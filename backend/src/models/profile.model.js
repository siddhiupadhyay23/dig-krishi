const mongoose = require("mongoose");

const profileSchema = new mongoose.Schema({
  // Reference to the user
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
    unique: true
  },
  
  // Profile completion tracking
  profileCompletion: {
    welcomeCompleted: {
      type: Boolean,
      default: false
    },
    phoneCompleted: {
      type: Boolean,
      default: false
    },
    stateCompleted: {
      type: Boolean,
      default: false
    },
    cityCompleted: {
      type: Boolean,
      default: false
    },
    districtCompleted: {
      type: Boolean,
      default: false
    },
    landSizeCompleted: {
      type: Boolean,
      default: false
    },
    cropSelectionCompleted: {
      type: Boolean,
      default: false
    },
    isProfileComplete: {
      type: Boolean,
      default: false
    }
  },

  // Personal Information
  personalInfo: {
    phoneNumber: {
      type: String,
      default: null,
      validate: {
        validator: function(v) {
          // Allow null or valid phone number (10 digits)
          return v === null || /^\d{10}$/.test(v);
        },
        message: 'Phone number must be 10 digits'
      }
    },
    dateOfBirth: {
      type: Date,
      default: null
    },
    gender: {
      type: String,
      enum: ['male', 'female', 'other', 'prefer_not_to_say'],
      default: null
    },
    education: {
      type: String,
      enum: ['primary', 'secondary', 'higher_secondary', 'graduate', 'post_graduate', 'other'],
      default: null
    },
    occupation: {
      primary: {
        type: String,
        default: 'farming'
      },
      secondary: {
        type: String,
        default: null
      }
    },
    familyMembers: {
      total: {
        type: Number,
        min: 1,
        default: null
      },
      dependents: {
        type: Number,
        min: 0,
        default: null
      }
    },
    profilePhoto: {
      type: String,
      default: null
    },
    bio: {
      type: String,
      maxlength: 500,
      default: null
    }
  },

  // Location Information
  location: {
    city: {
      type: String,
      default: null,
      trim: true
    },
    district: {
      type: String,
      default: null,
      trim: true
    },
    state: {
      type: String,
      default: null,
      trim: true
    },
    pincode: {
      type: String,
      default: null,
      validate: {
        validator: function(v) {
          // Allow null or valid pincode (6 digits)
          return v === null || /^\d{6}$/.test(v);
        },
        message: 'Pincode must be 6 digits'
      }
    }
  },

  // Land Information
  landDetails: {
    farmName: {
      type: String,
      default: null,
      trim: true
    },
    totalLandSize: {
      value: {
        type: Number,
        default: null,
        min: 0
      },
      unit: {
        type: String,
        enum: ['acres', 'hectares', 'bigha', 'guntha', 'square_feet', 'square_meters'],
        default: 'acres'
      }
    },
    landType: {
      type: String,
      enum: ['irrigated', 'rain_fed', 'mixed'],
      default: null
    },
    soilType: {
      type: String,
      enum: ['clay', 'sandy', 'loamy', 'black_soil', 'red_soil', 'alluvial', 'other'],
      default: null
    },
    irrigationMethods: [{
      type: String,
      enum: ['drip', 'sprinkler', 'flood', 'furrow', 'center_pivot', 'manual', 'rain_fed']
    }],
    waterSource: {
      type: String,
      enum: ['borewell', 'canal', 'river', 'pond', 'rainwater', 'other'],
      default: null
    },
    irrigationSystem: {
      type: String,
      default: null
    },
    landOwnership: {
      type: String,
      enum: ['owned', 'leased', 'shared', 'contract_farming'],
      default: 'owned'
    },
    landCertificates: {
      hasTitle: {
        type: Boolean,
        default: false
      },
      titleNumber: {
        type: String,
        default: null
      },
      registrationNumber: {
        type: String,
        default: null
      }
    },
    // Soil Details (Optional but Recommended)
    soilDetails: {
      phLevel: {
        type: Number,
        min: 0,
        max: 14,
        default: null
      },
      organicCarbon: {
        type: Number,
        min: 0,
        max: 100,
        default: null
      },
      nitrogenLevel: {
        type: String,
        enum: ['low', 'medium', 'high'],
        default: null
      },
      phosphorusLevel: {
        type: String,
        enum: ['low', 'medium', 'high'],
        default: null
      },
      potassiumLevel: {
        type: String,
        enum: ['low', 'medium', 'high'],
        default: null
      }
    },
    
    // Water & Irrigation Details
    waterIrrigation: {
      irrigationSource: {
        type: String,
        enum: ['borewell', 'canal', 'river', 'pond', 'rainwater', 'other'],
        default: null
      },
      irrigationMethod: {
        type: String,
        enum: ['drip', 'sprinkler', 'flood', 'furrow', 'other'],
        default: null
      },
      waterAvailability: {
        type: String,
        enum: ['abundant', 'adequate', 'limited', 'scarce'],
        default: null
      }
    },
    
    // Farm Infrastructure
    farmingInfrastructure: {
      hasWarehouses: {
        type: Boolean,
        default: false
      },
      warehouseCapacity: {
        type: Number,
        default: null
      },
      hasProcessingUnits: {
        type: Boolean,
        default: false
      },
      farmRoads: {
        type: String,
        enum: ['excellent', 'good', 'fair', 'poor', 'none'],
        default: null
      },
      storageFacility: {
        type: String,
        enum: ['modern_warehouse', 'traditional_storage', 'cold_storage', 'none'],
        default: null
      },
      electricity: {
        type: String,
        enum: ['24_hours', '12_hours', '6_hours', 'irregular', 'none'],
        default: null
      },
      nearestMarketDistance: {
        type: Number,
        min: 0,
        default: null
      },
      machinery: [{
        name: String,
        type: String,
        condition: {
          type: String,
          enum: ['excellent', 'good', 'fair', 'poor'],
          default: 'good'
        },
        purchaseYear: Number
      }]
    },
    
    // Equipment & Inputs
    equipmentInputs: {
      tractorAccess: {
        type: String,
        enum: ['owned', 'rented', 'shared', 'none'],
        default: null
      },
      pumpSetAccess: {
        type: String,
        enum: ['owned', 'rented', 'shared', 'none'],
        default: null
      },
      fertilizerUsage: {
        type: String,
        enum: ['organic_only', 'chemical_only', 'mixed', 'minimal', 'none'],
        default: null
      },
      pesticideUsage: {
        type: String,
        enum: ['organic_only', 'chemical_only', 'mixed', 'minimal', 'none'],
        default: null
      }
    },
    
    // Economic Information
    economicInfo: {
      monthlyInputCosts: {
        type: String,
        enum: ['below_10k', '10k_25k', '25k_50k', '50k_1lakh', 'above_1lakh'],
        default: null
      },
      marketingMethod: {
        type: String,
        enum: ['direct_market', 'middleman', 'cooperative', 'online', 'contract_farming'],
        default: null
      },
      annualIncome: {
        type: Number,
        min: 0,
        default: null
      },
      investmentCapacity: {
        type: Number,
        min: 0,
        default: null
      }
    }
  },

  // Crop Information
  cropsGrown: [
    {
      cropName: {
        type: String,
        required: true,
        trim: true
      },
      cropType: {
        type: String,
        enum: ['food_grain', 'cash_crop', 'plantation', 'horticulture', 'spices', 'other'],
        default: 'other'
      },
      season: {
        type: String,
        enum: ['kharif', 'rabi', 'zaid', 'year_round'],
        default: 'kharif'
      },
      areaAllocated: {
        value: {
          type: Number,
          min: 0,
          default: null
        },
        unit: {
          type: String,
          enum: ['acres', 'hectares', 'bigha', 'guntha', 'square_feet', 'square_meters'],
          default: 'acres'
        }
      },
      varietyName: {
        type: String,
        default: null
      },
      plantingDate: {
        type: Date,
        default: null
      },
      expectedHarvestDate: {
        type: Date,
        default: null
      },
      irrigationSchedule: {
        frequency: {
          type: String,
          enum: ['daily', 'weekly', 'bi-weekly', 'monthly', 'seasonal', 'as_needed'],
          default: 'as_needed'
        },
        waterSource: {
          type: String,
          enum: ['borewell', 'canal', 'river', 'rainwater', 'pond', 'other'],
          default: 'borewell'
        }
      },
      fertilizers: [{
        name: String,
        type: {
          type: String,
          enum: ['organic', 'chemical', 'bio_fertilizer']
        },
        applicationDate: Date,
        quantity: {
          value: Number,
          unit: String
        }
      }],
      pesticides: [{
        name: String,
        type: {
          type: String,
          enum: ['insecticide', 'fungicide', 'herbicide', 'organic']
        },
        applicationDate: Date,
        targetPest: String
      }],
      growthStages: [{
        stage: {
          type: String,
          enum: ['seeding', 'germination', 'vegetative', 'flowering', 'fruiting', 'maturity', 'harvest']
        },
        date: Date,
        notes: String,
        photos: [String]
      }],
      expenses: {
        seeds: { type: Number, default: 0 },
        fertilizers: { type: Number, default: 0 },
        pesticides: { type: Number, default: 0 },
        irrigation: { type: Number, default: 0 },
        labor: { type: Number, default: 0 },
        machinery: { type: Number, default: 0 },
        other: { type: Number, default: 0 },
        total: { type: Number, default: 0 }
      },
      expectedYield: {
        quantity: {
          type: Number,
          default: null
        },
        unit: {
          type: String,
          enum: ['kg', 'quintal', 'ton', 'bags'],
          default: 'kg'
        }
      },
      actualYield: {
        quantity: {
          type: Number,
          default: null
        },
        unit: {
          type: String,
          enum: ['kg', 'quintal', 'ton', 'bags'],
          default: 'kg'
        }
      },
      marketPrice: {
        pricePerUnit: {
          type: Number,
          default: null
        },
        unit: {
          type: String,
          enum: ['kg', 'quintal', 'ton'],
          default: 'kg'
        },
        marketLocation: String,
        saleDate: Date
      },
      revenue: {
        type: Number,
        default: 0
      },
      profit: {
        type: Number,
        default: 0
      },
      isActive: {
        type: Boolean,
        default: true
      },
      cropStatus: {
        type: String,
        enum: ['planned', 'planted', 'growing', 'harvested', 'sold', 'completed'],
        default: 'planned'
      },
      addedDate: {
        type: Date,
        default: Date.now
      }
    }
  ],

  // Farming Experience
  farmingExperience: {
    yearsOfExperience: {
      type: Number,
      min: 0,
      default: null
    },
    farmingType: {
      type: String,
      enum: ['traditional', 'organic', 'modern', 'mixed'],
      default: null
    }
  },

  // Current Step in Profile Setup
  currentProfileStep: {
    type: Number,
    default: 1, // 1: Welcome, 2: Phone, 3: State, 4: City, 5: District (optional), 6: Land Size, 7: Crop Selection
    min: 1,
    max: 7
  },

  // Profile setup completion date
  profileCompletedAt: {
    type: Date,
    default: null
  },

  // Additional metadata
  lastUpdated: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index for faster queries
profileSchema.index({ userId: 1 });
profileSchema.index({ 'location.city': 1 });
profileSchema.index({ 'location.district': 1 });
profileSchema.index({ 'cropsGrown.cropName': 1 });

// Pre-save middleware to update lastUpdated
profileSchema.pre('save', function(next) {
  this.lastUpdated = new Date();
  
  // Check if profile is complete (district is optional)
  const completion = this.profileCompletion;
  this.profileCompletion.isProfileComplete = 
    completion.welcomeCompleted && 
    completion.phoneCompleted && 
    completion.stateCompleted && 
    completion.cityCompleted && 
    completion.landSizeCompleted && 
    completion.cropSelectionCompleted;
  
  // Set completion date if just completed
  if (this.profileCompletion.isProfileComplete && !this.profileCompletedAt) {
    this.profileCompletedAt = new Date();
  }
  
  next();
});

// Instance method to get profile completion percentage (district is optional)
profileSchema.methods.getCompletionPercentage = function() {
  const completion = this.profileCompletion;
  const totalRequiredSteps = 6; // Excluding district as it's optional
  const totalOptionalSteps = 1; // District
  let completedRequiredSteps = 0;
  let completedOptionalSteps = 0;
  
  // Required steps
  if (completion.welcomeCompleted) completedRequiredSteps++;
  if (completion.phoneCompleted) completedRequiredSteps++;
  if (completion.stateCompleted) completedRequiredSteps++;
  if (completion.cityCompleted) completedRequiredSteps++;
  if (completion.landSizeCompleted) completedRequiredSteps++;
  if (completion.cropSelectionCompleted) completedRequiredSteps++;
  
  // Optional steps
  if (completion.districtCompleted) completedOptionalSteps++;
  
  // Calculate percentage with optional steps as bonus
  const requiredPercentage = (completedRequiredSteps / totalRequiredSteps) * 90; // 90% for required
  const optionalPercentage = (completedOptionalSteps / totalOptionalSteps) * 10; // 10% bonus for optional
  
  return Math.round(requiredPercentage + optionalPercentage);
};

// Instance method to get next step (district step is optional, can be skipped)
profileSchema.methods.getNextStep = function() {
  const completion = this.profileCompletion;
  
  if (!completion.welcomeCompleted) return 1;
  if (!completion.phoneCompleted) return 2;
  if (!completion.stateCompleted) return 3;
  if (!completion.cityCompleted) return 4;
  if (!completion.landSizeCompleted) return 6; // Skip district (5) as it's optional
  if (!completion.cropSelectionCompleted) return 7;
  
  return 0; // Profile complete
};

// Static method to create initial profile for user
profileSchema.statics.createInitialProfile = function(userId) {
  return this.create({
    userId: userId,
    currentProfileStep: 1,
    profileCompletion: {
      welcomeCompleted: false,
      phoneCompleted: false,
      stateCompleted: false,
      cityCompleted: false,
      districtCompleted: false,
      landSizeCompleted: false,
      cropSelectionCompleted: false,
      isProfileComplete: false
    }
  });
};

const profileModel = mongoose.model("profile", profileSchema);

module.exports = profileModel;
