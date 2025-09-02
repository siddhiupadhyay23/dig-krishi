import React from 'react';
import Navbar from './Navbar';
import Chatbot from './Chatbot';
import './HeroSection.scss';
import headSvg from '../assets/head.svg';

const HeroSection = () => {
  return (
    <div className="hero-section">
      <Navbar />
      <h1 className="hero-title">A Farmer AI Assistant</h1>
      <div className="hero-svg">
        <img src={headSvg} alt="Head" className="head-svg" />
      </div>
      <Chatbot />
    </div>
  );
};

export default HeroSection;
