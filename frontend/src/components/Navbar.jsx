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
    { id: 'dashboard', label: 'Dashboard', icon: '📊', path: '/dashboard' },
    { id: 'profile', label: 'Profile', icon: '👤', path: '/profile' },
    { id: 'ai-assistant', label: 'AI Assistant', icon: '🤖', path: '/reports?tab=ai-chat' },
    { id: 'prediction', label: 'AI Prediction', icon: '🔮', path: '/reports?tab=prediction' },
    { id: 'govt-services', label: 'Govt Services', icon: '🏛️', path: '/reports?tab=govt-services' }
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
        )}
      </div>
    </nav>
  );
};

export default Navbar;
