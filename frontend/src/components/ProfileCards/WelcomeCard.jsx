import React, { useState } from 'react';

const WelcomeCard = ({ user, phoneNumber, onUpdate, onNext, onSkip, loading }) => {
  const [phone, setPhone] = useState(phoneNumber || '');

  const handleNext = () => {
    const data = { phoneNumber: phone };
    onUpdate(data);
    onNext(data); // Pass data to the API handler
  };

  const handleSkip = () => {
    const data = { phoneNumber: '' }; // Empty phone number when skipping
    onUpdate(data);
    onSkip(data); // Call skip handler
  };

  const handlePhoneChange = (e) => {
    const value = e.target.value.replace(/\D/g, ''); // Only digits
    if (value.length <= 10) {
      setPhone(value);
    }
  };

  return (
    <div className="profile-card">
      <div className="card-header">
        <h2 className="card-title">
          Welcome, {user?.fullName?.firstName}!
        </h2>
        <p className="card-subtitle">
          Let's set up your profile to get personalized farming assistance
        </p>
      </div>

      <div className="card-content">
        <div className="welcome-message">
          <div style={{
            backgroundColor: 'var(--color-light-green)',
            padding: '1.5rem',
            borderRadius: '12px',
            marginBottom: '2rem',
            border: '1px solid var(--color-primary)'
          }}>
            <h3 style={{ 
              color: 'var(--color-primary)', 
              margin: '0 0 0.5rem 0',
              fontSize: '1.1rem' 
            }}>
              Welcome to Digital Krishi Officer!
            </h3>
            <p style={{ 
              color: 'var(--color-black)', 
              margin: 0,
              lineHeight: '1.5' 
            }}>
              We're excited to help you with AI-powered farming guidance. 
              Let's collect some basic information to personalize your experience.
            </p>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="phoneNumber">
            Mobile Number (Optional)
          </label>
          <input
            type="tel"
            id="phoneNumber"
            placeholder="Enter your 10-digit mobile number"
            value={phone}
            onChange={handlePhoneChange}
            maxLength="10"
          />
          {phone && phone.length < 10 && phone.length > 0 && (
            <small style={{ 
              color: 'var(--color-primary)', 
              fontSize: '0.8rem',
              marginTop: '0.25rem',
              display: 'block'
            }}>
              Please enter a valid 10-digit mobile number
            </small>
          )}
        </div>
      </div>

      <div className="card-actions">
        <button 
          className="btn btn-secondary"
          onClick={handleSkip}
          disabled={loading}
          style={{
            backgroundColor: 'transparent',
            color: 'var(--color-primary)',
            border: '1px solid var(--color-primary)'
          }}
        >
          Skip
        </button>
        <button 
          className="btn btn-primary"
          onClick={handleNext}
          disabled={loading}
        >
          {loading ? 'Saving...' : 'Next →'}
        </button>
      </div>
    </div>
  );
};

export default WelcomeCard;
