const { app } = require('@azure/functions');
const OpenAI = require('openai');
const { DatabaseClient } = require('../shared/db-client');
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

      // Obtener historial de conversación
      const db = new DatabaseClient();
      const history = await db.getConversationHistory(conversationId);

      // Construir contexto
      const contextPrompt = CONTEXT_BUILDER(history);

      // Llamar a OpenAI
      const startTime = Date.now();
      const completion = await openai.chat.completions.create({
        model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
        messages: [
          { role: 'system', content: MASTER_PROMPT },
          { role: 'system', content: contextPrompt },
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

      // Guardar conversación
      await db.saveConversation({
        sessionId: conversationId,
        userMessage: message,
        aiResponse: parsedResponse.response,
        confidenceScore: parsedResponse.confidence,
        category: parsedResponse.category,
        escalated: parsedResponse.escalate
      });

      // Actualizar métricas
      await db.updateMetrics({
        conversationId,
        responseTime,
        category: parsedResponse.category,
        intent: parsedResponse.category,
        confidence: parsedResponse.confidence
      });

      return {
        status: 200,
        jsonBody: {
          ...parsedResponse,
          conversationId,
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