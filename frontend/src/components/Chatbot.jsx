import React, { useState, useRef, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { useSocket } from '../context/SocketContext';
import { useLanguage } from '../context/LanguageContext';
import './Chatbot.scss';

const Chatbot = ({ socket }) => {
  const { t } = useLanguage();
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState([]);
  const [showInitialScreen, setShowInitialScreen] = useState(true);
  const [isWaitingForResponse, setIsWaitingForResponse] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const { isConnected, connectionError } = useSocket();
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

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
          type: 'text'
        };
        setMessages(prev => [...prev, botMessage]);
        setIsWaitingForResponse(false);
      });

      // Listen for image generation responses
      socket.on('image-generated', (data) => {
        const botMessage = {
          id: Date.now() + 1,
          content: data.imageUrl || data.response,
          sender: 'bot',
          timestamp: new Date().toISOString(),
          responseTime: 'Socket.IO',
          type: data.imageUrl ? 'image' : 'text'
        };
        setMessages(prev => [...prev, botMessage]);
        setIsWaitingForResponse(false);
      });

      // Cleanup function to remove listeners
      return () => {
        socket.off('ai-message-response');
        socket.off('image-generated');
      };
    }
  }, [socket]);

  const handleInputChange = (e) => {
    setQuery(e.target.value);
  };

  const handleImageUpload = (file) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImage({
          file: file,
          preview: e.target.result,
          name: file.name
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleImageUpload(files[0]);
    }
  };

  const removeSelectedImage = () => {
    setSelectedImage(null);
  };

  const handleImageButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if ((query.trim() || selectedImage) && socket && isConnected) {
      // Add user message to chat
      const userMessage = {
        id: Date.now(),
        content: query.trim(),
        sender: 'user',
        timestamp: new Date().toISOString(),
        type: 'text',
        image: selectedImage
      };
      
      setMessages(prev => [...prev, userMessage]);
      setIsWaitingForResponse(true);

      // Send message with image if present
      if (selectedImage) {
        // For image uploads, we could send to a different endpoint
        socket.emit('ai-message-with-image', {
          message: query.trim(),
          image: selectedImage.preview // base64 image data
        });
      } else {
        // Use Socket.IO to send text message to backend
        socket.emit('ai-message', query.trim());
      }
      
      // Hide initial screen once first message is sent
      if (showInitialScreen) {
        setShowInitialScreen(false);
      }
      
      setQuery('');
      setSelectedImage(null);
    }
  };

  const handleSamplePromptClick = (prompt) => {
    setQuery(prompt);
  };

  return (
    <div className="chatbot">
      <Navbar />
      <div className={`chatbot__container ${!showInitialScreen ? 'chat-active' : ''}`}>
        {showInitialScreen ? (
          <div className="chatbot__content">
            {/* Digital Krishi Logo with Enhanced Animation */}
            <div className="chatbot__hero">
              <div className="chatbot__logo">
                <div className="chatbot__logo-container">
                  <svg width="64" height="64" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="chatbot__logo-icon">
                    <defs>
                      <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#4caf50"/>
                        <stop offset="100%" stopColor="#00b564"/>
                      </linearGradient>
                    </defs>
                    <circle cx="50" cy="50" r="35" stroke="url(#logoGradient)" strokeWidth="3" fill="none" className="logo-circle"/>
                    <path d="M30 35 L50 25 L70 35 L65 45 L50 40 L35 45 Z" stroke="url(#logoGradient)" strokeWidth="2" fill="url(#logoGradient)" fillOpacity="0.2" className="logo-leaf"/>
                    <circle cx="40" cy="55" r="3" fill="url(#logoGradient)" className="logo-dot"/>
                    <circle cx="60" cy="55" r="3" fill="url(#logoGradient)" className="logo-dot"/>
                    <path d="M35 65 Q50 75 65 65" stroke="url(#logoGradient)" strokeWidth="2" strokeLinecap="round" className="logo-smile"/>
                    <line x1="50" y1="15" x2="50" y2="25" stroke="url(#logoGradient)" strokeWidth="2" strokeLinecap="round" className="logo-antenna"/>
                    <line x1="15" y1="50" x2="25" y2="50" stroke="url(#logoGradient)" strokeWidth="2" strokeLinecap="round" className="logo-antenna"/>
                    <line x1="75" y1="50" x2="85" y2="50" stroke="url(#logoGradient)" strokeWidth="2" strokeLinecap="round" className="logo-antenna"/>
                  </svg>
                </div>
                <div className="chatbot__title-section">
                  <h1 className="chatbot__title">{t('chatbot.title')}</h1>
                  <p className="chatbot__subtitle">{t('chatbot.subtitle')}</p>
                </div>
              </div>
              <div className="chatbot__welcome">
                <p className="chatbot__welcome-text">{t('chatbot.welcomeText')}</p>
              </div>
            </div>

            {/* Main Search Area */}
            <div className="chatbot__search-section"
                 onDragOver={handleDragOver}
                 onDragLeave={handleDragLeave}
                 onDrop={handleDrop}>
              
              {/* Selected Image Preview */}
              {selectedImage && (
                <div className="chatbot__image-preview">
                  <img src={selectedImage.preview} alt="Selected" className="chatbot__preview-image" />
                  <button type="button" onClick={removeSelectedImage} className="chatbot__remove-image">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <line x1="18" y1="6" x2="6" y2="18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                      <line x1="6" y1="6" x2="18" y2="18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                  </button>
                  <span className="chatbot__image-name">{selectedImage.name}</span>
                </div>
              )}
              
              <form onSubmit={handleSubmit} className="chatbot__search-form">
                <div className={`chatbot__input-container chatbot__input-container--enhanced ${isDragOver ? 'drag-over' : ''}`}>
                  <div className="chatbot__input-tools">
                    <button type="button" onClick={handleImageButtonClick} className="chatbot__tool-btn chatbot__image-btn" aria-label={t('chatbot.uploadImage')} title={t('chatbot.uploadImage')}>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" stroke="currentColor" strokeWidth="2"/>
                        <circle cx="8.5" cy="8.5" r="1.5" stroke="currentColor" strokeWidth="2"/>
                        <path d="M21 15l-5-5L5 21" stroke="currentColor" strokeWidth="2"/>
                      </svg>
                    </button>
                    
                    <button type="button" className="chatbot__tool-btn chatbot__voice-btn-tool" aria-label="Voice input" title="Voice input">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" fill="currentColor"/>
                        <path d="M19 10v2a7 7 0 0 1-14 0v-2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <line x1="12" x2="12" y1="19" y2="23" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                        <line x1="8" x2="16" y1="23" y2="23" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                      </svg>
                    </button>
                  </div>
                  
                  <div className="chatbot__input-wrapper">
                    <input
                      type="text"
                      value={query}
                      onChange={handleInputChange}
                      placeholder={t('chatbot.inputPlaceholder')}
                      className="chatbot__input chatbot__input--enhanced"
                      autoFocus
                    />
                    {query && (
                      <button type="button" onClick={() => setQuery('')} className="chatbot__clear-btn" aria-label="Clear input">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <line x1="18" y1="6" x2="6" y2="18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                          <line x1="6" y1="6" x2="18" y2="18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                        </svg>
                      </button>
                    )}
                  </div>
                  
                  <div className="chatbot__input-actions">
                    <div className="chatbot__model-selector">
                      <div className="chatbot__model-indicator">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <circle cx="12" cy="12" r="3" fill="#4ade80"/>
                        </svg>
                        <span>AI</span>
                      </div>
                    </div>
                    
                    <button 
                      type="submit" 
                      className="chatbot__send-btn" 
                      aria-label={t('chatbot.sendMessage')}
                      disabled={!query.trim() && !selectedImage}
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M22 2l-20 10 5 5 15-15z" fill="currentColor"/>
                        <path d="M7 12l15-15-15 15" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>
                  </div>
                </div>
                
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={(e) => e.target.files[0] && handleImageUpload(e.target.files[0])}
                  style={{ display: 'none' }}
                />
              </form>
              
              {/* Enhanced Sample Prompts with Categories */}
              <div className="chatbot__sample-prompts">
                <div className="chatbot__prompts-header">
                  <h3>{t('chatbot.popularQuestions')}</h3>
                  <p>{t('chatbot.tryAskingTopics')}</p>
                </div>
                <div className="chatbot__prompt-categories">
                  <div className="chatbot__prompt-category">
                    <div className="chatbot__category-header">
                      <div className="chatbot__category-icon">🌾</div>
                      <span>{t('chatbot.categories.cropManagement')}</span>
                    </div>
                    <div className="chatbot__category-prompts">
                      <button 
                        type="button" 
                        className="chatbot__sample-prompt chatbot__sample-prompt--small"
                        onClick={() => handleSamplePromptClick(t('chatbot.prompts.monsoonCrops'))}
                      >
                        <span>{t('chatbot.promptLabels.monsoonCrops')}</span>
                      </button>
                      <button 
                        type="button" 
                        className="chatbot__sample-prompt chatbot__sample-prompt--small"
                        onClick={() => handleSamplePromptClick(t('chatbot.prompts.cropRotation'))}
                      >
                        <span>{t('chatbot.promptLabels.cropRotation')}</span>
                      </button>
                    </div>
                  </div>
                  
                  <div className="chatbot__prompt-category">
                    <div className="chatbot__category-header">
                      <div className="chatbot__category-icon">🔬</div>
                      <span>{t('chatbot.categories.plantHealth')}</span>
                    </div>
                    <div className="chatbot__category-prompts">
                      <button 
                        type="button" 
                        className="chatbot__sample-prompt chatbot__sample-prompt--small"
                        onClick={() => handleSamplePromptClick(t('chatbot.prompts.diseaseIdentification'))}
                      >
                        <span>{t('chatbot.promptLabels.diseaseIdentification')}</span>
                      </button>
                      <button 
                        type="button" 
                        className="chatbot__sample-prompt chatbot__sample-prompt--small"
                        onClick={() => handleSamplePromptClick(t('chatbot.prompts.pestControl'))}
                      >
                        <span>{t('chatbot.promptLabels.pestControl')}</span>
                      </button>
                    </div>
                  </div>
                  
                  <div className="chatbot__prompt-category">
                    <div className="chatbot__category-header">
                      <div className="chatbot__category-icon">🌱</div>
                      <span>{t('chatbot.categories.soilNutrition')}</span>
                    </div>
                    <div className="chatbot__category-prompts">
                      <button 
                        type="button" 
                        className="chatbot__sample-prompt chatbot__sample-prompt--small"
                        onClick={() => handleSamplePromptClick(t('chatbot.prompts.organicFertilizers'))}
                      >
                        <span>{t('chatbot.promptLabels.organicFertilizers')}</span>
                      </button>
                      <button 
                        type="button" 
                        className="chatbot__sample-prompt chatbot__sample-prompt--small"
                        onClick={() => handleSamplePromptClick(t('chatbot.prompts.soilTesting'))}
                      >
                        <span>{t('chatbot.promptLabels.soilTesting')}</span>
                      </button>
                    </div>
                  </div>
                  
                  <div className="chatbot__prompt-category">
                    <div className="chatbot__category-header">
                      <div className="chatbot__category-icon">🏛️</div>
                      <span>{t('chatbot.categories.governmentSupport')}</span>
                    </div>
                    <div className="chatbot__category-prompts">
                      <button 
                        type="button" 
                        className="chatbot__sample-prompt chatbot__sample-prompt--small"
                        onClick={() => handleSamplePromptClick(t('chatbot.prompts.farmerSchemes'))}
                      >
                        <span>{t('chatbot.promptLabels.farmerSchemes')}</span>
                      </button>
                      <button 
                        type="button" 
                        className="chatbot__sample-prompt chatbot__sample-prompt--small"
                        onClick={() => handleSamplePromptClick(t('chatbot.prompts.loanOptions'))}
                      >
                        <span>{t('chatbot.promptLabels.loanOptions')}</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Terms and Privacy */}
              <div className="chatbot__footer-text">
                {t('chatbot.footerTerms')}{' '}
                <a href="#" className="chatbot__link">{t('chatbot.terms')}</a>{' '}
                {t('chatbot.and')}{' '}
                <a href="#" className="chatbot__link">{t('chatbot.privacyPolicy')}</a>
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
                    <>❌ {t('chatbot.connectionFailed')} {connectionError}</>
                  ) : (
                    <>🔄 {t('chatbot.connectingToServer')}</>
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
                      <div className="chatbot__bot-avatar">
                        <svg width="32" height="32" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <circle cx="50" cy="50" r="35" stroke="currentColor" strokeWidth="3" fill="none"/>
                          <path d="M30 35 L50 25 L70 35 L65 45 L50 40 L35 45 Z" stroke="currentColor" strokeWidth="2" fill="currentColor" fillOpacity="0.1"/>
                          <circle cx="40" cy="55" r="3" fill="currentColor"/>
                          <circle cx="60" cy="55" r="3" fill="currentColor"/>
                          <path d="M35 65 Q50 75 65 65" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                        </svg>
                      </div>
                      <div className="chatbot__bot-content">
                        <div className="chatbot__bot-text">
                          {message.type === 'image' ? (
                            <img src={message.content} alt="Generated" className="chatbot__generated-image" />
                          ) : (
                            <div className="chatbot__formatted-text">
                              {message.content.split('\n').map((line, index) => {
                                if (line.trim() === '') {
                                  return <br key={index} />;
                                }
                                
                                // Parse markdown-like formatting
                                let formattedLine = line;
                                
                                // Handle bold text (**text** first, then single *text*)
                                formattedLine = formattedLine.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
                                // Simple single asterisk handling (avoiding complex lookbehinds)
                                formattedLine = formattedLine.replace(/\b\*([^*\s][^*]*[^*\s])\*\b/g, '<strong>$1</strong>');
                                formattedLine = formattedLine.replace(/\b\*([^*\s])\*\b/g, '<strong>$1</strong>'); // Single character case
                                
                                // Handle bullet points
                                const isBulletPoint = line.trim().match(/^\* (.+)$/);
                                if (isBulletPoint) {
                                  const content = isBulletPoint[1];
                                  const formattedContent = content
                                    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                                    .replace(/\b\*([^*\s][^*]*[^*\s])\*\b/g, '<strong>$1</strong>')
                                    .replace(/\b\*([^*\s])\*\b/g, '<strong>$1</strong>');
                                  
                                  return (
                                    <div key={index} className="chatbot__bullet-point">
                                      <span className="chatbot__bullet">•</span>
                                      <span 
                                        className="chatbot__bullet-content"
                                        dangerouslySetInnerHTML={{ __html: formattedContent }}
                                      />
                                    </div>
                                  );
                                }
                                
                                // Handle sub-bullet points (indented)
                                const isSubBullet = line.trim().match(/^\s+\* (.+)$/);
                                if (isSubBullet) {
                                  const content = isSubBullet[1];
                                  const formattedContent = content
                                    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                                    .replace(/\b\*([^*\s][^*]*[^*\s])\*\b/g, '<strong>$1</strong>')
                                    .replace(/\b\*([^*\s])\*\b/g, '<strong>$1</strong>');
                                  
                                  return (
                                    <div key={index} className="chatbot__sub-bullet-point">
                                      <span className="chatbot__sub-bullet">◦</span>
                                      <span 
                                        className="chatbot__bullet-content"
                                        dangerouslySetInnerHTML={{ __html: formattedContent }}
                                      />
                                    </div>
                                  );
                                }
                                
                                return (
                                  <p 
                                    key={index} 
                                    className="chatbot__text-line"
                                    dangerouslySetInnerHTML={{ __html: formattedLine }}
                                  />
                                );
                              })}
                            </div>
                          )}
                        </div>
                        <div className="chatbot__message-actions">
                          <button className="chatbot__action-btn" title={t('chatbot.copy')}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <rect x="9" y="9" width="13" height="13" rx="2" ry="2" stroke="currentColor" strokeWidth="2" fill="none"/>
                              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" stroke="currentColor" strokeWidth="2" fill="none"/>
                            </svg>
                          </button>
                          <button className="chatbot__action-btn" title={t('chatbot.like')}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3H14z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                              <path d="M7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          </button>
                          <button className="chatbot__action-btn" title={t('chatbot.dislike')}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M10 15v4a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2 1.7l-1.38 9a2 2 0 0 0 2 2.3H10z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                              <path d="M17 2h3a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2h-3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          </button>
                          {message.responseTime && (
                            <div className="chatbot__response-time">
                              {message.responseTime}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ) : (
                    // User message - bubble on the right
                    <div className="chatbot__user-message">
                      <div className="chatbot__user-bubble">
                        {message.image && (
                          <div className="chatbot__user-image">
                            <img src={message.image.preview} alt={message.image.name} className="chatbot__user-uploaded-image" />
                          </div>
                        )}
                        {message.content && (
                          <div className="chatbot__user-text">
                            {message.content}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}
              
              {/* Loading indicator when waiting for response */}
              {isWaitingForResponse && (
                <div className="chatbot__message chatbot__message--bot">
                  <div className="chatbot__bot-message">
                    <div className="chatbot__bot-avatar">
                      <svg width="32" height="32" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="50" cy="50" r="35" stroke="currentColor" strokeWidth="3" fill="none"/>
                        <path d="M30 35 L50 25 L70 35 L65 45 L50 40 L35 45 Z" stroke="currentColor" strokeWidth="2" fill="currentColor" fillOpacity="0.1"/>
                        <circle cx="40" cy="55" r="3" fill="currentColor"/>
                        <circle cx="60" cy="55" r="3" fill="currentColor"/>
                        <path d="M35 65 Q50 75 65 65" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                      </svg>
                    </div>
                    <div className="chatbot__bot-content">
                      <div className="chatbot__bot-text">
                        <div className="chatbot__typing-indicator">
                          <span></span>
                          <span></span>
                          <span></span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} /> {/* Empty div for scrolling to bottom */}
            </div>
            
            {/* Input container */}
            <div className="chatbot__input-footer"
                 onDragOver={handleDragOver}
                 onDragLeave={handleDragLeave}
                 onDrop={handleDrop}>
              
              {/* Selected Image Preview in Chat */}
              {selectedImage && (
                <div className="chatbot__chat-image-preview">
                  <img src={selectedImage.preview} alt="Selected" className="chatbot__preview-image" />
                  <button type="button" onClick={removeSelectedImage} className="chatbot__remove-image">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <line x1="18" y1="6" x2="6" y2="18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                      <line x1="6" y1="6" x2="18" y2="18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                  </button>
                  <span className="chatbot__image-name">{selectedImage.name}</span>
                </div>
              )}
              
              <form onSubmit={handleSubmit} className="chatbot__input-form">
                <div className={`chatbot__input-container chatbot__input-container--enhanced ${isDragOver ? 'drag-over' : ''}`}>
                  <div className="chatbot__input-tools">
                    <button type="button" onClick={handleImageButtonClick} className="chatbot__tool-btn" aria-label="Upload image" title="Upload an image">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" stroke="currentColor" strokeWidth="2"/>
                        <circle cx="8.5" cy="8.5" r="1.5" stroke="currentColor" strokeWidth="2"/>
                        <path d="M21 15l-5-5L5 21" stroke="currentColor" strokeWidth="2"/>
                      </svg>
                    </button>
                    
                    <button type="button" className="chatbot__tool-btn chatbot__voice-btn-tool" aria-label="Voice input" title="Voice input">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" fill="currentColor"/>
                        <path d="M19 10v2a7 7 0 0 1-14 0v-2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <line x1="12" x2="12" y1="19" y2="23" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                        <line x1="8" x2="16" y1="23" y2="23" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                      </svg>
                    </button>
                  </div>
                  
                  <div className="chatbot__input-wrapper">
                    <input
                      type="text"
                      value={query}
                      onChange={handleInputChange}
                      placeholder={!isConnected ? t('chatbot.connecting') : t('chatbot.inputPlaceholder')}
                      className="chatbot__input chatbot__input--enhanced"
                      disabled={!isConnected || isWaitingForResponse}
                      autoFocus
                    />
                    {query && (
                      <button type="button" onClick={() => setQuery('')} className="chatbot__clear-btn" aria-label="Clear input">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <line x1="18" y1="6" x2="6" y2="18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                          <line x1="6" y1="6" x2="18" y2="18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                        </svg>
                      </button>
                    )}
                  </div>
                  
                  <div className="chatbot__input-actions">
                    <div className="chatbot__model-selector">
                      <div className="chatbot__model-indicator">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <circle cx="12" cy="12" r="3" fill="#4ade80"/>
                        </svg>
                        <span>AI</span>
                      </div>
                    </div>
                    
                    <button 
                      type="submit" 
                      className="chatbot__send-btn" 
                      aria-label="Send message"
                      disabled={!isConnected || isWaitingForResponse || (!query.trim() && !selectedImage)}
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M22 2l-20 10 5 5 15-15z" fill="currentColor"/>
                        <path d="M7 12l15-15-15 15" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>
                  </div>
                </div>
                
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={(e) => e.target.files[0] && handleImageUpload(e.target.files[0])}
                  style={{ display: 'none' }}
                />
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Chatbot;
