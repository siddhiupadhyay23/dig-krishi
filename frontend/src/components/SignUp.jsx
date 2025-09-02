import React, { useState } from 'react';
import axios from 'axios';
import './SignUp.scss';

const SignUp = ({ onBackToHome, onNavigateToLogin }) => {
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
    if (error) setError('');
    if (message) setMessage('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    try {
      // Validate passwords match
      if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match');
        setLoading(false);
        return;
      }

      // Make API call to register user
      const response = await axios.post('http://localhost:5000/api/auth/register', {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        confirmPassword: formData.confirmPassword
      });

      if (response.data.status === 'success') {
        setMessage('Account created successfully! You can now login.');
        // Clear form
        setFormData({
          name: '',
          email: '',
          password: '',
          confirmPassword: ''
        });
        
        // Redirect to login after 2 seconds
        setTimeout(() => {
          onNavigateToLogin();
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
        ←
      </button>

      {/* Main Content */}
      <div className="signup-content">
        <h1 className="signup-title">
          Welcome to<br />
          Digital Krishi Officer
        </h1>
        
        <p className="signup-subtitle">
          Join our AI-powered farming community for expert agricultural advice and solutions
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
        <form className="signup-form" onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            className="signup-input"
            value={formData.name}
            onChange={handleInputChange}
            required
          />
          
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            className="signup-input"
            value={formData.email}
            onChange={handleInputChange}
            required
          />
          
          <input
            type="password"
            name="password"
            placeholder="Password"
            className="signup-input"
            value={formData.password}
            onChange={handleInputChange}
            required
          />

          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            className="signup-input"
            value={formData.confirmPassword}
            onChange={handleInputChange}
            required
          />
          
          <button type="submit" className="signup-button" disabled={loading}>
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>


        {/* Toggle to Login */}
        <div className="signup-toggle">
          Already have an account? 
          <span className="signup-toggle-link" onClick={onBackToHome}>
            Sign In
          </span>
        </div>
      </div>
    </div>
  );
};

export default SignUp;