import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HeroSection from '../components/HeroSection';
import SignUp from '../components/SignUp';
import Login from '../components/Login';

// Default Home component for the root route
const Home = () => {
  return (
    <HeroSection />
  );
};

const MainRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/signup" element={<SignUp onBackToHome={() => window.location.href = '/'} onNavigateToLogin={() => window.location.href = '/login'} />} />
      <Route path="/login" element={<Login onBackToHome={() => window.location.href = '/'} onNavigateToSignUp={() => window.location.href = '/signup'} onLoginSuccess={() => window.location.href = '/'} />} />
      {/* Add more routes here as needed */}
    </Routes>
  );
};

export default MainRouter;
