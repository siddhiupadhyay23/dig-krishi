import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import Navbar from './Navbar';
import Features from './Features';
import './HeroSection.scss';
import headSvg from '../assets/head.svg';

const HeroSection = () => {
  const { t } = useLanguage();
  
  return (
    <>
      <div className="hero-section">
        <Navbar />
        <h1 className="hero-title">
          {t('hero.title')} <span className="italic-text">{t('hero.titleItalic')}</span>
        </h1>
        <p className="hero-slogan">
          {t('hero.slogan')}
        </p>
        <div className="hero-svg">
          <img src={headSvg} alt="Head" className="head-svg" />
        </div>
      </div>
      <Features />
    </>
  );
};

export default HeroSection;
