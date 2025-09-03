import React from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import HeroSection from '../components/HeroSection';
import SignUp from '../components/SignUp';
import Login from '../components/Login';
import Profile from '../components/Profile';
import ProfileSetup from '../components/ProfileSetup';
import Dashboard from '../components/Dashboard';
import Reports from '../components/Reports';
import Prediction from '../components/Prediction';
import GovernmentServices from '../components/GovernmentServices';
import Chatbot from '../components/Chatbot';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';

// Default Home component for the root route
const Home = () => {
  return (
    <HeroSection />
  );
};

const MainRouter = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { socket } = useSocket();

  const handleSignUpSuccess = (userData, token) => {
    login(userData, token);
    navigate('/profile-setup');
  };

  const handleLoginSuccess = (userData, token) => {
    login(userData, token);
    navigate('/');
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
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/profile-setup" element={<ProfileSetup />} />
      <Route path="/reports" element={<Reports />} />
      <Route path="/prediction" element={<Prediction />} />
      <Route path="/government-services" element={<GovernmentServices />} />
      <Route path="/chatbot" element={<Chatbot socket={socket} />} />
    </Routes>
  );
};

export default MainRouter;
