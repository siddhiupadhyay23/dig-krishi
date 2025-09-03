import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import Navbar from './Navbar';
import Features from './Features';
import Working from './Working';
import Footer from './Footer';
import leafs from '../assets/leafs.png';
import './HeroSection.scss';

const HeroSection = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [isExpanded, setIsExpanded] = useState(false);
  const [question, setQuestion] = useState('');
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  
  const handleGetStarted = () => {
    setIsExpanded(true);
  };
  
  const handleSubmitQuestion = (e) => {
    e.preventDefault();
    if (question.trim()) {
      if (isAuthenticated) {
        // Redirect to AI assistant page with the question
        navigate('/ai-assistant', { state: { question: question.trim() } });
      } else {
        // Show login popup
        setShowLoginPopup(true);
      }
    }
  };
  
  const handleLoginSuccess = () => {
    setShowLoginPopup(false);
    // After login, redirect to AI assistant with the question
    navigate('/ai-assistant', { state: { question: question.trim() } });
  };
  
  const handleCloseLoginPopup = () => {
    setShowLoginPopup(false);
  };
  
  // Handle escape key to reset to initial state
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setIsExpanded(false);
        setQuestion('');
        setShowLoginPopup(false);
      }
    };
    
    document.addEventListener('keydown', handleKeyDown);
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);
  
  
  return (
    <>
      <div className="hero-section">
        <Navbar />
        <p className="hero-slogan">
          {t('hero.slogan')}
        </p>
        <h1 className="hero-title">
          {t('hero.title')} <span className="italic-text">{t('hero.titleItalic')}</span>
        </h1>
        <div className={`hero-cta-container ${isExpanded ? 'expanded' : ''}`}>
          {!isExpanded ? (
            <button className="hero-cta-button" onClick={handleGetStarted}>
              Get Started
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="button-arrow">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </button>
          ) : (
            <form onSubmit={handleSubmitQuestion} className="question-form-inline">
              <div className="input-wrapper-inline">
                <button 
                  type="button" 
                  className="add-button-inline"
                  onClick={() => {
                    setIsExpanded(false);
                    setQuestion('');
                  }}
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <line x1="12" y1="5" x2="12" y2="19"></line>
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                  </svg>
                </button>
                
                <input
                  type="text"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder="Ask me anything about farming..."
                  className="question-input-inline"
                  autoFocus
                />
                
                <button 
                  type="submit" 
                  className="submit-button-inline"
                  disabled={!question.trim()}
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7l4-4m0 0l4 4m-4-4v18" />
                  </svg>
                </button>
              </div>
            </form>
          )}
        </div>
        
        {showLoginPopup && (
          <div className="login-popup-overlay">
            <div className="login-popup">
              <div className="login-popup-header">
                <h3>Login Required</h3>
                <button onClick={handleCloseLoginPopup} className="close-popup">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
              </div>
              <p>Please login to ask questions to our AI assistant.</p>
              <div className="login-popup-actions">
                <button 
                  onClick={() => navigate('/login')}
                  className="login-popup-btn primary"
                >
                  Login
                </button>
                <button 
                  onClick={() => navigate('/signup')}
                  className="login-popup-btn secondary"
                >
                  Sign Up
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      <Features />
      <Working />
    </>
  );
};

export default HeroSection;
