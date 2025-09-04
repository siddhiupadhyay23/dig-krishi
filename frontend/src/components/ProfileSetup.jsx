import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import './ProfileSetup.scss';

// Individual Card Components
import WelcomeCard from './ProfileCards/WelcomeCard';
import StateCard from './ProfileCards/StateCard';
import CityCard from './ProfileCards/CityCard';
import DistrictCard from './ProfileCards/DistrictCard';
import LandSizeCard from './ProfileCards/LandSizeCard';
import CropSelectionCard from './ProfileCards/CropSelectionCard';

const ProfileSetup = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  // Current step state (1-6)
  const [currentStep, setCurrentStep] = useState(1);
  
  // Form data state
  const [profileData, setProfileData] = useState({
    phoneNumber: '',
    state: '',
    city: '',
    district: '',
    landSize: '',
    landUnit: 'acres',
    selectedCrops: []
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Get auth token for API calls
  const getAuthToken = () => {
    return localStorage.getItem('authToken');
  };

  // API call helper
  const makeAPICall = async (endpoint, data) => {
    try {
      setLoading(true);
      setError('');
      
      const token = getAuthToken();
      const response = await axios.post(`http://localhost:5000/api/profile/${endpoint}`, data, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      return response.data;
    } catch (error) {
      console.error(`API Error (${endpoint}):`, error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Handle data update from cards
  const updateProfileData = (newData) => {
    setProfileData(prev => ({ ...prev, ...newData }));
  };

  // Step-specific API handlers
  const handleWelcomeNext = async (data) => {
    try {
      updateProfileData(data);
      await makeAPICall('welcome', {});
      if (data.phoneNumber) {
        await makeAPICall('phone', { phoneNumber: data.phoneNumber });
      }
      goToNextStep();
    } catch (error) {
      setError('Failed to save welcome step. Please try again.');
    }
  };

  const handleWelcomeSkip = async (data) => {
    try {
      updateProfileData(data);
      await makeAPICall('welcome', {});
      // Skip phone number API call since it's empty
      goToNextStep();
    } catch (error) {
      setError('Failed to skip welcome step. Please try again.');
    }
  };

  const handleStateNext = async (data) => {
    try {
      updateProfileData(data);
      await makeAPICall('state', { state: data.state });
      goToNextStep();
    } catch (error) {
      setError('Failed to save state. Please try again.');
    }
  };

  const handleCityNext = async (data) => {
    try {
      updateProfileData(data);
      await makeAPICall('city', { city: data.city });
      goToNextStep();
    } catch (error) {
      setError('Failed to save city. Please try again.');
    }
  };

  const handleDistrictNext = async (data) => {
    try {
      updateProfileData(data);
      await makeAPICall('district', { district: data.district });
      goToNextStep();
    } catch (error) {
      setError('Failed to save district. Please try again.');
    }
  };

  const handleLandSizeNext = async (data) => {
    try {
      updateProfileData(data);
      await makeAPICall('land-size', { 
        landSize: data.landSize || null, 
        unit: data.landUnit 
      });
      goToNextStep();
    } catch (error) {
      setError('Failed to save land size. Please try again.');
    }
  };

  const handleCropSelectionFinish = async (data) => {
    try {
      updateProfileData(data);
      const cropsData = data.selectedCrops.map(cropName => ({
        cropName: cropName,
        cropType: 'other',
        season: 'kharif'
      }));
      
      await makeAPICall('crops', { crops: cropsData });
      navigate('/');
    } catch (error) {
      setError('Failed to save crop selection. Please try again.');
    }
  };

  // Navigation functions
  const goToNextStep = () => {
    if (currentStep < 6) {
      setCurrentStep(currentStep + 1);
    }
  };

  const goToPreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const goToHome = async () => {
    try {
      // Skip land size step
      await makeAPICall('land-size', { landSize: null, unit: 'acres' });
      navigate('/');
    } catch (error) {
      setError('Failed to skip land size. Please try again.');
    }
  };

  // Render current card based on step
  const renderCurrentCard = () => {
    switch (currentStep) {
      case 1:
        return (
          <WelcomeCard
            user={user}
            phoneNumber={profileData.phoneNumber}
            onUpdate={updateProfileData}
            onNext={handleWelcomeNext}
            onSkip={handleWelcomeSkip}
            loading={loading}
          />
        );
      case 2:
        return (
          <StateCard
            selectedState={profileData.state}
            onUpdate={updateProfileData}
            onNext={handleStateNext}
            onPrevious={goToPreviousStep}
            loading={loading}
          />
        );
      case 3:
        return (
          <CityCard
            selectedCity={profileData.city}
            selectedState={profileData.state}
            onUpdate={updateProfileData}
            onNext={handleCityNext}
            onPrevious={goToPreviousStep}
            loading={loading}
          />
        );
      case 4:
        return (
          <DistrictCard
            selectedDistrict={profileData.district}
            selectedState={profileData.state}
            onUpdate={updateProfileData}
            onNext={handleDistrictNext}
            onPrevious={goToPreviousStep}
            loading={loading}
          />
        );
      case 5:
        return (
          <LandSizeCard
            landSize={profileData.landSize}
            landUnit={profileData.landUnit}
            onUpdate={updateProfileData}
            onNext={handleLandSizeNext}
            onPrevious={goToPreviousStep}
            onSkipToHome={goToHome}
            loading={loading}
          />
        );
      case 6:
        return (
          <CropSelectionCard
            selectedCrops={profileData.selectedCrops}
            onUpdate={updateProfileData}
            onPrevious={goToPreviousStep}
            onFinish={handleCropSelectionFinish}
            loading={loading}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="profile-setup">
      {/* Progress Bar */}
      <div className="progress-container">
        <div className="progress-bar">
          <div 
            className="progress-fill" 
            style={{ width: `${(currentStep / 6) * 100}%` }}
          ></div>
        </div>
        <span className="progress-text">
          Step {currentStep} of 6
        </span>
      </div>

      {/* Error Message */}
      {error && (
        <div style={{
          backgroundColor: 'rgba(239, 68, 68, 0.1)',
          border: '1px solid rgba(239, 68, 68, 0.3)',
          color: '#dc2626',
          padding: '12px 20px',
          borderRadius: '8px',
          margin: '0 20px 20px 20px',
          textAlign: 'center',
          fontSize: '14px'
        }}>
          {error}
        </div>
      )}

      {/* Card Container */}
      <div className="card-container">
        {renderCurrentCard()}
      </div>
    </div>
  );
};

export default ProfileSetup;
