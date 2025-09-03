import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import Navbar from './Navbar';
import './Profile.scss';

const Profile = () => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const [activeSection, setActiveSection] = useState('personal');
  const [isEditing, setIsEditing] = useState(false);

  // Fallback to localStorage if useAuth doesn't have user data
  const userData = user || JSON.parse(localStorage.getItem('user') || '{}');

  const sidebarItems = [
    { id: 'personal', label: 'Personal Info', icon: '👨‍🌾' },
    { id: 'farm', label: 'Farm Details', icon: '🌾' },
    { id: 'crops', label: 'My Crops', icon: '🌱' },
    { id: 'analytics', label: 'Farm Analytics', icon: '📊' },
    { id: 'settings', label: 'Settings', icon: '⚙️' },
    { id: 'support', label: 'Help & Support', icon: '🤝' }
  ];

  const renderContent = () => {
    switch (activeSection) {
      case 'personal':
        return (
          <div className="content-section">
            <h2>Personal Information</h2>
            <div className="personal-info">
              <div className="profile-avatar">
                <div className="avatar-circle">
                  {(userData.fullName?.firstName || 'U')[0].toUpperCase()}
                </div>
                <button className="change-avatar-btn">Change Photo</button>
              </div>
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
        );
      case 'farm':
        return (
          <div className="content-section">
            <h2>🌾 Farm Details</h2>
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
                  placeholder="e.g., Rice, Coconut, Pepper" 
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
              <div className="detail-item">
                <label>Farming Method</label>
                <select className="profile-input">
                  <option>Select farming method</option>
                  <option>Organic Farming</option>
                  <option>Conventional Farming</option>
                  <option>Mixed Farming</option>
                  <option>Sustainable Farming</option>
                </select>
              </div>
              <div className="detail-item">
                <label>Location</label>
                <input 
                  type="text" 
                  placeholder="Farm location (District, State)" 
                  className="profile-input"
                />
              </div>
              <button className="save-btn">💾 Save Farm Details</button>
            </div>
          </div>
        );
      case 'crops':
        return (
          <div className="content-section">
            <h2>🌱 My Crops</h2>
            <div className="crops-overview">
              <div className="crop-stats">
                <div className="stat-card">
                  <div className="stat-icon">🌾</div>
                  <div className="stat-content">
                    <h3>5</h3>
                    <p>Active Crops</p>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon">🗓️</div>
                  <div className="stat-content">
                    <h3>2</h3>
                    <p>Seasons Completed</p>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon">📈</div>
                  <div className="stat-content">
                    <h3>85%</h3>
                    <p>Success Rate</p>
                  </div>
                </div>
              </div>
              
              <div className="crops-grid">
                <div className="crop-card">
                  <div className="crop-icon">🌾</div>
                  <h4>Rice</h4>
                  <p>Season: Kharif</p>
                  <p>Area: 2.5 acres</p>
                  <span className="crop-status growing">Growing</span>
                </div>
                <div className="crop-card">
                  <div className="crop-icon">🥥</div>
                  <h4>Coconut</h4>
                  <p>Season: Perennial</p>
                  <p>Area: 1.2 acres</p>
                  <span className="crop-status mature">Mature</span>
                </div>
                <div className="crop-card">
                  <div className="crop-icon">🌶️</div>
                  <h4>Black Pepper</h4>
                  <p>Season: Perennial</p>
                  <p>Area: 0.8 acres</p>
                  <span className="crop-status harvesting">Harvesting</span>
                </div>
              </div>
              
              <button className="add-crop-btn">➕ Add New Crop</button>
            </div>
          </div>
        );
      case 'analytics':
        return (
          <div className="content-section">
            <h2>📊 Farm Analytics</h2>
            <div className="analytics-dashboard">
              <div className="analytics-cards">
                <div className="analytics-card">
                  <h3>🌾 Total Yield</h3>
                  <div className="metric">
                    <span className="value">12.5</span>
                    <span className="unit">tons</span>
                  </div>
                  <p className="trend positive">↗️ +15% from last season</p>
                </div>
                <div className="analytics-card">
                  <h3>💰 Revenue</h3>
                  <div className="metric">
                    <span className="value">₹3,75,000</span>
                  </div>
                  <p className="trend positive">↗️ +22% from last season</p>
                </div>
                <div className="analytics-card">
                  <h3>💧 Water Usage</h3>
                  <div className="metric">
                    <span className="value">2,400</span>
                    <span className="unit">liters</span>
                  </div>
                  <p className="trend negative">↘️ -8% optimized usage</p>
                </div>
                <div className="analytics-card">
                  <h3>🌱 Crop Health</h3>
                  <div className="metric">
                    <span className="value">92%</span>
                  </div>
                  <p className="trend positive">↗️ Excellent condition</p>
                </div>
              </div>
              
              <div className="recent-activities">
                <h3>📋 Recent Activities</h3>
                <div className="activity-list">
                  <div className="activity-item">
                    <div className="activity-icon">🌱</div>
                    <div className="activity-content">
                      <p><strong>Planted Rice Seeds</strong></p>
                      <span>2 days ago • 2.5 acres</span>
                    </div>
                  </div>
                  <div className="activity-item">
                    <div className="activity-icon">💧</div>
                    <div className="activity-content">
                      <p><strong>Applied Irrigation</strong></p>
                      <span>5 days ago • All crops</span>
                    </div>
                  </div>
                  <div className="activity-item">
                    <div className="activity-icon">🌶️</div>
                    <div className="activity-content">
                      <p><strong>Harvested Black Pepper</strong></p>
                      <span>1 week ago • 25 kg</span>
                    </div>
                  </div>
                </div>
              </div>
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
    <div className="profile">
      <Navbar />
      
      <div className="profile-container">
        <div className="profile-header">
          <div className="header-content">
            <h1>👨‍🌾 Farmer Profile</h1>
            <p>Manage your agricultural profile, farm details, and account settings</p>
          </div>
          <div className="user-info">
            <span>Welcome, {userData.fullName?.firstName || 'Farmer'}</span>
          </div>
        </div>

        <div className="profile-tabs">
          {sidebarItems.map(tab => (
            <button
              key={tab.id}
              className={`tab-button ${activeSection === tab.id ? 'active' : ''}`}
              onClick={() => setActiveSection(tab.id)}
            >
              <span className="tab-icon">{tab.icon}</span>
              <span className="tab-label">{tab.label}</span>
            </button>
          ))}
        </div>

        <div className="profile-content">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default Profile;
