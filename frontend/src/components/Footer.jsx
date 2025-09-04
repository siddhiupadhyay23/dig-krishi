import React from 'react';
import './Footer.scss';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-main">
          <div className="footer-brand">
            <h1 className="footer-title">Empowering Agriculture</h1>
            <h2 className="footer-subtitle">Through Digital Innovation</h2>
            <div className="footer-cta">
              <button className="cta-button">
                Get Started
                <span className="arrow">↗</span>
              </button>
            </div>
          </div>
          
          <div className="footer-nav">
            <div className="nav-section">
              <h3 className="nav-title">SERVICES</h3>
              <nav className="nav-links">
                <a href="/prediction" className="nav-link">
                  Crop Prediction <span className="arrow">↗</span>
                </a>
                <a href="/reports" className="nav-link">
                  Reports <span className="arrow">↗</span>
                </a>
                <a href="/government-services" className="nav-link">
                  Government Services <span className="arrow">↗</span>
                </a>
                <a href="/dashboard" className="nav-link">
                  Dashboard <span className="arrow">↗</span>
                </a>
              </nav>
            </div>
            
            <div className="nav-section">
              <h3 className="nav-title">RESOURCES</h3>
              <nav className="nav-links">
                <a href="/features" className="nav-link">
                  Features <span className="arrow">↗</span>
                </a>
                <a href="/profile" className="nav-link">
                  Profile <span className="arrow">↗</span>
                </a>
                <a href="/working" className="nav-link">
                  How It Works <span className="arrow">↗</span>
                </a>
                <a href="/login" className="nav-link">
                  Login <span className="arrow">↗</span>
                </a>
              </nav>
            </div>
          </div>
        </div>
        
        <div className="footer-bottom">
          <div className="footer-divider"></div>
          <div className="footer-copyright">
            <p>© 2024 DigKrishi. Transforming agriculture through technology.</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
