const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../server');
const profileModel = require('../src/models/profile.model');
const userModel = require('../src/models/user.model');

// Mock JWT middleware for testing
jest.mock('../src/middlewares/auth.middleware', () => {
  return {
    authMiddleware: (req, res, next) => {
      req.user = { id: global.testUserId || 'testuser123' };
      next();
    }
  };
});

describe('Data Integration - Cross-Page Data Flow', () => {
  let testUserId;
  let testUser;

  beforeAll(async () => {
    // Connect to test database only if not already connected
    if (mongoose.connection.readyState === 0) {
      const mongoUri = process.env.TEST_MONGODB_URI || 'mongodb://localhost:27017/dig-krishi-test';
      await mongoose.connect(mongoUri);
    }
  });

  beforeEach(async () => {
    await userModel.deleteMany({});
    await profileModel.deleteMany({});
    
    testUser = await userModel.create({
      fullName: {
        firstName: 'Integration',
        lastName: 'Farmer'
      },
      email: 'integration@test.com',
      password: 'hashedpassword'
    });
    testUserId = testUser._id;
    global.testUserId = testUserId; // Set for the mock
  });

  afterEach(async () => {
    await userModel.deleteMany({});
    await profileModel.deleteMany({});
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  describe('Complete Farm Profile Creation and Reflection', () => {
    test('should create complete farm profile and reflect across all sections', async () => {
      // Step 1: Save comprehensive farm details
      const farmData = {
        // Basic farm info
        farmName: 'Integrated Test Farm',
        totalLandSize: 30,
        landUnit: 'acres',
        landType: 'irrigated',
        soilType: 'loamy',
        
        // Location details
        state: 'Gujarat',
        city: 'Vadodara',
        district: 'Vadodara',
        pincode: '390001',
        
        // Farming experience
        yearsOfExperience: 10,
        farmingMethod: 'mixed',
        
        // Crops
        primaryCrops: ['rice', 'wheat', 'other'],
        customPrimaryCrops: 'cotton, sugarcane',
        secondaryCrops: ['vegetables'],
        
        // Soil details
        phLevel: 6.8,
        organicCarbon: 1.5,
        nitrogenLevel: 'medium',
        phosphorusLevel: 'high',
        potassiumLevel: 'medium',
        
        // Water & Irrigation
        irrigationSource: 'borewell',
        irrigationMethod: 'drip',
        waterAvailability: 'adequate',
        
        // Infrastructure
        hasWarehouses: true,
        warehouseCapacity: 500,
        farmRoads: 'good',
        electricity: '24_hours',
        nearestMarketDistance: 8,
        
        // Equipment
        tractorAccess: 'owned',
        pumpSetAccess: 'owned',
        fertilizerUsage: 'mixed',
        pesticideUsage: 'minimal',
        
        // Economic info
        monthlyInputCosts: '25k_50k',
        marketingMethod: 'direct_market'
      };

      const saveResponse = await request(app)
        .post('/api/profile/farm-details/save')
        .send(farmData)
        .expect(200);

      expect(saveResponse.body.message).toBe('Farm details saved successfully');
      
      // Step 2: Verify data is reflected in profile retrieval
      const profileResponse = await request(app)
        .get('/api/profile')
        .expect(200);

      const profile = profileResponse.body.profile;
      
      // Verify basic farm details
      expect(profile.landDetails.farmName).toBe('Integrated Test Farm');
      expect(profile.landDetails.totalLandSize.value).toBe(30);
      expect(profile.landDetails.totalLandSize.unit).toBe('acres');
      
      // Verify location details
      expect(profile.location.state).toBe('Gujarat');
      expect(profile.location.city).toBe('Vadodara');
      expect(profile.location.pincode).toBe('390001');
      
      // Verify crops are created
      expect(profile.cropsGrown).toHaveLength(5); // rice, wheat, cotton, sugarcane, vegetables
      
      // Verify soil details
      expect(profile.landDetails.soilDetails.phLevel).toBe(6.8);
      expect(profile.landDetails.soilDetails.nitrogenLevel).toBe('medium');
      
      // Verify infrastructure
      expect(profile.landDetails.farmingInfrastructure.hasWarehouses).toBe(true);
      expect(profile.landDetails.farmingInfrastructure.warehouseCapacity).toBe(500);
    });

    test('should reflect farm data changes in analytics', async () => {
      // Create initial farm profile
      const initialData = {
        farmName: 'Analytics Test Farm',
        totalLandSize: 25,
        primaryCrops: ['rice', 'wheat'],
        yearsOfExperience: 8
      };

      await request(app)
        .post('/api/profile/farm-details/save')
        .send(initialData)
        .expect(200);

      // Get analytics for the farm
      const analyticsResponse = await request(app)
        .get('/api/profile/analytics')
        .expect(200);

      const analytics = analyticsResponse.body.analytics;
      
      expect(analytics.overview.totalLandArea).toBe(25);
      expect(analytics.overview.farmingExperience).toBe(8);
      expect(analytics.overview.totalActiveCrops).toBe(2);
      
      // Update farm data
      const updatedData = {
        totalLandSize: 35,
        primaryCrops: ['rice', 'wheat', 'cotton'],
        yearsOfExperience: 12
      };

      await request(app)
        .put('/api/profile/farm-details/save')
        .send(updatedData)
        .expect(200);

      // Get updated analytics
      const updatedAnalyticsResponse = await request(app)
        .get('/api/profile/analytics')
        .expect(200);

      const updatedAnalytics = updatedAnalyticsResponse.body.analytics;
      
      expect(updatedAnalytics.overview.totalLandArea).toBe(35);
      expect(updatedAnalytics.overview.farmingExperience).toBe(12);
      expect(updatedAnalytics.overview.totalActiveCrops).toBe(3);
    });
  });

  describe('Data Persistence Tests', () => {
    test('should save and persist all farm form fields', async () => {
      const comprehensiveFormData = {
        // All the fields from your form
        farmName: 'Complete Test Farm',
        totalLandSize: 40,
        landUnit: 'acres',
        primaryCrops: ['rice', 'wheat', 'cotton'],
        secondaryCrops: ['vegetables'],
        farmingExperience: '10_15_years',
        farmingMethod: 'mixed',
        state: 'Gujarat',
        city: 'Ahmedabad',
        district: 'Ahmedabad',
        pincode: '380001',
        landType: 'irrigated',
        soilType: 'black_soil',
        
        // Soil details from your form
        phLevel: 7.0,
        organicCarbon: 1.8,
        nitrogenLevel: 'high',
        phosphorusLevel: 'medium',
        potassiumLevel: 'high',
        
        // Water & irrigation from your form
        irrigationSource: 'borewell',
        irrigationMethod: 'drip',
        waterAvailability: 'adequate',
        
        // Infrastructure from your form
        farmRoads: 'excellent',
        storageFacility: 'modern_warehouse',
        electricity: '24_hours',
        nearestMarketDistance: 3,
        
        // Equipment from your form
        tractorAccess: 'owned',
        pumpSetAccess: 'owned',
        fertilizerUsage: 'mixed',
        pesticideUsage: 'minimal',
        
        // Economic from your form
        monthlyInputCosts: '50k_1lakh',
        marketingMethod: 'cooperative'
      };

      const saveResponse = await request(app)
        .post('/api/profile/farm-details/save')
        .send(comprehensiveFormData)
        .expect(200);

      expect(saveResponse.body.message).toBe('Farm details saved successfully');
      
      // Verify ALL data is persisted correctly
      const profile = await profileModel.findOne({ userId: testUserId });
      
      // Basic details
      expect(profile.landDetails.farmName).toBe('Complete Test Farm');
      expect(profile.landDetails.totalLandSize.value).toBe(40);
      expect(profile.landDetails.totalLandSize.unit).toBe('acres');
      expect(profile.landDetails.landType).toBe('irrigated');
      expect(profile.landDetails.soilType).toBe('black_soil');
      
      // Location
      expect(profile.location.state).toBe('Gujarat');
      expect(profile.location.city).toBe('Ahmedabad');
      expect(profile.location.district).toBe('Ahmedabad');
      expect(profile.location.pincode).toBe('380001');
      
      // Farming experience
      expect(profile.farmingExperience.yearsOfExperience).toBeDefined();
      expect(profile.farmingExperience.farmingType).toBe('mixed');
      
      // Crops
      expect(profile.cropsGrown.length).toBeGreaterThan(0);
      const cropNames = profile.cropsGrown.map(crop => crop.cropName);
      expect(cropNames).toContain('rice');
      expect(cropNames).toContain('wheat');
      expect(cropNames).toContain('cotton');
      
      // Soil details
      expect(profile.landDetails.soilDetails.phLevel).toBe(7.0);
      expect(profile.landDetails.soilDetails.organicCarbon).toBe(1.8);
      expect(profile.landDetails.soilDetails.nitrogenLevel).toBe('high');
      expect(profile.landDetails.soilDetails.phosphorusLevel).toBe('medium');
      expect(profile.landDetails.soilDetails.potassiumLevel).toBe('high');
      
      // Infrastructure
      expect(profile.landDetails.farmingInfrastructure.farmRoads).toBe('excellent');
      expect(profile.landDetails.farmingInfrastructure.storageFacility).toBe('modern_warehouse');
      expect(profile.landDetails.farmingInfrastructure.electricity).toBe('24_hours');
      expect(profile.landDetails.farmingInfrastructure.nearestMarketDistance).toBe(3);
      
      // Equipment
      expect(profile.landDetails.equipmentInputs.tractorAccess).toBe('owned');
      expect(profile.landDetails.equipmentInputs.pumpSetAccess).toBe('owned');
      expect(profile.landDetails.equipmentInputs.fertilizerUsage).toBe('mixed');
      expect(profile.landDetails.equipmentInputs.pesticideUsage).toBe('minimal');
      
      // Economic
      expect(profile.landDetails.economicInfo.monthlyInputCosts).toBe('50k_1lakh');
      expect(profile.landDetails.economicInfo.marketingMethod).toBe('cooperative');
    });

    test('should handle form field updates correctly', async () => {
      // Initial save
      await request(app)
        .post('/api/profile/farm-details/save')
        .send({
          farmName: 'Original Farm',
          totalLandSize: 20,
          primaryCrops: ['rice'],
          phLevel: 6.5
        })
        .expect(200);

      // Update some fields
      const updateResponse = await request(app)
        .put('/api/profile/farm-details/save')
        .send({
          farmName: 'Updated Farm Name',
          totalLandSize: 25,
          phLevel: 7.2,
          organicCarbon: 2.0
        })
        .expect(200);

      expect(updateResponse.body.message).toBe('Farm details saved successfully');
      
      // Verify updates
      const profile = await profileModel.findOne({ userId: testUserId });
      expect(profile.landDetails.farmName).toBe('Updated Farm Name');
      expect(profile.landDetails.totalLandSize.value).toBe(25);
      expect(profile.landDetails.soilDetails.phLevel).toBe(7.2);
      expect(profile.landDetails.soilDetails.organicCarbon).toBe(2.0);
      
      // Verify original crops are preserved
      expect(profile.cropsGrown.length).toBe(1);
      expect(profile.cropsGrown[0].cropName).toBe('rice');
    });
  });
});
