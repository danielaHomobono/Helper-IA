// API Configuration
// Usar variable de entorno de Vite
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://backend-equipo6-f6defvc0d3ezb6ff.centralus-01.azurewebsites.net';

export const ENDPOINTS = {
  INTERACTION: '/api/interaction',
  CHAT: '/api/chat',
  FEEDBACK: '/api/feedback',
  ANALYTICS: '/api/analytics',
  ESCALATION: '/api/escalation',
  HEALTH: '/api/health'
};

// Response Categories
export const CATEGORIES = {
  PASSWORD_RESET: 'PASSWORD_RESET',
  VACATION_INQUIRY: 'VACATION_INQUIRY',
  CERTIFICATE_REQUEST: 'CERTIFICATE_REQUEST',
  POLICY_QUESTION: 'POLICY_QUESTION',
  ESCALATE_TO_HUMAN: 'ESCALATE_TO_HUMAN'
};

// Message Types
export const MESSAGE_TYPES = {
  USER: 'user',
  AI: 'ai',
  SYSTEM: 'system'
};

// Action Types
export const ACTION_TYPES = {
  SEND_MESSAGE: 'SEND_MESSAGE',
  RECEIVE_MESSAGE: 'RECEIVE_MESSAGE',
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  CLEAR_CHAT: 'CLEAR_CHAT'
};

// Confidence Thresholds
export const CONFIDENCE_THRESHOLDS = {
  HIGH: 0.8,
  MEDIUM: 0.6,
  LOW: 0.4
};

export default {
  API_BASE_URL,
  ENDPOINTS,
  CATEGORIES,
  MESSAGE_TYPES,
  ACTION_TYPES,
  CONFIDENCE_THRESHOLDS
};