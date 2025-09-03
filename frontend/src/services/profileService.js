import api from './api';

class ProfileService {
  // Get user profile data
  async getProfile() {
    try {
      console.log('ProfileService: Making API call to fetch profile...');
      const response = await api.get('/profile');
      console.log('ProfileService: API response received:', response);
      console.log('ProfileService: Response data:', response.data);
      return response.data;
    } catch (error) {
      console.error('ProfileService: API call failed:', error);
      console.error('ProfileService: Error details:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        message: error.message
      });
      throw this.handleError(error);
    }
  }

  // Update personal information (phone number)
  async updatePersonalInfo(data) {
    try {
      const response = await api.put('/profile/personal-info', {
        phoneNumber: data.phone,
        profilePhoto: data.profilePhoto
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Update location information
  async updateLocation(data) {
    try {
      // Use the comprehensive farm details endpoint for location updates
      const response = await api.put('/profile/farm-details', {
        state: data.state,
        city: data.city,
        district: data.district, // Optional
        pincode: data.pincode
      });
      
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Update complete farm details
  async updateFarmDetails(data) {
    try {
      const requestData = {
        farmName: data.farmName,
        landSize: data.farmSize,
        unit: data.farmSizeUnit || 'acres',
        landType: data.landType,
        soilType: data.soilType,
        state: data.state,
        city: data.city,
        district: data.district || null, // District is optional
        pincode: data.pincode || null, // Pincode is optional
        primaryCrops: data.primaryCrops, // Array of selected primary crops
        secondaryCrops: data.secondaryCrops, // Array of selected secondary crops
        customPrimaryCrops: data.customPrimaryCrops, // Custom primary crops string
        customSecondaryCrops: data.customSecondaryCrops, // Custom secondary crops string
        experience: data.experience,
        farmingMethod: data.farmingMethod
      };
      
      console.log('ProfileService: Sending farm details data:', requestData);
      console.log('ProfileService: Primary crops:', data.primaryCrops);
      console.log('ProfileService: Secondary crops:', data.secondaryCrops);
      
      const response = await api.put('/profile/farm-details', requestData);
      console.log('ProfileService: Farm details update response:', response.data);
      return response.data;
    } catch (error) {
      console.error('ProfileService: Farm details update error:', error);
      throw this.handleError(error);
    }
  }

  // Update crops information
  async updateCrops(crops) {
    try {
      const response = await api.post('/profile/crops', {
        crops: crops
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Add a new crop
  async addCrop(cropData) {
    try {
      // First get current profile to get existing crops
      const currentProfile = await this.getProfile();
      const existingCrops = currentProfile.profile.cropsGrown || [];
      
      // Add new crop to existing crops
      const updatedCrops = [...existingCrops, {
        cropName: cropData.cropName,
        cropType: cropData.cropType || 'other',
        season: cropData.season || 'kharif',
        areaAllocated: cropData.areaAllocated || null,
        unit: cropData.unit || 'acres'
      }];
      
      return await this.updateCrops(updatedCrops);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Remove a crop
  async removeCrop(cropIndex) {
    try {
      // First get current profile to get existing crops
      const currentProfile = await this.getProfile();
      const existingCrops = currentProfile.profile.cropsGrown || [];
      
      // Remove crop at specified index
      const updatedCrops = existingCrops.filter((_, index) => index !== cropIndex);
      
      return await this.updateCrops(updatedCrops);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Update farming experience
  async updateFarmingExperience(data) {
    try {
      // This endpoint doesn't exist in the backend yet, but we can extend it
      // For now, we'll store it in the land details update
      const response = await api.post('/profile/land-size', {
        farmingExperience: {
          yearsOfExperience: data.yearsOfExperience,
          farmingType: data.farmingType
        }
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Handle API errors consistently
  handleError(error) {
    if (error.response) {
      // Server responded with error status
      return {
        message: error.response.data.message || 'An error occurred',
        status: error.response.status,
        data: error.response.data
      };
    } else if (error.request) {
      // Request was made but no response received
      return {
        message: 'Network error - please check your connection',
        status: 0,
        data: null
      };
    } else {
      // Something else happened
      return {
        message: error.message || 'An unexpected error occurred',
        status: 0,
        data: null
      };
    }
  }

  // Helper method to format profile data for frontend use
  formatProfileData(backendProfile) {
    const profile = backendProfile.profile;
    
    // Map years to experience level
    const mapYearsToExperience = (years) => {
      if (!years) return '';
      if (years <= 2) return 'beginner';
      if (years <= 10) return 'intermediate';
      return 'experienced';
    };

    // Map backend farming type to frontend farming method
    const mapFarmingType = (type) => {
      const typeMap = {
        'organic': 'organic',
        'traditional': 'conventional',
        'mixed': 'mixed',
        'modern': 'sustainable'
      };
      return typeMap[type] || type || '';
    };

    // Extract crops and separate into primary/secondary and predefined/custom
    const crops = profile.cropsGrown || [];
    const predefinedCrops = ['rice', 'wheat', 'coconut', 'pepper', 'cardamom', 'rubber', 'banana', 'sugarcane', 'tea', 'coffee', 'cotton', 'vegetables', 'fruits', 'spices', 'mango', 'cashew', 'areca', 'ginger', 'turmeric'];
    
    let primaryCrops = [];
    let secondaryCrops = [];
    let customPrimaryCrops = '';
    let customSecondaryCrops = '';
    
    // Since backend stores all crops in one array, we need a way to distinguish
    // For now, we'll assume:
    // - First crop is primary
    // - Rest are secondary
    // This is a temporary solution until we add crop type distinction in backend
    
    const predefinedPrimaryCropsList = [];
    const customPrimaryCropsList = [];
    const predefinedSecondaryCropsList = [];
    const customSecondaryCropsList = [];
    
    crops.forEach((crop, index) => {
      const cropName = crop.cropName.toLowerCase();
      const isPredefined = predefinedCrops.includes(cropName);
      
      if (index === 0) {
        // First crop is considered primary
        if (isPredefined) {
          predefinedPrimaryCropsList.push(cropName);
        } else {
          customPrimaryCropsList.push(crop.cropName);
        }
      } else {
        // Rest are considered secondary
        if (isPredefined) {
          predefinedSecondaryCropsList.push(cropName);
        } else {
          customSecondaryCropsList.push(crop.cropName);
        }
      }
    });
    
    // Set primary crops
    primaryCrops = predefinedPrimaryCropsList;
    if (customPrimaryCropsList.length > 0) {
      primaryCrops.push('other');
      customPrimaryCrops = customPrimaryCropsList.join(', ');
    }
    
    // Set secondary crops
    secondaryCrops = predefinedSecondaryCropsList;
    if (customSecondaryCropsList.length > 0) {
      secondaryCrops.push('other');
      customSecondaryCrops = customSecondaryCropsList.join(', ');
    }
    
    return {
      // Personal Information
      personalInfo: {
        firstName: profile.userId?.fullName?.firstName || '',
        lastName: profile.userId?.fullName?.lastName || '',
        email: profile.userId?.email || '',
        phone: profile.phoneNumber || '',
        // Separate location fields
        city: profile.location?.city || '',
        state: profile.location?.state || '',
        district: profile.location?.district || '', // Optional field
        pincode: profile.location?.pincode || '',
        // Combined location for display
        location: `${profile.location?.city || ''}, ${profile.location?.district || ''}, ${profile.location?.state || ''}`.replace(/^,\s*|,\s*$/g, '').replace(/,\s*,/g, ',')
      },
      
      // Farm Details
      farmInfo: {
        farmName: profile.landDetails?.farmName || '', // Now supported in backend
        farmSize: profile.landDetails?.totalLandSize?.value || '',
        farmSizeUnit: profile.landDetails?.totalLandSize?.unit || 'acres',
        landType: profile.landDetails?.landType || '',
        soilType: profile.landDetails?.soilType || '',
        // Separate location fields
        city: profile.location?.city || '',
        state: profile.location?.state || '',
        district: profile.location?.district || '', // Optional field
        pincode: profile.location?.pincode || '',
        farmLocation: `${profile.location?.district || ''}, ${profile.location?.state || ''}`.replace(/^,\s*|,\s*$/g, ''),
        experience: mapYearsToExperience(profile.farmingExperience?.yearsOfExperience),
        farmingMethod: mapFarmingType(profile.farmingExperience?.farmingType),
        primaryCrops: primaryCrops,
        secondaryCrops: secondaryCrops,
        customPrimaryCrops: customPrimaryCrops,
        customSecondaryCrops: customSecondaryCrops
      },
      
      // Crops Data
      crops: (profile.cropsGrown || []).map(crop => ({
        cropName: crop.cropName,
        cropType: crop.cropType,
        season: crop.season,
        areaAllocated: crop.areaAllocated?.value,
        unit: crop.areaAllocated?.unit || 'acres',
        isActive: crop.isActive
      })),
      
      // Profile Metadata
      metadata: {
        completionPercentage: backendProfile.completionPercentage || 0,
        isProfileComplete: profile.profileCompletion?.isProfileComplete || false,
        nextStep: backendProfile.nextStep || 0,
        lastUpdated: profile.lastUpdated
      }
    };
  }
}

// Export singleton instance
export default new ProfileService();
