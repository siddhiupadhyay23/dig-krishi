import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import Navbar from './Navbar';
import './Profile.scss';

const Profile = () => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const [activeSection, setActiveSection] = useState('personal');

  // Fallback to localStorage if useAuth doesn't have user data
  const userData = user || JSON.parse(localStorage.getItem('user') || '{}');

  const sidebarItems = [
    { id: 'personal', label: 'Personal Info', icon: '👤' },
    { id: 'farm', label: 'Farm Details', icon: '🏡' },
    { id: 'preferences', label: 'Preferences', icon: '⚙️' },
    { id: 'security', label: 'Security', icon: '🔒' },
    { id: 'notifications', label: 'Notifications', icon: '🔔' },
    { id: 'help', label: 'Help & Support', icon: '❓' }
  ];

  const renderContent = () => {
    switch (activeSection) {
      case 'personal':
        return (
          <div className="content-section">
            <h2>Personal Information</h2>
            <div className="profile-card">
              <div className="profile-avatar">
                <div className="avatar-circle">
                  {(userData.fullName?.firstName || 'U')[0].toUpperCase()}
                </div>
                <button className="change-avatar-btn">Change Photo</button>
              </div>
              <div className="profile-details">
                <div className="detail-group">
                  <div className="detail-item">
                    <label>First Name</label>
                    <input 
                      type="text" 
                      value={userData.fullName?.firstName || ''} 
                      readOnly 
                      className="profile-input"
                    />
                  </div>
                  <div className="detail-item">
                    <label>Last Name</label>
                    <input 
                      type="text" 
                      value={userData.fullName?.lastName || ''} 
                      readOnly 
                      className="profile-input"
                    />
                  </div>
                </div>
                <div className="detail-item">
                  <label>Email Address</label>
                  <input 
                    type="email" 
                    value={userData.email || ''} 
                    readOnly 
                    className="profile-input"
                  />
                </div>
                <div className="detail-item">
                  <label>Phone Number</label>
                  <input 
                    type="tel" 
                    placeholder="Add your phone number" 
                    className="profile-input"
                  />
                </div>
                <div className="detail-item">
                  <label>Location</label>
                  <input 
                    type="text" 
                    placeholder="Add your location" 
                    className="profile-input"
                  />
                </div>
                <button className="save-btn">Save Changes</button>
              </div>
            </div>
          </div>
        );
      case 'farm':
        return (
          <div className="content-section">
            <h2>Farm Details</h2>
            <div className="farm-info">
              <div className="detail-item">
                <label>Farm Name</label>
                <input 
                  type="text" 
                  placeholder="Enter your farm name" 
                  className="profile-input"
                />
              </div>
              <div className="detail-item">
                <label>Farm Size (acres)</label>
                <input 
                  type="number" 
                  placeholder="Enter farm size" 
                  className="profile-input"
                />
              </div>
              <div className="detail-item">
                <label>Primary Crops</label>
                <input 
                  type="text" 
                  placeholder="e.g., Rice, Wheat, Corn" 
                  className="profile-input"
                />
              </div>
              <div className="detail-item">
                <label>Farming Experience</label>
                <select className="profile-input">
                  <option>Select experience level</option>
                  <option>Beginner (0-2 years)</option>
                  <option>Intermediate (3-10 years)</option>
                  <option>Experienced (10+ years)</option>
                </select>
              </div>
              <button className="save-btn">Save Farm Details</button>
            </div>
          </div>
        );
      default:
        return (
          <div className="content-section">
            <h2>{sidebarItems.find(item => item.id === activeSection)?.label}</h2>
            <div className="coming-soon">
              <div className="coming-soon-icon">🚧</div>
              <h3>Coming Soon</h3>
              <p>This feature is currently under development. Stay tuned!</p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="profile-container">
      <Navbar />
      <div className="profile-layout">
        {/* Left Sidebar */}
        <div className="profile-sidebar">
          <div className="sidebar-header">
            <h2>Profile</h2>
            <p>Welcome, {userData.fullName?.firstName || 'User'}!</p>
          </div>
          <nav className="sidebar-nav">
            {sidebarItems.map((item) => (
              <button
                key={item.id}
                className={`sidebar-item ${activeSection === item.id ? 'active' : ''}`}
                onClick={() => setActiveSection(item.id)}
              >
                <span className="sidebar-icon">{item.icon}</span>
                <span className="sidebar-label">{item.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Main Content */}
        <div className="profile-main">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default Profile;
