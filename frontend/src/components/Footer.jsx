import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import './Footer.scss';

const Footer = () => {
  const { t } = useLanguage();
  
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-main">
          <div className="footer-brand">
            <h1 className="footer-title">{t('footer.brand.title')}</h1>
            <h2 className="footer-subtitle">{t('footer.brand.subtitle')}</h2>
            <div className="footer-cta">
              <button className="cta-button">
                {t('footer.brand.getStarted')}
                <span className="arrow">↗</span>
              </button>
            </div>
          </div>
          
          <div className="footer-nav">
            <div className="nav-section">
              <h3 className="nav-title">{t('footer.services.title')}</h3>
              <nav className="nav-links">
                <a href="/prediction" className="nav-link">
                  {t('footer.services.cropPrediction')} <span className="arrow">↗</span>
                </a>
                <a href="/reports" className="nav-link">
                  {t('footer.services.reports')} <span className="arrow">↗</span>
                </a>
                <a href="/government-services" className="nav-link">
                  {t('footer.services.governmentServices')} <span className="arrow">↗</span>
                </a>
                <a href="/dashboard" className="nav-link">
                  {t('footer.services.dashboard')} <span className="arrow">↗</span>
                </a>
              </nav>
            </div>
            
            <div className="nav-section">
              <h3 className="nav-title">{t('footer.resources.title')}</h3>
              <nav className="nav-links">
                <a href="/features" className="nav-link">
                  {t('footer.resources.features')} <span className="arrow">↗</span>
                </a>
                <a href="/profile" className="nav-link">
                  {t('footer.resources.profile')} <span className="arrow">↗</span>
                </a>
                <a href="/working" className="nav-link">
                  {t('footer.resources.howItWorks')} <span className="arrow">↗</span>
                </a>
                <a href="/login" className="nav-link">
                  {t('footer.resources.login')} <span className="arrow">↗</span>
                </a>
              </nav>
            </div>
          </div>
        </div>
        
        <div className="footer-bottom">
          <div className="footer-divider"></div>
          <div className="footer-copyright">
            <p>{t('footer.copyright')}</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
