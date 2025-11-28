import React from 'react';
import { MdRefresh } from 'react-icons/md';
import { BsDiamondFill } from 'react-icons/bs';
import { useChat } from '../hooks/useChat';
import ChatWindow from '../components/ChatWindow';
import { useSearch } from '../hooks/useSearch';
import MessageInput from '../components/MessageInput';
import DarkModeToggle from '../components/DarkModeToggle';
import '../styles/pages/ChatPage.css';

function ChatPage() {
  const { messages, loading, error, sendMessage, clearChat } = useChat();
  const {
    searchResults,
    searchLoading,
    searchError,
    searchTickets,
    clearResults
  } = useSearch();
  const [searchQuery, setSearchQuery] = React.useState('');

  return (
    <div className="chat-page">
      <div className="search-bar" style={{ display: 'flex', gap: '12px', alignItems: 'center', margin: '24px 32px 0 32px' }}>
        <input
          type="text"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          placeholder="Buscar ticket..."
          disabled={searchLoading}
          style={{
            padding: '10px 16px',
            borderRadius: '8px',
            border: '1px solid #e2e8f0',
            fontSize: '15px',
            width: '260px',
            background: '#f9fafb',
            boxShadow: 'var(--shadow-sm)',
            outline: 'none',
            transition: 'border-color 0.2s',
          }}
        />
        <button
          onClick={() => searchTickets(searchQuery)}
          disabled={searchLoading || !searchQuery.trim()}
          className="clear-btn"
          style={{ background: '#3182ce', color: 'white', border: 'none', minWidth: '90px' }}
        >
          Buscar
        </button>
        <button
          onClick={clearResults}
          disabled={searchLoading || searchResults.length === 0}
          className="clear-btn"
          style={{ background: '#e53e3e', color: 'white', border: 'none', minWidth: '90px' }}
        >
          Limpiar
        </button>
      </div>
      {searchError && <div className="error-message">{searchError}</div>}
      {searchLoading && <div className="loading-message">Buscando...</div>}
      {searchResults.length > 0 && (
        <div className="search-results">
          <h3>Resultados de búsqueda:</h3>
          <ul>
            {searchResults.map((doc, idx) => (
              <li key={idx} style={{marginBottom: '1em', padding: '0.5em', border: '1px solid #eee', borderRadius: '6px'}}>
                <strong>ID:</strong> {doc.id}<br/>
                <strong>Ticket:</strong> {doc.ticket}<br/>
                <strong>Categoría:</strong> {doc.category}<br/>
                <strong>Subcategoría:</strong> {doc.sub_category}<br/>
                {doc.label && (<><strong>Label:</strong> {doc.label}<br/></>)}
                {doc.entity_label && (<><strong>Entidad:</strong> {doc.entity_label} ({doc.entity_start}-{doc.entity_end})<br/></>)}
              </li>
            ))}
          </ul>
        </div>
      )}
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
            <DarkModeToggle />
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

        <ChatWindow 
          messages={messages} 
          loading={loading}
          onSendSuggestion={sendMessage}
        />
        
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