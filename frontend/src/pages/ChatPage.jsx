import React from 'react';
import { MdRefresh } from 'react-icons/md';
import { BsDiamondFill } from 'react-icons/bs';
import { useChat } from '../hooks/useChat';
import ChatWindow from '../components/ChatWindow';
import MessageInput from '../components/MessageInput';
import '../styles/pages/ChatPage.css';

function ChatPage() {
  const { messages, loading, error, sendMessage, clearChat } = useChat();

  return (
    <div className="chat-page">
      <div className="chat-container">
        <div className="chat-header">
          <div className="chat-header-content">
            <h1>
              <BsDiamondFill className="logo-icon" />
              Helper IA
            </h1>
            <p>Tu asistente virtual de Recursos Humanos - Siempre listo para ayudarte</p>
          </div>
          
          <div className="header-actions">
            <div className="status-indicator">
              <span className="status-dot"></span>
              En línea
            </div>
            <button onClick={clearChat} className="clear-btn" title="Limpiar conversación">
              <MdRefresh className="btn-icon" />
              <span className="btn-text">Limpiar</span>
            </button>
          </div>
        </div>

        <ChatWindow messages={messages} loading={loading} />
        
        {error && (
          <div className="error-message">
            <span>⚠️</span>
            {error}
          </div>
        )}

        <MessageInput onSend={sendMessage} disabled={loading} />
      </div>
    </div>
  );
}

export default ChatPage;