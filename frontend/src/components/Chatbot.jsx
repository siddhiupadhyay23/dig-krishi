import React, { useState, useRef, useEffect } from 'react';
import Navbar from '../components/Navbar';
import './Chatbot.scss';

const Chatbot = ({ socket }) => {
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState([]);
  const [showInitialScreen, setShowInitialScreen] = useState(true);
  const messagesEndRef = useRef(null);

  // Scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Socket.IO effect to listen for AI responses
  useEffect(() => {
    if (socket) {
      socket.on('ai-message-response', (data) => {
        const botMessage = {
          id: Date.now() + 1,
          content: data.response,
          sender: 'bot',
          timestamp: new Date().toISOString(),
          responseTime: 'Socket.IO'
        };
        setMessages(prev => [...prev, botMessage]);
      });

      // Cleanup function to remove listeners
      return () => {
        socket.off('ai-message-response');
      };
    }
  }, [socket]);

  const handleInputChange = (e) => {
    setQuery(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      // Add user message to chat
      const userMessage = {
        id: Date.now(),
        content: query.trim(),
        sender: 'user',
        timestamp: new Date().toISOString()
      };
      
      setMessages(prev => [...prev, userMessage]);

      // Use Socket.IO to send message to backend
      if (socket) {
        socket.emit('ai-message', query.trim());
      }
      
      // Hide initial screen once first message is sent
      if (showInitialScreen) {
        setShowInitialScreen(false);
      }
      
      setQuery('');
    }
  };

  return (
    <div className="chatbot">
      <Navbar />
      <div className={`chatbot__container ${!showInitialScreen ? 'chat-active' : ''}`}>
        {showInitialScreen ? (
          <div className="chatbot__content">
            {/* Kripson Logo */}
            <div className="chatbot__logo">
              <svg width="48" height="48" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="50" cy="50" r="35" stroke="currentColor" strokeWidth="3" fill="none"/>
                <circle cx="50" cy="50" r="18" stroke="currentColor" strokeWidth="2" fill="none"/>
                <line x1="50" y1="15" x2="50" y2="32" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                <line x1="50" y1="68" x2="50" y2="85" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                <line x1="15" y1="50" x2="32" y2="50" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                <line x1="68" y1="50" x2="85" y2="50" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              <h1 className="chatbot__title">Kripson</h1>
            </div>

            {/* Main Search Area */}
            <div className="chatbot__search-section">
              <form onSubmit={handleSubmit} className="chatbot__search-form">
                <div className="chatbot__input-container">
                  <button type="button" className="chatbot__mic-btn" aria-label="Voice input">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" fill="currentColor"/>
                      <path d="M19 10v2a7 7 0 0 1-14 0v-2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <line x1="12" x2="12" y1="19" y2="23" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                      <line x1="8" x2="16" y1="23" y2="23" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                  </button>
                  
                  <input
                    type="text"
                    value={query}
                    onChange={handleInputChange}
                    placeholder="What do you want to know?"
                    className="chatbot__input"
                    autoFocus
                  />
                  
                  <div className="chatbot__model-selector">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 2L2 7V17L12 22L22 17V7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
                      <path d="M12 22V12" stroke="currentColor" strokeWidth="2"/>
                      <path d="M2 7L12 12L22 7" stroke="currentColor" strokeWidth="2"/>
                    </svg>
                    <span>Auto</span>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  
                  <button type="button" className="chatbot__voice-btn" aria-label="Voice">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="12" cy="12" r="2" fill="currentColor"/>
                      <circle cx="12" cy="5" r="2" fill="currentColor"/>
                      <circle cx="12" cy="19" r="2" fill="currentColor"/>
                    </svg>
                  </button>
                </div>
              </form>
              
              {/* Terms and Privacy */}
              <div className="chatbot__footer-text">
                By messaging Kripson, you agree to our{' '}
                <a href="#" className="chatbot__link">Terms</a>{' '}
                and{' '}
                <a href="#" className="chatbot__link">Privacy Policy</a>
              </div>
            </div>
          </div>
        ) : (
          <div className="chatbot__chat-interface">
            
            {/* Messages container */}
            <div className="chatbot__messages">
              {messages.map(message => (
                <div key={message.id} className={`chatbot__message ${message.sender === 'user' ? 'chatbot__message--user' : 'chatbot__message--bot'}`}>
                  {message.sender === 'bot' ? (
                    // Bot message - plain text with actions below
                    <div className="chatbot__bot-message">
                      <div className="chatbot__bot-text">
                        {message.content}
                      </div>
                      <div className="chatbot__message-actions">
                        <button className="chatbot__action-btn" title="Regenerate">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M3 3v5h5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M21 21v-5h-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </button>
                        <button className="chatbot__action-btn" title="Copy">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <rect x="9" y="9" width="13" height="13" rx="2" ry="2" stroke="currentColor" strokeWidth="2" fill="none"/>
                            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" stroke="currentColor" strokeWidth="2" fill="none"/>
                          </svg>
                        </button>
                        <button className="chatbot__action-btn" title="Share">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M16 6l-4-4-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M12 2v13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </button>
                        <button className="chatbot__action-btn" title="Like">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3H14z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </button>
                        <button className="chatbot__action-btn" title="Dislike">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M10 15v4a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2 1.7l-1.38 9a2 2 0 0 0 2 2.3H10z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M17 2h3a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2h-3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </button>
                        <button className="chatbot__action-btn" title="More options">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="12" cy="12" r="1" fill="currentColor"/>
                            <circle cx="19" cy="12" r="1" fill="currentColor"/>
                            <circle cx="5" cy="12" r="1" fill="currentColor"/>
                          </svg>
                        </button>
                        {message.responseTime && (
                          <div className="chatbot__response-time">
                            {message.responseTime}
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    // User message - bubble on the right
                    <div className="chatbot__user-message">
                      <div className="chatbot__user-bubble">
                        {message.content}
                      </div>
                    </div>
                  )}
                </div>
              ))}
              <div ref={messagesEndRef} /> {/* Empty div for scrolling to bottom */}
            </div>
            
            {/* Input container */}
            <div className="chatbot__input-footer">
              <form onSubmit={handleSubmit} className="chatbot__input-form">
                <div className="chatbot__input-container">
                  <button type="button" className="chatbot__mic-btn" aria-label="Voice input">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" fill="currentColor"/>
                      <path d="M19 10v2a7 7 0 0 1-14 0v-2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <line x1="12" x2="12" y1="19" y2="23" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                      <line x1="8" x2="16" y1="23" y2="23" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                  </button>
                  
                  <input
                    type="text"
                    value={query}
                    onChange={handleInputChange}
                    placeholder="How can Kripson help?"
                    className="chatbot__input"
                    autoFocus
                  />
                  
                  <div className="chatbot__model-selector">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 2L2 7V17L12 22L22 17V7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
                      <path d="M12 22V12" stroke="currentColor" strokeWidth="2"/>
                      <path d="M2 7L12 12L22 7" stroke="currentColor" strokeWidth="2"/>
                    </svg>
                    <span>Auto</span>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  
                  <button type="submit" className="chatbot__voice-btn" aria-label="Submit">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="12" cy="12" r="10" fill="currentColor"/>
                      <path d="M16 12l-6 4V8l6 4z" fill="white" stroke="white" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Chatbot;
