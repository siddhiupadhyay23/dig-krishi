import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import './Navbar.scss';
import logo from '../assets/logo1.png';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t, toggleLanguage, currentLanguage } = useLanguage();
  const { isAuthenticated, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navigationItems = [
    { 
      id: 'dashboard', 
      label: 'Dashboard', 
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor" className="nav-icon">
          <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z"/>
        </svg>
      ), 
      path: '/dashboard' 
    },
    { 
      id: 'profile', 
      label: 'Profile', 
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor" className="nav-icon">
          <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
        </svg>
      ), 
      path: '/profile' 
    },
    { 
      id: 'ai-assistant', 
      label: 'AI Assistant', 
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor" className="nav-icon">
          <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 14v-2.47l6.88-6.88c.2-.2.51-.2.71 0l1.77 1.77c.2.2.2.51 0 .71L8.47 14H6zm12 0h-7.5l2-2H18v2z"/>
        </svg>
      ), 
      path: '/ai-assistant' 
    },
    { 
      id: 'prediction', 
      label: 'AI Prediction', 
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor" className="nav-icon">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
        </svg>
      ), 
      path: '/prediction' 
    },
    { 
      id: 'govt-services', 
      label: 'Govt Services', 
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor" className="nav-icon">
          <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z"/>
        </svg>
      ), 
      path: '/government-services' 
    }
  ];

  const isActiveTab = (path) => {
    if (path.includes('?tab=')) {
      const [basePath, tabQuery] = path.split('?tab=');
      return location.pathname === basePath && location.search.includes(tabQuery);
    }
    return location.pathname === path;
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-logo">
          <img src={logo} alt="Digital Krishi Officer Logo" className="logo-image" onClick={() => navigate('/')} />
        </div>

        {isAuthenticated ? (
          // Authenticated Navbar - Center Navigation Menu
          <>
            <div className="navbar-center-menu">
              {navigationItems.map((item) => (
                <button
                  key={item.id}
                  className={`nav-menu-item ${
                    isActiveTab(item.path) ? 'active' : ''
                  }`}
                  onClick={() => navigate(item.path)}
                >
                  <span className="nav-item-icon">{item.icon}</span>
                  <span className="nav-item-label">{item.label}</span>
                </button>
              ))}
            </div>
            
            <div className="navbar-user-actions">
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
              
              <button className="auth-btn logout-btn" onClick={handleLogout}>
                <svg 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  className="logout-icon"
                >
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                  <polyline points="16,17 21,12 16,7"/>
                  <line x1="21" y1="12" x2="9" y2="12"/>
                </svg>
                Logout
              </button>
            </div>
          </>
        ) : (
          // Unauthenticated Navbar - Simple Layout
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
                  d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 919-9" 
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
        )}
      </div>
    </nav>
  );
};

export default Navbar;
