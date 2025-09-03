import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import Navbar from './Navbar';
import ProfileService from '../services/profileService';
import AnalyticsService from '../services/analyticsService';
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
    location: '' // Combined for display
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
    soilType: ''
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
    { value: 'rice', label: 'Rice (Paddy)', icon: '' },
    { value: 'coconut', label: 'Coconut', icon: '' },
    { value: 'pepper', label: 'Black Pepper', icon: '' },
    { value: 'cardamom', label: 'Cardamom', icon: '' },
    { value: 'rubber', label: 'Rubber', icon: '' },
    { value: 'banana', label: 'Banana', icon: '' },
    { value: 'tea', label: 'Tea', icon: '' },
    { value: 'coffee', label: 'Coffee', icon: '' },
    { value: 'cashew', label: 'Cashew', icon: '' },
    { value: 'areca', label: 'Areca Nut (Betel Nut)', icon: '' },
    { value: 'ginger', label: 'Ginger', icon: '' },
    { value: 'turmeric', label: 'Turmeric', icon: '' },
    { value: 'tapioca', label: 'Tapioca (Cassava)', icon: '' },
    { value: 'jackfruit', label: 'Jackfruit', icon: '' },
    { value: 'mango', label: 'Mango', icon: '' },
    { value: 'plantain', label: 'Plantain', icon: '' },
    { value: 'cocoa', label: 'Cocoa', icon: '' },
    { value: 'nutmeg', label: 'Nutmeg', icon: '' },
    { value: 'clove', label: 'Clove', icon: '' },
    { value: 'cinnamon', label: 'Cinnamon', icon: '' },
    { value: 'vanilla', label: 'Vanilla', icon: '' },
    { value: 'pineapple', label: 'Pineapple', icon: '' },
    { value: 'papaya', label: 'Papaya', icon: '' },
    { value: 'curry_leaves', label: 'Curry Leaves', icon: '' },
    { value: 'vegetables', label: 'Mixed Vegetables', icon: '' },
    { value: 'other', label: 'Other Crops (specify)', icon: '+' }
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
    { id: 'personal', label: 'Personal Info', icon: '' },
    { id: 'farm', label: 'Farm Details', icon: '' },
    { id: 'crops', label: 'My Crops', icon: '' },
    { id: 'analytics', label: 'Farm Analytics', icon: '' },
    { id: 'settings', label: 'Settings', icon: '' },
    { id: 'support', label: 'Help & Support', icon: '' }
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
        <div className="profile-header">
          <div className="header-content">
            <h1>Farmer Profile</h1>
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
                  {profileData.metadata.completionPercentage || 0}% Complete
                </span>
              </div>
            )}
          </div>
          <div className="user-info">
            <span>
              Welcome, {personalInfo.firstName || profileData?.userId?.fullName?.firstName || 'Farmer'}!
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
