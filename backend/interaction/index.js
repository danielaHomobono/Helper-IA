const { app } = require('@azure/functions');
const OpenAI = require('openai');
const { v4: uuidv4 } = require('uuid');
const { DatabaseClient } = require('../shared/db-client');
const { CognitiveSearchClient } = require('../shared/search-client');
const { buildKnowledgeSummary, validateAnswerAgainstDocuments } = require('../shared/validators');
const { MASTER_PROMPT, CONTEXT_BUILDER } = require('../shared/prompts');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: process.env.OPENAI_ENDPOINT
    ? `${process.env.OPENAI_ENDPOINT}/openai/deployments/${process.env.OPENAI_MODEL}`
    : undefined,
  defaultQuery: process.env.OPENAI_ENDPOINT
    ? { 'api-version': process.env.OPENAI_API_VERSION || '2024-05-01-preview' }
    : undefined,
  defaultHeaders: process.env.OPENAI_ENDPOINT
    ? { 'api-key': process.env.OPENAI_API_KEY }
    : undefined
});

const normalizeResponse = (rawMessage) => {
  try {
    const parsed = JSON.parse(rawMessage);
    return {
      response: parsed.response || rawMessage,
      category: parsed.category || 'GENERAL',
      confidence: parsed.confidence ?? 0.5,
      suggestedActions: parsed.suggestedActions || [],
      escalate: Boolean(parsed.escalate)
    };
  } catch (error) {
    return {
      response: rawMessage,
      category: 'GENERAL',
      confidence: 0.5,
      suggestedActions: [],
      escalate: false
    };
  }
};

const formatSources = (documents = []) =>
  documents.slice(0, 3).map((doc) => ({
    ticketId: doc.ticketId,
    category: doc.category,
    snippet: doc.snippet || doc.description?.slice(0, 160),
    score: doc.score
  }));

app.http('interaction', {
  methods: ['POST'],
  authLevel: 'anonymous',
  handler: async (request, context) => {
    const requestId = uuidv4();
    context.log(`🧠 [interaction] requestId=${requestId}`);

    try {
      const body = await request.json();
      const conversationId = body.conversationId || uuidv4();
      const userId = body.userId || 'anonymous';
      const message = body.message?.trim();

      if (!message) {
        return {
          status: 400,
          jsonBody: { error: 'El campo "message" es obligatorio.' }
        };
      }

      const dbClient = new DatabaseClient();
      const searchClient = new CognitiveSearchClient();

      const history = await dbClient.getConversationHistory(conversationId, 15);

      let searchResults = [];
      if (searchClient.isConfigured()) {
        const results = await searchClient.searchTickets(message, { top: 5 });
        searchResults = results.results;
      }

      const knowledgeSection = buildKnowledgeSummary(searchResults);
      const systemMessages = [
        { role: 'system', content: MASTER_PROMPT },
        { role: 'system', content: CONTEXT_BUILDER(history) },
        {
          role: 'system',
          content: `Usa el siguiente contexto proveniente de tickets reales de Service Desk. 
Si la evidencia contradice tu posible respuesta, regresa una respuesta con confianza baja y recomienda escalar:
${knowledgeSection}`
        }
      ];

      await dbClient.logInteraction({
        conversationId,
        userId,
        message,
        type: 'user',
        timestamp: new Date(),
        metadata: { searchResults: searchResults.slice(0, 3), requestId }
      });

      const start = Date.now();
      const completion = await openai.chat.completions.create({
        model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
        messages: [
          ...systemMessages,
          { role: 'user', content: message }
        ],
        temperature: 0.3,
        max_tokens: 600
      });
      const latencyMs = Date.now() - start;

      const aiMessage = completion.choices[0].message.content;
      const parsedResponse = normalizeResponse(aiMessage);

      const validation = validateAnswerAgainstDocuments({
        question: message,
        answer: parsedResponse.response,
        documents: searchResults
      });

      const aiInteractionId = await dbClient.logInteraction({
        conversationId,
        userId: 'helper-ia',
        message: parsedResponse.response,
        type: 'ai',
        timestamp: new Date(),
        metadata: {
          validation,
          category: parsedResponse.category,
          confidence: parsedResponse.confidence,
          requestId,
          latencyMs,
          suggestedActions: parsedResponse.suggestedActions,
          knowledgeUsed: formatSources(validation.supportingDocuments)
        }
      });

      await dbClient.saveConversation({
        sessionId: conversationId,
        userMessage: message,
        aiResponse: parsedResponse.response,
        confidenceScore: parsedResponse.confidence,
        category: parsedResponse.category,
        escalated: parsedResponse.escalate
      });

      await dbClient.updateMetrics({
        conversationId,
        responseTime: latencyMs,
        category: parsedResponse.category,
        intent: parsedResponse.category,
        confidence: parsedResponse.confidence
      });

      return {
        status: 200,
        jsonBody: {
          response: parsedResponse.response,
          category: parsedResponse.category,
          confidence: parsedResponse.confidence,
          suggestedActions: parsedResponse.suggestedActions,
          escalate: parsedResponse.escalate,
          conversationId,
          interactionId: aiInteractionId,
          validation,
          sources: validation.supportingDocuments,
          timestamp: new Date().toISOString()
        }
      };
    } catch (error) {
      context.error('Error en /interaction:', error);
      return {
        status: 500,
        jsonBody: {
          error: 'Error interno procesando la interacción',
          message: error.message
        }
      };
    }
  }
});

