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
    default: 1, // 1: Welcome, 2: Phone, 3: State, 4: City, 5: District, 6: Land Size, 7: Crop Selection
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
  
  // Check if profile is complete
  const completion = this.profileCompletion;
  this.profileCompletion.isProfileComplete = 
    completion.welcomeCompleted && 
    completion.phoneCompleted && 
    completion.stateCompleted && 
    completion.cityCompleted && 
    completion.districtCompleted && 
    completion.landSizeCompleted && 
    completion.cropSelectionCompleted;
  
  // Set completion date if just completed
  if (this.profileCompletion.isProfileComplete && !this.profileCompletedAt) {
    this.profileCompletedAt = new Date();
  }
  
  next();
});

// Instance method to get profile completion percentage
profileSchema.methods.getCompletionPercentage = function() {
  const completion = this.profileCompletion;
  const totalSteps = 7;
  let completedSteps = 0;
  
  if (completion.welcomeCompleted) completedSteps++;
  if (completion.phoneCompleted) completedSteps++;
  if (completion.stateCompleted) completedSteps++;
  if (completion.cityCompleted) completedSteps++;
  if (completion.districtCompleted) completedSteps++;
  if (completion.landSizeCompleted) completedSteps++;
  if (completion.cropSelectionCompleted) completedSteps++;
  
  return Math.round((completedSteps / totalSteps) * 100);
};

// Instance method to get next step
profileSchema.methods.getNextStep = function() {
  const completion = this.profileCompletion;
  
  if (!completion.welcomeCompleted) return 1;
  if (!completion.phoneCompleted) return 2;
  if (!completion.stateCompleted) return 3;
  if (!completion.cityCompleted) return 4;
  if (!completion.districtCompleted) return 5;
  if (!completion.landSizeCompleted) return 6;
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
