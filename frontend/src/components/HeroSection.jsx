import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import Navbar from './Navbar';
import Features from './Features';
import Working from './Working';
import './HeroSection.scss';

const HeroSection = () => {
  const { t } = useLanguage();
  
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
        <button className="hero-cta-button">
          Get Started
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="button-arrow">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </button>
      </div>
      <Features />
      <Working />
    </>
  );
};

export default HeroSection;
