const profileModel = require("../models/profile.model");
const userModel = require("../models/user.model");

// Get user profile data
async function getUserProfile(req, res) {
    try {
        const userId = req.user.id; // Assuming you have auth middleware
        
        let profile = await profileModel.findOne({ userId }).populate('userId', 'email fullName');
        
        // If profile doesn't exist, create initial profile
        if (!profile) {
            profile = await profileModel.createInitialProfile(userId);
            profile = await profile.populate('userId', 'email fullName');
        }

        res.status(200).json({
            message: "Profile retrieved successfully",
            profile: profile,
            completionPercentage: profile.getCompletionPercentage(),
            nextStep: profile.getNextStep()
        });
    } catch (error) {
        console.error('Get profile error:', error);
        res.status(500).json({
            message: "Internal server error",
            error: error.message
        });
    }
}

// Update welcome step (Step 1)
async function updateWelcomeStep(req, res) {
    try {
        const userId = req.user.id;
        
        let profile = await profileModel.findOne({ userId });
        if (!profile) {
            profile = await profileModel.createInitialProfile(userId);
        }

        profile.profileCompletion.welcomeCompleted = true;
        profile.currentProfileStep = 2;
        await profile.save();

        res.status(200).json({
            message: "Welcome step completed",
            profile: profile,
            nextStep: profile.getNextStep()
        });
    } catch (error) {
        console.error('Update welcome step error:', error);
        res.status(500).json({
            message: "Internal server error",
            error: error.message
        });
    }
}

// Update phone number (Step 2)
async function updatePhoneNumber(req, res) {
    try {
        const userId = req.user.id;
        const { phoneNumber } = req.body;

        // Validate phone number
        if (phoneNumber && !/^\d{10}$/.test(phoneNumber)) {
            return res.status(400).json({
                message: "Phone number must be 10 digits"
            });
        }

        let profile = await profileModel.findOne({ userId });
        if (!profile) {
            profile = await profileModel.createInitialProfile(userId);
        }

        profile.phoneNumber = phoneNumber || null;
        profile.profileCompletion.phoneCompleted = true;
        profile.currentProfileStep = 3;
        await profile.save();

        res.status(200).json({
            message: "Phone number updated successfully",
            profile: profile,
            nextStep: profile.getNextStep()
        });
    } catch (error) {
        console.error('Update phone number error:', error);
        res.status(500).json({
            message: "Internal server error",
            error: error.message
        });
    }
}

// Update state (Step 3)
async function updateState(req, res) {
    try {
        const userId = req.user.id;
        const { state } = req.body;

        if (!state) {
            return res.status(400).json({
                message: "State is required"
            });
        }

        let profile = await profileModel.findOne({ userId });
        if (!profile) {
            profile = await profileModel.createInitialProfile(userId);
        }

        profile.location.state = state;
        profile.profileCompletion.stateCompleted = true;
        profile.currentProfileStep = 4;
        await profile.save();

        res.status(200).json({
            message: "State updated successfully",
            profile: profile,
            nextStep: profile.getNextStep()
        });
    } catch (error) {
        console.error('Update state error:', error);
        res.status(500).json({
            message: "Internal server error",
            error: error.message
        });
    }
}

// Update city (Step 4)
async function updateCity(req, res) {
    try {
        const userId = req.user.id;
        const { city, pincode } = req.body;

        if (!city) {
            return res.status(400).json({
                message: "City is required"
            });
        }

        // Validate pincode if provided
        if (pincode && !/^\d{6}$/.test(pincode)) {
            return res.status(400).json({
                message: "Pincode must be 6 digits"
            });
        }

        let profile = await profileModel.findOne({ userId });
        if (!profile) {
            return res.status(404).json({
                message: "Profile not found"
            });
        }

        profile.location.city = city;
        profile.location.pincode = pincode || null;
        profile.profileCompletion.cityCompleted = true;
        profile.currentProfileStep = 5;
        await profile.save();

        res.status(200).json({
            message: "City updated successfully",
            profile: profile,
            nextStep: profile.getNextStep()
        });
    } catch (error) {
        console.error('Update city error:', error);
        res.status(500).json({
            message: "Internal server error",
            error: error.message
        });
    }
}

// Update district (Step 5)
async function updateDistrict(req, res) {
    try {
        const userId = req.user.id;
        const { district } = req.body;

        if (!district) {
            return res.status(400).json({
                message: "District is required"
            });
        }

        let profile = await profileModel.findOne({ userId });
        if (!profile) {
            return res.status(404).json({
                message: "Profile not found"
            });
        }

        profile.location.district = district;
        profile.profileCompletion.districtCompleted = true;
        profile.currentProfileStep = 6;
        await profile.save();

        res.status(200).json({
            message: "District updated successfully",
            profile: profile,
            nextStep: profile.getNextStep()
        });
    } catch (error) {
        console.error('Update district error:', error);
        res.status(500).json({
            message: "Internal server error",
            error: error.message
        });
    }
}

// Update land size (Step 6) - Can be skipped
async function updateLandSize(req, res) {
    try {
        const userId = req.user.id;
        const { landSize, unit, landType, soilType } = req.body;

        let profile = await profileModel.findOne({ userId });
        if (!profile) {
            return res.status(404).json({
                message: "Profile not found"
            });
        }

        // If landSize is provided, validate and store
        if (landSize) {
            if (landSize <= 0) {
                return res.status(400).json({
                    message: "Land size must be greater than 0"
                });
            }
            
            profile.landDetails.totalLandSize.value = landSize;
            profile.landDetails.totalLandSize.unit = unit || 'acres';
        } else {
            // Store null if skipped
            profile.landDetails.totalLandSize.value = null;
        }

        // Optional fields
        profile.landDetails.landType = landType || null;
        profile.landDetails.soilType = soilType || null;

        profile.profileCompletion.landSizeCompleted = true;
        profile.currentProfileStep = 7;
        await profile.save();

        res.status(200).json({
            message: landSize ? "Land size updated successfully" : "Land size step skipped",
            profile: profile,
            nextStep: profile.getNextStep()
        });
    } catch (error) {
        console.error('Update land size error:', error);
        res.status(500).json({
            message: "Internal server error",
            error: error.message
        });
    }
}

// Update crop selection (Step 7)
async function updateCropSelection(req, res) {
    try {
        const userId = req.user.id;
        const { crops } = req.body; // Array of crop objects

        if (!crops || !Array.isArray(crops) || crops.length === 0) {
            return res.status(400).json({
                message: "At least one crop must be selected"
            });
        }

        // Validate crop data
        for (let crop of crops) {
            if (!crop.cropName) {
                return res.status(400).json({
                    message: "Crop name is required for each crop"
                });
            }
        }

        let profile = await profileModel.findOne({ userId });
        if (!profile) {
            return res.status(404).json({
                message: "Profile not found"
            });
        }

        // Format crops data
        profile.cropsGrown = crops.map(crop => ({
            cropName: crop.cropName,
            cropType: crop.cropType || 'other',
            season: crop.season || 'kharif',
            areaAllocated: {
                value: crop.areaAllocated || null,
                unit: crop.unit || 'acres'
            },
            isActive: true
        }));

        profile.profileCompletion.cropSelectionCompleted = true;
        profile.currentProfileStep = 7; // Profile complete
        await profile.save();

        res.status(200).json({
            message: "Crop selection completed successfully",
            profile: profile,
            nextStep: profile.getNextStep(),
            profileComplete: true
        });
    } catch (error) {
        console.error('Update crop selection error:', error);
        res.status(500).json({
            message: "Internal server error",
            error: error.message
        });
    }
}

// Skip a step
async function skipStep(req, res) {
    try {
        const userId = req.user.id;
        const { step } = req.body;

        if (!step || step < 2 || step > 7) {
            return res.status(400).json({
                message: "Invalid step number"
            });
        }

        let profile = await profileModel.findOne({ userId });
        if (!profile) {
            return res.status(404).json({
                message: "Profile not found"
            });
        }

        // Mark step as completed and move to next
        switch (step) {
            case 2:
                profile.profileCompletion.phoneCompleted = true;
                profile.phoneNumber = null;
                break;
            case 3:
                // State cannot be skipped
                return res.status(400).json({
                    message: "State step cannot be skipped"
                });
            case 4:
                // City cannot be skipped
                return res.status(400).json({
                    message: "City step cannot be skipped"
                });
            case 5:
                // District cannot be skipped
                return res.status(400).json({
                    message: "District step cannot be skipped"
                });
            case 6:
                profile.profileCompletion.landSizeCompleted = true;
                profile.landDetails.totalLandSize.value = null;
                break;
            case 7:
                // Crop selection cannot be skipped
                return res.status(400).json({
                    message: "Crop selection step cannot be skipped"
                });
        }

        profile.currentProfileStep = step + 1;
        await profile.save();

        res.status(200).json({
            message: `Step ${step} skipped successfully`,
            profile: profile,
            nextStep: profile.getNextStep()
        });
    } catch (error) {
        console.error('Skip step error:', error);
        res.status(500).json({
            message: "Internal server error",
            error: error.message
        });
    }
}

module.exports = {
    getUserProfile,
    updateWelcomeStep,
    updatePhoneNumber,
    updateState,
    updateCity,
    updateDistrict,
    updateLandSize,
    updateCropSelection,
    skipStep
};
