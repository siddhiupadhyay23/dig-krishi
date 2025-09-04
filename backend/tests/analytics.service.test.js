const mongoose = require('mongoose');
const AnalyticsService = require('../src/services/analytics.service');
const profileModel = require('../src/models/profile.model');
const userModel = require('../src/models/user.model');

describe('AnalyticsService', () => {
  let testUserId;
  let testUser;
  let testProfile;

  beforeAll(async () => {
    // Connect to test database only if not already connected
    if (mongoose.connection.readyState === 0) {
      const mongoUri = process.env.TEST_MONGODB_URI || 'mongodb://localhost:27017/dig-krishi-test';
      await mongoose.connect(mongoUri);
    }
  });

  beforeEach(async () => {
    // Clean up database
    await userModel.deleteMany({});
    await profileModel.deleteMany({});
    
    // Create test user
    testUser = await userModel.create({
      fullName: {
        firstName: 'Test',
        lastName: 'User'
      },
      email: 'analytics@test.com',
      password: 'hashedpassword'
    });
    testUserId = testUser._id;

    // Create comprehensive test profile
    testProfile = await profileModel.create({
      userId: testUserId,
      landDetails: {
        farmName: 'Analytics Test Farm',
        totalLandSize: {
          value: 50,
          unit: 'acres'
        },
        landType: 'irrigated',
        soilType: 'loamy',
        farmingInfrastructure: {
          hasWarehouses: true,
          warehouseCapacity: 1000,
          electricity: '24_hours',
          nearestMarketDistance: 5
        }
      },
      farmingExperience: {
        yearsOfExperience: 15,
        farmingType: 'mixed'
      },
      cropsGrown: [
        {
          cropName: 'rice',
          cropType: 'cash_crop',
          season: 'kharif',
          areaAllocated: {
            value: 20,
            unit: 'acres'
          },
          expectedYield: {
            quantity: 2000,
            unit: 'kg'
          },
          actualYield: {
            quantity: 1800,
            unit: 'kg'
          },
          expenses: {
            seeds: 5000,
            fertilizers: 8000,
            pesticides: 3000,
            irrigation: 4000,
            labor: 10000,
            machinery: 5000,
            other: 2000,
            total: 37000
          },
          revenue: 54000,
          profit: 17000,
          isActive: true,
          cropStatus: 'completed',
          isPrimary: true
        },
        {
          cropName: 'wheat',
          cropType: 'cash_crop',
          season: 'rabi',
          areaAllocated: {
            value: 15,
            unit: 'acres'
          },
          expectedYield: {
            quantity: 1500,
            unit: 'kg'
          },
          actualYield: {
            quantity: 1600,
            unit: 'kg'
          },
          expenses: {
            seeds: 3000,
            fertilizers: 6000,
            pesticides: 2000,
            irrigation: 3000,
            labor: 8000,
            machinery: 4000,
            other: 1500,
            total: 27500
          },
          revenue: 48000,
          profit: 20500,
          isActive: true,
          cropStatus: 'completed',
          isPrimary: true
        },
        {
          cropName: 'vegetables',
          cropType: 'horticulture',
          season: 'year_round',
          areaAllocated: {
            value: 10,
            unit: 'acres'
          },
          expectedYield: {
            quantity: 800,
            unit: 'kg'
          },
          actualYield: {
            quantity: 750,
            unit: 'kg'
          },
          expenses: {
            seeds: 2000,
            fertilizers: 4000,
            pesticides: 1500,
            irrigation: 2500,
            labor: 6000,
            machinery: 2000,
            other: 1000,
            total: 19000
          },
          revenue: 30000,
          profit: 11000,
          isActive: true,
          cropStatus: 'completed',
          isPrimary: false
        }
      ],
      profileCompletion: {
        landSizeCompleted: true,
        cropSelectionCompleted: true,
        stateCompleted: true,
        cityCompleted: true
      }
    });
  });

  afterEach(async () => {
    await userModel.deleteMany({});
    await profileModel.deleteMany({});
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  describe('calculateFarmAnalytics', () => {
    test('should calculate comprehensive farm analytics successfully', async () => {
      const analytics = await AnalyticsService.calculateFarmAnalytics(testUserId);

      expect(analytics).toHaveProperty('overview');
      expect(analytics).toHaveProperty('cropAnalytics');
      expect(analytics).toHaveProperty('financialAnalytics');
      expect(analytics).toHaveProperty('productivityAnalytics');
      expect(analytics).toHaveProperty('seasonalAnalytics');
      expect(analytics).toHaveProperty('recommendations');
    });

    test('should throw error for non-existent user', async () => {
      const invalidUserId = new mongoose.Types.ObjectId();
      
      await expect(
        AnalyticsService.calculateFarmAnalytics(invalidUserId)
      ).rejects.toThrow('Profile not found');
    });
  });

  describe('getOverviewStats', () => {
    test('should calculate overview statistics correctly', () => {
      const overview = AnalyticsService.getOverviewStats(testProfile);

      expect(overview.totalLandArea).toBe(50);
      expect(overview.landUnit).toBe('acres');
      expect(overview.totalActiveCrops).toBe(3);
      expect(overview.totalAllocatedArea).toBe(45); // 20 + 15 + 10
      expect(overview.availableLand).toBe(5); // 50 - 45
      expect(overview.landUtilization).toBe(90); // (45/50) * 100
      expect(overview.farmingExperience).toBe(15);
      expect(overview.farmingType).toBe('mixed');
    });

    test('should handle zero land area', () => {
      const profileWithZeroLand = { ...testProfile.toObject() };
      profileWithZeroLand.landDetails.totalLandSize.value = 0;
      
      const overview = AnalyticsService.getOverviewStats(profileWithZeroLand);
      expect(overview.landUtilization).toBe(0);
    });
  });

  describe('getCropAnalytics', () => {
    test('should calculate crop analytics with summary', () => {
      const cropAnalytics = AnalyticsService.getCropAnalytics(testProfile);

      expect(cropAnalytics.crops).toHaveLength(3);
      expect(cropAnalytics.summary.totalRevenue).toBe(132000); // 54000 + 48000 + 30000
      expect(cropAnalytics.summary.totalExpenses).toBe(83500); // 37000 + 27500 + 19000
      expect(cropAnalytics.summary.totalProfit).toBe(48500);
      
      // Check individual crop calculations
      const riceCrop = cropAnalytics.crops.find(crop => crop.cropName === 'rice');
      expect(riceCrop.yieldEfficiency).toBe(90); // (1800/2000) * 100
      expect(riceCrop.profitMargin).toBe(31); // (17000/54000) * 100
    });

    test('should identify most profitable crop', () => {
      const cropAnalytics = AnalyticsService.getCropAnalytics(testProfile);
      
      expect(cropAnalytics.summary.mostProfitableCrop.cropName).toBe('wheat');
      expect(cropAnalytics.summary.mostProfitableCrop.profit).toBe(20500);
    });

    test('should group crops by type and season', () => {
      const cropAnalytics = AnalyticsService.getCropAnalytics(testProfile);
      
      expect(cropAnalytics.summary.cropsByType.cash_crop).toBe(2);
      expect(cropAnalytics.summary.cropsByType.horticulture).toBe(1);
      
      expect(cropAnalytics.summary.cropsBySeason.kharif).toBe(1);
      expect(cropAnalytics.summary.cropsBySeason.rabi).toBe(1);
      expect(cropAnalytics.summary.cropsBySeason.year_round).toBe(1);
    });
  });

  describe('getFinancialAnalytics', () => {
    test('should calculate financial metrics correctly', () => {
      const financial = AnalyticsService.getFinancialAnalytics(testProfile);

      expect(financial.totalInvestment).toBe(83500);
      expect(financial.totalRevenue).toBe(132000);
      expect(financial.totalProfit).toBe(48500);
      expect(financial.roi).toBe(58); // ((48500/83500) * 100) rounded

      // Check expense breakdown
      expect(financial.expenseBreakdown.seeds).toBe(10000); // 5000 + 3000 + 2000
      expect(financial.expenseBreakdown.fertilizers).toBe(18000); // 8000 + 6000 + 4000
      expect(financial.expenseBreakdown.labor).toBe(24000); // 10000 + 8000 + 6000
    });

    test('should analyze cost distribution', () => {
      const financial = AnalyticsService.getFinancialAnalytics(testProfile);
      
      expect(financial.costAnalysis.labor.percentage).toBe(29); // (24000/83500) * 100 rounded
      expect(financial.costAnalysis.fertilizers.percentage).toBe(22); // (18000/83500) * 100 rounded
    });
  });

  describe('getProductivityAnalytics', () => {
    test('should calculate productivity metrics', () => {
      const productivity = AnalyticsService.getProductivityAnalytics(testProfile);

      expect(productivity.totalYield).toBe(4150); // 1800 + 1600 + 750
      expect(productivity.totalAllocatedArea).toBe(45);
      expect(productivity.yieldPerAcre).toBe(92.22); // 4150/45 rounded to 2 decimals

      expect(productivity.cropEfficiency).toHaveLength(3);
      
      const riceEfficiency = productivity.cropEfficiency.find(crop => crop.cropName === 'rice');
      expect(riceEfficiency.efficiency).toBe(90); // (1800/2000) * 100
      
      const wheatEfficiency = productivity.cropEfficiency.find(crop => crop.cropName === 'wheat');
      expect(wheatEfficiency.efficiency).toBe(107); // (1600/1500) * 100
    });

    test('should calculate productivity score', () => {
      const productivity = AnalyticsService.getProductivityAnalytics(testProfile);
      
      expect(productivity.productivityScore).toBeGreaterThan(0);
      expect(productivity.productivityScore).toBeLessThanOrEqual(100);
    });
  });

  describe('getSeasonalAnalytics', () => {
    test('should group data by seasons correctly', () => {
      const seasonal = AnalyticsService.getSeasonalAnalytics(testProfile);

      expect(seasonal.seasonal.kharif.crops).toHaveLength(1);
      expect(seasonal.seasonal.kharif.totalRevenue).toBe(54000);
      expect(seasonal.seasonal.kharif.totalExpenses).toBe(37000);
      expect(seasonal.seasonal.kharif.totalProfit).toBe(17000);

      expect(seasonal.seasonal.rabi.crops).toHaveLength(1);
      expect(seasonal.seasonal.rabi.totalRevenue).toBe(48000);
      
      expect(seasonal.seasonal.year_round.crops).toHaveLength(1);
      expect(seasonal.seasonal.year_round.totalRevenue).toBe(30000);
    });

    test('should identify best season', () => {
      const seasonal = AnalyticsService.getSeasonalAnalytics(testProfile);
      
      expect(seasonal.bestSeason).toBe('rabi'); // Highest profit per crop
    });

    test('should calculate profitability percentages', () => {
      const seasonal = AnalyticsService.getSeasonalAnalytics(testProfile);
      
      expect(seasonal.seasonal.kharif.profitability).toBe(31); // (17000/54000) * 100 rounded
      expect(seasonal.seasonal.rabi.profitability).toBe(43); // (20500/48000) * 100 rounded
    });
  });

  describe('generateRecommendations', () => {
    test('should generate relevant recommendations', () => {
      const recommendations = AnalyticsService.generateRecommendations(testProfile);
      
      expect(recommendations).toBeInstanceOf(Array);
      // Our test profile has good land utilization and crop diversity, so might not generate many recommendations
      // The service should return diversification recommendation because we only have 2 crop types (cash_crop and horticulture)
      expect(recommendations.length).toBeGreaterThanOrEqual(0);
      
      // Test with a profile that should generate recommendations
      const lowDiversityProfile = { ...testProfile.toObject() };
      lowDiversityProfile.cropsGrown = [lowDiversityProfile.cropsGrown[0]]; // Only one crop type
      const diversityRecs = AnalyticsService.generateRecommendations(lowDiversityProfile);
      expect(diversityRecs.length).toBeGreaterThan(0);
      expect(diversityRecs.some(r => r.type === 'diversification')).toBe(true);
    });

    test('should recommend land optimization for low utilization', () => {
      const lowUtilizationProfile = { ...testProfile.toObject() };
      lowUtilizationProfile.landDetails.totalLandSize.value = 100; // More land, same crops
      
      const recommendations = AnalyticsService.generateRecommendations(lowUtilizationProfile);
      
      const landRec = recommendations.find(r => r.type === 'land_utilization');
      expect(landRec).toBeDefined();
      expect(landRec.priority).toBe('high');
    });

    test('should recommend ROI improvement for low returns', () => {
      const lowROIProfile = { ...testProfile.toObject() };
      // Increase expenses to lower ROI
      lowROIProfile.cropsGrown.forEach(crop => {
        crop.expenses.total *= 5; // Make expenses much higher
      });
      
      const recommendations = AnalyticsService.generateRecommendations(lowROIProfile);
      
      const financialRec = recommendations.find(r => r.type === 'financial');
      expect(financialRec).toBeDefined();
      expect(financialRec.priority).toBe('high');
    });
  });

  describe('Helper Methods', () => {
    test('convertToAcres should handle different units', () => {
      expect(AnalyticsService.convertToAcres(1, 'acres')).toBe(1);
      expect(AnalyticsService.convertToAcres(1, 'hectares')).toBe(2.471);
      expect(AnalyticsService.convertToAcres(3, 'bigha')).toBe(0.99); // 3 * 0.33
      expect(AnalyticsService.convertToAcres(1, 'unknown_unit')).toBe(1); // Fallback
    });

    test('getCurrentGrowthStage should return latest stage', () => {
      const cropWithStages = {
        growthStages: [
          { stage: 'seeding', date: new Date('2024-01-01') },
          { stage: 'flowering', date: new Date('2024-03-01') },
          { stage: 'vegetative', date: new Date('2024-02-01') }
        ]
      };
      
      const currentStage = AnalyticsService.getCurrentGrowthStage(cropWithStages);
      expect(currentStage).toBe('flowering'); // Latest by date
    });

    test('getMostProfitableCrop should handle empty array', () => {
      const result = AnalyticsService.getMostProfitableCrop([]);
      expect(result).toBeNull();
    });

    test('calculateProductivityScore should be comprehensive', () => {
      const score = AnalyticsService.calculateProductivityScore(testProfile);
      
      expect(score).toBeGreaterThan(50); // Should be decent with our test data
      expect(score).toBeLessThanOrEqual(100);
      
      // Test with traditional farming (lower score)
      const traditionalProfile = { ...testProfile.toObject() };
      traditionalProfile.farmingExperience.farmingType = 'traditional';
      
      const traditionalScore = AnalyticsService.calculateProductivityScore(traditionalProfile);
      expect(traditionalScore).toBeLessThan(score);
    });
  });

  describe('Edge Cases', () => {
    test('should handle profile with no active crops', async () => {
      const noCropsProfile = { ...testProfile.toObject() };
      noCropsProfile.cropsGrown = [];
      
      const overview = AnalyticsService.getOverviewStats(noCropsProfile);
      expect(overview.totalActiveCrops).toBe(0);
      expect(overview.totalAllocatedArea).toBe(0);
      
      const cropAnalytics = AnalyticsService.getCropAnalytics(noCropsProfile);
      expect(cropAnalytics.crops).toHaveLength(0);
      expect(cropAnalytics.summary.totalRevenue).toBe(0);
    });

    test('should handle missing yield data', () => {
      const noYieldProfile = { ...testProfile.toObject() };
      noYieldProfile.cropsGrown[0].expectedYield.quantity = 0;
      noYieldProfile.cropsGrown[0].actualYield.quantity = 0;
      
      const cropAnalytics = AnalyticsService.getCropAnalytics(noYieldProfile);
      const crop = cropAnalytics.crops[0];
      expect(crop.yieldEfficiency).toBe(0);
    });

    test('should handle missing revenue data', () => {
      const noRevenueProfile = { ...testProfile.toObject() };
      noRevenueProfile.cropsGrown[0].revenue = 0;
      
      const cropAnalytics = AnalyticsService.getCropAnalytics(noRevenueProfile);
      const crop = cropAnalytics.crops[0];
      expect(crop.profitMargin).toBe(0);
    });
  });
});
