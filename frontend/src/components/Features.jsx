import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import './Features.scss';

const Features = () => {
  const { t, getCurrentTranslations } = useLanguage();
  const translations = getCurrentTranslations();

  const featureIcons = [
    (
      <svg viewBox="0 0 24 24" fill="currentColor" className="feature-svg-icon">
        <path d="M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20A8,8 0 0,0 20,12A8,8 0 0,0 12,4M12,6A6,6 0 0,1 18,12A6,6 0 0,1 12,18A6,6 0 0,1 6,12A6,6 0 0,1 12,6M12,8A4,4 0 0,0 8,12A4,4 0 0,0 12,16A4,4 0 0,0 16,12A4,4 0 0,0 12,8M7,2L8.5,3.5L7,5V2M17,2V5L15.5,3.5L17,2Z" />
      </svg>
    ),
    (
      <svg viewBox="0 0 24 24" fill="currentColor" className="feature-svg-icon">
        <path d="M9,2V8H11V11H5C3.89,11 3,11.89 3,13V16L1,18V21H5V20.5L4,19.5V19H7V16H5V14H11V22H13V14H19V16H17V19H20V19.5L19,20.5V21H23V18L21,16V13C21,11.89 20.11,11 19,11H13V8H15V2H9M11,4H13V6H11V4M6,16V18H4V16H6M18,16H20V18H18V16Z" />
      </svg>
    ),
    (
      <svg viewBox="0 0 24 24" fill="currentColor" className="feature-svg-icon">
        <path d="M17.5,12A1.5,1.5 0 0,1 16,10.5A1.5,1.5 0 0,1 17.5,9A1.5,1.5 0 0,1 19,10.5A1.5,1.5 0 0,1 17.5,12M14.5,8A1.5,1.5 0 0,1 13,6.5A1.5,1.5 0 0,1 14.5,5A1.5,1.5 0 0,1 16,6.5A1.5,1.5 0 0,1 14.5,8M9.5,8A1.5,1.5 0 0,1 8,6.5A1.5,1.5 0 0,1 9.5,5A1.5,1.5 0 0,1 11,6.5A1.5,1.5 0 0,1 9.5,8M6.5,12A1.5,1.5 0 0,1 5,10.5A1.5,1.5 0 0,1 6.5,9A1.5,1.5 0 0,1 8,10.5A1.5,1.5 0 0,1 6.5,12M12,3L17.39,6L21.39,8L12,13L2.61,8L6.61,6L12,3M12,15L16.75,12.37L20.75,10.37L12,15L3.25,10.37L7.25,12.37L12,15Z" />
      </svg>
    ),
    (
      <svg viewBox="0 0 24 24" fill="currentColor" className="feature-svg-icon">
        <path d="M12,1L3,5V11C3,16.55 6.84,21.74 12,23C17.16,21.74 21,16.55 21,11V5L12,1M12,4.2L18,6.7V11C18,15.55 15.68,19.74 12,20.5C8.32,19.74 6,15.55 6,11V6.7L12,4.2M15.5,9L16.92,10.42L11.5,15.84L7.08,11.42L8.5,10L11.5,13L15.5,9Z" />
      </svg>
    ),
    (
      <svg viewBox="0 0 24 24" fill="currentColor" className="feature-svg-icon">
        <path d="M20,17H22V19H20V17M20,7V15H22V7C22,5.89 21.1,5 20,5H4C2.89,5 2,5.89 2,7V15H4V7H20M4,17H6V19H4V17M6,19V17H18V19H6M13,9H15V13H13V9M11,9V13H13V9H11M7,11H9V13H7V11M17,11V13H19V11H17M9,11V9H11V11H9M15,13V11H17V13H15M7,9V11H9V9H7M17,9V11H19V9H17Z" />
      </svg>
    ),
    (
      <svg viewBox="0 0 24 24" fill="currentColor" className="feature-svg-icon">
        <path d="M9,12L7.5,10.5L6,12L7.5,13.5L9,12M15,12L13.5,10.5L12,12L13.5,13.5L15,12M18,12L16.5,10.5L15,12L16.5,13.5L18,12M21,12L19.5,10.5L18,12L19.5,13.5L21,12M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20A8,8 0 0,0 20,12A8,8 0 0,0 12,4M9,17H15V15H9V17Z" />
      </svg>
    )
  ];

  return (
    <section className="features-section">
      <div className="features-container">
        <div className="features-header">
          <h2 className="features-title">
            {translations.features.title}
          </h2>
        </div>
        <div className="features-grid">
          {translations.features.cards.map((feature, index) => (
            <div key={index} className="feature-card">
              <div className="feature-icon">{featureIcons[index]}</div>
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