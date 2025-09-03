import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CelebrationIcon,
  SeedlingIcon,
  RocketIcon,
  SproutIcon,
  AIIcon,
  SunIcon,
  GovernmentIcon,
  AnalyticsIcon,
  RiceIcon,
  CheckIcon
} from './icons';
import './WelcomeCard.scss';

const WelcomeCard = ({ user, onClose, onContinue }) => {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  const welcomeSteps = [
    {
      icon: <CelebrationIcon size={32} />,
      title: 'Welcome to DigKrishi!',
      message: `Hello ${user?.fullName?.firstName || 'Farmer'}! Your agricultural journey begins now.`
    },
    {
      icon: <SeedlingIcon size={32} />,
      title: 'Your Farm Awaits',
      message: 'Access AI-powered insights, weather forecasts, and government schemes tailored for you.'
    },
    {
      icon: <RocketIcon size={32} />,
      title: 'Ready to Grow?',
      message: 'Let\'s set up your farm profile and start maximizing your agricultural potential!'
    }
  ];

  useEffect(() => {
    setIsVisible(true);
    
    // Auto-progress through steps
    const interval = setInterval(() => {
      setCurrentStep(prev => {
        if (prev < welcomeSteps.length - 1) {
          return prev + 1;
        }
        clearInterval(interval);
        return prev;
      });
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const handleContinue = () => {
    setIsVisible(false);
    setTimeout(() => {
      if (onContinue) {
        onContinue();
      } else {
        navigate('/profile-setup');
      }
    }, 300);
  };

  const handleSkip = () => {
    setIsVisible(false);
    setTimeout(() => {
      if (onClose) {
        onClose();
      } else {
        navigate('/');
      }
    }, 300);
  };

  return (
    <div className={`welcome-overlay ${isVisible ? 'visible' : ''}`}>
      <div className={`welcome-card ${isVisible ? 'slide-in' : ''}`}>
        {/* Background Decorations */}
        <div className="card-decorations">
          <div className="decoration-leaf decoration-leaf-1"><SproutIcon size={16} /></div>
          <div className="decoration-leaf decoration-leaf-2"><SeedlingIcon size={16} /></div>
          <div className="decoration-leaf decoration-leaf-3"><SproutIcon size={16} /></div>
        </div>

        {/* Progress Indicators */}
        <div className="progress-indicators">
          {welcomeSteps.map((_, index) => (
            <div
              key={index}
              className={`progress-dot ${index <= currentStep ? 'active' : ''}`}
            />
          ))}
        </div>

        {/* Main Content */}
        <div className="welcome-content">
          <div className="welcome-icon">
            {welcomeSteps[currentStep].icon}
          </div>
          
          <h2 className="welcome-title">
            {welcomeSteps[currentStep].title}
          </h2>
          
          <p className="welcome-message">
            {welcomeSteps[currentStep].message}
          </p>

          {/* User Info Card */}
          <div className="user-info-card">
            <div className="user-avatar">
              {(user?.fullName?.firstName || 'F')[0].toUpperCase()}
            </div>
            <div className="user-details">
              <h3>{user?.fullName?.firstName} {user?.fullName?.lastName}</h3>
              <p>{user?.email}</p>
              <span className="user-badge"><SeedlingIcon size={14} /> New Farmer</span>
            </div>
          </div>

          {/* Features Preview */}
          <div className="features-preview">
            <div className="feature-item">
              <AIIcon className="feature-icon" size={16} />
              <span className="feature-text">AI Assistant</span>
            </div>
            <div className="feature-item">
              <SunIcon className="feature-icon" size={16} />
              <span className="feature-text">Weather Insights</span>
            </div>
            <div className="feature-item">
              <GovernmentIcon className="feature-icon" size={16} />
              <span className="feature-text">Govt. Schemes</span>
            </div>
            <div className="feature-item">
              <AnalyticsIcon className="feature-icon" size={16} />
              <span className="feature-text">Crop Predictions</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="welcome-actions">
          <button 
            className="btn btn-secondary"
            onClick={handleSkip}
          >
            Skip for Now
          </button>
          <button 
            className="btn btn-primary"
            onClick={handleContinue}
          >
            {currentStep === welcomeSteps.length - 1 ? (
              <><RiceIcon size={16} /> Set Up My Farm</>
            ) : (
              <>Continue ›</>
            )}
          </button>
        </div>

        {/* Success Animation */}
        <div className="success-animation">
          <div className="success-circle">
            <CheckIcon className="success-check" size={24} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomeCard;
