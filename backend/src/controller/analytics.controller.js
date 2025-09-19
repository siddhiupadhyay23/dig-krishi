const profileModel = require("../models/profile.model");
const userModel = require("../models/user.model");

// Get comprehensive farm analytics
async function getFarmAnalytics(req, res) {
    try {
        const userId = req.user.id;
        
        // Get complete profile data
        const profile = await profileModel.findOne({ userId }).populate('userId', 'email fullName');
        
        if (!profile) {
            return res.status(404).json({
                message: "Profile not found. Please complete your profile setup first."
            });
        }

        // Calculate analytics from profile data
        const analyticsData = calculateFarmAnalytics(profile);
        
        res.status(200).json({
            message: "Farm analytics retrieved successfully",
            analytics: analyticsData,
            dataQuality: assessDataQuality(profile),
            lastUpdated: profile.lastUpdated
        });
    } catch (error) {
        console.error('Get farm analytics error:', error);
        res.status(500).json({
            message: "Internal server error",
            error: error.message
        });
    }
}

// Calculate comprehensive farm analytics from profile data
function calculateFarmAnalytics(profile) {
    const crops = profile.cropsGrown || [];
    const activeCrops = crops.filter(crop => crop.isActive);
    const landSize = profile.landDetails?.totalLandSize?.value || 0;
    const landUnit = profile.landDetails?.totalLandSize?.unit || 'acres';
    const landDetails = profile.landDetails || {};
    const location = profile.location || {};

    return {
        // Enhanced Farm Metrics with all collected data
        farmMetrics: {
            totalLandSize: {
                value: landSize,
                unit: landUnit,
                hectares: convertToHectares(landSize, landUnit)
            },
            activeCrops: activeCrops.length,
            totalCrops: crops.length,
            farmingExperience: profile.farmingExperience?.yearsOfExperience || 0,
            farmingMethod: profile.farmingExperience?.farmingType || 'traditional',
            landType: landDetails.landType || 'unknown',
            soilType: landDetails.soilType || 'unknown',
            farmName: landDetails.farmName || 'Unnamed Farm',
            // Additional farm infrastructure metrics
            infrastructure: {
                hasWarehouses: landDetails.farmingInfrastructure?.hasWarehouses || false,
                warehouseCapacity: landDetails.farmingInfrastructure?.warehouseCapacity || 0,
                hasProcessingUnits: landDetails.farmingInfrastructure?.hasProcessingUnits || false,
                electricity: landDetails.farmingInfrastructure?.electricity || 'unknown',
                farmRoads: landDetails.farmingInfrastructure?.farmRoads || 'unknown',
                nearestMarketDistance: landDetails.farmingInfrastructure?.nearestMarketDistance || null
            },
            // Water and irrigation details
            irrigation: {
                source: landDetails.waterIrrigation?.irrigationSource || landDetails.waterSource || 'unknown',
                method: landDetails.waterIrrigation?.irrigationMethod || 'unknown',
                availability: landDetails.waterIrrigation?.waterAvailability || 'unknown'
            },
            // Equipment access
            equipment: {
                tractorAccess: landDetails.equipmentInputs?.tractorAccess || 'unknown',
                pumpSetAccess: landDetails.equipmentInputs?.pumpSetAccess || 'unknown',
                machinery: landDetails.farmingInfrastructure?.machinery || []
            }
        },

        // Enhanced Crop Analytics
        cropAnalytics: {
            cropDiversity: calculateCropDiversity(activeCrops),
            seasonalDistribution: calculateSeasonalDistribution(activeCrops),
            cropTypes: calculateCropTypeDistribution(activeCrops),
            landUtilization: calculateLandUtilization(activeCrops, landSize, landUnit)
        },

        // Enhanced Yield Estimates using farm details
        yieldEstimates: calculateEnhancedYieldEstimates(activeCrops, landSize, landUnit, profile),

        // Enhanced Farming Efficiency Metrics
        efficiencyMetrics: calculateEnhancedEfficiencyMetrics(profile),

        // Soil Health Analysis
        soilAnalysis: calculateSoilAnalysis(landDetails),

        // Economic Analysis
        economicAnalysis: calculateEconomicAnalysis(landDetails, activeCrops),

        // Infrastructure Score
        infrastructureScore: calculateInfrastructureScore(landDetails),

        // Recent Activities (generated based on crop data)
        recentActivities: generateActivities(activeCrops),

        // Enhanced Recommendations based on all profile data
        recommendations: generateEnhancedRecommendations(profile),

        // Location-based insights
        locationInsights: generateLocationInsights(location)
    };
}

// Convert different land units to hectares for standardized calculations
function convertToHectares(value, unit) {
    if (!value) return 0;
    
    const conversionRates = {
        'acres': 0.4047,
        'hectares': 1,
        'bigha': 0.25, // Approximate, varies by region
        'guntha': 0.01, // Approximate
        'square_feet': 0.0000929,
        'square_meters': 0.0001
    };
    
    return Number((value * (conversionRates[unit] || 1)).toFixed(2));
}

// Calculate crop diversity index
function calculateCropDiversity(crops) {
    if (crops.length === 0) return 0;
    if (crops.length === 1) return 25; // Low diversity
    if (crops.length <= 3) return 60; // Medium diversity
    if (crops.length <= 5) return 80; // Good diversity
    return 95; // High diversity
}

// Calculate seasonal distribution of crops
function calculateSeasonalDistribution(crops) {
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
function calculateCropTypeDistribution(crops) {
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
function calculateLandUtilization(crops, totalLand, landUnit) {
    let allocatedLand = 0;
    
    crops.forEach(crop => {
        if (crop.areaAllocated?.value) {
            // Convert to same unit as total land
            const cropArea = convertLandUnit(
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
        allocatedLand: Number(allocatedLand.toFixed(2)),
        utilizationPercentage: Number(utilizationPercentage.toFixed(1)),
        availableLand: Number(Math.max(0, totalLand - allocatedLand).toFixed(2))
    };
}

// Convert between different land units
function convertLandUnit(value, fromUnit, toUnit) {
    if (fromUnit === toUnit) return value;
    
    // Convert to hectares first, then to target unit
    const hectares = convertToHectares(value, fromUnit);
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

// Calculate yield estimates based on crop types and regional averages
function calculateYieldEstimates(crops, landSize, landUnit) {
    // Kerala/India average yields per hectare (approximate)
    const yieldRates = {
        'rice': { yield: 3.5, unit: 'tons', price: 25000 },
        'coconut': { yield: 10400, unit: 'nuts', price: 15 }, // 130 trees/hectare, 80 nuts/tree
        'pepper': { yield: 2.5, unit: 'tons', price: 800000 },
        'cardamom': { yield: 250, unit: 'kg', price: 1500 },
        'rubber': { yield: 1.8, unit: 'tons', price: 180000 },
        'banana': { yield: 40, unit: 'tons', price: 15000 },
        'tea': { yield: 2.2, unit: 'tons', price: 200000 },
        'coffee': { yield: 800, unit: 'kg', price: 350 },
        'cashew': { yield: 1000, unit: 'kg', price: 150 },
        'ginger': { yield: 8, unit: 'tons', price: 40000 },
        'turmeric': { yield: 4, unit: 'tons', price: 80000 },
        'areca': { yield: 1200, unit: 'kg', price: 300 },
        'tapioca': { yield: 25, unit: 'tons', price: 8000 },
        'jackfruit': { yield: 15, unit: 'tons', price: 20000 },
        'mango': { yield: 12, unit: 'tons', price: 25000 },
        'plantain': { yield: 30, unit: 'tons', price: 12000 },
        'default': { yield: 2, unit: 'tons', price: 20000 }
    };

    let totalEstimatedYield = 0;
    let totalEstimatedRevenue = 0;
    const cropEstimates = [];

    const totalHectares = convertToHectares(landSize, landUnit);

    crops.forEach(crop => {
        const cropName = crop.cropName.toLowerCase();
        const rates = yieldRates[cropName] || yieldRates['default'];
        
        // Calculate area for this crop (assume equal distribution if not specified)
        let cropHectares = totalHectares / crops.length;
        if (crop.areaAllocated?.value) {
            cropHectares = convertToHectares(crop.areaAllocated.value, crop.areaAllocated.unit);
        }

        const estimatedYield = rates.yield * cropHectares;
        const estimatedRevenue = estimatedYield * rates.price;

        cropEstimates.push({
            cropName: crop.cropName,
            area: Number(cropHectares.toFixed(2)),
            estimatedYield: Number(estimatedYield.toFixed(2)),
            unit: rates.unit,
            pricePerUnit: rates.price,
            estimatedRevenue: Math.round(estimatedRevenue)
        });

        // For total calculations, convert everything to standard units
        if (rates.unit === 'kg') {
            totalEstimatedYield += estimatedYield / 1000; // Convert kg to tons
        } else {
            totalEstimatedYield += estimatedYield;
        }
        totalEstimatedRevenue += estimatedRevenue;
    });

    return {
        totalEstimatedYield: Number(totalEstimatedYield.toFixed(2)),
        totalEstimatedRevenue: Math.round(totalEstimatedRevenue),
        cropWiseEstimates: cropEstimates
    };
}

// Calculate farming efficiency metrics
function calculateEfficiencyMetrics(profile) {
    const landSize = profile.landDetails?.totalLandSize?.value || 0;
    const crops = profile.cropsGrown?.filter(crop => crop.isActive) || [];
    const experience = profile.farmingExperience?.yearsOfExperience || 0;
    const farmingType = profile.farmingExperience?.farmingType || 'traditional';

    // Calculate efficiency scores (0-100)
    const landEfficiency = landSize > 0 ? Math.min(crops.length * 20, 100) : 0;
    const experienceScore = Math.min(experience * 5, 100);
    const diversificationScore = calculateCropDiversity(crops);
    
    // Farming method bonus
    const methodBonus = {
        'organic': 10,
        'modern': 8,
        'mixed': 6,
        'traditional': 0
    }[farmingType] || 0;
    
    const overallEfficiency = Math.min(Math.round(
        (landEfficiency * 0.3 + experienceScore * 0.4 + diversificationScore * 0.3) + methodBonus
    ), 100);

    return {
        overallEfficiency,
        landEfficiency: Math.round(landEfficiency),
        experienceScore: Math.round(experienceScore),
        diversificationScore,
        methodBonus,
        waterUsageEfficiency: 75, // Would be calculated from actual usage data
        soilHealthScore: getSoilHealthScore(profile.landDetails?.soilType)
    };
}

// Get soil health score based on soil type
function getSoilHealthScore(soilType) {
    const soilScores = {
        'loamy': 95,
        'alluvial': 90,
        'black_soil': 85,
        'red_soil': 70,
        'clay': 60,
        'sandy': 50,
        'other': 65
    };
    
    return soilScores[soilType] || 65;
}

// Generate activities based on crop data
function generateActivities(crops) {
    const activities = [];
    
    if (crops.length === 0) return activities;

    // Generate activities based on crops and seasons
    const now = new Date();
    
    crops.forEach((crop, index) => {
        // Planting activity
        activities.push({
            type: 'planting',
            description: `Planted ${crop.cropName} seeds`,
            date: new Date(now - (index + 1) * 2 * 24 * 60 * 60 * 1000), // Stagger by 2 days
            area: crop.areaAllocated?.value ? 
                `${crop.areaAllocated.value} ${crop.areaAllocated.unit}` : 
                'Area not specified',
            status: 'completed',
            cropName: crop.cropName
        });
    });

    // Add irrigation activity
    activities.push({
        type: 'irrigation',
        description: 'Applied irrigation to all crops',
        date: new Date(now - 5 * 24 * 60 * 60 * 1000), // 5 days ago
        area: 'All crops',
        status: 'completed',
        cropName: null
    });

    // Sort by date (most recent first)
    activities.sort((a, b) => b.date - a.date);
    
    // Return only the most recent 5 activities
    return activities.slice(0, 5);
}

// Generate recommendations based on profile data
function generateRecommendations(profile) {
    const recommendations = [];
    const landSize = profile.landDetails?.totalLandSize?.value || 0;
    const landUnit = profile.landDetails?.totalLandSize?.unit || 'acres';
    const crops = profile.cropsGrown?.filter(crop => crop.isActive) || [];
    const location = profile.location || {};
    const experience = profile.farmingExperience?.yearsOfExperience || 0;

    // Crop diversification recommendation
    if (crops.length < 2) {
        recommendations.push({
            type: 'diversification',
            priority: 'high',
            title: 'Improve Crop Diversification',
            description: 'Growing multiple crops reduces risk and improves soil health. Consider adding 2-3 different crop varieties.',
            action: 'Add more crops in the Farm Details section',
            impact: 'Reduces risk by 40-60%'
        });
    }

    // Land utilization recommendation
    const landInHectares = convertToHectares(landSize, landUnit);
    if (landInHectares > 2 && crops.length < 3) {
        recommendations.push({
            type: 'land_use',
            priority: 'medium',
            title: 'Optimize Land Utilization',
            description: `With ${landSize} ${landUnit} of land, you have potential to grow more crop varieties for better returns.`,
            action: 'Consider intercropping or adding complementary crops',
            impact: 'Potential 25-35% increase in revenue'
        });
    }

    // Experience-based recommendations
    if (experience < 3) {
        recommendations.push({
            type: 'education',
            priority: 'medium',
            title: 'Enhance Farming Knowledge',
            description: 'Consider participating in agricultural training programs to improve farming techniques.',
            action: 'Look for local agricultural extension programs',
            impact: 'Can improve yields by 15-25%'
        });
    }

    // Kerala-specific recommendations
    if (location.state?.toLowerCase().includes('kerala')) {
        const hasSpices = crops.some(crop => 
            ['pepper', 'cardamom', 'ginger', 'turmeric', 'cinnamon', 'clove', 'nutmeg'].includes(
                crop.cropName.toLowerCase()
            )
        );
        
        if (!hasSpices) {
            recommendations.push({
                type: 'regional',
                priority: 'medium',
                title: 'Consider High-Value Spice Crops',
                description: 'Kerala climate is excellent for spices like cardamom, pepper, and ginger which offer higher returns.',
                action: 'Explore spice cultivation suitable for your area',
                impact: 'Spices can offer 2-3x higher revenue per hectare'
            });
        }

        const hasPlantation = crops.some(crop => 
            ['coconut', 'rubber', 'areca', 'cashew'].includes(crop.cropName.toLowerCase())
        );
        
        if (!hasPlantation && landInHectares > 1) {
            recommendations.push({
                type: 'plantation',
                priority: 'low',
                title: 'Consider Plantation Crops',
                description: 'Coconut, rubber, and areca nut are well-suited for Kerala and provide long-term stable income.',
                action: 'Evaluate plantation crops for part of your land',
                impact: 'Long-term stable income source'
            });
        }
    }

    // Soil-specific recommendations
    const soilType = profile.landDetails?.soilType;
    if (soilType === 'sandy' && !crops.some(crop => crop.cropName.toLowerCase().includes('cashew'))) {
        recommendations.push({
            type: 'soil_specific',
            priority: 'low',
            title: 'Sandy Soil Optimization',
            description: 'Sandy soil is ideal for cashew cultivation. Consider this drought-resistant, profitable crop.',
            action: 'Explore cashew cultivation',
            impact: 'Better soil utilization and drought resilience'
        });
    }

    return recommendations;
}

// Generate location-based insights
function generateLocationInsights(location) {
    const insights = {
        climateZone: 'tropical', // Default for Kerala
        rainfall: 'high',
        suitableCrops: [],
        seasonalAdvice: []
    };

    if (location.state?.toLowerCase().includes('kerala')) {
        insights.climateZone = 'tropical_coastal';
        insights.rainfall = 'high_monsoon';
        insights.suitableCrops = [
            'rice', 'coconut', 'pepper', 'cardamom', 'rubber', 'banana',
            'tea', 'coffee', 'ginger', 'turmeric', 'areca'
        ];
        insights.seasonalAdvice = [
            {
                season: 'monsoon',
                advice: 'Ideal time for planting rice and other kharif crops',
                months: 'June-September'
            },
            {
                season: 'post_monsoon',
                advice: 'Good time for plantation crops and spice cultivation',
                months: 'October-December'
            },
            {
                season: 'summer',
                advice: 'Focus on irrigation and harvest of rabi crops',
                months: 'March-May'
            }
        ];
    }

    return insights;
}

// Assess data quality for analytics
function assessDataQuality(profile) {
    let score = 0;
    const maxScore = 100;
    const missingData = [];
    
    // Basic profile completion (40%)
    if (profile.userId?.email) score += 10;
    if (profile.phoneNumber) score += 10;
    if (profile.location?.state) score += 10;
    if (profile.location?.city) score += 10;

    // Farm details (40%)
    if (profile.landDetails?.farmName) score += 10;
    if (profile.landDetails?.totalLandSize?.value) {
        score += 15;
    } else {
        missingData.push('Farm land size');
    }
    if (profile.landDetails?.soilType) {
        score += 5;
    } else {
        missingData.push('Soil type information');
    }
    if (profile.landDetails?.landType) {
        score += 5;
    } else {
        missingData.push('Land type (irrigated/rain-fed)');
    }
    if (profile.farmingExperience?.yearsOfExperience) {
        score += 5;
    } else {
        missingData.push('Farming experience');
    }

    // Crops data (20%)
    const activeCrops = profile.cropsGrown?.filter(crop => crop.isActive) || [];
    if (activeCrops.length > 0) {
        score += 10;
        
        // Check if area allocation is specified for crops
        const cropsWithArea = activeCrops.filter(crop => crop.areaAllocated?.value);
        if (cropsWithArea.length > 0) {
            score += 5;
        } else {
            missingData.push('Area allocation for crops');
        }

        // Crop type information
        const cropsWithType = activeCrops.filter(crop => crop.cropType && crop.cropType !== 'other');
        if (cropsWithType.length > 0) {
            score += 5;
        } else {
            missingData.push('Crop type classification');
        }
    } else {
        missingData.push('Crop information');
    }

    // Location details bonus
    if (profile.location?.district) score += 5;
    if (profile.location?.pincode) score += 5;

    const qualityLevel = score >= 90 ? 'excellent' : 
                        score >= 70 ? 'good' : 
                        score >= 50 ? 'fair' : 'poor';

    return {
        score: Math.min(score, maxScore),
        level: qualityLevel,
        completionPercentage: profile.getCompletionPercentage(),
        missingData,
        recommendations: generateDataQualityRecommendations(missingData)
    };
}

// Generate recommendations for improving data quality
function generateDataQualityRecommendations(missingData) {
    const recommendations = [];
    
    missingData.forEach(missing => {
        switch (missing) {
            case 'Farm land size':
                recommendations.push({
                    field: 'landSize',
                    message: 'Add your farm size for accurate yield calculations',
                    section: 'farm'
                });
                break;
            case 'Soil type information':
                recommendations.push({
                    field: 'soilType',
                    message: 'Soil type helps provide crop-specific recommendations',
                    section: 'farm'
                });
                break;
            case 'Crop information':
                recommendations.push({
                    field: 'crops',
                    message: 'Add your crops to get personalized insights',
                    section: 'farm'
                });
                break;
            case 'Area allocation for crops':
                recommendations.push({
                    field: 'cropArea',
                    message: 'Specify area for each crop for precise yield estimates',
                    section: 'crops'
                });
                break;
        }
    });
    
    return recommendations;
}

// Get analytics summary (lighter endpoint)
async function getAnalyticsSummary(req, res) {
    try {
        const userId = req.user.id;
        
        const profile = await profileModel.findOne({ userId }).select('cropsGrown landDetails farmingExperience');
        
        if (!profile) {
            return res.status(404).json({
                message: "Profile not found"
            });
        }

        const activeCrops = profile.cropsGrown?.filter(crop => crop.isActive) || [];
        const landSize = profile.landDetails?.totalLandSize?.value || 0;

        const summary = {
            totalCrops: activeCrops.length,
            totalLandSize: landSize,
            landUnit: profile.landDetails?.totalLandSize?.unit || 'acres',
            experience: profile.farmingExperience?.yearsOfExperience || 0,
            cropDiversity: calculateCropDiversity(activeCrops),
            completionStatus: profile.profileCompletion?.isProfileComplete || false
        };
        
        res.status(200).json({
            message: "Analytics summary retrieved successfully",
            summary: summary
        });
    } catch (error) {
        console.error('Get analytics summary error:', error);
        res.status(500).json({
            message: "Internal server error",
            error: error.message
        });
    }
}

// Enhanced yield estimates using farm infrastructure and soil data
function calculateEnhancedYieldEstimates(crops, landSize, landUnit, profile) {
    const baseEstimates = calculateYieldEstimates(crops, landSize, landUnit);
    const landDetails = profile.landDetails || {};
    
    // Apply multipliers based on farm infrastructure
    let infrastructureMultiplier = 1.0;
    
    // Irrigation bonus
    const irrigationSource = landDetails.waterIrrigation?.irrigationSource || landDetails.waterSource;
    if (irrigationSource === 'borewell' || irrigationSource === 'canal') {
        infrastructureMultiplier += 0.15; // 15% bonus for reliable water
    }
    
    const irrigationMethod = landDetails.waterIrrigation?.irrigationMethod;
    if (irrigationMethod === 'drip') {
        infrastructureMultiplier += 0.20; // 20% bonus for drip irrigation
    } else if (irrigationMethod === 'sprinkler') {
        infrastructureMultiplier += 0.10; // 10% bonus for sprinkler
    }
    
    // Soil quality bonus
    const soilType = landDetails.soilType;
    if (soilType === 'loamy' || soilType === 'alluvial') {
        infrastructureMultiplier += 0.10; // 10% bonus for good soil
    }
    
    // Equipment bonus
    const tractorAccess = landDetails.equipmentInputs?.tractorAccess;
    if (tractorAccess === 'owned') {
        infrastructureMultiplier += 0.05; // 5% bonus for owned tractor
    }
    
    // Apply multiplier to estimates
    const enhancedEstimates = {
        ...baseEstimates,
        totalEstimatedYield: Number((baseEstimates.totalEstimatedYield * infrastructureMultiplier).toFixed(2)),
        totalEstimatedRevenue: Math.round(baseEstimates.totalEstimatedRevenue * infrastructureMultiplier),
        cropWiseEstimates: baseEstimates.cropWiseEstimates.map(crop => ({
            ...crop,
            estimatedYield: Number((crop.estimatedYield * infrastructureMultiplier).toFixed(2)),
            estimatedRevenue: Math.round(crop.estimatedRevenue * infrastructureMultiplier)
        })),
        infrastructureBonus: Math.round((infrastructureMultiplier - 1) * 100)
    };
    
    return enhancedEstimates;
}

// Enhanced efficiency metrics using all farm data
function calculateEnhancedEfficiencyMetrics(profile) {
    const baseMetrics = calculateEfficiencyMetrics(profile);
    const landDetails = profile.landDetails || {};
    
    // Infrastructure efficiency score
    let infrastructureScore = 0;
    if (landDetails.farmingInfrastructure?.hasWarehouses) infrastructureScore += 15;
    if (landDetails.farmingInfrastructure?.hasProcessingUnits) infrastructureScore += 10;
    if (landDetails.farmingInfrastructure?.electricity === '24_hours') infrastructureScore += 20;
    else if (landDetails.farmingInfrastructure?.electricity === '12_hours') infrastructureScore += 15;
    if (landDetails.farmingInfrastructure?.farmRoads === 'excellent') infrastructureScore += 10;
    else if (landDetails.farmingInfrastructure?.farmRoads === 'good') infrastructureScore += 5;
    
    // Water management efficiency
    let waterEfficiency = 50; // Base score
    const irrigationMethod = landDetails.waterIrrigation?.irrigationMethod;
    if (irrigationMethod === 'drip') waterEfficiency = 95;
    else if (irrigationMethod === 'sprinkler') waterEfficiency = 80;
    else if (irrigationMethod === 'flood') waterEfficiency = 60;
    
    const waterAvailability = landDetails.waterIrrigation?.waterAvailability;
    if (waterAvailability === 'abundant') waterEfficiency += 5;
    else if (waterAvailability === 'scarce') waterEfficiency -= 15;
    
    // Input efficiency based on usage patterns
    let inputEfficiency = 70; // Base score
    const fertilizerUsage = landDetails.equipmentInputs?.fertilizerUsage;
    if (fertilizerUsage === 'organic_only') inputEfficiency = 90;
    else if (fertilizerUsage === 'mixed') inputEfficiency = 80;
    else if (fertilizerUsage === 'minimal') inputEfficiency = 85;
    
    return {
        ...baseMetrics,
        infrastructureScore: Math.min(infrastructureScore, 100),
        waterUsageEfficiency: Math.min(Math.max(waterEfficiency, 0), 100),
        inputEfficiency: Math.min(Math.max(inputEfficiency, 0), 100),
        overallEfficiency: Math.min(Math.round(
            (baseMetrics.overallEfficiency * 0.6 + infrastructureScore * 0.2 + waterEfficiency * 0.2)
        ), 100)
    };
}

// Soil health analysis based on collected soil data
function calculateSoilAnalysis(landDetails) {
    const soilDetails = landDetails.soilDetails || {};
    const analysis = {
        healthScore: getSoilHealthScore(landDetails.soilType),
        phLevel: soilDetails.phLevel || null,
        organicCarbon: soilDetails.organicCarbon || null,
        nutrientLevels: {
            nitrogen: soilDetails.nitrogenLevel || 'unknown',
            phosphorus: soilDetails.phosphorusLevel || 'unknown',
            potassium: soilDetails.potassiumLevel || 'unknown'
        },
        recommendations: []
    };
    
    // pH recommendations
    if (analysis.phLevel) {
        if (analysis.phLevel < 6.0) {
            analysis.recommendations.push('Soil is acidic. Consider lime application to increase pH.');
        } else if (analysis.phLevel > 8.0) {
            analysis.recommendations.push('Soil is alkaline. Consider organic matter addition to balance pH.');
        }
    }
    
    // Organic carbon recommendations
    if (analysis.organicCarbon && analysis.organicCarbon < 0.5) {
        analysis.recommendations.push('Low organic carbon. Increase organic matter through compost or green manure.');
    }
    
    // Nutrient recommendations
    if (analysis.nutrientLevels.nitrogen === 'low') {
        analysis.recommendations.push('Apply nitrogen-rich fertilizers or grow leguminous crops.');
    }
    if (analysis.nutrientLevels.phosphorus === 'low') {
        analysis.recommendations.push('Apply phosphorus fertilizers, especially during flowering stage.');
    }
    if (analysis.nutrientLevels.potassium === 'low') {
        analysis.recommendations.push('Apply potassium fertilizers to improve fruit quality and disease resistance.');
    }
    
    return analysis;
}

// Economic analysis based on farm details
function calculateEconomicAnalysis(landDetails, crops) {
    const economicInfo = landDetails.economicInfo || {};
    const inputCosts = economicInfo.monthlyInputCosts;
    const marketingMethod = economicInfo.marketingMethod;
    
    let monthlyCostEstimate = 0;
    const costRanges = {
        'below_10k': 7500,
        '10k_25k': 17500,
        '25k_50k': 37500,
        '50k_1lakh': 75000,
        'above_1lakh': 125000
    };
    
    if (inputCosts && costRanges[inputCosts]) {
        monthlyCostEstimate = costRanges[inputCosts];
    }
    
    // Marketing efficiency score
    let marketingEfficiency = 70; // Base score
    const marketingScores = {
        'direct_market': 60,
        'middleman': 50,
        'cooperative': 80,
        'online': 90,
        'contract_farming': 85
    };
    
    if (marketingMethod && marketingScores[marketingMethod]) {
        marketingEfficiency = marketingScores[marketingMethod];
    }
    
    return {
        monthlyCostEstimate,
        annualCostEstimate: monthlyCostEstimate * 12,
        marketingMethod: marketingMethod || 'unknown',
        marketingEfficiency,
        costOptimizationPotential: monthlyCostEstimate > 50000 ? 'High' : 
                                  monthlyCostEstimate > 25000 ? 'Medium' : 'Low',
        recommendations: generateEconomicRecommendations(economicInfo, marketingEfficiency)
    };
}

// Infrastructure scoring
function calculateInfrastructureScore(landDetails) {
    const infrastructure = landDetails.farmingInfrastructure || {};
    let score = 0;
    const maxScore = 100;
    
    // Storage facilities (25 points)
    if (infrastructure.hasWarehouses) score += 15;
    if (infrastructure.warehouseCapacity > 0) score += 10;
    
    // Processing capabilities (20 points)
    if (infrastructure.hasProcessingUnits) score += 20;
    
    // Electricity access (20 points)
    const electricityScores = {
        '24_hours': 20,
        '12_hours': 15,
        '6_hours': 10,
        'irregular': 5,
        'none': 0
    };
    score += electricityScores[infrastructure.electricity] || 0;
    
    // Road access (15 points)
    const roadScores = {
        'excellent': 15,
        'good': 12,
        'fair': 8,
        'poor': 4,
        'none': 0
    };
    score += roadScores[infrastructure.farmRoads] || 0;
    
    // Market proximity (10 points)
    const marketDistance = infrastructure.nearestMarketDistance;
    if (marketDistance !== null) {
        if (marketDistance <= 5) score += 10;
        else if (marketDistance <= 15) score += 7;
        else if (marketDistance <= 30) score += 4;
        else score += 1;
    }
    
    // Machinery (10 points)
    const machinery = infrastructure.machinery || [];
    score += Math.min(machinery.length * 2, 10);
    
    return {
        score: Math.min(score, maxScore),
        level: score >= 80 ? 'Excellent' : score >= 60 ? 'Good' : score >= 40 ? 'Fair' : 'Poor',
        strengths: getInfrastructureStrengths(infrastructure),
        improvements: getInfrastructureImprovements(infrastructure, score)
    };
}

// Generate enhanced recommendations using all profile data
function generateEnhancedRecommendations(profile) {
    const baseRecommendations = generateRecommendations(profile);
    const landDetails = profile.landDetails || {};
    const enhancedRecommendations = [...baseRecommendations];
    
    // Infrastructure-based recommendations
    if (!landDetails.farmingInfrastructure?.hasWarehouses) {
        enhancedRecommendations.push({
            type: 'infrastructure',
            priority: 'medium',
            title: 'Consider Storage Infrastructure',
            description: 'Building storage facilities can reduce post-harvest losses and improve bargaining power.',
            action: 'Explore warehouse construction or shared storage options',
            impact: 'Can reduce losses by 15-25%'
        });
    }
    
    // Irrigation recommendations
    const irrigationMethod = landDetails.waterIrrigation?.irrigationMethod;
    if (irrigationMethod === 'flood' || !irrigationMethod) {
        enhancedRecommendations.push({
            type: 'water_management',
            priority: 'high',
            title: 'Upgrade Irrigation System',
            description: 'Drip or sprinkler irrigation can save water and increase yields significantly.',
            action: 'Consider installing drip irrigation system',
            impact: 'Can increase yields by 20-30% and save 40% water'
        });
    }
    
    // Soil health recommendations
    const soilDetails = landDetails.soilDetails || {};
    if (!soilDetails.phLevel && !soilDetails.organicCarbon) {
        enhancedRecommendations.push({
            type: 'soil_health',
            priority: 'medium',
            title: 'Conduct Soil Testing',
            description: 'Regular soil testing helps optimize fertilizer use and improve crop yields.',
            action: 'Get comprehensive soil analysis done',
            impact: 'Can optimize fertilizer costs by 20-30%'
        });
    }
    
    return enhancedRecommendations;
}

// Helper functions
function generateEconomicRecommendations(economicInfo, marketingEfficiency) {
    const recommendations = [];
    
    if (marketingEfficiency < 70) {
        recommendations.push('Consider direct marketing or cooperative selling for better prices');
    }
    
    if (economicInfo.monthlyInputCosts === 'above_1lakh') {
        recommendations.push('Review input costs - consider bulk purchasing or organic alternatives');
    }
    
    return recommendations;
}

function getInfrastructureStrengths(infrastructure) {
    const strengths = [];
    
    if (infrastructure.hasWarehouses) strengths.push('Storage facilities available');
    if (infrastructure.hasProcessingUnits) strengths.push('Processing capabilities');
    if (infrastructure.electricity === '24_hours') strengths.push('Reliable electricity supply');
    if (infrastructure.farmRoads === 'excellent' || infrastructure.farmRoads === 'good') {
        strengths.push('Good road connectivity');
    }
    
    return strengths;
}

function getInfrastructureImprovements(infrastructure, currentScore) {
    const improvements = [];
    
    if (!infrastructure.hasWarehouses) improvements.push('Add storage facilities');
    if (!infrastructure.hasProcessingUnits) improvements.push('Consider processing units');
    if (infrastructure.electricity !== '24_hours') improvements.push('Improve electricity access');
    if (infrastructure.farmRoads === 'poor' || infrastructure.farmRoads === 'fair') {
        improvements.push('Improve road connectivity');
    }
    
    return improvements;
}

module.exports = {
    getFarmAnalytics,
    getAnalyticsSummary
};
