import React, { useState, useRef, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { useSocket } from '../context/SocketContext';
import ImageUpload from './ImageUpload';
import './Chatbot.scss';

const Chatbot = ({ socket }) => {
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState([]);
  const [showInitialScreen, setShowInitialScreen] = useState(true);
  const [isWaitingForResponse, setIsWaitingForResponse] = useState(false);
  const [selectedImages, setSelectedImages] = useState([]);
  const [showImageUpload, setShowImageUpload] = useState(false);
  const { isConnected, connectionError } = useSocket();
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
          responseTime: 'Socket.IO',
          hasImage: data.hasImage || false
        };
        setMessages(prev => [...prev, botMessage]);
        setIsWaitingForResponse(false);
      });

      socket.on('ai-message-error', (data) => {
        const errorMessage = {
          id: Date.now() + 1,
          content: `Error: ${data.error}`,
          sender: 'bot',
          timestamp: new Date().toISOString(),
          isError: true
        };
        setMessages(prev => [...prev, errorMessage]);
        setIsWaitingForResponse(false);
      });

      // Cleanup function to remove listeners
      return () => {
        socket.off('ai-message-response');
        socket.off('ai-message-error');
      };
    }
  }, [socket]);

  const handleInputChange = (e) => {
    setQuery(e.target.value);
  };

  // Handle image upload
  const handleImageSelect = (imageData) => {
    setSelectedImages(prev => [...prev, imageData]);
  };

  const handleRemoveImage = (imageId) => {
    setSelectedImages(prev => prev.filter(img => img.id !== imageId));
  };

  const toggleImageUpload = () => {
    setShowImageUpload(!showImageUpload);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (socket && isConnected && (query.trim() || selectedImages.length > 0)) {
      // Prepare user message
      const userMessage = {
        id: Date.now(),
        content: query.trim() || (selectedImages.length > 0 ? 'Sent an image' : ''),
        sender: 'user',
        timestamp: new Date().toISOString(),
        images: selectedImages.length > 0 ? selectedImages : null
      };
      
      setMessages(prev => [...prev, userMessage]);
      setIsWaitingForResponse(true);

      // Send message to backend
      if (selectedImages.length > 0) {
        // Send message with images
        const imageData = {
          text: query.trim(),
          imageData: selectedImages[0].base64, // For now, send only first image
          mimeType: selectedImages[0].type
        };
        socket.emit('ai-message-with-image', imageData);
      } else {
        // Send text-only message
        socket.emit('ai-message', query.trim());
      }
      
      // Reset form
      setQuery('');
      setSelectedImages([]);
      setShowImageUpload(false);
      
      // Hide initial screen once first message is sent
      if (showInitialScreen) {
        setShowInitialScreen(false);
      }
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

            {/* Image upload area for initial screen */}
            {showImageUpload && (
              <div className="chatbot__image-upload-area">
                <ImageUpload 
                  onImageSelect={handleImageSelect}
                  onRemoveImage={handleRemoveImage}
                  selectedImages={selectedImages}
                />
              </div>
            )}

            {/* Main Search Area */}
            <div className="chatbot__search-section">
              {/* Selected images preview for initial screen */}
              {selectedImages.length > 0 && (
                <div className="chatbot__selected-images">
                  {selectedImages.map(image => (
                    <div key={image.id} className="chatbot__selected-image">
                      <img src={image.dataUrl} alt={image.name} />
                      <button 
                        type="button"
                        onClick={() => handleRemoveImage(image.id)}
                        className="chatbot__remove-image"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
              
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
                    placeholder={selectedImages.length > 0 ? "Describe the image or ask a question..." : "What do you want to know?"}
                    className="chatbot__input"
                    autoFocus
                  />
                  
                  <button 
                    type="button" 
                    onClick={toggleImageUpload}
                    className={`chatbot__image-btn ${showImageUpload ? 'active' : ''}`}
                    aria-label="Upload image"
                    title="Upload image"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" stroke="currentColor" strokeWidth="2"/>
                      <circle cx="9" cy="9" r="2" stroke="currentColor" strokeWidth="2"/>
                      <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" stroke="currentColor" strokeWidth="2"/>
                    </svg>
                    {selectedImages.length > 0 && (
                      <span className="chatbot__image-count">{selectedImages.length}</span>
                    )}
                  </button>
                  
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
                  
                  <button 
                    type="submit" 
                    className="chatbot__voice-btn" 
                    aria-label="Submit"
                    disabled={!query.trim() && selectedImages.length === 0}
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="12" cy="12" r="10" fill="currentColor"/>
                      <path d="M16 12l-6 4V8l6 4z" fill="white" stroke="white" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
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
            
            {/* Connection status indicator */}
            {!isConnected && (
              <div className="chatbot__connection-status">
                <div className="chatbot__connection-error">
                  {connectionError ? (
                    <>❌ Connection failed: {connectionError}</>
                  ) : (
                    <>🔄 Connecting to server...</>
                  )}
                </div>
              </div>
            )}
            
            {/* Messages container */}
            <div className="chatbot__messages">
              {messages.map(message => (
                <div key={message.id} className={`chatbot__message ${message.sender === 'user' ? 'chatbot__message--user' : 'chatbot__message--bot'}`}>
                  {message.sender === 'bot' ? (
                    // Bot message - plain text with actions below
                    <div className="chatbot__bot-message">
                      <div className={`chatbot__bot-text ${message.isError ? 'chatbot__bot-text--error' : ''}`}>
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
                    <div className={`chatbot__user-message ${message.images ? 'chatbot__user-message--with-images' : ''}`}>
                      <div className="chatbot__user-bubble">
                        {message.images && (
                          <div className="chatbot__user-images">
                            {message.images.map((image, index) => (
                              <img key={index} src={image.dataUrl} alt={image.name} />
                            ))}
                          </div>
                        )}
                        {message.content}
                      </div>
                    </div>
                  )}
                </div>
              ))}
              
              {/* Loading indicator when waiting for response */}
              {isWaitingForResponse && (
                <div className="chatbot__message chatbot__message--bot">
                  <div className="chatbot__bot-message">
                    <div className="chatbot__bot-text">
                      <div className="chatbot__typing-indicator">
                        <span></span>
                        <span></span>
                        <span></span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} /> {/* Empty div for scrolling to bottom */}
            </div>
            
            {/* Image upload area */}
            {showImageUpload && (
              <div className="chatbot__image-upload-area">
                <ImageUpload 
                  onImageSelect={handleImageSelect}
                  onRemoveImage={handleRemoveImage}
                  selectedImages={selectedImages}
                />
              </div>
            )}
            
            {/* Input container */}
            <div className="chatbot__input-footer">
              <form onSubmit={handleSubmit} className="chatbot__input-form">
                {/* Selected images preview bar */}
                {selectedImages.length > 0 && (
                  <div className="chatbot__selected-images">
                    {selectedImages.map(image => (
                      <div key={image.id} className="chatbot__selected-image">
                        <img src={image.dataUrl} alt={image.name} />
                        <button 
                          type="button"
                          onClick={() => handleRemoveImage(image.id)}
                          className="chatbot__remove-image"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                
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
                    placeholder={!isConnected ? "Connecting..." : selectedImages.length > 0 ? "Describe the image or ask a question..." : "How can Kripson help?"}
                    className="chatbot__input"
                    disabled={!isConnected || isWaitingForResponse}
                    autoFocus
                  />
                  
                  <button 
                    type="button" 
                    onClick={toggleImageUpload}
                    className={`chatbot__image-btn ${showImageUpload ? 'active' : ''}`}
                    aria-label="Upload image"
                    title="Upload image"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" stroke="currentColor" strokeWidth="2"/>
                      <circle cx="9" cy="9" r="2" stroke="currentColor" strokeWidth="2"/>
                      <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" stroke="currentColor" strokeWidth="2"/>
                    </svg>
                    {selectedImages.length > 0 && (
                      <span className="chatbot__image-count">{selectedImages.length}</span>
                    )}
                  </button>
                  
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
                  
                  <button 
                    type="submit" 
                    className="chatbot__voice-btn" 
                    aria-label="Submit"
                    disabled={!isConnected || isWaitingForResponse || (!query.trim() && selectedImages.length === 0)}
                  >
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
