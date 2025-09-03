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

// Update district (Step 5 - Optional)
async function updateDistrict(req, res) {
    try {
        const userId = req.user.id;
        const { district } = req.body;

        let profile = await profileModel.findOne({ userId });
        if (!profile) {
            return res.status(404).json({
                message: "Profile not found"
            });
        }

        // District is optional, so allow null/empty values
        profile.location.district = district || null;
        profile.profileCompletion.districtCompleted = true;
        profile.currentProfileStep = 6;
        await profile.save();

        res.status(200).json({
            message: district ? "District updated successfully" : "District step skipped",
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
                // District can be skipped as it's optional
                profile.profileCompletion.districtCompleted = true;
                profile.location.district = null;
                break;
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

// Update complete personal information
async function updatePersonalInfo(req, res) {
    try {
        const userId = req.user.id;
        const { phoneNumber, profilePhoto } = req.body;

        // Validate phone number if provided
        if (phoneNumber && !/^\d{10}$/.test(phoneNumber)) {
            return res.status(400).json({
                message: "Phone number must be 10 digits"
            });
        }

        let profile = await profileModel.findOne({ userId });
        if (!profile) {
            profile = await profileModel.createInitialProfile(userId);
        }

        // Update personal information
        if (phoneNumber !== undefined) {
            profile.phoneNumber = phoneNumber;
            profile.profileCompletion.phoneCompleted = true;
        }

        await profile.save();

        // Populate user data for response
        await profile.populate('userId', 'email fullName');

        res.status(200).json({
            message: "Personal information updated successfully",
            profile: profile,
            completionPercentage: profile.getCompletionPercentage(),
            nextStep: profile.getNextStep()
        });
    } catch (error) {
        console.error('Update personal info error:', error);
        res.status(500).json({
            message: "Internal server error",
            error: error.message
        });
    }
}

// Update complete farm details
async function updateFarmDetails(req, res) {
    try {
        const userId = req.user.id;
        const { 
            farmName, 
            landSize, 
            unit, 
            landType, 
            soilType,
            state,
            city,
            district,
            pincode,
            primaryCrops,
            secondaryCrops,
            customPrimaryCrops,
            customSecondaryCrops,
            experience,
            farmingMethod
        } = req.body;

        let profile = await profileModel.findOne({ userId });
        if (!profile) {
            return res.status(404).json({
                message: "Profile not found"
            });
        }

        // Update location if provided
        if (state) {
            profile.location.state = state;
            profile.profileCompletion.stateCompleted = true;
        }
        if (city) {
            profile.location.city = city;
            profile.profileCompletion.cityCompleted = true;
        }
        if (district) {
            profile.location.district = district;
            profile.profileCompletion.districtCompleted = true;
        }
        // Pincode is optional now
        if (pincode !== undefined) {
            if (pincode && !/^\d{6}$/.test(pincode)) {
                return res.status(400).json({
                    message: "Pincode must be 6 digits"
                });
            }
            profile.location.pincode = pincode || null;
        }

        // Update farm name
        if (farmName !== undefined) {
            profile.landDetails.farmName = farmName || null;
        }

        // Update land details
        if (landSize !== undefined) {
            if (landSize && landSize <= 0) {
                return res.status(400).json({
                    message: "Land size must be greater than 0"
                });
            }
            profile.landDetails.totalLandSize.value = landSize;
            profile.landDetails.totalLandSize.unit = unit || 'acres';
            profile.profileCompletion.landSizeCompleted = true;
        }
        
        if (landType) {
            profile.landDetails.landType = landType;
        }
        if (soilType) {
            profile.landDetails.soilType = soilType;
        }

        // Update farming experience
        if (experience !== undefined) {
            // Map frontend experience values to years
            let yearsOfExperience = null;
            if (experience === 'beginner') yearsOfExperience = 1;
            else if (experience === 'intermediate') yearsOfExperience = 5;
            else if (experience === 'experienced') yearsOfExperience = 15;
            
            profile.farmingExperience.yearsOfExperience = yearsOfExperience;
        }

        if (farmingMethod !== undefined) {
            // Map frontend values to backend enum
            const farmingTypeMap = {
                'organic': 'organic',
                'conventional': 'traditional',
                'mixed': 'mixed',
                'sustainable': 'modern'
            };
            profile.farmingExperience.farmingType = farmingTypeMap[farmingMethod] || farmingMethod;
        }

        // Handle crops data - convert arrays + custom fields to complex cropsGrown array
        if (primaryCrops !== undefined || secondaryCrops !== undefined) {
            const cropNames = [];
            
            // Handle primary crops array
            if (Array.isArray(primaryCrops) && primaryCrops.length > 0) {
                // Add predefined primary crops
                const predefinedPrimaryCrops = primaryCrops.filter(crop => crop !== 'other');
                cropNames.push(...predefinedPrimaryCrops);
                
                // Add custom primary crops if 'other' is selected
                if (primaryCrops.includes('other') && customPrimaryCrops) {
                    cropNames.push(...customPrimaryCrops.split(',').map(crop => crop.trim()).filter(crop => crop));
                }
            }
            
            // Handle secondary crops array (optional)
            if (Array.isArray(secondaryCrops) && secondaryCrops.length > 0) {
                // Add predefined secondary crops
                const predefinedSecondaryCrops = secondaryCrops.filter(crop => crop !== 'other');
                cropNames.push(...predefinedSecondaryCrops);
                
                // Add custom secondary crops if 'other' is selected
                if (secondaryCrops.includes('other') && customSecondaryCrops) {
                    cropNames.push(...customSecondaryCrops.split(',').map(crop => crop.trim()).filter(crop => crop));
                }
            }
            
            // Convert to cropsGrown array format
            profile.cropsGrown = cropNames.map(cropName => ({
                cropName: cropName,
                cropType: 'other', // Default type
                season: 'kharif', // Default season
                areaAllocated: {
                    value: null, // No area specified
                    unit: unit || 'acres'
                },
                isActive: true
            }));
            
            if (cropNames.length > 0) {
                profile.profileCompletion.cropSelectionCompleted = true;
            }
        }

        await profile.save();
        await profile.populate('userId', 'email fullName');

        res.status(200).json({
            message: "Farm details updated successfully",
            profile: profile,
            completionPercentage: profile.getCompletionPercentage(),
            nextStep: profile.getNextStep()
        });
    } catch (error) {
        console.error('Update farm details error:', error);
        res.status(500).json({
            message: "Internal server error",
            error: error.message
        });
    }
}

// Update farming experience
async function updateFarmingExperience(req, res) {
    try {
        const userId = req.user.id;
        const { yearsOfExperience, farmingType } = req.body;

        let profile = await profileModel.findOne({ userId });
        if (!profile) {
            return res.status(404).json({
                message: "Profile not found"
            });
        }

        // Update farming experience
        if (yearsOfExperience !== undefined) {
            if (yearsOfExperience < 0) {
                return res.status(400).json({
                    message: "Years of experience cannot be negative"
                });
            }
            profile.farmingExperience.yearsOfExperience = yearsOfExperience;
        }
        
        if (farmingType) {
            profile.farmingExperience.farmingType = farmingType;
        }

        await profile.save();
        await profile.populate('userId', 'email fullName');

        res.status(200).json({
            message: "Farming experience updated successfully",
            profile: profile,
            completionPercentage: profile.getCompletionPercentage(),
            nextStep: profile.getNextStep()
        });
    } catch (error) {
        console.error('Update farming experience error:', error);
        res.status(500).json({
            message: "Internal server error",
            error: error.message
        });
    }
}

// Add new crop
async function addCrop(req, res) {
    try {
        const userId = req.user.id;
        const { cropName, cropType, season, areaAllocated, unit } = req.body;

        if (!cropName) {
            return res.status(400).json({
                message: "Crop name is required"
            });
        }

        let profile = await profileModel.findOne({ userId });
        if (!profile) {
            return res.status(404).json({
                message: "Profile not found"
            });
        }

        // Check if crop already exists
        const existingCrop = profile.cropsGrown.find(crop => 
            crop.cropName.toLowerCase() === cropName.toLowerCase() && crop.isActive
        );
        
        if (existingCrop) {
            return res.status(400).json({
                message: "This crop is already added to your profile"
            });
        }

        // Add new crop
        const newCrop = {
            cropName: cropName,
            cropType: cropType || 'other',
            season: season || 'kharif',
            areaAllocated: {
                value: areaAllocated || null,
                unit: unit || 'acres'
            },
            isActive: true
        };

        profile.cropsGrown.push(newCrop);
        await profile.save();
        await profile.populate('userId', 'email fullName');

        res.status(200).json({
            message: "Crop added successfully",
            profile: profile,
            addedCrop: newCrop
        });
    } catch (error) {
        console.error('Add crop error:', error);
        res.status(500).json({
            message: "Internal server error",
            error: error.message
        });
    }
}

// Remove crop
async function removeCrop(req, res) {
    try {
        const userId = req.user.id;
        const { cropId } = req.params;

        let profile = await profileModel.findOne({ userId });
        if (!profile) {
            return res.status(404).json({
                message: "Profile not found"
            });
        }

        // Find and remove the crop
        const cropIndex = profile.cropsGrown.findIndex(crop => 
            crop._id.toString() === cropId
        );
        
        if (cropIndex === -1) {
            return res.status(404).json({
                message: "Crop not found"
            });
        }

        const removedCrop = profile.cropsGrown[cropIndex];
        profile.cropsGrown.splice(cropIndex, 1);
        
        await profile.save();
        await profile.populate('userId', 'email fullName');

        res.status(200).json({
            message: "Crop removed successfully",
            profile: profile,
            removedCrop: removedCrop
        });
    } catch (error) {
        console.error('Remove crop error:', error);
        res.status(500).json({
            message: "Internal server error",
            error: error.message
        });
    }
}

// Update crop
async function updateCrop(req, res) {
    try {
        const userId = req.user.id;
        const { cropId } = req.params;
        const { cropName, cropType, season, areaAllocated, unit, isActive } = req.body;

        let profile = await profileModel.findOne({ userId });
        if (!profile) {
            return res.status(404).json({
                message: "Profile not found"
            });
        }

        // Find the crop to update
        const crop = profile.cropsGrown.id(cropId);
        if (!crop) {
            return res.status(404).json({
                message: "Crop not found"
            });
        }

        // Update crop fields
        if (cropName) crop.cropName = cropName;
        if (cropType) crop.cropType = cropType;
        if (season) crop.season = season;
        if (areaAllocated !== undefined) crop.areaAllocated.value = areaAllocated;
        if (unit) crop.areaAllocated.unit = unit;
        if (isActive !== undefined) crop.isActive = isActive;
        
        await profile.save();
        await profile.populate('userId', 'email fullName');

        res.status(200).json({
            message: "Crop updated successfully",
            profile: profile,
            updatedCrop: crop
        });
    } catch (error) {
        console.error('Update crop error:', error);
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
    skipStep,
    updatePersonalInfo,
    updateFarmDetails,
    updateFarmingExperience,
    addCrop,
    removeCrop,
    updateCrop
};
