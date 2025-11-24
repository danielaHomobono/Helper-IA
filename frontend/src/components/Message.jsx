import React from 'react';
import { BsDiamondFill, BsCircleFill } from 'react-icons/bs';
import { MdLockOpen, MdBeachAccess, MdPerson } from 'react-icons/md';
import { IoDocumentText, IoBookSharp, IoChatbubble } from 'react-icons/io5';
import { MESSAGE_TYPES } from '../utils/constants';
import '../styles/components/Message.css';

function Message({ message }) {
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
      </div>
      
      <div className="message-timestamp">
        {formatTime(message.timestamp)}
      </div>
    </div>
  );
}

export default Message;