import React from 'react';
import Navbar from './Navbar';
import Chatbot from './Chatbot';
import './HeroSection.scss';
import headSvg from '../assets/head.svg';

const HeroSection = () => {
  return (
    <div className="hero-section">
      <Navbar />
      <div className="hero-svg">
        <img src={headSvg} alt="Head" className="head-svg" />
      </div>
      <Chatbot />
    </div>
  );
};

export default HeroSection;
