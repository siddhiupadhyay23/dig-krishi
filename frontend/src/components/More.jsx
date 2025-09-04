import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import './More.scss';

const More = () => {
  const { t } = useLanguage();
  
  return (
    <section className="more-section">
      <div className="more-container">
        <div className="more-header">
          <h3 className="more-subtitle">
            {t('services.subtitle')}
          </h3>
          <h2 className="more-title">
            {t('services.title')}
          </h2>
        </div>
        <div className="more-content">
          <div className="more-box">
            <div className="services-grid">
              <div className="service-card">
                <div className="service-icon">
                  <svg viewBox="0 0 24 24" fill="currentColor" className="service-svg-icon">
                    <path d="M12,3C17.5,3 22,6.58 22,11C22,15.42 17.5,19 12,19C10.76,19 9.57,18.82 8.47,18.5C5.55,21 2,21 2,21C4.33,18.67 4.7,17.1 4.75,16.5C3.05,15.07 2,13.13 2,11C2,6.58 6.5,3 12,3Z" />
                  </svg>
                </div>
                <h3 className="service-title">{t('services.liveChat.title')}</h3>
                <p className="service-description">
                  {t('services.liveChat.description')}
                </p>
                <button className="service-button">
                  {t('services.liveChat.button')}
                </button>
              </div>

              <div className="service-card">
                <div className="service-icon">
                  <svg viewBox="0 0 24 24" fill="currentColor" className="service-svg-icon">
                    <path d="M20,8L12,13L4,8V6L12,11L20,6M20,4H4C2.89,4 2,4.89 2,6V18A2,2 0 0,0 4,20H20A2,2 0 0,0 22,18V6C22,4.89 21.1,4 20,4Z" />
                  </svg>
                </div>
                <h3 className="service-title">{t('services.emailSupport.title')}</h3>
                <p className="service-description">
                  {t('services.emailSupport.description')}
                </p>
                <button className="service-button">
                  {t('services.emailSupport.button')}
                </button>
              </div>

              <div className="service-card">
                <div className="service-icon">
                  <svg viewBox="0 0 24 24" fill="currentColor" className="service-svg-icon">
                    <path d="M6.62,10.79C8.06,13.62 10.38,15.94 13.21,17.38L15.41,15.18C15.69,14.9 16.08,14.82 16.43,14.93C17.55,15.3 18.75,15.5 20,15.5A1,1 0 0,1 21,16.5V20A1,1 0 0,1 20,21A17,17 0 0,1 3,4A1,1 0 0,1 4,3H7.5A1,1 0 0,1 8.5,4C8.5,5.25 8.7,6.45 9.07,7.57C9.18,7.92 9.1,8.31 8.82,8.59L6.62,10.79Z" />
                  </svg>
                </div>
                <h3 className="service-title">{t('services.phoneSupport.title')}</h3>
                <p className="service-description">
                  {t('services.phoneSupport.description')}
                </p>
                <button className="service-button">
                  {t('services.phoneSupport.button')}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default More;
