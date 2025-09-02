import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import Navbar from './Navbar';
import './Profile.scss';

const Profile = () => {
  const { t } = useLanguage();

  // Get user data from localStorage
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  return (
    <div className="profile-container">
      <Navbar />
      <div className="profile-content">
        <div className="profile-header">
          <h1 className="profile-title">
            Profile
          </h1>
          <p className="profile-subtitle">
            Welcome to your profile, {user.fullName?.firstName || 'User'}!
          </p>
        </div>
        
        <div className="profile-main">
          {/* Profile content will be added here */}
          <div className="profile-placeholder">
            <h2>Profile Setup</h2>
            <p>Your profile features are being developed.</p>
            <div className="user-info">
              <p><strong>Name:</strong> {user.fullName?.firstName} {user.fullName?.lastName}</p>
              <p><strong>Email:</strong> {user.email}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
