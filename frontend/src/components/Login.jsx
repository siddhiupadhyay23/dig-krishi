import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import axios from 'axios';
import './Login.scss';

const Login = ({ onBackToHome, onNavigateToSignUp, onLoginSuccess }) => {
  const { t } = useLanguage();

  const [formData, setFormData] = useState({
    email: '',
    password: ''
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
    if (error) setError('');
    if (message) setMessage('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    try {
      // Make API call to login user
      const response = await axios.post('http://localhost:5000/api/auth/login', {
        email: formData.email,
        password: formData.password
      });

      if (response.data.message === 'user logged in sucessful') {
        setMessage('Login successful! Welcome back.');
        
        // Clear form
        setFormData({ email: '', password: '' });
        
        // Redirect to dashboard after 1 second
        setTimeout(() => {
          onLoginSuccess(response.data.user, response.data.token);
        }, 1000);
      }
    } catch (error) {
      console.error('Login error:', error);
      console.error('Error response:', error.response);
      console.error('Error message:', error.message);
      
      if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else if (error.response?.data?.errors) {
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
    <div className="login-container">
      {/* Back Button */}
      <button className="login-back-btn" onClick={onBackToHome}>
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
        <span className="back-text">{t('auth.login.back')}</span>
      </button>

      {/* Main Content */}
      <div className="login-content">
        <h1 className="login-title">
          {t('auth.login.title')}
        </h1>
        
        <p className="login-subtitle">
          {t('auth.login.subtitle')}
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

        {/* Login Form */}
        <form className="login-form" onSubmit={handleSubmit}>
          <div className="form-header">
            <div className="form-icon">🌾</div>
            <h2>Welcome Back, Farmer!</h2>
            <p>Sign in to access your agricultural dashboard</p>
          </div>
          
          <input
            type="email"
            name="email"
            placeholder={t('auth.login.email')}
            className="login-input"
            value={formData.email}
            onChange={handleInputChange}
            required
          />
          
          <input
            type="password"
            name="password"
            placeholder={t('auth.login.password')}
            className="login-input"
            value={formData.password}
            onChange={handleInputChange}
            required
          />
          
          <button type="submit" className="login-button" disabled={loading}>
            {loading ? '🌱 Signing In...' : '🚀 Sign In'}
          </button>
        </form>


        {/* Toggle to SignUp */}
        <div className="login-toggle">
          {t('auth.login.noAccount')} 
          <span className="login-toggle-link" onClick={onNavigateToSignUp}>
            {t('auth.login.signUp')}
          </span>
        </div>
      </div>
    </div>
  );
};

export default Login;