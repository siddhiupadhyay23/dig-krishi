import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Navbar.scss';
import logo from '../assets/logo1.png';

const Navbar = () => {
  const navigate = useNavigate();

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-logo">
          <img src={logo} alt="Digital Krishi Officer Logo" className="logo-image" />
        </div>
        <div className="navbar-auth">
          <button className="auth-btn sign-in-btn" onClick={() => navigate('/signup')}>Sign In</button>

          <button className="auth-btn log-in-btn" onClick={() => navigate('/login')}>Log In</button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
