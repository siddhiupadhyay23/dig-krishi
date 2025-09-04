const profileModel = require("../models/profile.model");

class AnalyticsService {
    /**
     * Calculate comprehensive farm analytics for a user profile
     */
    static async calculateFarmAnalytics(userId) {
        try {
            const profile = await profileModel.findOne({ userId }).populate('userId', 'fullName email');
            
            if (!profile) {
                throw new Error('Profile not found');
            }

            const analytics = {
                overview: this.getOverviewStats(profile),
                cropAnalytics: this.getCropAnalytics(profile),
                financialAnalytics: this.getFinancialAnalytics(profile),
                productivityAnalytics: this.getProductivityAnalytics(profile),
                seasonalAnalytics: this.getSeasonalAnalytics(profile),
                recommendations: this.generateRecommendations(profile)
            };

            return analytics;
        } catch (error) {
            console.error('Analytics calculation error:', error);
            throw error;
        }
    }

    /**
     * Get overview statistics
     */
    static getOverviewStats(profile) {
        const activeCrops = profile.cropsGrown.filter(crop => crop.isActive);
        const totalLandArea = profile.landDetails.totalLandSize.value || 0;
        const landUnit = profile.landDetails.totalLandSize.unit || 'acres';

        // Calculate total allocated area
        let totalAllocatedArea = 0;
        activeCrops.forEach(crop => {
            if (crop.areaAllocated.value) {
                // Convert all to acres for calculation (simplified)
                const areaInAcres = this.convertToAcres(crop.areaAllocated.value, crop.areaAllocated.unit);
                totalAllocatedArea += areaInAcres;
            }
        });

        return {
            totalLandArea: totalLandArea,
            landUnit: landUnit,
            totalAllocatedArea: totalAllocatedArea,
            availableLand: Math.max(0, totalLandArea - totalAllocatedArea),
            totalActiveCrops: activeCrops.length,
            landUtilization: totalLandArea > 0 ? Math.round((totalAllocatedArea / totalLandArea) * 100) : 0,
            farmingExperience: profile.farmingExperience.yearsOfExperience || 0,
            farmingType: profile.farmingExperience.farmingType || 'traditional'
        };
    }

    /**
     * Get crop-specific analytics
     */
    static getCropAnalytics(profile) {
        const crops = profile.cropsGrown.filter(crop => crop.isActive);
        
        const cropStats = crops.map(crop => {
            const expectedYield = crop.expectedYield.quantity || 0;
            const actualYield = crop.actualYield.quantity || 0;
            const totalExpenses = crop.expenses.total || 0;
            const revenue = crop.revenue || 0;
            const profit = crop.profit || 0;

            return {
                cropId: crop._id,
                cropName: crop.cropName,
                cropType: crop.cropType,
                season: crop.season,
                areaAllocated: crop.areaAllocated,
                cropStatus: crop.cropStatus,
                plantingDate: crop.plantingDate,
                expectedHarvestDate: crop.expectedHarvestDate,
                expectedYield: expectedYield,
                actualYield: actualYield,
                yieldEfficiency: expectedYield > 0 ? Math.round((actualYield / expectedYield) * 100) : 0,
                totalExpenses: totalExpenses,
                revenue: revenue,
                profit: profit,
                profitMargin: revenue > 0 ? Math.round((profit / revenue) * 100) : 0,
                costPerUnit: actualYield > 0 ? Math.round(totalExpenses / actualYield) : 0,
                growthStages: crop.growthStages.length,
                currentStage: this.getCurrentGrowthStage(crop)
            };
        });

        // Aggregate statistics
        const totalRevenue = cropStats.reduce((sum, crop) => sum + crop.revenue, 0);
        const totalExpenses = cropStats.reduce((sum, crop) => sum + crop.totalExpenses, 0);
        const totalProfit = totalRevenue - totalExpenses;

        return {
            crops: cropStats,
            summary: {
                totalRevenue,
                totalExpenses,
                totalProfit,
                averageProfitMargin: cropStats.length > 0 ? 
                    Math.round(cropStats.reduce((sum, crop) => sum + crop.profitMargin, 0) / cropStats.length) : 0,
                mostProfitableCrop: this.getMostProfitableCrop(cropStats),
                cropsByType: this.groupCropsByType(cropStats),
                cropsBySeason: this.groupCropsBySeason(cropStats)
            }
        };
    }

    /**
     * Get financial analytics
     */
    static getFinancialAnalytics(profile) {
        const crops = profile.cropsGrown.filter(crop => crop.isActive);
        
        let totalInvestment = 0;
        let totalRevenue = 0;
        let expenseBreakdown = {
            seeds: 0,
            fertilizers: 0,
            pesticides: 0,
            irrigation: 0,
            labor: 0,
            machinery: 0,
            other: 0
        };

        crops.forEach(crop => {
            totalInvestment += crop.expenses.total || 0;
            totalRevenue += crop.revenue || 0;
            
            Object.keys(expenseBreakdown).forEach(category => {
                expenseBreakdown[category] += crop.expenses[category] || 0;
            });
        });

        const totalProfit = totalRevenue - totalInvestment;
        const roi = totalInvestment > 0 ? Math.round(((totalProfit / totalInvestment) * 100)) : 0;

        return {
            totalInvestment,
            totalRevenue,
            totalProfit,
            roi,
            expenseBreakdown,
            profitTrend: this.calculateProfitTrend(crops),
            costAnalysis: this.analyzeCosts(expenseBreakdown, totalInvestment)
        };
    }

    /**
     * Get productivity analytics
     */
    static getProductivityAnalytics(profile) {
        const crops = profile.cropsGrown.filter(crop => crop.isActive);
        const totalLandArea = profile.landDetails.totalLandSize.value || 0;

        let totalYield = 0;
        let totalAllocatedArea = 0;

        crops.forEach(crop => {
            totalYield += crop.actualYield.quantity || 0;
            totalAllocatedArea += this.convertToAcres(
                crop.areaAllocated.value || 0, 
                crop.areaAllocated.unit || 'acres'
            );
        });

        const yieldPerAcre = totalAllocatedArea > 0 ? totalYield / totalAllocatedArea : 0;
        const productivityScore = this.calculateProductivityScore(profile);

        return {
            totalYield,
            totalAllocatedArea,
            yieldPerAcre: Math.round(yieldPerAcre * 100) / 100,
            productivityScore,
            cropEfficiency: crops.map(crop => ({
                cropName: crop.cropName,
                efficiency: crop.expectedYield.quantity > 0 ? 
                    Math.round(((crop.actualYield.quantity || 0) / crop.expectedYield.quantity) * 100) : 0
            })),
            recommendations: this.getProductivityRecommendations(profile)
        };
    }

    /**
     * Get seasonal analytics
     */
    static getSeasonalAnalytics(profile) {
        const crops = profile.cropsGrown.filter(crop => crop.isActive);
        
        const seasonalData = {
            kharif: { crops: [], totalArea: 0, totalRevenue: 0, totalExpenses: 0 },
            rabi: { crops: [], totalArea: 0, totalRevenue: 0, totalExpenses: 0 },
            zaid: { crops: [], totalArea: 0, totalRevenue: 0, totalExpenses: 0 },
            year_round: { crops: [], totalArea: 0, totalRevenue: 0, totalExpenses: 0 }
        };

        crops.forEach(crop => {
            const season = crop.season;
            if (seasonalData[season]) {
                seasonalData[season].crops.push({
                    name: crop.cropName,
                    area: crop.areaAllocated.value || 0,
                    revenue: crop.revenue || 0,
                    expenses: crop.expenses.total || 0
                });
                seasonalData[season].totalArea += crop.areaAllocated.value || 0;
                seasonalData[season].totalRevenue += crop.revenue || 0;
                seasonalData[season].totalExpenses += crop.expenses.total || 0;
            }
        });

        // Calculate profit for each season
        Object.keys(seasonalData).forEach(season => {
            seasonalData[season].totalProfit = seasonalData[season].totalRevenue - seasonalData[season].totalExpenses;
            seasonalData[season].profitability = seasonalData[season].totalRevenue > 0 ? 
                Math.round((seasonalData[season].totalProfit / seasonalData[season].totalRevenue) * 100) : 0;
        });

        return {
            seasonal: seasonalData,
            bestSeason: this.getBestSeason(seasonalData),
            seasonalRecommendations: this.getSeasonalRecommendations(seasonalData)
        };
    }

    /**
     * Generate recommendations based on analytics
     */
    static generateRecommendations(profile) {
        const recommendations = [];
        const crops = profile.cropsGrown.filter(crop => crop.isActive);
        const totalLandArea = profile.landDetails.totalLandSize.value || 0;

        // Land utilization recommendations
        const overview = this.getOverviewStats(profile);
        if (overview.landUtilization < 70) {
            recommendations.push({
                type: 'land_utilization',
                priority: 'high',
                title: 'Optimize Land Usage',
                description: `You're using only ${overview.landUtilization}% of your land. Consider expanding cultivation to increase productivity.`,
                action: 'Plan additional crops for unused land areas'
            });
        }

        // Crop diversification
        const cropTypes = [...new Set(crops.map(crop => crop.cropType))];
        if (cropTypes.length < 2) {
            recommendations.push({
                type: 'diversification',
                priority: 'medium',
                title: 'Diversify Crop Portfolio',
                description: 'Growing different types of crops can reduce risk and improve soil health.',
                action: 'Consider adding crops from different categories'
            });
        }

        // Financial recommendations
        const financial = this.getFinancialAnalytics(profile);
        if (financial.roi < 20) {
            recommendations.push({
                type: 'financial',
                priority: 'high',
                title: 'Improve Return on Investment',
                description: `Your current ROI is ${financial.roi}%. Focus on high-value crops or reduce input costs.`,
                action: 'Analyze cost structure and market prices'
            });
        }

        // Technology recommendations
        if (profile.farmingExperience.farmingType === 'traditional') {
            recommendations.push({
                type: 'technology',
                priority: 'medium',
                title: 'Adopt Modern Farming Techniques',
                description: 'Modern farming methods can increase yield and reduce costs.',
                action: 'Explore drip irrigation, soil testing, and precision farming'
            });
        }

        return recommendations;
    }

    // Helper methods
    static convertToAcres(value, unit) {
        const conversionFactors = {
            acres: 1,
            hectares: 2.471,
            bigha: 0.33,
            guntha: 0.025,
            square_feet: 0.000023,
            square_meters: 0.000247
        };
        return value * (conversionFactors[unit] || 1);
    }

    static getCurrentGrowthStage(crop) {
        const stages = crop.growthStages.sort((a, b) => new Date(b.date) - new Date(a.date));
        return stages.length > 0 ? stages[0].stage : 'seeding';
    }

    static getMostProfitableCrop(cropStats) {
        if (cropStats.length === 0) return null;
        return cropStats.reduce((max, crop) => crop.profit > max.profit ? crop : max);
    }

    static groupCropsByType(cropStats) {
        return cropStats.reduce((acc, crop) => {
            acc[crop.cropType] = (acc[crop.cropType] || 0) + 1;
            return acc;
        }, {});
    }

    static groupCropsBySeason(cropStats) {
        return cropStats.reduce((acc, crop) => {
            acc[crop.season] = (acc[crop.season] || 0) + 1;
            return acc;
        }, {});
    }

    static calculateProfitTrend(crops) {
        // Simplified trend calculation based on completed crops
        const completedCrops = crops.filter(crop => crop.cropStatus === 'completed');
        return completedCrops.map(crop => ({
            date: crop.addedDate,
            profit: crop.profit || 0
        }));
    }

    static analyzeCosts(expenseBreakdown, totalInvestment) {
        const analysis = {};
        Object.keys(expenseBreakdown).forEach(category => {
            analysis[category] = {
                amount: expenseBreakdown[category],
                percentage: totalInvestment > 0 ? 
                    Math.round((expenseBreakdown[category] / totalInvestment) * 100) : 0
            };
        });
        return analysis;
    }

    static calculateProductivityScore(profile) {
        // Simple productivity scoring based on various factors
        let score = 0;
        
        // Land utilization (40% weight)
        const overview = this.getOverviewStats(profile);
        score += (overview.landUtilization * 0.4);
        
        // Crop diversity (20% weight)
        const crops = profile.cropsGrown.filter(crop => crop.isActive);
        const cropTypes = [...new Set(crops.map(crop => crop.cropType))];
        const diversityScore = Math.min(100, (cropTypes.length * 20));
        score += (diversityScore * 0.2);
        
        // Technology adoption (20% weight)
        const techScore = profile.farmingExperience.farmingType === 'modern' ? 100 : 
                         profile.farmingExperience.farmingType === 'mixed' ? 70 : 40;
        score += (techScore * 0.2);
        
        // Experience (20% weight)
        const experience = profile.farmingExperience.yearsOfExperience || 0;
        const expScore = Math.min(100, experience * 5);
        score += (expScore * 0.2);
        
        return Math.round(score);
    }

    static getProductivityRecommendations(profile) {
        const recommendations = [];
        const score = this.calculateProductivityScore(profile);
        
        if (score < 60) {
            recommendations.push('Focus on improving land utilization');
            recommendations.push('Consider adopting modern farming techniques');
            recommendations.push('Diversify crop selection');
        }
        
        return recommendations;
    }

    static getBestSeason(seasonalData) {
        let bestSeason = null;
        let maxProfit = -Infinity;
        
        Object.keys(seasonalData).forEach(season => {
            if (seasonalData[season].totalProfit > maxProfit) {
                maxProfit = seasonalData[season].totalProfit;
                bestSeason = season;
            }
        });
        
        return bestSeason;
    }

    static getSeasonalRecommendations(seasonalData) {
        const recommendations = [];
        const seasons = Object.keys(seasonalData);
        
        seasons.forEach(season => {
            const data = seasonalData[season];
            if (data.totalProfit < 0) {
                recommendations.push(`Consider revising ${season} season crop selection for better profitability`);
            }
        });
        
        return recommendations;
    }
}

module.exports = AnalyticsService;
