import React, { useState } from 'react';
import { IoSend } from 'react-icons/io5';
import '../styles/components/MessageInput.css';

function MessageInput({ onSend, disabled }) {
  const [input, setInput] = useState('');
  const maxLength = 500;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim() && !disabled) {
      onSend(input);
      setInput('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleQuickReply = (text) => {
    if (!disabled) {
      onSend(text);
    }
  };

  const getCharCounterClass = () => {
    const remaining = maxLength - input.length;
    if (remaining < 50) return 'danger';
    if (remaining < 100) return 'warning';
    return '';
  };

  const quickReplies = [
    '¿Cómo restablezco mi contraseña?',
    '¿Cuántos días de vacaciones tengo?',
    'Necesito ayuda'
  ];

  return (
    <div className="message-input-container">
      <form className="message-input-form" onSubmit={handleSubmit}>
        <div className="input-wrapper">
          <textarea
            className="input-field"
            value={input}
            onChange={(e) => setInput(e.target.value.slice(0, maxLength))}
            onKeyPress={handleKeyPress}
            placeholder="Escribe tu mensaje aquí... (presiona Enter para enviar)"
            disabled={disabled}
            rows="1"
          />
          {input.length > 0 && (
            <span className={`char-counter ${getCharCounterClass()}`}>
              {input.length}/{maxLength}
            </span>
          )}
        </div>
        
        <button 
          type="submit" 
          disabled={disabled || !input.trim()}
          className="send-btn"
        >
          <span className="send-btn-text">Enviar</span>
          <IoSend className="send-icon" />
        </button>
      </form>

      {!disabled && input.length === 0 && (
        <div className="quick-replies">
          {quickReplies.map((reply, index) => (
            <button
              key={index}
              className="quick-reply-btn"
              onClick={() => handleQuickReply(reply)}
            >
              {reply}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default MessageInput;