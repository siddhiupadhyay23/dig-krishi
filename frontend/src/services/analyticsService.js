import api from './api';

class AnalyticsService {
  // Get comprehensive farm analytics data
  async getFarmAnalytics() {
    try {
      console.log('AnalyticsService: Fetching farm analytics data...');
      const response = await api.get('/analytics/farm');
      console.log('AnalyticsService: Analytics data received:', response.data);
      return response.data;
    } catch (error) {
      console.error('AnalyticsService: Failed to fetch analytics:', error);
      throw this.handleError(error);
    }
  }

  // Calculate analytics from profile data (client-side calculation as fallback)
  calculateAnalyticsFromProfile(profileData) {
    if (!profileData || !profileData.profile) {
      return this.getDefaultAnalytics();
    }

    const profile = profileData.profile;
    const crops = profile.cropsGrown || [];
    const activeCrops = crops.filter(crop => crop.isActive);
    const landSize = profile.landDetails?.totalLandSize?.value || 0;
    const landUnit = profile.landDetails?.totalLandSize?.unit || 'acres';

    return {
      // Basic Farm Metrics
      farmMetrics: {
        totalLandSize: {
          value: landSize,
          unit: landUnit,
          hectares: this.convertToHectares(landSize, landUnit)
        },
        activeCrops: activeCrops.length,
        totalCrops: crops.length,
        farmingExperience: profile.farmingExperience?.yearsOfExperience || 0,
        farmingMethod: profile.farmingExperience?.farmingType || 'traditional',
        landType: profile.landDetails?.landType || 'unknown',
        soilType: profile.landDetails?.soilType || 'unknown'
      },

      // Crop Analytics
      cropAnalytics: {
        cropDiversity: this.calculateCropDiversity(activeCrops),
        seasonalDistribution: this.calculateSeasonalDistribution(activeCrops),
        cropTypes: this.calculateCropTypes(activeCrops),
        landUtilization: this.calculateLandUtilization(activeCrops, landSize, landUnit)
      },

      // Estimated Yields and Revenue (based on Kerala averages)
      yieldEstimates: this.calculateYieldEstimates(activeCrops, landSize, landUnit),

      // Farming Efficiency Metrics
      efficiencyMetrics: this.calculateEfficiencyMetrics(profile),

      // Recent Activities (mock data for now - would come from activity tracking)
      recentActivities: this.generateMockActivities(activeCrops),

      // Recommendations based on profile data
      recommendations: this.generateRecommendations(profile),

      // Profile completion and data quality
      dataQuality: this.assessDataQuality(profileData)
    };
  }

  // Convert different land units to hectares for standardized calculations
  convertToHectares(value, unit) {
    if (!value) return 0;
    
    const conversionRates = {
      'acres': 0.4047,
      'hectares': 1,
      'bigha': 0.25, // Approximate, varies by region
      'guntha': 0.01, // Approximate
      'square_feet': 0.0000929,
      'square_meters': 0.0001
    };
    
    return (value * (conversionRates[unit] || 1)).toFixed(2);
  }

  // Calculate crop diversity index
  calculateCropDiversity(crops) {
    if (crops.length === 0) return 0;
    if (crops.length === 1) return 25; // Low diversity
    if (crops.length <= 3) return 60; // Medium diversity
    return 90; // High diversity
  }

  // Calculate seasonal distribution of crops
  calculateSeasonalDistribution(crops) {
    const distribution = {
      kharif: 0,
      rabi: 0,
      zaid: 0,
      year_round: 0
    };

    crops.forEach(crop => {
      const season = crop.season || 'kharif';
      distribution[season]++;
    });

    return distribution;
  }

  // Calculate crop type distribution
  calculateCropTypes(crops) {
    const types = {
      food_grain: 0,
      cash_crop: 0,
      plantation: 0,
      horticulture: 0,
      spices: 0,
      other: 0
    };

    crops.forEach(crop => {
      const type = crop.cropType || 'other';
      types[type]++;
    });

    return types;
  }

  // Calculate land utilization percentage
  calculateLandUtilization(crops, totalLand, landUnit) {
    let allocatedLand = 0;
    
    crops.forEach(crop => {
      if (crop.areaAllocated?.value) {
        // Convert to same unit as total land
        const cropArea = this.convertLandUnit(
          crop.areaAllocated.value, 
          crop.areaAllocated.unit, 
          landUnit
        );
        allocatedLand += cropArea;
      }
    });

    const utilizationPercentage = totalLand > 0 ? Math.min((allocatedLand / totalLand) * 100, 100) : 0;
    
    return {
      totalLand,
      allocatedLand: allocatedLand.toFixed(2),
      utilizationPercentage: utilizationPercentage.toFixed(1),
      availableLand: Math.max(0, totalLand - allocatedLand).toFixed(2)
    };
  }

  // Convert between different land units
  convertLandUnit(value, fromUnit, toUnit) {
    if (fromUnit === toUnit) return value;
    
    // Convert to hectares first, then to target unit
    const hectares = this.convertToHectares(value, fromUnit);
    const conversionRates = {
      'acres': 2.471, // hectares to acres
      'hectares': 1,
      'bigha': 4, // approximate
      'guntha': 100, // approximate
      'square_feet': 10764,
      'square_meters': 10000
    };
    
    return hectares * (conversionRates[toUnit] || 1);
  }

  // Calculate yield estimates based on crop types and Kerala averages
  calculateYieldEstimates(crops, landSize, landUnit) {
    // Kerala average yields per hectare (approximate)
    const yieldRates = {
      'rice': { yield: 3.5, unit: 'tons', price: 25000 }, // per hectare
      'coconut': { yield: 80, unit: 'nuts/tree', price: 500 }, // per tree, 130 trees/hectare
      'pepper': { yield: 2.5, unit: 'kg', price: 800 },
      'cardamom': { yield: 250, unit: 'kg', price: 1500 },
      'rubber': { yield: 1800, unit: 'kg', price: 180 },
      'banana': { yield: 40, unit: 'tons', price: 15000 },
      'tea': { yield: 2200, unit: 'kg', price: 200 },
      'coffee': { yield: 800, unit: 'kg', price: 350 },
      'cashew': { yield: 1000, unit: 'kg', price: 150 },
      'ginger': { yield: 8, unit: 'tons', price: 40000 },
      'turmeric': { yield: 4, unit: 'tons', price: 80000 },
      'default': { yield: 2, unit: 'tons', price: 20000 }
    };

    let totalEstimatedYield = 0;
    let totalEstimatedRevenue = 0;
    const cropEstimates = [];

    const totalHectares = this.convertToHectares(landSize, landUnit);

    crops.forEach(crop => {
      const cropName = crop.cropName.toLowerCase();
      const rates = yieldRates[cropName] || yieldRates['default'];
      
      // Calculate area for this crop (assume equal distribution if not specified)
      let cropHectares = totalHectares / crops.length;
      if (crop.areaAllocated?.value) {
        cropHectares = this.convertToHectares(crop.areaAllocated.value, crop.areaAllocated.unit);
      }

      const estimatedYield = rates.yield * cropHectares;
      const estimatedRevenue = estimatedYield * rates.price;

      cropEstimates.push({
        cropName: crop.cropName,
        area: cropHectares,
        estimatedYield,
        unit: rates.unit,
        pricePerUnit: rates.price,
        estimatedRevenue
      });

      totalEstimatedYield += estimatedYield;
      totalEstimatedRevenue += estimatedRevenue;
    });

    return {
      totalEstimatedYield: totalEstimatedYield.toFixed(2),
      totalEstimatedRevenue: Math.round(totalEstimatedRevenue),
      cropWiseEstimates: cropEstimates
    };
  }

  // Calculate farming efficiency metrics
  calculateEfficiencyMetrics(profile) {
    const landSize = profile.landDetails?.totalLandSize?.value || 0;
    const crops = profile.cropsGrown?.filter(crop => crop.isActive) || [];
    const experience = profile.farmingExperience?.yearsOfExperience || 0;

    // Calculate efficiency scores (0-100)
    const landEfficiency = landSize > 0 ? Math.min(crops.length * 25, 100) : 0;
    const experienceScore = Math.min(experience * 5, 100);
    const diversificationScore = this.calculateCropDiversity(crops);
    
    const overallEfficiency = Math.round(
      (landEfficiency * 0.3 + experienceScore * 0.4 + diversificationScore * 0.3)
    );

    return {
      overallEfficiency,
      landEfficiency: Math.round(landEfficiency),
      experienceScore: Math.round(experienceScore),
      diversificationScore,
      waterUsageEfficiency: 75, // Would be calculated from actual usage data
      soilHealthScore: 80 // Would come from soil testing data
    };
  }

  // Generate mock recent activities (would be replaced with actual activity tracking)
  generateMockActivities(crops) {
    if (crops.length === 0) return [];

    const activities = [
      {
        type: 'planting',
        description: `Planted ${crops[0]?.cropName || 'crops'} seeds`,
        date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
        area: '2.5 acres',
        status: 'completed'
      },
      {
        type: 'irrigation',
        description: 'Applied irrigation to all crops',
        date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
        area: 'All crops',
        status: 'completed'
      }
    ];

    if (crops.length > 1) {
      activities.push({
        type: 'harvesting',
        description: `Harvested ${crops[1]?.cropName || 'secondary crop'}`,
        date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 1 week ago
        area: '25 kg',
        status: 'completed'
      });
    }

    return activities;
  }

  // Generate recommendations based on profile data
  generateRecommendations(profile) {
    const recommendations = [];
    const landSize = profile.landDetails?.totalLandSize?.value || 0;
    const crops = profile.cropsGrown?.filter(crop => crop.isActive) || [];
    const location = profile.location || {};

    // Crop diversification recommendation
    if (crops.length < 2) {
      recommendations.push({
        type: 'diversification',
        priority: 'high',
        title: 'Improve Crop Diversification',
        description: 'Consider growing 2-3 different crops to reduce risk and improve soil health.',
        action: 'Add more crops in the Farm Details section'
      });
    }

    // Land utilization recommendation
    if (landSize > 2 && crops.length < 3) {
      recommendations.push({
        type: 'land_use',
        priority: 'medium',
        title: 'Optimize Land Utilization',
        description: 'With your farm size, you could grow more varieties of crops for better returns.',
        action: 'Consider adding plantation crops or horticulture'
      });
    }

    // Kerala-specific recommendations
    if (location.state?.toLowerCase().includes('kerala')) {
      if (!crops.some(crop => crop.cropName.toLowerCase().includes('spice'))) {
        recommendations.push({
          type: 'regional',
          priority: 'medium',
          title: 'Consider Spice Cultivation',
          description: 'Kerala climate is excellent for spices like cardamom, pepper, and ginger.',
          action: 'Explore spice crops suitable for your area'
        });
      }
    }

    return recommendations;
  }

  // Assess data quality and completeness
  assessDataQuality(profileData) {
    const profile = profileData.profile;
    let score = 0;
    const maxScore = 100;
    
    // Profile completion
    if (profileData.completionPercentage) {
      score += profileData.completionPercentage * 0.6; // 60% weight
    }

    // Crops data quality
    const crops = profile.cropsGrown || [];
    if (crops.length > 0) {
      score += 20; // 20% for having crops
      
      // Check if area allocation is specified
      const cropsWithArea = crops.filter(crop => crop.areaAllocated?.value);
      if (cropsWithArea.length > 0) {
        score += 10; // 10% for area data
      }
    }

    // Location specificity
    if (profile.location?.district) {
      score += 10; // 10% for detailed location
    }

    const qualityLevel = score >= 90 ? 'excellent' : 
                        score >= 70 ? 'good' : 
                        score >= 50 ? 'fair' : 'poor';

    return {
      score: Math.round(Math.min(score, maxScore)),
      level: qualityLevel,
      completionPercentage: profileData.completionPercentage || 0,
      missingData: this.identifyMissingData(profile)
    };
  }

  // Identify what profile data is missing for better analytics
  identifyMissingData(profile) {
    const missing = [];

    if (!profile.landDetails?.totalLandSize?.value) {
      missing.push('Farm land size');
    }

    if (!profile.landDetails?.soilType) {
      missing.push('Soil type information');
    }

    if (!profile.cropsGrown || profile.cropsGrown.length === 0) {
      missing.push('Crop information');
    } else {
      const cropsWithoutArea = profile.cropsGrown.filter(crop => 
        crop.isActive && !crop.areaAllocated?.value
      );
      if (cropsWithoutArea.length > 0) {
        missing.push('Area allocation for crops');
      }
    }

    if (!profile.farmingExperience?.yearsOfExperience) {
      missing.push('Farming experience details');
    }

    if (!profile.location?.district) {
      missing.push('Detailed location (district)');
    }

    return missing;
  }

  // Get default analytics when no data is available
  getDefaultAnalytics() {
    return {
      farmMetrics: {
        totalLandSize: { value: 0, unit: 'acres', hectares: 0 },
        activeCrops: 0,
        totalCrops: 0,
        farmingExperience: 0,
        farmingMethod: 'unknown',
        landType: 'unknown',
        soilType: 'unknown'
      },
      cropAnalytics: {
        cropDiversity: 0,
        seasonalDistribution: { kharif: 0, rabi: 0, zaid: 0, year_round: 0 },
        cropTypes: { food_grain: 0, cash_crop: 0, plantation: 0, horticulture: 0, spices: 0, other: 0 },
        landUtilization: { totalLand: 0, allocatedLand: 0, utilizationPercentage: 0, availableLand: 0 }
      },
      yieldEstimates: {
        totalEstimatedYield: 0,
        totalEstimatedRevenue: 0,
        cropWiseEstimates: []
      },
      efficiencyMetrics: {
        overallEfficiency: 0,
        landEfficiency: 0,
        experienceScore: 0,
        diversificationScore: 0,
        waterUsageEfficiency: 0,
        soilHealthScore: 0
      },
      recentActivities: [],
      recommendations: [{
        type: 'setup',
        priority: 'high',
        title: 'Complete Your Profile',
        description: 'Add your farm details and crops to get personalized analytics and recommendations.',
        action: 'Go to Profile Setup'
      }],
      dataQuality: {
        score: 0,
        level: 'poor',
        completionPercentage: 0,
        missingData: ['All profile data']
      }
    };
  }

  // Handle API errors consistently
  handleError(error) {
    if (error.response) {
      return {
        message: error.response.data.message || 'Analytics service error',
        status: error.response.status,
        data: error.response.data
      };
    } else if (error.request) {
      return {
        message: 'Network error - please check your connection',
        status: 0,
        data: null
      };
    } else {
      return {
        message: error.message || 'An unexpected error occurred',
        status: 0,
        data: null
      };
    }
  }
}

// Export singleton instance
export default new AnalyticsService();
