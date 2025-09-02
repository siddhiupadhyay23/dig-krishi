import React from 'react';
import './Navbar.scss';
import logo from '../assets/logo1.png';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-logo">
          <img src={logo} alt="Digital Krishi Officer Logo" className="logo-image" />
        </div>
        <div className="navbar-auth">
          <button className="auth-btn sign-in-btn">Sign In</button>
          <button className="auth-btn log-in-btn">Log In</button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
