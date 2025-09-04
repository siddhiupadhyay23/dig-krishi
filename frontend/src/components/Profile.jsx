import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import Navbar from './Navbar';
import ProfileService from '../services/profileService';
import AnalyticsService from '../services/analyticsService';
import {
  UserIcon,
  SettingsIcon,
  HelpIcon,
  SeedlingIcon,
  RiceIcon,
  TomatoIcon,
  CoconutIcon,
  PepperIcon,
  CarrotIcon,
  FarmerIcon,
  TractorIcon,
  AnalyticsIcon,
  AddIcon,
  TargetIcon,
  CelebrationIcon,
  RocketIcon
} from './icons';
import './Profile.scss';

const Profile = () => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const [activeSection, setActiveSection] = useState('personal');
  const [isEditing, setIsEditing] = useState({});
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');
  const [profileData, setProfileData] = useState(null);
  const [analyticsData, setAnalyticsData] = useState(null);
  const [analyticsLoading, setAnalyticsLoading] = useState(false);

  // Form states for different sections (initialized empty, loaded from backend)
  const [personalInfo, setPersonalInfo] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    city: '',
    state: '',
    district: '', // Optional
    pincode: '',
    location: '', // Combined for display
    // Additional personal fields for analytics
    age: '',
    gender: '',
    education: '',
    primaryOccupation: 'farming', // farming/mixed/other
    annualIncome: '' // income range for economic analytics
  });

  const [farmInfo, setFarmInfo] = useState({
    farmName: '',
    farmSize: '',
    farmSizeUnit: 'acres',
    primaryCrops: [], // Array of selected primary crops
    secondaryCrops: [], // Array of selected secondary crops (optional)
    customPrimaryCrops: '', // For custom primary crops
    customSecondaryCrops: '', // For custom secondary crops
    experience: '',
    farmingMethod: '',
    city: '',
    state: '',
    district: '', // Optional
    pincode: '', // Now optional
    farmLocation: '',
    landType: '',
    soilType: '',
    // Additional farm fields for analytics
    // Soil details
    soilPh: '',
    soilOrganicCarbon: '',
    soilNitrogen: '',
    soilPhosphorus: '',
    soilPotassium: '',
    // Water & Irrigation
    irrigationSource: '',
    irrigationMethod: '',
    waterAvailability: '',
    // Farm Infrastructure
    farmRoads: '',
    storage: '',
    electricity: '',
    nearestMarket: '',
    // Equipment & Inputs
    tractorAccess: '',
    pumpSetAccess: '',
    fertilizerUsage: '',
    pesticideUsage: '',
    // Economic data
    inputCosts: '',
    marketingMethod: ''
  });

  const [profilePhoto, setProfilePhoto] = useState(null);

  // Load profile data from backend when component mounts
  const loadProfileData = async () => {
    try {
      setInitialLoading(true);
      
      // Debug authentication state
      const token = localStorage.getItem('authToken');
      const userData = localStorage.getItem('user');
      console.log('Auth token:', token);
      console.log('User data:', userData);
      console.log('Auth context user:', user);
      
      const response = await ProfileService.getProfile();
      const formattedData = ProfileService.formatProfileData(response);
      
      setProfileData(response.profile);
      setPersonalInfo(formattedData.personalInfo);
      setFarmInfo(formattedData.farmInfo);
      setProfilePhoto(response.profile.profilePhoto || null);
      
      // Load analytics data after profile data is loaded
      await loadAnalyticsData(response);
      
      console.log('Profile data loaded:', formattedData);
    } catch (error) {
      console.error('Failed to load profile data:', error);
      
      // Check if it's an auth error
      if (error.status === 401 || error.message === 'unauthorized') {
        setErrors({ 
          general: 'You need to log in to access your profile. Please log in again.' 
        });
      } else {
        setErrors({ 
          general: error.message || 'Failed to load profile data. Please refresh the page.' 
        });
      }
    } finally {
      setInitialLoading(false);
    }
  };

  // Load analytics data based on profile information
  const loadAnalyticsData = async (profileResponse) => {
    try {
      setAnalyticsLoading(true);
      
      // Try to get analytics from backend first
      let analytics;
      try {
        analytics = await AnalyticsService.getFarmAnalytics();
      } catch (analyticsError) {
        console.log('Backend analytics not available, calculating from profile data...');
        // Fallback to client-side calculation
        analytics = AnalyticsService.calculateAnalyticsFromProfile(profileResponse);
      }
      
      setAnalyticsData(analytics);
      console.log('Analytics data loaded:', analytics);
    } catch (error) {
      console.error('Failed to load analytics data:', error);
      // Set default analytics on error
      setAnalyticsData(AnalyticsService.getDefaultAnalytics());
    } finally {
      setAnalyticsLoading(false);
    }
  };

  useEffect(() => {
    loadProfileData();
  }, []);

  // Clear messages after 3 seconds
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(''), 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  // Validation functions
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone) => {
    const phoneRegex = /^[\+]?[1-9][\d]{0,3}[\s\-]?[(]?[\d]{1,4}[)]?[\s\-]?[\d]{1,4}[\s\-]?[\d]{1,9}$/;
    return phoneRegex.test(phone) || phone === '';
  };

  const validatePersonalInfo = () => {
    const newErrors = {};
    
    if (!personalInfo.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }
    
    if (!personalInfo.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }
    
    if (!personalInfo.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(personalInfo.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (personalInfo.phone && !validatePhone(personalInfo.phone)) {
      newErrors.phone = 'Please enter a valid phone number';
    }
    
    if (!personalInfo.state.trim()) {
      newErrors.state = 'State is required';
    }
    
    if (!personalInfo.city.trim()) {
      newErrors.city = 'City is required';
    }
    
    if (personalInfo.pincode && !/^\d{6}$/.test(personalInfo.pincode)) {
      newErrors.pincode = 'Pincode must be 6 digits';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateFarmInfo = () => {
    const newErrors = {};
    
    if (!farmInfo.farmName.trim()) {
      newErrors.farmName = 'Farm name is required';
    }
    
    if (!farmInfo.farmSize || farmInfo.farmSize <= 0) {
      newErrors.farmSize = 'Please enter a valid farm size';
    }
    
    // Check if primary crops array is not empty or if custom primary crops are specified
    if (farmInfo.primaryCrops.length === 0) {
      if (!farmInfo.customPrimaryCrops.trim()) {
        newErrors.primaryCrops = 'At least one primary crop is required';
      }
    } else if (farmInfo.primaryCrops.includes('other') && !farmInfo.customPrimaryCrops.trim()) {
      newErrors.customPrimaryCrops = 'Please specify your custom primary crops';
    }
    
    // Secondary crops validation (optional but if custom is used, must be specified)
    if (farmInfo.secondaryCrops.includes('other') && !farmInfo.customSecondaryCrops.trim()) {
      newErrors.customSecondaryCrops = 'Please specify your custom secondary crops';
    }
    
    if (!farmInfo.experience) {
      newErrors.experience = 'Please select your farming experience';
    }
    
    if (!farmInfo.farmingMethod) {
      newErrors.farmingMethod = 'Please select your farming method';
    }
    
    if (!farmInfo.state.trim()) {
      newErrors.farmState = 'Farm state is required';
    }
    
    if (!farmInfo.city.trim()) {
      newErrors.farmCity = 'Farm city is required';
    }
    
    // Farm pincode is now optional, but if provided must be valid
    if (farmInfo.pincode && !/^\d{6}$/.test(farmInfo.pincode)) {
      newErrors.farmPincode = 'Pincode must be 6 digits';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Save functions using backend API
  const handleSavePersonalInfo = async () => {
    if (!validatePersonalInfo()) {
      return;
    }
    
    setLoading(true);
    try {
      const response = await ProfileService.updatePersonalInfo({
        phone: personalInfo.phone,
        profilePhoto: profilePhoto
      });
      
      // Reload profile data to get latest state
      await loadProfileData();
      
      setSuccessMessage('Personal information updated successfully!');
      setIsEditing({ ...isEditing, personal: false });
      setErrors({});
    } catch (error) {
      console.error('Save personal info error:', error);
      setErrors({ general: error.message || 'Failed to update personal information. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const handleSaveFarmInfo = async () => {
    if (!validateFarmInfo()) {
      return;
    }
    
    setLoading(true);
    try {
      const response = await ProfileService.updateFarmDetails(farmInfo);
      
      // Reload profile data to get latest state
      await loadProfileData();
      
      setSuccessMessage('Farm details updated successfully!');
      setIsEditing({ ...isEditing, farm: false });
      setErrors({});
    } catch (error) {
      console.error('Save farm info error:', error);
      setErrors({ general: error.message || 'Failed to update farm details. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  // Handle input changes
  const handlePersonalInfoChange = (field, value) => {
    setPersonalInfo({ ...personalInfo, [field]: value });
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors({ ...errors, [field]: '' });
    }
  };

  const handleFarmInfoChange = (field, value) => {
    console.log(`Updating ${field} to:`, value);
    setFarmInfo(prev => {
      const updated = { ...prev, [field]: value };
      console.log('Updated farmInfo:', updated);
      return updated;
    });
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors({ ...errors, [field]: '' });
    }
  };

  // Toggle edit mode
  const toggleEdit = (section) => {
    setIsEditing({ ...isEditing, [section]: !isEditing[section] });
    setErrors({});
  };

  // Handle profile photo upload
  const handlePhotoUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        setErrors({ photo: 'Please select a valid image file (JPEG, PNG, GIF, or WebP)' });
        return;
      }

      // Validate file size (max 5MB)
      const maxSize = 5 * 1024 * 1024; // 5MB in bytes
      if (file.size > maxSize) {
        setErrors({ photo: 'Image file size should be less than 5MB' });
        return;
      }

      // Create file reader to preview image
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageDataUrl = e.target.result;
        setProfilePhoto(imageDataUrl);
        
        // Update user data with new photo
        const updatedUser = {
          ...userData,
          profilePhoto: imageDataUrl
        };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        
        setSuccessMessage('Profile photo updated successfully!');
        setErrors(prev => ({ ...prev, photo: '' }));
      };
      
      reader.readAsDataURL(file);
    }
  };

  // Remove profile photo
  const handleRemovePhoto = () => {
    setProfilePhoto(null);
    
    // Update user data
    const updatedUser = {
      ...userData,
      profilePhoto: null
    };
    localStorage.setItem('user', JSON.stringify(updatedUser));
    
    setSuccessMessage('Profile photo removed successfully!');
  };

  // Kerala-specific crop options for selection
  const cropOptions = [
    { value: 'rice', label: 'Rice (Paddy)', icon: <RiceIcon size={16} /> },
    { value: 'coconut', label: 'Coconut', icon: <CoconutIcon size={16} /> },
    { value: 'pepper', label: 'Black Pepper', icon: <PepperIcon size={16} /> },
    { value: 'cardamom', label: 'Cardamom', icon: <SeedlingIcon size={16} /> },
    { value: 'rubber', label: 'Rubber', icon: <SeedlingIcon size={16} /> },
    { value: 'banana', label: 'Banana', icon: <SeedlingIcon size={16} /> },
    { value: 'tea', label: 'Tea', icon: <SeedlingIcon size={16} /> },
    { value: 'coffee', label: 'Coffee', icon: <SeedlingIcon size={16} /> },
    { value: 'cashew', label: 'Cashew', icon: <SeedlingIcon size={16} /> },
    { value: 'areca', label: 'Areca Nut (Betel Nut)', icon: <SeedlingIcon size={16} /> },
    { value: 'ginger', label: 'Ginger', icon: <CarrotIcon size={16} /> },
    { value: 'turmeric', label: 'Turmeric', icon: <CarrotIcon size={16} /> },
    { value: 'tapioca', label: 'Tapioca (Cassava)', icon: <CarrotIcon size={16} /> },
    { value: 'jackfruit', label: 'Jackfruit', icon: <SeedlingIcon size={16} /> },
    { value: 'mango', label: 'Mango', icon: <SeedlingIcon size={16} /> },
    { value: 'plantain', label: 'Plantain', icon: <SeedlingIcon size={16} /> },
    { value: 'cocoa', label: 'Cocoa', icon: <SeedlingIcon size={16} /> },
    { value: 'nutmeg', label: 'Nutmeg', icon: <SeedlingIcon size={16} /> },
    { value: 'clove', label: 'Clove', icon: <SeedlingIcon size={16} /> },
    { value: 'cinnamon', label: 'Cinnamon', icon: <SeedlingIcon size={16} /> },
    { value: 'vanilla', label: 'Vanilla', icon: <SeedlingIcon size={16} /> },
    { value: 'pineapple', label: 'Pineapple', icon: <SeedlingIcon size={16} /> },
    { value: 'papaya', label: 'Papaya', icon: <SeedlingIcon size={16} /> },
    { value: 'curry_leaves', label: 'Curry Leaves', icon: <SeedlingIcon size={16} /> },
    { value: 'vegetables', label: 'Mixed Vegetables', icon: <TomatoIcon size={16} /> },
    { value: 'other', label: 'Other Crops (specify)', icon: <AddIcon size={16} /> }
  ];

  // Handle crop selection
  const handleCropToggle = (type, cropValue) => {
    const fieldName = type === 'primary' ? 'primaryCrops' : 'secondaryCrops';
    const currentCrops = farmInfo[fieldName];
    
    let newCrops;
    if (currentCrops.includes(cropValue)) {
      // Remove the crop
      newCrops = currentCrops.filter(crop => crop !== cropValue);
    } else {
      // Add the crop
      newCrops = [...currentCrops, cropValue];
    }
    
    handleFarmInfoChange(fieldName, newCrops);
  };

  // Render crop checkboxes
  const renderCropsCheckboxes = (type) => {
    const selectedCrops = type === 'primary' ? farmInfo.primaryCrops : farmInfo.secondaryCrops;
    const disabled = !isEditing.farm;
    
    return (
      <div className="crops-checkbox-grid">
        {cropOptions.map(crop => (
          <label key={crop.value} className={`crop-checkbox ${disabled ? 'disabled' : ''}`}>
            <input
              type="checkbox"
              checked={selectedCrops.includes(crop.value)}
              onChange={() => handleCropToggle(type, crop.value)}
              disabled={disabled}
              className="crop-checkbox-input"
            />
            <div className="crop-checkbox-content">
              <span className="crop-icon">{crop.icon}</span>
              <span className="crop-label">{crop.label}</span>
            </div>
          </label>
        ))}
      </div>
    );
  };

  // Render selected crops display (read-only mode)
  const renderSelectedCropsDisplay = (type) => {
    const selectedCrops = type === 'primary' ? farmInfo.primaryCrops : farmInfo.secondaryCrops;
    const customCrops = type === 'primary' ? farmInfo.customPrimaryCrops : farmInfo.customSecondaryCrops;
    
    if (selectedCrops.length === 0 && !customCrops) {
      return (
        <span className="no-crops-selected">
          {type === 'primary' ? 'No primary crops selected' : 'No secondary crops selected'}
        </span>
      );
    }
    
    const displayCrops = [];
    
    // Add predefined crops with their labels and icons
    selectedCrops.forEach(cropValue => {
      if (cropValue !== 'other') {
        const crop = cropOptions.find(option => option.value === cropValue);
        if (crop) {
          displayCrops.push(
            <span key={cropValue} className="selected-crop-tag">
              <span className="crop-icon">{crop.icon}</span>
              <span className="crop-label">{crop.label}</span>
            </span>
          );
        }
      }
    });
    
    // Add custom crops
    if (selectedCrops.includes('other') && customCrops) {
      const customList = customCrops.split(',').map(crop => crop.trim()).filter(crop => crop);
      customList.forEach((customCrop, index) => {
        displayCrops.push(
          <span key={`custom-${index}`} className="selected-crop-tag custom-crop">
            <span className="crop-icon">*</span>
            <span className="crop-label">{customCrop}</span>
          </span>
        );
      });
    }
    
    return (
      <div className="selected-crops-display">
        {displayCrops.length > 0 ? displayCrops : (
          <span className="no-crops-selected">
            {type === 'primary' ? 'No primary crops selected' : 'No secondary crops selected'}
          </span>
        )}
      </div>
    );
  };

  const sidebarItems = [
    { id: 'personal', label: 'Personal Info', icon: <UserIcon size={20} /> },
    { id: 'farm', label: 'Farm Details', icon: <TractorIcon size={20} /> },
    { id: 'crops', label: 'My Crops', icon: <SeedlingIcon size={20} /> },
    { id: 'analytics', label: 'Farm Analytics', icon: <AnalyticsIcon size={20} /> },
    { id: 'settings', label: 'Settings', icon: <SettingsIcon size={20} /> },
    { id: 'support', label: 'Help & Support', icon: <HelpIcon size={20} /> }
  ];

  const renderContent = () => {
    switch (activeSection) {
      case 'personal':
        return (
          <div className="content-section">
            <div className="section-header">
              <h2>Personal Information</h2>
              <button 
                className={`edit-toggle-btn ${isEditing.personal ? 'editing' : ''}`}
                onClick={() => toggleEdit('personal')}
              >
{isEditing.personal ? 'Cancel' : 'Edit'}
              </button>
            </div>
            
            {successMessage && (
              <div className="success-message">
{successMessage}
              </div>
            )}
            
            {errors.general && (
              <div className="error-message">
{errors.general}
              </div>
            )}
            
            <div className="personal-info">
              <div className="profile-avatar">
                <div className="avatar-circle">
                  {profilePhoto ? (
                    <img src={profilePhoto} alt="Profile" />
                  ) : (
                    (personalInfo.firstName || 'U')[0].toUpperCase()
                  )}
                </div>
                
                <div className="avatar-actions">
                  <input 
                    type="file" 
                    id="photo-upload" 
                    accept="image/*" 
                    style={{ display: 'none' }} 
                    onChange={handlePhotoUpload}
                  />
                  <button 
                    className="change-avatar-btn"
                    onClick={() => document.getElementById('photo-upload').click()}
                  >
                    Change Photo
                  </button>
                  {profilePhoto && (
                    <button 
                      className="remove-avatar-btn"
                      onClick={handleRemovePhoto}
                    >
                      Remove
                    </button>
                  )}
                </div>
                
                {errors.photo && (
                  <span className="field-error">{errors.photo}</span>
                )}
              </div>
              
              <div className="detail-group">
                <div className="detail-item">
                  <label>First Name *</label>
                  <input 
                    type="text" 
                    value={personalInfo.firstName}
                    onChange={(e) => handlePersonalInfoChange('firstName', e.target.value)}
                    readOnly={!isEditing.personal}
                    className={`profile-input ${errors.firstName ? 'error' : ''}`}
                    placeholder="Enter your first name"
                  />
                  {errors.firstName && (
                    <span className="field-error">{errors.firstName}</span>
                  )}
                </div>
                
                <div className="detail-item">
                  <label>Last Name *</label>
                  <input 
                    type="text" 
                    value={personalInfo.lastName}
                    onChange={(e) => handlePersonalInfoChange('lastName', e.target.value)}
                    readOnly={!isEditing.personal}
                    className={`profile-input ${errors.lastName ? 'error' : ''}`}
                    placeholder="Enter your last name"
                  />
                  {errors.lastName && (
                    <span className="field-error">{errors.lastName}</span>
                  )}
                </div>
              </div>
              
              <div className="detail-item">
                <label>Email Address *</label>
                <input 
                  type="email" 
                  value={personalInfo.email}
                  onChange={(e) => handlePersonalInfoChange('email', e.target.value)}
                  readOnly={!isEditing.personal}
                  className={`profile-input ${errors.email ? 'error' : ''}`}
                  placeholder="Enter your email address"
                />
                {errors.email && (
                  <span className="field-error">{errors.email}</span>
                )}
              </div>
              
              <div className="detail-item">
                <label>Phone Number</label>
                <input 
                  type="tel" 
                  value={personalInfo.phone}
                  onChange={(e) => handlePersonalInfoChange('phone', e.target.value)}
                  readOnly={!isEditing.personal}
                  className={`profile-input ${errors.phone ? 'error' : ''}`}
                  placeholder="Enter your phone number"
                />
                {errors.phone && (
                  <span className="field-error">{errors.phone}</span>
                )}
              </div>
              
              <div className="detail-item">
                <label>State *</label>
                <input 
                  type="text" 
                  value={personalInfo.state}
                  onChange={(e) => handlePersonalInfoChange('state', e.target.value)}
                  readOnly={!isEditing.personal}
                  className={`profile-input ${errors.state ? 'error' : ''}`}
                  placeholder="Enter your state"
                />
                {errors.state && (
                  <span className="field-error">{errors.state}</span>
                )}
              </div>
              
              <div className="detail-item">
                <label>City *</label>
                <input 
                  type="text" 
                  value={personalInfo.city}
                  onChange={(e) => handlePersonalInfoChange('city', e.target.value)}
                  readOnly={!isEditing.personal}
                  className={`profile-input ${errors.city ? 'error' : ''}`}
                  placeholder="Enter your city"
                />
                {errors.city && (
                  <span className="field-error">{errors.city}</span>
                )}
              </div>
              
              <div className="detail-item">
                <label>District (Optional)</label>
                <input 
                  type="text" 
                  value={personalInfo.district}
                  onChange={(e) => handlePersonalInfoChange('district', e.target.value)}
                  readOnly={!isEditing.personal}
                  className="profile-input"
                  placeholder="Enter your district (optional)"
                />
              </div>
              
              <div className="detail-item">
                <label>Pincode</label>
                <input 
                  type="text" 
                  value={personalInfo.pincode}
                  onChange={(e) => handlePersonalInfoChange('pincode', e.target.value)}
                  readOnly={!isEditing.personal}
                  className={`profile-input ${errors.pincode ? 'error' : ''}`}
                  placeholder="Enter your pincode"
                  maxLength="6"
                />
                {errors.pincode && (
                  <span className="field-error">{errors.pincode}</span>
                )}
              </div>
              
              {/* Additional Personal Info Fields for Analytics */}
              <div className="detail-group">
                <div className="detail-item">
                  <label>Age</label>
                  <input 
                    type="number" 
                    value={personalInfo.age}
                    onChange={(e) => handlePersonalInfoChange('age', e.target.value)}
                    readOnly={!isEditing.personal}
                    className="profile-input"
                    placeholder="Enter your age"
                    min="18"
                    max="100"
                  />
                </div>
                
                <div className="detail-item">
                  <label>Gender</label>
                  <select 
                    value={personalInfo.gender}
                    onChange={(e) => handlePersonalInfoChange('gender', e.target.value)}
                    disabled={!isEditing.personal}
                    className="profile-input"
                  >
                    <option value="">Select gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>
              
              <div className="detail-item">
                <label>Education Level</label>
                <select 
                  value={personalInfo.education}
                  onChange={(e) => handlePersonalInfoChange('education', e.target.value)}
                  disabled={!isEditing.personal}
                  className="profile-input"
                >
                  <option value="">Select education level</option>
                  <option value="primary">Primary School</option>
                  <option value="secondary">Secondary School</option>
                  <option value="higher_secondary">Higher Secondary</option>
                  <option value="diploma">Diploma</option>
                  <option value="graduation">Graduation</option>
                  <option value="post_graduation">Post Graduation</option>
                  <option value="other">Other</option>
                </select>
              </div>
              
              <div className="detail-item">
                <label>Primary Occupation</label>
                <select 
                  value={personalInfo.primaryOccupation}
                  onChange={(e) => handlePersonalInfoChange('primaryOccupation', e.target.value)}
                  disabled={!isEditing.personal}
                  className="profile-input"
                >
                  <option value="farming">Farming (Primary)</option>
                  <option value="mixed">Mixed (Farming + Other)</option>
                  <option value="other">Other (Farming as Secondary)</option>
                </select>
              </div>
              
              <div className="detail-item">
                <label>Annual Income Range</label>
                <select 
                  value={personalInfo.annualIncome}
                  onChange={(e) => handlePersonalInfoChange('annualIncome', e.target.value)}
                  disabled={!isEditing.personal}
                  className="profile-input"
                >
                  <option value="">Select income range</option>
                  <option value="under_1l">Under ₹1 Lakh</option>
                  <option value="1_3l">₹1 - 3 Lakhs</option>
                  <option value="3_5l">₹3 - 5 Lakhs</option>
                  <option value="5_10l">₹5 - 10 Lakhs</option>
                  <option value="above_10l">Above ₹10 Lakhs</option>
                </select>
              </div>
              
              {isEditing.personal && (
                <div className="form-actions">
                  <button 
                    className="save-btn"
                    onClick={handleSavePersonalInfo}
                    disabled={loading}
                  >
                    {loading ? 'Saving...' : 'Save Changes'}
                  </button>
                  <button 
                    className="cancel-btn"
                    onClick={() => toggleEdit('personal')}
                    disabled={loading}
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          </div>
        );
      case 'farm':
        return (
          <div className="content-section">
            <div className="section-header">
              <h2>Farm Details</h2>
              <button 
                className={`edit-toggle-btn ${isEditing.farm ? 'editing' : ''}`}
                onClick={() => toggleEdit('farm')}
              >
                {isEditing.farm ? 'X Cancel' : 'Edit'}
              </button>
            </div>
            
            {successMessage && (
              <div className="success-message">
                Success: {successMessage}
              </div>
            )}
            
            {errors.general && (
              <div className="error-message">
                Error: {errors.general}
              </div>
            )}
            
            <div className="farm-info">
              <div className="basic-farm-fields">
                <div className="detail-item">
                  <label>Farm Name *</label>
                  <input 
                    type="text" 
                    value={farmInfo.farmName}
                    onChange={(e) => handleFarmInfoChange('farmName', e.target.value)}
                    readOnly={!isEditing.farm}
                    className={`profile-input ${errors.farmName ? 'error' : ''}`}
                    placeholder="Enter your farm name"
                  />
                  {errors.farmName && (
                    <span className="field-error">{errors.farmName}</span>
                  )}
                </div>
              
              <div className="detail-item">
                <label>Farm Size *</label>
                <div className="farm-size-container">
                  <input 
                    type="number" 
                    value={farmInfo.farmSize}
                    onChange={(e) => handleFarmInfoChange('farmSize', e.target.value)}
                    readOnly={!isEditing.farm}
                    className={`profile-input farm-size-input ${errors.farmSize ? 'error' : ''}`}
                    placeholder="Enter farm size"
                    min="0"
                    step="0.1"
                  />
                  <select 
                    value={farmInfo.farmSizeUnit}
                    onChange={(e) => handleFarmInfoChange('farmSizeUnit', e.target.value)}
                    disabled={!isEditing.farm}
                    className={`profile-input farm-size-unit ${errors.farmSize ? 'error' : ''}`}
                  >
                    <option value="acres">Acres</option>
                    <option value="hectares">Hectares</option>
                    <option value="square_feet">Square Feet</option>
                    <option value="square_meters">Square Meters</option>
                  </select>
                </div>
                {errors.farmSize && (
                  <span className="field-error">{errors.farmSize}</span>
                )}
              </div>
              
              {/* Primary Crops Section */}
              <div className="detail-item">
                <label>Primary Crops *</label>
                <select 
                  value={farmInfo.primaryCrops.length > 0 ? farmInfo.primaryCrops[0] : ''}
                  onChange={(e) => {
                    const selectedCrop = e.target.value;
                    console.log('Selected primary crop:', selectedCrop);
                    handleFarmInfoChange('primaryCrops', selectedCrop ? [selectedCrop] : []);
                    // Clear custom crops if not "other"
                    if (selectedCrop !== 'other') {
                      handleFarmInfoChange('customPrimaryCrops', '');
                    }
                  }}
                  disabled={!isEditing.farm}
                  className={`profile-input ${errors.primaryCrops ? 'error' : ''}`}
                >
                  <option value="">Select primary crop</option>
                  {cropOptions.map(crop => (
                    <option key={crop.value} value={crop.value}>
                      {crop.icon} {crop.label}
                    </option>
                  ))}
                </select>
                
                {farmInfo.primaryCrops.includes('other') && (
                  <div style={{ marginTop: '0.5rem' }}>
                    <input 
                      type="text" 
                      value={farmInfo.customPrimaryCrops}
                      onChange={(e) => handleFarmInfoChange('customPrimaryCrops', e.target.value)}
                      disabled={!isEditing.farm}
                      className={`profile-input ${errors.customPrimaryCrops ? 'error' : ''}`}
                      placeholder="Specify your primary crops (e.g., Ginger, Turmeric, Vanilla)"
                    />
                    {errors.customPrimaryCrops && (
                      <span className="field-error">{errors.customPrimaryCrops}</span>
                    )}
                  </div>
                )}
                
                {errors.primaryCrops && (
                  <span className="field-error">{errors.primaryCrops}</span>
                )}
              </div>
              
              {/* Secondary Crops Section - Optional */}
              <div className="detail-item">
                <label>Secondary Crops (Optional)</label>
                
                {/* Display selected crops in read-only mode */}
                {!isEditing.farm && (
                  <input 
                    type="text" 
                    value={farmInfo.secondaryCrops.length > 0 ? 
                      (() => {
                        const displayCrops = [];
                        farmInfo.secondaryCrops.forEach(cropValue => {
                          if (cropValue === 'other') {
                            // If 'other' is selected, show the custom crops instead
                            if (farmInfo.customSecondaryCrops) {
                              displayCrops.push(farmInfo.customSecondaryCrops);
                            }
                          } else {
                            const crop = cropOptions.find(option => option.value === cropValue);
                            if (crop) {
                              displayCrops.push(crop.label);
                            }
                          }
                        });
                        return displayCrops.join(', ');
                      })()
                      : 'No secondary crops selected'
                    }
                    readOnly
                    className="profile-input"
                  />
                )}
                
                {/* Multiple select dropdown in edit mode */}
                {isEditing.farm && (
                  <div className="secondary-crops-edit-section">
                    <select 
                      value=""
                      onChange={(e) => {
                        const selectedCrop = e.target.value;
                        if (selectedCrop && !farmInfo.secondaryCrops.includes(selectedCrop)) {
                          console.log('Adding secondary crop:', selectedCrop);
                          const newCrops = [...farmInfo.secondaryCrops, selectedCrop];
                          handleFarmInfoChange('secondaryCrops', newCrops);
                        }
                      }}
                      className={`profile-input ${errors.secondaryCrops ? 'error' : ''}`}
                    >
                      <option value="">+ Add secondary crop</option>
                      {cropOptions
                        .filter(crop => !farmInfo.secondaryCrops.includes(crop.value))
                        .map(crop => (
                        <option key={crop.value} value={crop.value}>
                          {crop.icon} {crop.label}
                        </option>
                      ))}
                    </select>
                    
                    {/* Show selected crops as a simple list */}
                    {farmInfo.secondaryCrops.length > 0 && (
                      <div className="selected-crops-simple-list">
                        <label style={{ fontSize: '0.8rem', color: '#666', marginBottom: '0.5rem', display: 'block' }}>Selected Secondary Crops:</label>
                        <input 
                          type="text" 
                          value={(() => {
                            const displayCrops = [];
                            farmInfo.secondaryCrops.forEach(cropValue => {
                              if (cropValue === 'other') {
                                // If 'other' is selected, show the custom crops instead
                                if (farmInfo.customSecondaryCrops) {
                                  displayCrops.push(farmInfo.customSecondaryCrops);
                                }
                              } else {
                                const crop = cropOptions.find(option => option.value === cropValue);
                                if (crop) {
                                  displayCrops.push(crop.label);
                                }
                              }
                            });
                            return displayCrops.join(', ');
                          })()}
                          readOnly
                          className="profile-input selected-crops-display-input"
                          style={{ backgroundColor: '#f8fafc', border: '1px solid #e5e7eb' }}
                        />
                        <button
                          type="button"
                          onClick={() => {
                            handleFarmInfoChange('secondaryCrops', []);
                            handleFarmInfoChange('customSecondaryCrops', '');
                          }}
                          className="clear-crops-btn"
                          style={{
                            marginTop: '0.5rem',
                            padding: '0.3rem 0.8rem',
                            background: '#ef4444',
                            color: 'white',
                            border: 'none',
                            borderRadius: '6px',
                            fontSize: '0.8rem',
                            cursor: 'pointer'
                          }}
                        >
                          Clear All
                        </button>
                      </div>
                    )}
                  </div>
                )}
                
                {/* Custom crops input for 'other' option */}
                {farmInfo.secondaryCrops.includes('other') && (
                  <div style={{ marginTop: '0.5rem' }}>
                    <input 
                      type="text" 
                      value={farmInfo.customSecondaryCrops}
                      onChange={(e) => handleFarmInfoChange('customSecondaryCrops', e.target.value)}
                      disabled={!isEditing.farm}
                      className={`profile-input ${errors.customSecondaryCrops ? 'error' : ''}`}
                      placeholder="Specify your other secondary crops (e.g., Herbs, Medicinal plants)"
                    />
                    {errors.customSecondaryCrops && (
                      <span className="field-error">{errors.customSecondaryCrops}</span>
                    )}
                  </div>
                )}
              </div>
              
              <div className="detail-item">
                <label>Farming Experience *</label>
                <select 
                  value={farmInfo.experience}
                  onChange={(e) => handleFarmInfoChange('experience', e.target.value)}
                  disabled={!isEditing.farm}
                  className={`profile-input ${errors.experience ? 'error' : ''}`}
                >
                  <option value="">Select experience level</option>
                  <option value="beginner">Beginner (0-2 years)</option>
                  <option value="intermediate">Intermediate (3-10 years)</option>
                  <option value="experienced">Experienced (10+ years)</option>
                </select>
                {errors.experience && (
                  <span className="field-error">{errors.experience}</span>
                )}
              </div>
              
              <div className="detail-item">
                <label>Farming Method *</label>
                <select 
                  value={farmInfo.farmingMethod}
                  onChange={(e) => handleFarmInfoChange('farmingMethod', e.target.value)}
                  disabled={!isEditing.farm}
                  className={`profile-input ${errors.farmingMethod ? 'error' : ''}`}
                >
                  <option value="">Select farming method</option>
                  <option value="organic">Organic Farming</option>
                  <option value="conventional">Conventional Farming</option>
                  <option value="mixed">Mixed Farming</option>
                  <option value="sustainable">Sustainable Farming</option>
                </select>
                {errors.farmingMethod && (
                  <span className="field-error">{errors.farmingMethod}</span>
                )}
              </div>
              
              <div className="detail-item">
                <label>Farm State *</label>
                <input 
                  type="text" 
                  value={farmInfo.state}
                  onChange={(e) => handleFarmInfoChange('state', e.target.value)}
                  readOnly={!isEditing.farm}
                  className={`profile-input ${errors.farmState ? 'error' : ''}`}
                  placeholder="Enter farm state"
                />
                {errors.farmState && (
                  <span className="field-error">{errors.farmState}</span>
                )}
              </div>
              
              <div className="detail-item">
                <label>Farm City *</label>
                <input 
                  type="text" 
                  value={farmInfo.city}
                  onChange={(e) => handleFarmInfoChange('city', e.target.value)}
                  readOnly={!isEditing.farm}
                  className={`profile-input ${errors.farmCity ? 'error' : ''}`}
                  placeholder="Enter farm city"
                />
                {errors.farmCity && (
                  <span className="field-error">{errors.farmCity}</span>
                )}
              </div>
              
              <div className="detail-item">
                <label>Farm District (Optional)</label>
                <input 
                  type="text" 
                  value={farmInfo.district}
                  onChange={(e) => handleFarmInfoChange('district', e.target.value)}
                  readOnly={!isEditing.farm}
                  className="profile-input"
                  placeholder="Enter farm district (optional)"
                />
              </div>
              
              <div className="detail-item">
                <label>Farm Pincode (Optional)</label>
                <input 
                  type="text" 
                  value={farmInfo.pincode}
                  onChange={(e) => handleFarmInfoChange('pincode', e.target.value)}
                  readOnly={!isEditing.farm}
                  className={`profile-input ${errors.farmPincode ? 'error' : ''}`}
                  placeholder="Enter farm pincode (optional)"
                  maxLength="6"
                />
                {errors.farmPincode && (
                  <span className="field-error">{errors.farmPincode}</span>
                )}
              </div>
              </div>
              
              {/* Advanced Farm Details for Analytics */}
              <div className="detail-group">
                <div className="detail-item">
                  <label>Land Type</label>
                  <select 
                    value={farmInfo.landType}
                    onChange={(e) => handleFarmInfoChange('landType', e.target.value)}
                    disabled={!isEditing.farm}
                    className="profile-input"
                  >
                    <option value="">Select land type</option>
                    <option value="irrigated">Irrigated</option>
                    <option value="rain_fed">Rain-fed</option>
                    <option value="mixed">Mixed (Irrigated + Rain-fed)</option>
                  </select>
                </div>
                
                <div className="detail-item">
                  <label>Soil Type</label>
                  <select 
                    value={farmInfo.soilType}
                    onChange={(e) => handleFarmInfoChange('soilType', e.target.value)}
                    disabled={!isEditing.farm}
                    className="profile-input"
                  >
                    <option value="">Select soil type</option>
                    <option value="loamy">Loamy</option>
                    <option value="clay">Clay</option>
                    <option value="sandy">Sandy</option>
                    <option value="silt">Silt</option>
                    <option value="laterite">Laterite</option>
                    <option value="black">Black Soil</option>
                    <option value="red">Red Soil</option>
                    <option value="alluvial">Alluvial</option>
                  </select>
                </div>
              </div>
              
              {/* Soil Details Section */}
              <div className="section-divider">
                <h3>Soil Details (Optional but Recommended)</h3>
              </div>
              
              <div className="detail-group">
                <div className="detail-item">
                  <label>Soil pH Level</label>
                  <input 
                    type="number" 
                    value={farmInfo.soilPh}
                    onChange={(e) => handleFarmInfoChange('soilPh', e.target.value)}
                    readOnly={!isEditing.farm}
                    className="profile-input"
                    placeholder="e.g., 6.5"
                    min="4"
                    max="9"
                    step="0.1"
                  />
                </div>
                
                <div className="detail-item">
                  <label>Organic Carbon (%)</label>
                  <input 
                    type="number" 
                    value={farmInfo.soilOrganicCarbon}
                    onChange={(e) => handleFarmInfoChange('soilOrganicCarbon', e.target.value)}
                    readOnly={!isEditing.farm}
                    className="profile-input"
                    placeholder="e.g., 1.2"
                    min="0"
                    max="5"
                    step="0.1"
                  />
                </div>
              </div>
              
              <div className="detail-group">
                <div className="detail-item">
                  <label>Nitrogen Level</label>
                  <select 
                    value={farmInfo.soilNitrogen}
                    onChange={(e) => handleFarmInfoChange('soilNitrogen', e.target.value)}
                    disabled={!isEditing.farm}
                    className="profile-input"
                  >
                    <option value="">Select nitrogen level</option>
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
                
                <div className="detail-item">
                  <label>Phosphorus Level</label>
                  <select 
                    value={farmInfo.soilPhosphorus}
                    onChange={(e) => handleFarmInfoChange('soilPhosphorus', e.target.value)}
                    disabled={!isEditing.farm}
                    className="profile-input"
                  >
                    <option value="">Select phosphorus level</option>
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
              </div>
              
              <div className="detail-item">
                <label>Potassium Level</label>
                <select 
                  value={farmInfo.soilPotassium}
                  onChange={(e) => handleFarmInfoChange('soilPotassium', e.target.value)}
                  disabled={!isEditing.farm}
                  className="profile-input"
                >
                  <option value="">Select potassium level</option>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
              
              {/* Water & Irrigation Section */}
              <div className="section-divider">
                <h3>Water & Irrigation</h3>
              </div>
              
              <div className="detail-group">
                <div className="detail-item">
                  <label>Irrigation Source</label>
                  <select 
                    value={farmInfo.irrigationSource}
                    onChange={(e) => handleFarmInfoChange('irrigationSource', e.target.value)}
                    disabled={!isEditing.farm}
                    className="profile-input"
                  >
                    <option value="">Select irrigation source</option>
                    <option value="borewell">Borewell</option>
                    <option value="canal">Canal</option>
                    <option value="river">River/Stream</option>
                    <option value="rainwater">Rainwater Harvesting</option>
                    <option value="tank">Tank/Pond</option>
                    <option value="none">No Irrigation (Rain-fed only)</option>
                  </select>
                </div>
                
                <div className="detail-item">
                  <label>Irrigation Method</label>
                  <select 
                    value={farmInfo.irrigationMethod}
                    onChange={(e) => handleFarmInfoChange('irrigationMethod', e.target.value)}
                    disabled={!isEditing.farm}
                    className="profile-input"
                  >
                    <option value="">Select irrigation method</option>
                    <option value="flood">Flood Irrigation</option>
                    <option value="drip">Drip Irrigation</option>
                    <option value="sprinkler">Sprinkler</option>
                    <option value="furrow">Furrow Irrigation</option>
                    <option value="rainfed">Rain-fed Only</option>
                  </select>
                </div>
              </div>
              
              <div className="detail-item">
                <label>Water Availability</label>
                <select 
                  value={farmInfo.waterAvailability}
                  onChange={(e) => handleFarmInfoChange('waterAvailability', e.target.value)}
                  disabled={!isEditing.farm}
                  className="profile-input"
                >
                  <option value="">Select water availability</option>
                  <option value="abundant">Abundant (Year-round)</option>
                  <option value="adequate">Adequate (Most seasons)</option>
                  <option value="limited">Limited (Seasonal)</option>
                  <option value="scarce">Scarce (Drought-prone)</option>
                </select>
              </div>
              
              {/* Farm Infrastructure Section */}
              <div className="section-divider">
                <h3>Farm Infrastructure</h3>
              </div>
              
              <div className="detail-group">
                <div className="detail-item">
                  <label>Farm Roads</label>
                  <select 
                    value={farmInfo.farmRoads}
                    onChange={(e) => handleFarmInfoChange('farmRoads', e.target.value)}
                    disabled={!isEditing.farm}
                    className="profile-input"
                  >
                    <option value="">Select road access</option>
                    <option value="good">Good (All-weather road)</option>
                    <option value="fair">Fair (Seasonal access)</option>
                    <option value="poor">Poor (Limited access)</option>
                  </select>
                </div>
                
                <div className="detail-item">
                  <label>Storage Facility</label>
                  <select 
                    value={farmInfo.storage}
                    onChange={(e) => handleFarmInfoChange('storage', e.target.value)}
                    disabled={!isEditing.farm}
                    className="profile-input"
                  >
                    <option value="">Select storage availability</option>
                    <option value="yes">Yes (On-farm storage)</option>
                    <option value="shared">Shared (Community storage)</option>
                    <option value="no">No storage facility</option>
                  </select>
                </div>
              </div>
              
              <div className="detail-group">
                <div className="detail-item">
                  <label>Electricity</label>
                  <select 
                    value={farmInfo.electricity}
                    onChange={(e) => handleFarmInfoChange('electricity', e.target.value)}
                    disabled={!isEditing.farm}
                    className="profile-input"
                  >
                    <option value="">Select electricity status</option>
                    <option value="24x7">24x7 Supply</option>
                    <option value="regular">Regular (8-12 hours)</option>
                    <option value="limited">Limited (4-8 hours)</option>
                    <option value="none">No electricity</option>
                  </select>
                </div>
                
                <div className="detail-item">
                  <label>Nearest Market (km)</label>
                  <input 
                    type="number" 
                    value={farmInfo.nearestMarket}
                    onChange={(e) => handleFarmInfoChange('nearestMarket', e.target.value)}
                    readOnly={!isEditing.farm}
                    className="profile-input"
                    placeholder="Distance in km"
                    min="0"
                    max="200"
                  />
                </div>
              </div>
              
              {/* Equipment & Inputs Section */}
              <div className="section-divider">
                <h3>Equipment & Inputs</h3>
              </div>
              
              <div className="detail-group">
                <div className="detail-item">
                  <label>Tractor Access</label>
                  <select 
                    value={farmInfo.tractorAccess}
                    onChange={(e) => handleFarmInfoChange('tractorAccess', e.target.value)}
                    disabled={!isEditing.farm}
                    className="profile-input"
                  >
                    <option value="">Select tractor access</option>
                    <option value="own">Own Tractor</option>
                    <option value="rent">Rent/Hire</option>
                    <option value="none">No Tractor (Manual/Animal)</option>
                  </select>
                </div>
                
                <div className="detail-item">
                  <label>Pump Set Access</label>
                  <select 
                    value={farmInfo.pumpSetAccess}
                    onChange={(e) => handleFarmInfoChange('pumpSetAccess', e.target.value)}
                    disabled={!isEditing.farm}
                    className="profile-input"
                  >
                    <option value="">Select pump set access</option>
                    <option value="own">Own Pump Set</option>
                    <option value="rent">Rent/Hire</option>
                    <option value="none">No Pump Set</option>
                  </select>
                </div>
              </div>
              
              <div className="detail-group">
                <div className="detail-item">
                  <label>Fertilizer Usage</label>
                  <select 
                    value={farmInfo.fertilizerUsage}
                    onChange={(e) => handleFarmInfoChange('fertilizerUsage', e.target.value)}
                    disabled={!isEditing.farm}
                    className="profile-input"
                  >
                    <option value="">Select fertilizer usage</option>
                    <option value="high">High (Chemical + Organic)</option>
                    <option value="medium">Medium (Balanced)</option>
                    <option value="low">Low (Minimal inputs)</option>
                    <option value="organic">Organic Only</option>
                  </select>
                </div>
                
                <div className="detail-item">
                  <label>Pesticide Usage</label>
                  <select 
                    value={farmInfo.pesticideUsage}
                    onChange={(e) => handleFarmInfoChange('pesticideUsage', e.target.value)}
                    disabled={!isEditing.farm}
                    className="profile-input"
                  >
                    <option value="">Select pesticide usage</option>
                    <option value="high">High (Regular spray)</option>
                    <option value="medium">Medium (Need-based)</option>
                    <option value="low">Low (Minimal use)</option>
                    <option value="none">No Pesticides</option>
                  </select>
                </div>
              </div>
              
              {/* Economic Data Section */}
              <div className="section-divider">
                <h3>Economic Information</h3>
              </div>
              
              <div className="detail-group">
                <div className="detail-item">
                  <label>Monthly Input Costs</label>
                  <select 
                    value={farmInfo.inputCosts}
                    onChange={(e) => handleFarmInfoChange('inputCosts', e.target.value)}
                    disabled={!isEditing.farm}
                    className="profile-input"
                  >
                    <option value="">Select input cost range</option>
                    <option value="under_5k">Under ₹5,000</option>
                    <option value="5k_15k">₹5,000 - 15,000</option>
                    <option value="15k_30k">₹15,000 - 30,000</option>
                    <option value="30k_50k">₹30,000 - 50,000</option>
                    <option value="above_50k">Above ₹50,000</option>
                  </select>
                </div>
                
                <div className="detail-item">
                  <label>Marketing Method</label>
                  <select 
                    value={farmInfo.marketingMethod}
                    onChange={(e) => handleFarmInfoChange('marketingMethod', e.target.value)}
                    disabled={!isEditing.farm}
                    className="profile-input"
                  >
                    <option value="">Select marketing method</option>
                    <option value="local">Local Market/Traders</option>
                    <option value="mandi">Mandi/APMC</option>
                    <option value="direct">Direct to Consumer</option>
                    <option value="contract">Contract Farming</option>
                    <option value="cooperative">Cooperative Society</option>
                    <option value="online">Online Platforms</option>
                  </select>
                </div>
              </div>
              
              {isEditing.farm && (
                <div className="form-actions">
                  <button 
                    className="save-btn"
                    onClick={handleSaveFarmInfo}
                    disabled={loading}
                  >
                    {loading ? 'Saving...' : 'Save Farm Details'}
                  </button>
                  <button 
                    className="cancel-btn"
                    onClick={() => toggleEdit('farm')}
                    disabled={loading}
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          </div>
        );
      case 'crops':
        // Get user's actual crops from profile data
        const userCrops = profileData?.cropsGrown || [];
        const activeCrops = userCrops.filter(crop => crop.isActive);
        
        // Helper function to get crop icon
        const getCropIcon = (cropName) => {
          const crop = cropOptions.find(option => 
            option.label.toLowerCase() === cropName.toLowerCase() || 
            option.value.toLowerCase() === cropName.toLowerCase()
          );
          return crop ? crop.icon : '';
        };
        
        return (
          <div className="content-section">
            <h2>My Crops</h2>
            <div className="crops-overview">
              <div className="crop-stats">
                <div className="stat-card">
                  <div className="stat-icon"></div>
                  <div className="stat-content">
                    <h3>{activeCrops.length}</h3>
                    <p>Active Crops</p>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon"></div>
                  <div className="stat-content">
                    <h3>1</h3>
                    <p>Season Active</p>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon"></div>
                  <div className="stat-content">
                    <h3>{activeCrops.length > 0 ? '100%' : '0%'}</h3>
                    <p>Profile Complete</p>
                  </div>
                </div>
              </div>
              
              {activeCrops.length > 0 ? (
                <div className="crops-grid">
                  {activeCrops.map((crop, index) => (
                    <div key={index} className="crop-card">
                      <div className="crop-icon">{getCropIcon(crop.cropName)}</div>
                      <h4>{crop.cropName}</h4>
                      <p>Season: {crop.season || 'All Season'}</p>
                      <p>Area: {crop.areaAllocated?.value ? `${crop.areaAllocated.value} ${crop.areaAllocated.unit}` : 'Not specified'}</p>
                      <span className="crop-status growing">Active</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="no-crops-message">
                  <div className="empty-state-icon">+</div>
                  <h3>No Crops Added Yet</h3>
                  <p>Start by adding your crops in the Farm Details section</p>
                  <button 
                    className="add-crops-btn"
                    onClick={() => setActiveSection('farm')}
                  >
                    + Add Your First Crop
                  </button>
                </div>
              )}
            </div>
          </div>
        );
      case 'analytics':
        if (analyticsLoading) {
          return (
            <div className="content-section">
              <h2>Farm Analytics</h2>
              <div className="loading-container">
                <div className="loading-spinner"></div>
                <p>Loading analytics data...</p>
              </div>
            </div>
          );
        }

        if (!analyticsData) {
          return (
            <div className="content-section">
              <h2>Farm Analytics</h2>
              <div className="no-data-message">
                <h3>No Analytics Data Available</h3>
                <p>Complete your profile to see detailed farm analytics</p>
                <button 
                  className="setup-profile-btn"
                  onClick={() => setActiveSection('personal')}
                >
                  Complete Profile Setup
                </button>
              </div>
            </div>
          );
        }

        const metrics = analyticsData.farmMetrics || {};
        const cropAnalytics = analyticsData.cropAnalytics || {};
        const yieldEstimates = analyticsData.yieldEstimates || {};
        const efficiency = analyticsData.efficiencyMetrics || {};
        const activities = analyticsData.recentActivities || [];
        const recommendations = analyticsData.recommendations || [];
        const dataQuality = analyticsData.dataQuality || {};

        return (
          <div className="content-section">
            <div className="section-header">
              <h2>Farm Analytics</h2>
              <div className="data-quality-indicator">
                <span className={`quality-badge quality-${dataQuality.level}`}>
                  Data Quality: {dataQuality.level}
                </span>
                <span className="completion-percentage">
                  {dataQuality.completionPercentage}% Complete
                </span>
              </div>
            </div>

            {/* Key Metrics Cards */}
            <div className="analytics-dashboard">
              <div className="analytics-cards">
                <div className="analytics-card">
                  <h3>Total Farm Size</h3>
                  <div className="metric">
                    <span className="value">{metrics.totalLandSize?.value || 0}</span>
                    <span className="unit">{metrics.totalLandSize?.unit || 'acres'}</span>
                  </div>
                  <p className="metric-detail">
                    {metrics.totalLandSize?.hectares || 0} hectares
                  </p>
                </div>
                
                <div className="analytics-card">
                  <h3>Active Crops</h3>
                  <div className="metric">
                    <span className="value">{metrics.activeCrops || 0}</span>
                    <span className="unit">varieties</span>
                  </div>
                  <p className="metric-detail">
                    {cropAnalytics.cropDiversity}% crop diversity
                  </p>
                </div>
                
                <div className="analytics-card">
                  <h3>Est. Annual Revenue</h3>
                  <div className="metric">
                    <span className="value">₹{(yieldEstimates.totalEstimatedRevenue || 0).toLocaleString('en-IN')}</span>
                  </div>
                  <p className="metric-detail">
                    Based on {yieldEstimates.totalEstimatedYield || 0} tons estimated yield
                  </p>
                </div>
                
                <div className="analytics-card">
                  <h3>Farm Efficiency</h3>
                  <div className="metric">
                    <span className="value">{efficiency.overallEfficiency || 0}%</span>
                  </div>
                  <p className={`trend ${efficiency.overallEfficiency >= 70 ? 'positive' : efficiency.overallEfficiency >= 40 ? 'neutral' : 'negative'}`}>
                    {efficiency.overallEfficiency >= 70 ? 'Excellent performance' : 
                     efficiency.overallEfficiency >= 40 ? 'Good performance' : 'Room for improvement'}
                  </p>
                </div>
              </div>
              
              {/* Land Utilization */}
              {cropAnalytics.landUtilization && (
                <div className="land-utilization-section">
                  <h3>Land Utilization</h3>
                  <div className="utilization-chart">
                    <div className="utilization-bar">
                      <div 
                        className="utilization-fill"
                        style={{ width: `${cropAnalytics.landUtilization.utilizationPercentage}%` }}
                      ></div>
                    </div>
                    <div className="utilization-stats">
                      <span>Utilized: {cropAnalytics.landUtilization.allocatedLand} {metrics.totalLandSize?.unit}</span>
                      <span>Available: {cropAnalytics.landUtilization.availableLand} {metrics.totalLandSize?.unit}</span>
                      <span>{cropAnalytics.landUtilization.utilizationPercentage}% utilized</span>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Crop-wise Yield Estimates */}
              {yieldEstimates.cropWiseEstimates && yieldEstimates.cropWiseEstimates.length > 0 && (
                <div className="crop-yield-section">
                  <h3>Crop-wise Yield Estimates</h3>
                  <div className="yield-estimates-grid">
                    {yieldEstimates.cropWiseEstimates.map((estimate, index) => (
                      <div key={index} className="yield-estimate-card">
                        <h4>{estimate.cropName}</h4>
                        <div className="yield-details">
                          <p><strong>Area:</strong> {estimate.area} hectares</p>
                          <p><strong>Est. Yield:</strong> {estimate.estimatedYield.toFixed(1)} {estimate.unit}</p>
                          <p><strong>Est. Revenue:</strong> ₹{estimate.estimatedRevenue.toLocaleString('en-IN')}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Recommendations */}
              {recommendations.length > 0 && (
                <div className="recommendations-section">
                  <h3>Recommendations for Your Farm</h3>
                  <div className="recommendations-list">
                    {recommendations.map((rec, index) => (
                      <div key={index} className={`recommendation-card priority-${rec.priority}`}>
                        <div className="recommendation-header">
                          <h4>{rec.title}</h4>
                          <span className={`priority-badge ${rec.priority}`}>{rec.priority}</span>
                        </div>
                        <p>{rec.description}</p>
                        <div className="recommendation-action">{rec.action}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Data Quality Info */}
              {dataQuality.missingData && dataQuality.missingData.length > 0 && (
                <div className="data-quality-section">
                  <h3>Improve Your Analytics</h3>
                  <p>Add the following information to get more accurate insights:</p>
                  <ul className="missing-data-list">
                    {dataQuality.missingData.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                  <button 
                    className="improve-data-btn"
                    onClick={() => setActiveSection('farm')}
                  >
                    Update Farm Details
                  </button>
                </div>
              )}
              
              {/* Recent Activities */}
              {activities.length > 0 && (
                <div className="recent-activities">
                  <h3>Recent Activities</h3>
                  <div className="activity-list">
                    {activities.map((activity, index) => (
                      <div key={index} className="activity-item">
                        <div className="activity-icon"></div>
                        <div className="activity-content">
                          <p><strong>{activity.description}</strong></p>
                          <span>
                            {activity.date.toLocaleDateString()} • {activity.area}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        );
      default:
        return (
          <div className="content-section">
            <h2>{sidebarItems.find(item => item.id === activeSection)?.label}</h2>
            <div className="coming-soon">
              <div className="coming-soon-icon"></div>
              <h3>Coming Soon</h3>
              <p>This feature is currently under development. Stay tuned!</p>
            </div>
          </div>
        );
    }
  };

  // Show loading screen during initial data fetch
  if (initialLoading) {
    return (
      <div className="profile">
        <Navbar />
        <div className="profile-container">
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <h2>Loading your profile...</h2>
            <p>Please wait while we fetch your information.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="profile">
      <Navbar />
      
      <div className="profile-container">
      <div className="profile-header farmer-profile-header">
        <div className="header-content">
          <h1><FarmerIcon size={24} /> Farmer Profile</h1>
          <p>Manage your agricultural profile, farm details, and account settings</p>
          {profileData?.metadata && (
            <div className="profile-completion">
              <div className="completion-bar">
                <div 
                  className="completion-fill" 
                  style={{ width: `${profileData.metadata.completionPercentage || 0}%` }}
                ></div>
              </div>
              <span className="completion-text">
                <TargetIcon size={16} /> {profileData.metadata.completionPercentage || 0}% Complete
              </span>
            </div>
          )}
        </div>
        <div className="user-info">
          <span>
            <CelebrationIcon size={18} /> Welcome, {personalInfo.firstName || profileData?.userId?.fullName?.firstName || 'Farmer'}!
          </span>
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
