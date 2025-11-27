import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import ApiClient from '../utils/api';
import { ENDPOINTS, MESSAGE_TYPES } from '../utils/constants';

export const useChat = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [conversationId] = useState(() => uuidv4());

  const sendMessage = async (message) => {
    if (!message.trim()) return;

    setLoading(true);
    setError(null);

    // Agregar mensaje del usuario
    const userMessage = {
      id: uuidv4(),
      type: MESSAGE_TYPES.USER,
      content: message,
      timestamp: new Date().toISOString()
    };
    
    setMessages(prev => [...prev, userMessage]);

    try {
      // Llamar al backend
      const response = await ApiClient.post(ENDPOINTS.INTERACTION || ENDPOINTS.CHAT, {
        message,
        conversationId,
        userId: 'anonymous'
      });

      // Agregar respuesta de la IA
      const aiMessage = {
        id: uuidv4(),
        type: MESSAGE_TYPES.AI,
        content: response.response,
        category: response.category,
        confidence: response.confidence,
        suggestedActions: response.suggestedActions,
        timestamp: response.timestamp,
        interactionId: response.interactionId,
        validation: response.validation,
        sources: response.sources
      };

      setMessages(prev => [...prev, aiMessage]);

    } catch (err) {
      setError('Error al enviar mensaje. Por favor intenta de nuevo.');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const sendFeedback = async ({ interactionId, rating, comment }) => {
    if (!interactionId || !rating) return;

    setMessages(prev =>
      prev.map((msg) =>
        msg.interactionId === interactionId
          ? { ...msg, feedbackStatus: 'saving', feedbackError: null }
          : msg
      )
    );

    try {
      await ApiClient.post(ENDPOINTS.FEEDBACK, {
        interactionId,
        conversationId,
        rating,
        comment
      });

      setMessages(prev =>
        prev.map((msg) =>
          msg.interactionId === interactionId
            ? { ...msg, userRating: rating, feedbackStatus: 'success' }
            : msg
        )
      );
    } catch (error) {
      console.error('Error enviando feedback:', error);
      setMessages(prev =>
        prev.map((msg) =>
          msg.interactionId === interactionId
            ? {
                ...msg,
                feedbackStatus: 'error',
                feedbackError: 'No se pudo guardar tu feedback. Intenta nuevamente.'
              }
            : msg
        )
      );
      setError('No se pudo guardar tu feedback. Intenta nuevamente.');
    }
  };

  const clearChat = () => {
    setMessages([]);
    setError(null);
  };

  return {
    messages,
    loading,
    error,
    sendMessage,
    clearChat,
    sendFeedback,
    conversationId
  };
};