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
      isActive: {
        type: Boolean,
        default: true
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
