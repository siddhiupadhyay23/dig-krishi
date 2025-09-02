import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HeroSection from '../components/HeroSection';

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
      {/* Add more routes here as needed */}
    </Routes>
  );
};

export default MainRouter;
