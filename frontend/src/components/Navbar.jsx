import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import './Navbar.scss';
import logo from '../assets/logo1.png';

const Navbar = () => {
  const navigate = useNavigate();
  const { t, toggleLanguage, currentLanguage } = useLanguage();

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-logo">
          <img src={logo} alt="Digital Krishi Officer Logo" className="logo-image" />
        </div>
        <div className="navbar-auth">
          {/* Language Toggle Button */}
          <button className="language-toggle-btn" onClick={toggleLanguage}>
            <svg 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              className="language-icon"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" 
              />
            </svg>
            <span className="language-text">{t('navbar.language')}</span>
          </button>

          <button className="auth-btn sign-up-btn" onClick={() => navigate('/signup')}>
            {t('navbar.signUp')}
          </button>

          <button className="auth-btn sign-in-btn" onClick={() => navigate('/login')}>
            {t('navbar.login')}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
