const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../server'); // Assuming your main server file exports the app
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

describe('Profile Controller - saveFarmDetails', () => {
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
    // Clean up database before each test
    await userModel.deleteMany({});
    await profileModel.deleteMany({});
    
    // Create a test user
    testUser = await userModel.create({
      fullName: {
        firstName: 'Test',
        lastName: 'Farmer'
      },
      email: 'test@farmer.com',
      password: 'hashedpassword'
    });
    testUserId = testUser._id;
    global.testUserId = testUserId; // Set for the mock
  });

  afterEach(async () => {
    // Clean up after each test
    await userModel.deleteMany({});
    await profileModel.deleteMany({});
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  describe('Basic Farm Information Saving', () => {
    test('should save basic farm details successfully', async () => {
      const farmData = {
        farmName: 'Green Valley Farm',
        totalLandSize: 25,
        landUnit: 'acres',
        landType: 'irrigated',
        soilType: 'loamy'
      };

      const response = await request(app)
        .post('/api/profile/farm-details/save')
        .send(farmData)
        .expect(200);

      expect(response.body.message).toBe('Farm details saved successfully');
      expect(response.body.profile.landDetails.farmName).toBe('Green Valley Farm');
      expect(response.body.profile.landDetails.totalLandSize.value).toBe(25);
      expect(response.body.profile.landDetails.totalLandSize.unit).toBe('acres');

      // Verify data is actually saved in database
      const savedProfile = await profileModel.findOne({ userId: testUserId });
      expect(savedProfile.landDetails.farmName).toBe('Green Valley Farm');
      expect(savedProfile.landDetails.totalLandSize.value).toBe(25);
    });

    test('should handle missing farm name gracefully', async () => {
      const farmData = {
        totalLandSize: 15,
        landUnit: 'hectares'
      };

      const response = await request(app)
        .post('/api/profile/farm-details/save')
        .send(farmData)
        .expect(200);

      expect(response.body.profile.landDetails.farmName).toBe(null);
      expect(response.body.profile.landDetails.totalLandSize.value).toBe(15);
    });
  });

  describe('Location Details Validation', () => {
    test('should save complete location details', async () => {
      const farmData = {
        farmName: 'Test Farm',
        state: 'Gujarat',
        city: 'Vadodara',
        district: 'Vadodara',
        pincode: '390001'
      };

      const response = await request(app)
        .post('/api/profile/farm-details/save')
        .send(farmData)
        .expect(200);

      expect(response.body.profile.location.state).toBe('Gujarat');
      expect(response.body.profile.location.city).toBe('Vadodara');
      expect(response.body.profile.location.pincode).toBe('390001');
    });

    test('should validate pincode format', async () => {
      const farmData = {
        farmName: 'Test Farm',
        pincode: '12345' // Invalid pincode (5 digits instead of 6)
      };

      const response = await request(app)
        .post('/api/profile/farm-details/save')
        .send(farmData)
        .expect(400);

      expect(response.body.message).toBe('Pincode must be 6 digits');
    });

    test('should accept valid 6-digit pincode', async () => {
      const farmData = {
        farmName: 'Test Farm',
        pincode: '390001'
      };

      const response = await request(app)
        .post('/api/profile/farm-details/save')
        .send(farmData)
        .expect(200);

      expect(response.body.profile.location.pincode).toBe('390001');
    });
  });

  describe('Crop Information Handling', () => {
    test('should save primary and secondary crops correctly', async () => {
      const farmData = {
        farmName: 'Crop Test Farm',
        primaryCrops: ['rice', 'wheat', 'other'],
        customPrimaryCrops: 'millet, sorghum',
        secondaryCrops: ['vegetable', 'other'],
        customSecondaryCrops: 'tomato, onion'
      };

      const response = await request(app)
        .post('/api/profile/farm-details/save')
        .send(farmData)
        .expect(200);

      const savedProfile = await profileModel.findOne({ userId: testUserId });
      
      expect(savedProfile.cropsGrown).toHaveLength(7); // 2 primary + 2 custom primary + 1 secondary + 2 custom secondary
      
      // Check primary crops
      const primaryCrops = savedProfile.cropsGrown.filter(crop => crop.isPrimary);
      expect(primaryCrops).toHaveLength(4); // rice, wheat, millet, sorghum
      
      // Check secondary crops
      const secondaryCrops = savedProfile.cropsGrown.filter(crop => !crop.isPrimary);
      expect(secondaryCrops).toHaveLength(3); // vegetable, tomato, onion
    });

    test('should handle crops without custom entries', async () => {
      const farmData = {
        farmName: 'Simple Crop Farm',
        primaryCrops: ['rice', 'wheat']
      };

      const response = await request(app)
        .post('/api/profile/farm-details/save')
        .send(farmData)
        .expect(200);

      const savedProfile = await profileModel.findOne({ userId: testUserId });
      expect(savedProfile.cropsGrown).toHaveLength(2);
      expect(savedProfile.cropsGrown[0].cropName).toBe('rice');
      expect(savedProfile.cropsGrown[1].cropName).toBe('wheat');
    });
  });

  describe('Soil Details Validation', () => {
    test('should save soil details with valid pH level', async () => {
      const farmData = {
        farmName: 'Soil Test Farm',
        phLevel: 6.5,
        organicCarbon: 1.2,
        nitrogenLevel: 'medium',
        phosphorusLevel: 'high',
        potassiumLevel: 'low'
      };

      const response = await request(app)
        .post('/api/profile/farm-details/save')
        .send(farmData)
        .expect(200);

      expect(response.body.profile.landDetails.soilDetails.phLevel).toBe(6.5);
      expect(response.body.profile.landDetails.soilDetails.organicCarbon).toBe(1.2);
      expect(response.body.profile.landDetails.soilDetails.nitrogenLevel).toBe('medium');
    });

    test('should handle string pH conversion', async () => {
      const farmData = {
        farmName: 'pH String Test Farm',
        phLevel: '7.0' // String that should be converted to number
      };

      const response = await request(app)
        .post('/api/profile/farm-details/save')
        .send(farmData)
        .expect(200);

      expect(response.body.profile.landDetails.soilDetails.phLevel).toBe(7.0);
    });
  });

  describe('Infrastructure Details', () => {
    test('should save farming infrastructure details', async () => {
      const farmData = {
        farmName: 'Infrastructure Farm',
        hasWarehouses: true,
        warehouseCapacity: 1000,
        hasProcessingUnits: false,
        farmRoads: 'good',
        electricity: '24_hours',
        nearestMarketDistance: 5.5
      };

      const response = await request(app)
        .post('/api/profile/farm-details/save')
        .send(farmData)
        .expect(200);

      const infrastructure = response.body.profile.landDetails.farmingInfrastructure;
      expect(infrastructure.hasWarehouses).toBe(true);
      expect(infrastructure.warehouseCapacity).toBe(1000);
      expect(infrastructure.hasProcessingUnits).toBe(false);
      expect(infrastructure.farmRoads).toBe('good');
      expect(infrastructure.electricity).toBe('24_hours');
      expect(infrastructure.nearestMarketDistance).toBe(5.5);
    });

    test('should handle machinery array', async () => {
      const farmData = {
        farmName: 'Machinery Farm',
        machinery: [
          {
            name: 'Tractor',
            type: 'farming',
            condition: 'good',
            purchaseYear: 2020,
            brand: 'Mahindra',
            model: '575DI'
          },
          {
            name: 'Harvester',
            type: 'harvesting',
            condition: 'fair',
            purchaseYear: 2018
          }
        ]
      };

      const response = await request(app)
        .post('/api/profile/farm-details/save')
        .send(farmData)
        .expect(200);

      const machinery = response.body.profile.landDetails.farmingInfrastructure.machinery;
      expect(machinery).toHaveLength(2);
      expect(machinery[0].name).toBe('Tractor');
      expect(machinery[0].brand).toBe('Mahindra');
      expect(machinery[1].name).toBe('Harvester');
    });
  });

  describe('Error Handling', () => {
    test('should handle invalid user ID', async () => {
      // Mock invalid user
      jest.doMock('../src/middlewares/auth.middleware', () => {
        return (req, res, next) => {
          req.user = { id: 'invaliduserid' };
          next();
        };
      });

      const farmData = {
        farmName: 'Error Test Farm'
      };

      const response = await request(app)
        .post('/api/profile/farm-details/save')
        .send(farmData)
        .expect(500);

      expect(response.body.message).toBe('Internal server error');
    });

    test('should handle database connection errors gracefully', async () => {
      // Close database connection to simulate error
      await mongoose.connection.close();

      const farmData = {
        farmName: 'DB Error Test'
      };

      const response = await request(app)
        .post('/api/profile/farm-details/save')
        .send(farmData)
        .expect(500);

      // Reconnect for cleanup
      const mongoUri = process.env.TEST_MONGODB_URI || 'mongodb://localhost:27017/dig-krishi-test';
      await mongoose.connect(mongoUri);
    });
  });

  describe('Profile Completion Tracking', () => {
    test('should update profile completion status correctly', async () => {
      const farmData = {
        farmName: 'Completion Test Farm',
        totalLandSize: 20,
        state: 'Gujarat',
        city: 'Vadodara',
        primaryCrops: ['rice', 'wheat']
      };

      const response = await request(app)
        .post('/api/profile/farm-details/save')
        .send(farmData)
        .expect(200);

      expect(response.body.profile.profileCompletion.landSizeCompleted).toBe(true);
      expect(response.body.profile.profileCompletion.stateCompleted).toBe(true);
      expect(response.body.profile.profileCompletion.cityCompleted).toBe(true);
      expect(response.body.profile.profileCompletion.cropSelectionCompleted).toBe(true);
    });

    test('should calculate completion percentage', async () => {
      const farmData = {
        farmName: 'Percentage Test Farm',
        totalLandSize: 15,
        state: 'Gujarat',
        primaryCrops: ['rice']
      };

      const response = await request(app)
        .post('/api/profile/farm-details/save')
        .send(farmData)
        .expect(200);

      expect(response.body.completionPercentage).toBeGreaterThan(0);
      expect(typeof response.body.completionPercentage).toBe('number');
    });
  });
});
