import React from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import HeroSection from '../components/HeroSection';
import SignUp from '../components/SignUp';
import Login from '../components/Login';
import Profile from '../components/Profile';
import ProfileSetup from '../components/ProfileSetup';
import Reports from '../components/Reports';
import { useAuth } from '../context/AuthContext';

// Default Home component for the root route
const Home = () => {
  return (
    <HeroSection />
  );
};

const MainRouter = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSignUpSuccess = (userData, token) => {
    login(userData, token);
    navigate('/profile-setup');
  };

  const handleLoginSuccess = (userData, token) => {
    login(userData, token);
    navigate('/dashboard');
  };

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/signup" element={
        <SignUp 
          onBackToHome={() => navigate('/')} 
          onNavigateToLogin={() => navigate('/login')}
          onSignUpSuccess={handleSignUpSuccess}
        />
      } />
      <Route path="/login" element={
        <Login 
          onBackToHome={() => navigate('/')} 
          onNavigateToSignUp={() => navigate('/signup')} 
          onLoginSuccess={handleLoginSuccess}
        />
      } />
      <Route path="/dashboard" element={<Reports />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/profile-setup" element={<ProfileSetup />} />
    </Routes>
  );
};

export default MainRouter;
