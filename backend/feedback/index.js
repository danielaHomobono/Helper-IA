const { app } = require('@azure/functions');
const { DatabaseClient } = require('../shared/db-client');

const isValidRating = (rating) => Number.isInteger(rating) && rating >= 1 && rating <= 3;

app.http('feedback', {
  methods: ['POST'],
  authLevel: 'anonymous',
  handler: async (request, context) => {
    try {
      const body = await request.json();
      const interactionId = Number(body.interactionId);
      const conversationId = body.conversationId || null;
      const rating = Number(body.rating);
      const comment = body.comment?.trim();

      if (!interactionId || !isValidRating(rating)) {
        return {
          status: 400,
          jsonBody: {
            error: 'interactionId y rating (1-3) son obligatorios.'
          }
        };
      }

      const dbClient = new DatabaseClient();
      const feedbackId = await dbClient.saveFeedbackRating({
        interactionId,
        conversationId,
        rating,
        comment
      });

      return {
        status: 201,
        jsonBody: {
          feedbackId,
          status: 'ok'
        }
      };
    } catch (error) {
      context.error('Error guardando feedback:', error);
      return {
        status: 500,
        jsonBody: {
          error: 'No se pudo guardar el feedback',
          message: error.message
        }
      };
    }
  }
});

