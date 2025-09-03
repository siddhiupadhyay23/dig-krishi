import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import axios from 'axios';
import './SignUp.scss';

const SignUp = ({ onBackToHome, onNavigateToLogin, onSignUpSuccess }) => {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    
    // Clear messages when user types
    setError('');
    setMessage('');
  };

  // Check if all required fields are filled
  const isFormValid = () => {
    const nameValid = formData.name && formData.name.trim().length > 0;
    const emailValid = formData.email && formData.email.trim().length > 0;
    const passwordValid = formData.password && formData.password.length > 0;
    const confirmPasswordValid = formData.confirmPassword && formData.confirmPassword.length > 0;
    
    return nameValid && emailValid && passwordValid && confirmPasswordValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    try {
      // Validate all fields are filled
      if (!isFormValid()) {
        setError('All fields are required');
        setLoading(false);
        return;
      }

      // Validate passwords match
      if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match');
        setLoading(false);
        return;
      }

      setMessage('Creating your account...');

      // Parse full name into first and last name
      const nameParts = formData.name.trim().split(' ');
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || '';

      // Make API call to register user
      const response = await axios.post('http://localhost:5000/api/auth/register', {
        fullName: {
          firstName: firstName,
          lastName: lastName
        },
        email: formData.email,
        password: formData.password,
        confirmPassword: formData.confirmPassword
      });

      if (response.data.message === 'User registered successful') {
        setMessage('Account created successfully! Setting up your profile...');
        
        // Clear form
        setFormData({
          name: '',
          email: '',
          password: '',
          confirmPassword: ''
        });
        
        // Redirect to profile after 2 seconds
        setTimeout(() => {
          onSignUpSuccess(response.data.user, response.data.token);
        }, 2000);
      }
    } catch (error) {
      console.error('Registration error:', error);
      console.error('Error response:', error.response);
      console.error('Error message:', error.message);
      
      if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else if (error.response?.data?.errors) {
        // Handle validation errors
        const errorMessages = error.response.data.errors.map(err => err.msg).join(', ');
        setError(errorMessages);
      } else if (error.code === 'ECONNREFUSED') {
        setError('Cannot connect to server. Please make sure the backend is running.');
      } else if (error.code === 'ERR_NETWORK') {
        setError('Network error. Please check your connection.');
      } else {
        setError(`Error: ${error.message || 'Something went wrong. Please try again.'}`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-container">
      {/* Back Button */}
      <button className="signup-back-btn" onClick={onBackToHome}>
        <svg 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          className="back-arrow-icon"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M19 12H5m0 0l7 7m-7-7l7-7" 
          />
        </svg>
        <span className="back-text">{t('auth.signUp.back')}</span>
      </button>

      {/* Main Content */}
      <div className="signup-content">
        <h1 className="signup-title">
          {t('auth.signUp.title')}
        </h1>
        
        <p className="signup-subtitle">
          {t('auth.signUp.subtitle')}
        </p>

        {/* Success/Error Messages */}
        {message && (
          <div style={{
            backgroundColor: 'rgba(34, 197, 94, 0.2)',
            border: '1px solid rgba(34, 197, 94, 0.3)',
            color: '#22c55e',
            padding: '12px',
            borderRadius: '8px',
            marginBottom: '20px',
            fontSize: '14px',
            textAlign: 'center'
          }}>
            {message}
          </div>
        )}

        {error && (
          <div style={{
            backgroundColor: 'rgba(239, 68, 68, 0.2)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            color: '#ef4444',
            padding: '12px',
            borderRadius: '8px',
            marginBottom: '20px',
            fontSize: '14px',
            textAlign: 'center'
          }}>
            {error}
          </div>
        )}


        {/* SignUp Form */}
        <form className="signup-form" onSubmit={handleSubmit} noValidate>
          <div className="form-header">
            <div className="form-icon">🌱</div>
            <h2>Join the Farming Community!</h2>
            <p>Create your account to access agricultural tools and insights</p>
          </div>
          
          <input
            type="text"
            name="name"
            placeholder={t('auth.signUp.fullName')}
            className="signup-input"
            value={formData.name}
            onChange={handleInputChange}
          />
          
          <input
            type="email"
            name="email"
            placeholder={t('auth.signUp.email')}
            className="signup-input"
            value={formData.email}
            onChange={handleInputChange}
          />
          
          <input
            type="password"
            name="password"
            placeholder={t('auth.signUp.password')}
            className="signup-input"
            value={formData.password}
            onChange={handleInputChange}
          />

          <input
            type="password"
            name="confirmPassword"
            placeholder={t('auth.signUp.confirmPassword')}
            className="signup-input"
            value={formData.confirmPassword}
            onChange={handleInputChange}
          />
          
          <button type="submit" className="signup-button" disabled={loading}>
            {loading ? '🌾 Creating Account...' : '🎆 Create Account'}
          </button>
        </form>


        {/* Toggle to Login */}
        <div className="signup-toggle">
          {t('auth.signUp.alreadyHaveAccount')} 
          <span className="signup-toggle-link" onClick={onNavigateToLogin}>
            {t('auth.signUp.signIn')}
          </span>
        </div>
      </div>
    </div>
  );
};

export default SignUp;