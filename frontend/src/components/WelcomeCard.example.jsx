// Example of how to integrate WelcomeCard into your SignUp.jsx component

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import axios from 'axios';
import WelcomeCard from './WelcomeCard';
import './SignUp.scss';

const SignUpWithWelcomeCard = ({ onBackToHome, onNavigateToLogin, onSignUpSuccess }) => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  
  // ... your existing signup state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  
  // New state for welcome card
  const [showWelcomeCard, setShowWelcomeCard] = useState(false);
  const [registeredUser, setRegisteredUser] = useState(null);

  // ... your existing functions (handleInputChange, isFormValid, etc.)

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    try {
      // ... your existing validation logic

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
        setMessage('Account created successfully! Welcome to DigKrishi!');
        
        // Store user data for welcome card
        setRegisteredUser(response.data.user);
        
        // Clear form
        setFormData({
          name: '',
          email: '',
          password: '',
          confirmPassword: ''
        });
        
        // Show welcome card after a short delay
        setTimeout(() => {
          setShowWelcomeCard(true);
        }, 1500);
      }
    } catch (error) {
      // ... your existing error handling
      console.error('Registration error:', error);
      
      if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else {
        setError('Something went wrong. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Handle welcome card actions
  const handleWelcomeCardContinue = () => {
    setShowWelcomeCard(false);
    // Call the original success handler or navigate to profile setup
    if (onSignUpSuccess) {
      onSignUpSuccess(registeredUser, registeredUser.token);
    } else {
      navigate('/profile-setup');
    }
  };

  const handleWelcomeCardClose = () => {
    setShowWelcomeCard(false);
    // Navigate to homepage or call success handler
    navigate('/');
  };

  return (
    <>
      {/* Your existing SignUp JSX */}
      <div className="signup-container">
        {/* ... your existing signup form JSX */}
      </div>

      {/* Welcome Card Overlay */}
      {showWelcomeCard && registeredUser && (
        <WelcomeCard
          user={registeredUser}
          onContinue={handleWelcomeCardContinue}
          onClose={handleWelcomeCardClose}
        />
      )}
    </>
  );
};

export default SignUpWithWelcomeCard;

/* 
INTEGRATION STEPS:

1. Import WelcomeCard in your SignUp.jsx:
   import WelcomeCard from './WelcomeCard';

2. Add state for welcome card:
   const [showWelcomeCard, setShowWelcomeCard] = useState(false);
   const [registeredUser, setRegisteredUser] = useState(null);

3. Modify your signup success handler:
   if (response.data.message === 'User registered successful') {
     setMessage('Account created successfully! Welcome to DigKrishi!');
     setRegisteredUser(response.data.user);
     setFormData({ name: '', email: '', password: '', confirmPassword: '' });
     
     setTimeout(() => {
       setShowWelcomeCard(true);
     }, 1500);
   }

4. Add welcome card JSX at the end of your return statement:
   {showWelcomeCard && registeredUser && (
     <WelcomeCard
       user={registeredUser}
       onContinue={() => {
         setShowWelcomeCard(false);
         navigate('/profile-setup');
       }}
       onClose={() => {
         setShowWelcomeCard(false);
         navigate('/');
       }}
     />
   )}

FEATURES:
- 🎉 Beautiful welcome animation with agricultural theme
- 🌱 Multi-step welcome flow with progress indicators
- 👤 User profile card showing registration details
- 🚀 Feature preview showcasing app capabilities
- 📱 Fully responsive design
- ✨ Smooth animations and transitions
- 🌾 Agricultural theming matching your homepage
- 🎯 Action buttons for continuing or skipping setup
*/
