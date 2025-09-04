import React from 'react';
import './More.scss';

const More = () => {
  return (
    <section className="more-section">
      <div className="more-container">
        <div className="more-header">
          <h3 className="more-subtitle">
            Our Services
          </h3>
          <h2 className="more-title">
            Transforming Agriculture with Smart Solutions
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
                <h3 className="service-title">LIVE CHAT</h3>
                <p className="service-description">
                  Instant help via live chat, with faster responses for Premium members. Get immediate assistance from our agricultural experts anytime you need guidance.
                </p>
                <button className="service-button">
                  CHAT WITH US
                </button>
              </div>

              <div className="service-card">
                <div className="service-icon">
                  <svg viewBox="0 0 24 24" fill="currentColor" className="service-svg-icon">
                    <path d="M20,8L12,13L4,8V6L12,11L20,6M20,4H4C2.89,4 2,4.89 2,6V18A2,2 0 0,0 4,20H20A2,2 0 0,0 22,18V6C22,4.89 21.1,4 20,4Z" />
                  </svg>
                </div>
                <h3 className="service-title">EMAIL SUPPORT</h3>
                <p className="service-description">
                  Reach out for more detailed inquiries, and we'll get back to you within 24 hours. Perfect for complex agricultural questions and comprehensive solutions.
                </p>
                <button className="service-button">
                  WRITE US
                </button>
              </div>

              <div className="service-card">
                <div className="service-icon">
                  <svg viewBox="0 0 24 24" fill="currentColor" className="service-svg-icon">
                    <path d="M6.62,10.79C8.06,13.62 10.38,15.94 13.21,17.38L15.41,15.18C15.69,14.9 16.08,14.82 16.43,14.93C17.55,15.3 18.75,15.5 20,15.5A1,1 0 0,1 21,16.5V20A1,1 0 0,1 20,21A17,17 0 0,1 3,4A1,1 0 0,1 4,3H7.5A1,1 0 0,1 8.5,4C8.5,5.25 8.7,6.45 9.07,7.57C9.18,7.92 9.1,8.31 8.82,8.59L6.62,10.79Z" />
                  </svg>
                </div>
                <h3 className="service-title">PHONE SUPPORT</h3>
                <p className="service-description">
                  For Premium users, available Mon-Fri, 9 AM - 6 PM (EST) for urgent assistance. Direct phone support for immediate problem-solving and expert consultation.
                </p>
                <button className="service-button">
                  CALL US
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
