import React, { useEffect, useRef } from 'react';
import { BsDiamondFill } from 'react-icons/bs';
import { MdLockOpen, MdBeachAccess } from 'react-icons/md';
import { IoDocumentText, IoBookSharp } from 'react-icons/io5';
import Message from './Message';
import '../styles/components/ChatWindow.css';

function ChatWindow({ messages, loading, onSendSuggestion, onFeedback }) {
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const quickActions = [
    { icon: <MdLockOpen />, text: 'Restablecer mi contraseña', prompt: '¿Cómo puedo restablecer mi contraseña?' },
    { icon: <MdBeachAccess />, text: 'Consultar mis vacaciones', prompt: '¿Cuántos días de vacaciones tengo disponibles?' },
    { icon: <IoDocumentText />, text: 'Solicitar constancia laboral', prompt: 'Necesito una constancia laboral' },
    { icon: <IoBookSharp />, text: 'Políticas de RH', prompt: '¿Dónde puedo consultar las políticas de Recursos Humanos?' }
  ];

  const handleSuggestionClick = (prompt) => {
    if (onSendSuggestion) {
      onSendSuggestion(prompt);
    }
  };

  return (
    <div className="chat-window">
      {messages.length === 0 && (
        <div className="welcome-message">
          <BsDiamondFill className="welcome-icon" />
          <h2>¡Bienvenido a Helper IA!</h2>
          <p>Soy tu asistente virtual de Recursos Humanos</p>
          <p className="welcome-subtitle">Estoy aquí para ayudarte con tus consultas de RH las 24 horas del día</p>
          
          <div className="suggestions">
            {quickActions.map((action, index) => (
              <button 
                key={index} 
                className="suggestion-card"
                onClick={() => handleSuggestionClick(action.prompt)}
              >
                <span className="suggestion-icon">{action.icon}</span>
                <span className="suggestion-text">{action.text}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="messages-list">
        {messages.map((message) => (
          <Message key={message.id} message={message} onFeedback={onFeedback} />
        ))}
      </div>

      {loading && (
        <div className="typing-indicator">
          <span className="typing-dot"></span>
          <span className="typing-dot"></span>
          <span className="typing-dot"></span>
        </div>
      )}

      <div ref={messagesEndRef} />
    </div>
  );
}

export default ChatWindow;