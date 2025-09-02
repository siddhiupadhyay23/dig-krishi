import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import Navbar from './Navbar';
import './Dashboard.scss';

const Dashboard = () => {
  const { t } = useLanguage();

  return (
    <div className="dashboard-container">
      <Navbar />
      <div className="dashboard-content">
        <div className="dashboard-header">
          <h1 className="dashboard-title">
            Dashboard
          </h1>
          <p className="dashboard-subtitle">
            Welcome to your farming assistant dashboard
          </p>
        </div>
        
        <div className="dashboard-main">
          {/* Dashboard content will be added here */}
          <div className="dashboard-placeholder">
            <h2>Coming Soon</h2>
            <p>Your dashboard features are being developed.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
