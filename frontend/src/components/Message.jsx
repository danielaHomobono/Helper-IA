import React from 'react';
import { BsDiamondFill, BsCircleFill } from 'react-icons/bs';
import { MdLockOpen, MdBeachAccess, MdPerson } from 'react-icons/md';
import { IoDocumentText, IoBookSharp, IoChatbubble } from 'react-icons/io5';
import { MESSAGE_TYPES } from '../utils/constants';
import '../styles/components/Message.css';

function Message({ message, onFeedback }) {
  const isUser = message.type === MESSAGE_TYPES.USER;

  const getConfidenceClass = (confidence) => {
    if (confidence >= 0.8) return 'high';
    if (confidence >= 0.6) return 'medium';
    return 'low';
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('es-ES', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const getCategoryIcon = (category) => {
    const icons = {
      'PASSWORD_RESET': <MdLockOpen />,
      'VACATION_INQUIRY': <MdBeachAccess />,
      'CERTIFICATE_REQUEST': <IoDocumentText />,
      'POLICY_QUESTION': <IoBookSharp />,
      'ESCALATE_TO_HUMAN': <MdPerson />
    };
    return icons[category] || <IoChatbubble />;
  };

  const ratingOptions = [
    { value: 1, label: 'Necesita revisión' },
    { value: 2, label: 'Útil' },
    { value: 3, label: 'Excelente' }
  ];

  const handleFeedback = (value) => {
    if (!message.interactionId || !onFeedback) return;
    if (message.userRating === value) return;

    onFeedback({
      interactionId: message.interactionId,
      rating: value
    });
  };

  return (
    <div className={`message ${isUser ? 'user-message' : 'ai-message'}`}>
      {!isUser && (
        <div className="message-avatar ai-avatar">
          <BsDiamondFill />
        </div>
      )}
      {isUser && (
        <div className="message-avatar user-avatar">
          <BsCircleFill />
        </div>
      )}
      
      <div className="message-content">
        <p>{message.content}</p>
        
        {!isUser && message.category && (
          <div className="message-category">
            <span>{getCategoryIcon(message.category)}</span>
            {message.category.replace(/_/g, ' ')}
          </div>
        )}
        
        {!isUser && message.validation && (
          <div className={`validation-badge ${message.validation.confidence}`}>
            <span className="validation-status">
              Validación: {message.validation.confidence?.toUpperCase() || 'N/A'}
            </span>
            <span className="validation-reason">{message.validation.reason}</span>
          </div>
        )}

        {!isUser && message.sources && message.sources.length > 0 && (
          <div className="sources-section">
            <span className="sources-title">Fuentes:</span>
            <div className="sources-pills">
              {message.sources.map((source) => (
                <span
                  key={source.ticketId}
                  className="source-pill"
                  title={source.snippet}
                >
                  {source.ticketId} {source.category ? `(${source.category})` : ''}
                </span>
              ))}
            </div>
          </div>
        )}
        
        {!isUser && message.suggestedActions && message.suggestedActions.length > 0 && (
          <div className="suggested-actions">
            <div className="actions-title">Acciones sugeridas</div>
            {message.suggestedActions.map((action, index) => (
              <button key={index} className="action-btn">
                {action}
              </button>
            ))}
          </div>
        )}

        {!isUser && message.confidence !== undefined && (
          <div className="confidence-indicator">
            <span className="confidence-label">Confianza:</span>
            <div className="confidence-bar">
              <div 
                className={`confidence-fill ${getConfidenceClass(message.confidence)}`}
                style={{ width: `${message.confidence * 100}%` }}
              />
            </div>
            <span className={`confidence-percentage ${getConfidenceClass(message.confidence)}`}>
              {(message.confidence * 100).toFixed(0)}%
            </span>
          </div>
        )}
        {!isUser && message.interactionId && onFeedback && (
          <div className="feedback-wrapper">
            <span className="feedback-label">Califica la respuesta</span>
            <div className="feedback-buttons">
              {ratingOptions.map((option) => (
                <button
                  key={option.value}
                  className={`feedback-btn ${message.userRating === option.value ? 'active' : ''}`}
                  onClick={() => handleFeedback(option.value)}
                  disabled={
                    message.feedbackStatus === 'saving' ||
                    message.feedbackStatus === 'success'
                  }
                >
                  {option.label}
                </button>
              ))}
            </div>
            {message.feedbackStatus === 'saving' && (
              <span className="feedback-status saving">Enviando tu feedback…</span>
            )}
            {message.feedbackStatus === 'success' && (
              <span className="feedback-status success">¡Gracias por ayudarnos a mejorar!</span>
            )}
            {message.feedbackStatus === 'error' && (
              <span className="feedback-status error">
                {message.feedbackError || 'No se pudo guardar tu feedback.'}
              </span>
            )}
          </div>
        )}
      </div>
      
      <div className="message-timestamp">
        {formatTime(message.timestamp)}
      </div>
    </div>
  );
}

export default Message;