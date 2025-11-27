const { app } = require('@azure/functions');
const OpenAI = require('openai');
const { v4: uuidv4 } = require('uuid');
const { DatabaseClient } = require('../shared/db-client');
const { CognitiveSearchClient } = require('../shared/search-client');
const { buildKnowledgeSummary, validateAnswerAgainstDocuments } = require('../shared/validators');
const { MASTER_PROMPT, CONTEXT_BUILDER } = require('../shared/prompts');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

app.http('chat', {
  methods: ['POST'],
  authLevel: 'anonymous',
  handler: async (request, context) => {
    context.log('Chat function procesando solicitud');

    try {
      const body = await request.json();
      const { message, conversationId, userId } = body;

      if (!message) {
        return {
          status: 400,
          jsonBody: { error: 'Mensaje requerido' }
        };
      }

      const db = new DatabaseClient();
      const searchClient = new CognitiveSearchClient();
      const requestId = uuidv4();
      const activeConversationId = conversationId || uuidv4();

      const history = await db.getConversationHistory(activeConversationId, 15);

      let searchResults = [];
      if (searchClient.isConfigured()) {
        const { results = [] } = await searchClient.searchTickets(message, { top: 5 });
        searchResults = results;
      }

      const knowledgeSection = buildKnowledgeSummary(searchResults);
      const systemMessages = [
        { role: 'system', content: MASTER_PROMPT },
        { role: 'system', content: CONTEXT_BUILDER(history) }
      ];

      if (searchResults.length) {
        systemMessages.push({
          role: 'system',
          content: `Usa el siguiente contexto proveniente de tickets reales de Service Desk. 
Si la evidencia contradice tu posible respuesta, regresa una respuesta con confianza baja y recomienda escalar:
${knowledgeSection}`
        });
      }

      await db.logInteraction({
        conversationId: activeConversationId,
        userId: userId || 'anonymous',
        message,
        timestamp: new Date(),
        type: 'user',
        metadata: {
          requestId,
          searchResults: searchResults.slice(0, 3)
        }
      });

      const startTime = Date.now();
      const completion = await openai.chat.completions.create({
        model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
        messages: [
          ...systemMessages,
          { role: 'user', content: message }
        ],
        temperature: 0.7,
        max_tokens: 500
      });

      const responseTime = Date.now() - startTime;
      const aiResponse = completion.choices[0].message.content;

      // Parsear respuesta JSON
      let parsedResponse;
      try {
        parsedResponse = JSON.parse(aiResponse);
      } catch (e) {
        parsedResponse = {
          response: aiResponse,
          category: 'GENERAL',
          confidence: 0.5,
          suggestedActions: [],
          escalate: false
        };
      }

      const validation = validateAnswerAgainstDocuments({
        question: message,
        answer: parsedResponse.response,
        documents: searchResults
      });

      const aiInteractionId = await db.logInteraction({
        conversationId: activeConversationId,
        userId: 'helper-ia',
        message: parsedResponse.response,
        timestamp: new Date(),
        type: 'ai',
        metadata: {
          requestId,
          validation,
          category: parsedResponse.category,
          confidence: parsedResponse.confidence,
          suggestedActions: parsedResponse.suggestedActions
        }
      });

      await db.saveConversation({
        sessionId: activeConversationId,
        userMessage: message,
        aiResponse: parsedResponse.response,
        confidenceScore: parsedResponse.confidence,
        category: parsedResponse.category,
        escalated: parsedResponse.escalate
      });

      // Actualizar métricas
      await db.updateMetrics({
        conversationId: activeConversationId,
        responseTime,
        category: parsedResponse.category,
        intent: parsedResponse.category,
        confidence: parsedResponse.confidence
      });

      return {
        status: 200,
        jsonBody: {
          ...parsedResponse,
          conversationId: activeConversationId,
          interactionId: aiInteractionId,
          validation,
          sources: validation.supportingDocuments,
          timestamp: new Date().toISOString()
        }
      };

    } catch (error) {
      context.error('Error en chat function:', error);
      return {
        status: 500,
        jsonBody: { 
          error: 'Error procesando mensaje',
          message: error.message 
        }
      };
    }
  }
});