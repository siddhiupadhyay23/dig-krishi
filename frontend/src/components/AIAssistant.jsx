import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import Navbar from './Navbar';
import './AIAssistant.scss';

const AIAssistant = () => {
  const { t } = useLanguage();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'bot',
      message: 'Hello! I\'m your AI Agricultural Assistant. I can help you with farming techniques, crop management, rural development schemes, food technology, and agricultural best practices. How can I assist you today?',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const processedQuestionRef = useRef(false);

  const quickActions = [
    {
      id: 1,
      title: 'Crop Recommendations',
      description: 'Get AI-powered crop suggestions based on soil and weather',
      icon: 'C',
      action: 'What crops should I plant this season?'
    },
    {
      id: 2,
      title: 'Pest Management',
      description: 'Identify and manage crop pests effectively',
      icon: 'P',
      action: 'How can I manage pests in my crops naturally?'
    },
    {
      id: 3,
      title: 'Soil Health',
      description: 'Learn about soil testing and improvement',
      icon: 'S',
      action: 'How can I improve my soil health?'
    },
    {
      id: 4,
      title: 'Weather Advisory',
      description: 'Get weather-based farming advice',
      icon: 'W',
      action: 'What farming activities should I do based on current weather?'
    },
    {
      id: 5,
      title: 'Food Technology',
      description: 'Learn about food processing and preservation',
      icon: 'F',
      action: 'How can I process and preserve my harvest?'
    },
    {
      id: 6,
      title: 'Rural Development',
      description: 'Information about rural development schemes',
      icon: 'R',
      action: 'What rural development programs are available for farmers?'
    }
  ];

  const knowledgeBase = [
    {
      category: 'Agriculture',
      topics: ['Organic Farming', 'Precision Agriculture', 'Sustainable Farming', 'Crop Rotation']
    },
    {
      category: 'Food Technology',
      topics: ['Food Processing', 'Cold Storage', 'Value Addition', 'Food Safety']
    },
    {
      category: 'Rural Development',
      topics: ['Government Schemes', 'Skill Development', 'Infrastructure', 'Digital Literacy']
    }
  ];

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  // Handle incoming question from hero section
  useEffect(() => {
    if (location.state?.question && isAuthenticated && !processedQuestionRef.current) {
      processedQuestionRef.current = true;
      
      // Automatically send the question from hero section
      const incomingQuestion = location.state.question;
      
      const userMessage = {
        id: Date.now(),
        type: 'user',
        message: incomingQuestion,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, userMessage]);
      setIsTyping(true);

      // Simulate AI response delay
      setTimeout(() => {
        const botResponse = {
          id: Date.now() + 1,
          type: 'bot',
          message: generateBotResponse(incomingQuestion),
          timestamp: new Date()
        };
        setMessages(prev => [...prev, botResponse]);
        setIsTyping(false);
      }, 1500);
      
      // Clear the state to prevent resending on re-renders
      window.history.replaceState({}, document.title);
    }
  }, [location.state?.question, isAuthenticated]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const generateBotResponse = (userMessage) => {
    const responses = {
      'crop': [
        'Based on your location and current season, I recommend rice, coconut, and pepper cultivation. Kerala\'s tropical climate is ideal for these crops.',
        'For sustainable farming, consider intercropping with legumes to improve soil fertility naturally.',
        'Have you considered organic farming methods? They can increase your crop value and improve soil health.'
      ],
      'pest': [
        'Natural pest management includes neem oil spray, companion planting, and beneficial insects like ladybugs.',
        'Integrated Pest Management (IPM) combines biological, cultural, and minimal chemical methods effectively.',
        'Regular field monitoring and crop rotation can significantly reduce pest problems.'
      ],
      'soil': [
        'Soil health can be improved through composting, cover crops, and reducing tillage.',
        'Regular soil testing helps determine pH levels and nutrient deficiencies.',
        'Adding organic matter like compost and farmyard manure improves soil structure and fertility.'
      ],
      'weather': [
        'During monsoon season, focus on drainage management and plant disease prevention.',
        'Use weather forecasts to plan irrigation, fertilizer application, and harvesting.',
        'Consider rainwater harvesting systems for water conservation during dry periods.'
      ],
      'food': [
        'Food processing adds value to your harvest. Consider setting up small-scale processing units.',
        'Proper storage techniques can reduce post-harvest losses by 20-30%.',
        'Food safety standards are crucial for accessing premium markets.'
      ],
      'rural': [
        'Several schemes like PM-KISAN, PMAY-G, and MGNREGA support rural development.',
        'Digital literacy programs help farmers access online markets and information.',
        'Self-Help Groups (SHGs) provide financial support and skill development opportunities.'
      ],
      'default': [
        'That\'s an interesting question about agriculture. Could you provide more specific details?',
        'I\'m here to help with farming, food technology, and rural development. Can you elaborate on your query?',
        'Based on agricultural best practices, I\'d recommend consulting with local agricultural extension officers for specific guidance.'
      ]
    };

    const lowerMessage = userMessage.toLowerCase();
    let responseCategory = 'default';

    if (lowerMessage.includes('crop') || lowerMessage.includes('plant') || lowerMessage.includes('farming')) {
      responseCategory = 'crop';
    } else if (lowerMessage.includes('pest') || lowerMessage.includes('insect') || lowerMessage.includes('disease')) {
      responseCategory = 'pest';
    } else if (lowerMessage.includes('soil') || lowerMessage.includes('fertilizer') || lowerMessage.includes('compost')) {
      responseCategory = 'soil';
    } else if (lowerMessage.includes('weather') || lowerMessage.includes('rain') || lowerMessage.includes('climate')) {
      responseCategory = 'weather';
    } else if (lowerMessage.includes('food') || lowerMessage.includes('process') || lowerMessage.includes('storage')) {
      responseCategory = 'food';
    } else if (lowerMessage.includes('rural') || lowerMessage.includes('scheme') || lowerMessage.includes('government')) {
      responseCategory = 'rural';
    }

    const categoryResponses = responses[responseCategory];
    return categoryResponses[Math.floor(Math.random() * categoryResponses.length)];
  };

  const handleSendMessage = async (messageText = inputMessage) => {
    if (!messageText.trim()) return;

    const userMessage = {
      id: messages.length + 1,
      type: 'user',
      message: messageText,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    // Simulate AI response delay
    setTimeout(() => {
      const botResponse = {
        id: messages.length + 2,
        type: 'bot',
        message: generateBotResponse(messageText),
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const handleQuickAction = (action) => {
    handleSendMessage(action);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="ai-assistant">
      <Navbar />
      
      <div className="assistant-container">
        <div className="assistant-header">
          <div className="header-content">
            <h1>AI Agricultural Assistant</h1>
            <p>Your intelligent farming companion for sustainable agriculture and rural development</p>
          </div>
          <div className="user-info">
            <span>Welcome, {user?.name || 'Farmer'}</span>
          </div>
        </div>

        <div className="chat-container">
          <div className="conversation-starters">
            <h3>Quick Start Topics</h3>
            <div className="starter-buttons">
              {quickActions.map((action) => (
                <button
                  key={action.id}
                  className="starter-button"
                  onClick={() => handleQuickAction(action.action)}
                >
                  <span className="starter-icon">{action.icon}</span>
                  <span className="starter-text">{action.title}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="chat-interface">
            <div className="chat-messages">
              {messages.length === 1 ? (
                <div className="welcome-message">
                  <div className="welcome-icon">AI</div>
                  <h3>Welcome to Your AI Agricultural Assistant!</h3>
                  <p>
                    I'm here to help you with farming techniques, crop management, 
                    rural development, food technology, and sustainable agriculture practices. 
                    Ask me anything or use the quick topics to get started!
                  </p>
                </div>
              ) : (
                messages.slice(1).map((message) => (
                  <div key={message.id} className={`message ${message.type}`}>
                    <div className="message-content">
                      {message.message}
                    </div>
                    <div className={`message-time ${message.type}`}>
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                ))
              )}
              
              {isTyping && (
                <div className="typing-indicator">
                  <div className="typing-dots">
                    <div className="dot"></div>
                    <div className="dot"></div>
                    <div className="dot"></div>
                  </div>
                  <span>AI Assistant is thinking...</span>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
            
            <div className="chat-input-container">
              <div className="chat-input-wrapper">
                <textarea
                  className="chat-input"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask me anything about farming, crops, soil, weather, or rural development..."
                  rows="1"
                />
                <button 
                  className="send-button"
                  onClick={() => handleSendMessage()} 
                  disabled={!inputMessage.trim() || isTyping}
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIAssistant;
