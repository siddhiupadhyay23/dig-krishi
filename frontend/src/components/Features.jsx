import React from 'react';
import './Features.scss';

const Features = () => {
  const features = [
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor" className="feature-svg-icon">
          <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 1H5C3.89 1 3 1.89 3 3V21C3 22.11 3.89 23 5 23H11V21H5V3H14V8H21V9H19V11H21V13H19V15H21V17H19V19H21V21H19V23H17V21H15V19H17V17H15V15H17V13H15V11H17V9H21Z" />
        </svg>
      ),
      title: 'Crop Planning',
      description: 'Get personalized crop planning advice based on soil type, climate, and market conditions for optimal yield.'
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor" className="feature-svg-icon">
          <path d="M22,21H2V3H4V19H6V10H10V19H12V6H16V19H18V14H22V21Z" />
        </svg>
      ),
      title: 'Farm Analytics',
      description: 'Monitor your farm performance with detailed analytics on crop growth, yield predictions, and productivity insights.'
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor" className="feature-svg-icon">
          <path d="M12,2A2,2 0 0,1 14,4A2,2 0 0,1 12,6A2,2 0 0,1 10,4A2,2 0 0,1 12,2M12,15A6,6 0 0,1 6,9C6,7 7,5.1 8.5,3.8L12,7.3L15.5,3.8C17,5.1 18,7 18,9A6,6 0 0,1 12,15M12,17A8,8 0 0,0 20,9C20,6.2 18.8,3.7 16.8,2L12,6.8L7.2,2C5.2,3.7 4,6.2 4,9A8,8 0 0,0 12,17M14,10H16L12,14L8,10H10V8H14V10Z" />
        </svg>
      ),
      title: 'Smart Irrigation',
      description: 'Optimize water usage with AI-driven irrigation recommendations based on weather patterns and soil moisture.'
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor" className="feature-svg-icon">
          <path d="M12,2A3,3 0 0,1 15,5V11A3,3 0 0,1 12,14A3,3 0 0,1 9,11V5A3,3 0 0,1 12,2M19,11C19,14.53 16.39,17.44 13,17.93V21H11V17.93C7.61,17.44 5,14.53 5,11H7A5,5 0 0,0 12,16A5,5 0 0,0 17,11H19Z" />
        </svg>
      ),
      title: 'Knowledge Base',
      description: 'Access comprehensive farming guides, expert articles, and tutorials to enhance your agricultural knowledge.'
    }
  ];

  return (
    <section className="features-section">
      <div className="features-container">
        <div className="features-header">
          <h2 className="features-title">Smart Features for Smarter Farming</h2>
        </div>
        <div className="features-grid">
          {features.map((feature, index) => (
            <div key={index} className="feature-card">
              <div className="feature-icon">{feature.icon}</div>
              <h3 className="feature-title">{feature.title}</h3>
              <p className="feature-description">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;