// API Configuration
const ENV = process.env.NODE_ENV || 'development';

export const API_URLS = {
  development: 'http://localhost:3000/api',
  staging: 'https://helper-ia-staging.azurewebsites.net/api',
  production: 'https://helper-ia.azurewebsites.net/api'
};

export const API_BASE_URL = API_URLS[ENV];

export const ENDPOINTS = {
  CHAT: '/chat',
  FEEDBACK: '/feedback',
  ANALYTICS: '/analytics',
  ESCALATION: '/escalation',
  HEALTH: '/health'
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