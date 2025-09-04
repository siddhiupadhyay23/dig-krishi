const profileModel = require("../models/profile.model");
const userModel = require("../models/user.model");
const AnalyticsService = require("../services/analytics.service");

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

        // Support both old and new phone number structure
        if (profile.personalInfo) {
            profile.personalInfo.phoneNumber = phoneNumber || null;
        } else {
            profile.phoneNumber = phoneNumber || null;
        }
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

        // Update personal information (support both old and new structure)
        if (phoneNumber !== undefined) {
            // Update both old and new structure for backwards compatibility
            profile.phoneNumber = phoneNumber;
            if (profile.personalInfo) {
                profile.personalInfo.phoneNumber = phoneNumber;
            }
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

// Enhanced Personal Information Management
async function updateCompletePersonalInfo(req, res) {
    try {
        const userId = req.user.id;
        const { 
            phoneNumber, 
            dateOfBirth, 
            gender, 
            education, 
            primaryOccupation,
            secondaryOccupation,
            totalFamilyMembers,
            dependents,
            profilePhoto,
            bio
        } = req.body;

        let profile = await profileModel.findOne({ userId });
        if (!profile) {
            profile = await profileModel.createInitialProfile(userId);
        }

        // Validate phone number if provided
        if (phoneNumber && !/^\d{10}$/.test(phoneNumber)) {
            return res.status(400).json({
                message: "Phone number must be 10 digits"
            });
        }

        // Update personal information
        if (phoneNumber !== undefined) profile.personalInfo.phoneNumber = phoneNumber;
        if (dateOfBirth !== undefined) profile.personalInfo.dateOfBirth = dateOfBirth ? new Date(dateOfBirth) : null;
        if (gender !== undefined) profile.personalInfo.gender = gender;
        if (education !== undefined) profile.personalInfo.education = education;
        if (primaryOccupation !== undefined) profile.personalInfo.occupation.primary = primaryOccupation;
        if (secondaryOccupation !== undefined) profile.personalInfo.occupation.secondary = secondaryOccupation;
        if (totalFamilyMembers !== undefined) profile.personalInfo.familyMembers.total = totalFamilyMembers;
        if (dependents !== undefined) profile.personalInfo.familyMembers.dependents = dependents;
        if (profilePhoto !== undefined) profile.personalInfo.profilePhoto = profilePhoto;
        if (bio !== undefined) profile.personalInfo.bio = bio;

        // Update completion status
        if (phoneNumber) profile.profileCompletion.phoneCompleted = true;

        await profile.save();
        await profile.populate('userId', 'fullName email');

        res.status(200).json({
            message: "Personal information updated successfully",
            profile: profile,
            completionPercentage: profile.getCompletionPercentage()
        });
    } catch (error) {
        console.error('Update complete personal info error:', error);
        res.status(500).json({
            message: "Internal server error",
            error: error.message
        });
    }
}

// Enhanced Farm Details Management
async function updateCompleteFarmDetails(req, res) {
    try {
        const userId = req.user.id;
        const {
            farmName,
            totalLandSize,
            landUnit,
            landType,
            soilType,
            irrigationMethods,
            landOwnership,
            hasTitle,
            titleNumber,
            registrationNumber,
            hasWarehouses,
            warehouseCapacity,
            hasProcessingUnits,
            machinery
        } = req.body;

        let profile = await profileModel.findOne({ userId });
        if (!profile) {
            return res.status(404).json({
                message: "Profile not found"
            });
        }

        // Update land details
        if (farmName !== undefined) profile.landDetails.farmName = farmName;
        if (totalLandSize !== undefined) {
            profile.landDetails.totalLandSize.value = totalLandSize;
            profile.landDetails.totalLandSize.unit = landUnit || 'acres';
            if (totalLandSize) profile.profileCompletion.landSizeCompleted = true;
        }
        if (landType !== undefined) profile.landDetails.landType = landType;
        if (soilType !== undefined) profile.landDetails.soilType = soilType;
        if (irrigationMethods !== undefined) profile.landDetails.irrigationMethods = irrigationMethods;
        if (landOwnership !== undefined) profile.landDetails.landOwnership = landOwnership;
        
        // Update land certificates
        if (hasTitle !== undefined) profile.landDetails.landCertificates.hasTitle = hasTitle;
        if (titleNumber !== undefined) profile.landDetails.landCertificates.titleNumber = titleNumber;
        if (registrationNumber !== undefined) profile.landDetails.landCertificates.registrationNumber = registrationNumber;
        
        // Update farming infrastructure
        if (hasWarehouses !== undefined) profile.landDetails.farmingInfrastructure.hasWarehouses = hasWarehouses;
        if (warehouseCapacity !== undefined) profile.landDetails.farmingInfrastructure.warehouseCapacity = warehouseCapacity;
        if (hasProcessingUnits !== undefined) profile.landDetails.farmingInfrastructure.hasProcessingUnits = hasProcessingUnits;
        if (machinery !== undefined) profile.landDetails.farmingInfrastructure.machinery = machinery;

        await profile.save();
        await profile.populate('userId', 'fullName email');

        res.status(200).json({
            message: "Farm details updated successfully",
            profile: profile,
            completionPercentage: profile.getCompletionPercentage()
        });
    } catch (error) {
        console.error('Update complete farm details error:', error);
        res.status(500).json({
            message: "Internal server error",
            error: error.message
        });
    }
}

// Enhanced Crop Management
async function addDetailedCrop(req, res) {
    try {
        const userId = req.user.id;
        const {
            cropName,
            cropType,
            varietyName,
            season,
            areaAllocated,
            areaUnit,
            plantingDate,
            expectedHarvestDate,
            irrigationFrequency,
            waterSource,
            expectedYield,
            yieldUnit,
            expenses
        } = req.body;

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
            crop.cropName.toLowerCase() === cropName.toLowerCase() && 
            crop.isActive &&
            crop.season === (season || 'kharif')
        );
        
        if (existingCrop) {
            return res.status(400).json({
                message: "This crop for this season is already added to your profile"
            });
        }

        // Create detailed crop object
        const newCrop = {
            cropName,
            cropType: cropType || 'other',
            varietyName: varietyName || null,
            season: season || 'kharif',
            areaAllocated: {
                value: areaAllocated || null,
                unit: areaUnit || 'acres'
            },
            plantingDate: plantingDate ? new Date(plantingDate) : null,
            expectedHarvestDate: expectedHarvestDate ? new Date(expectedHarvestDate) : null,
            irrigationSchedule: {
                frequency: irrigationFrequency || 'as_needed',
                waterSource: waterSource || 'borewell'
            },
            expectedYield: {
                quantity: expectedYield || null,
                unit: yieldUnit || 'kg'
            },
            expenses: {
                seeds: expenses?.seeds || 0,
                fertilizers: expenses?.fertilizers || 0,
                pesticides: expenses?.pesticides || 0,
                irrigation: expenses?.irrigation || 0,
                labor: expenses?.labor || 0,
                machinery: expenses?.machinery || 0,
                other: expenses?.other || 0,
                total: expenses?.total || 0
            },
            cropStatus: 'planned',
            isActive: true
        };

        profile.cropsGrown.push(newCrop);
        
        // Mark crop selection as completed
        if (profile.cropsGrown.filter(crop => crop.isActive).length > 0) {
            profile.profileCompletion.cropSelectionCompleted = true;
        }

        await profile.save();
        await profile.populate('userId', 'fullName email');

        res.status(200).json({
            message: "Detailed crop added successfully",
            profile: profile,
            addedCrop: newCrop
        });
    } catch (error) {
        console.error('Add detailed crop error:', error);
        res.status(500).json({
            message: "Internal server error",
            error: error.message
        });
    }
}

// Update detailed crop information
async function updateDetailedCrop(req, res) {
    try {
        const userId = req.user.id;
        const { cropId } = req.params;
        const updateData = req.body;

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
        Object.keys(updateData).forEach(key => {
            if (key === 'plantingDate' || key === 'expectedHarvestDate') {
                crop[key] = updateData[key] ? new Date(updateData[key]) : null;
            } else if (key === 'areaAllocated') {
                crop.areaAllocated = { ...crop.areaAllocated, ...updateData[key] };
            } else if (key === 'expectedYield' || key === 'actualYield') {
                crop[key] = { ...crop[key], ...updateData[key] };
            } else if (key === 'expenses') {
                crop.expenses = { ...crop.expenses, ...updateData[key] };
            } else if (key === 'irrigationSchedule') {
                crop.irrigationSchedule = { ...crop.irrigationSchedule, ...updateData[key] };
            } else {
                crop[key] = updateData[key];
            }
        });

        // Calculate profit if both revenue and expenses are available
        if (crop.revenue && crop.expenses.total) {
            crop.profit = crop.revenue - crop.expenses.total;
        }
        
        await profile.save();
        await profile.populate('userId', 'fullName email');

        res.status(200).json({
            message: "Crop updated successfully",
            profile: profile,
            updatedCrop: crop
        });
    } catch (error) {
        console.error('Update detailed crop error:', error);
        res.status(500).json({
            message: "Internal server error",
            error: error.message
        });
    }
}

// Add growth stage to crop
async function addGrowthStage(req, res) {
    try {
        const userId = req.user.id;
        const { cropId } = req.params;
        const { stage, date, notes, photos } = req.body;

        if (!stage) {
            return res.status(400).json({
                message: "Growth stage is required"
            });
        }

        let profile = await profileModel.findOne({ userId });
        if (!profile) {
            return res.status(404).json({
                message: "Profile not found"
            });
        }

        const crop = profile.cropsGrown.id(cropId);
        if (!crop) {
            return res.status(404).json({
                message: "Crop not found"
            });
        }

        crop.growthStages.push({
            stage,
            date: date ? new Date(date) : new Date(),
            notes: notes || '',
            photos: photos || []
        });

        await profile.save();

        res.status(200).json({
            message: "Growth stage added successfully",
            crop: crop
        });
    } catch (error) {
        console.error('Add growth stage error:', error);
        res.status(500).json({
            message: "Internal server error",
            error: error.message
        });
    }
}

// Get farm analytics
async function getFarmAnalytics(req, res) {
    try {
        const userId = req.user.id;
        
        const analytics = await AnalyticsService.calculateFarmAnalytics(userId);
        
        res.status(200).json({
            message: "Farm analytics retrieved successfully",
            analytics: analytics
        });
    } catch (error) {
        console.error('Get farm analytics error:', error);
        res.status(500).json({
            message: "Internal server error",
            error: error.message
        });
    }
}

// Get crop analytics for specific crop
async function getCropAnalytics(req, res) {
    try {
        const userId = req.user.id;
        const { cropId } = req.params;
        
        const profile = await profileModel.findOne({ userId });
        if (!profile) {
            return res.status(404).json({
                message: "Profile not found"
            });
        }

        const crop = profile.cropsGrown.id(cropId);
        if (!crop) {
            return res.status(404).json({
                message: "Crop not found"
            });
        }

        // Calculate crop-specific analytics
        const analytics = {
            cropInfo: {
                name: crop.cropName,
                type: crop.cropType,
                season: crop.season,
                status: crop.cropStatus
            },
            areaInfo: crop.areaAllocated,
            timeline: {
                plantingDate: crop.plantingDate,
                expectedHarvestDate: crop.expectedHarvestDate,
                daysToHarvest: crop.expectedHarvestDate ? 
                    Math.ceil((new Date(crop.expectedHarvestDate) - new Date()) / (1000 * 60 * 60 * 24)) : null
            },
            yieldInfo: {
                expected: crop.expectedYield,
                actual: crop.actualYield,
                efficiency: crop.expectedYield.quantity > 0 ? 
                    Math.round(((crop.actualYield.quantity || 0) / crop.expectedYield.quantity) * 100) : 0
            },
            financial: {
                expenses: crop.expenses,
                revenue: crop.revenue || 0,
                profit: crop.profit || 0,
                profitMargin: crop.revenue > 0 ? Math.round((crop.profit / crop.revenue) * 100) : 0
            },
            growthProgress: {
                totalStages: crop.growthStages.length,
                currentStage: crop.growthStages.length > 0 ? 
                    crop.growthStages[crop.growthStages.length - 1].stage : 'not_started',
                stages: crop.growthStages.sort((a, b) => new Date(b.date) - new Date(a.date))
            }
        };

        res.status(200).json({
            message: "Crop analytics retrieved successfully",
            analytics: analytics
        });
    } catch (error) {
        console.error('Get crop analytics error:', error);
        res.status(500).json({
            message: "Internal server error",
            error: error.message
        });
    }
}

// COMPREHENSIVE FARM DETAILS SAVE FUNCTION
async function saveFarmDetails(req, res) {
    try {
        console.log('saveFarmDetails called. req.user:', req.user ? 'exists' : 'null');
        
        if (!req.user) {
            console.error('saveFarmDetails error: req.user is null');
            return res.status(401).json({
                message: "Authentication required",
                error: "req.user is null"
            });
        }
        
        const userId = req.user.id || req.user._id;
        const farmDetailsData = req.body;
        
        console.log('saveFarmDetails - userId:', userId, 'dataKeys:', Object.keys(farmDetailsData));
        
        console.log('Received farm details data:', JSON.stringify(farmDetailsData, null, 2));

        let profile = await profileModel.findOne({ userId });
        if (!profile) {
            profile = await profileModel.createInitialProfile(userId);
        }

        // Initialize nested objects if they don't exist
        if (!profile.landDetails) profile.landDetails = {};
        if (!profile.landDetails.farmingInfrastructure) profile.landDetails.farmingInfrastructure = {};
        if (!profile.landDetails.landCertificates) profile.landDetails.landCertificates = {};
        if (!profile.landDetails.soilDetails) profile.landDetails.soilDetails = {};
        if (!profile.landDetails.waterIrrigation) profile.landDetails.waterIrrigation = {};
        if (!profile.landDetails.equipmentInputs) profile.landDetails.equipmentInputs = {};
        if (!profile.landDetails.economicInfo) profile.landDetails.economicInfo = {};
        if (!profile.location) profile.location = {};
        if (!profile.farmingExperience) profile.farmingExperience = {};

        // === BASIC FARM INFORMATION ===
        if (farmDetailsData.farmName !== undefined) {
            profile.landDetails.farmName = farmDetailsData.farmName || null;
        }

        // === LOCATION DETAILS ===
        if (farmDetailsData.address !== undefined) profile.location.address = farmDetailsData.address;
        if (farmDetailsData.state !== undefined) {
            profile.location.state = farmDetailsData.state;
            if (farmDetailsData.state) profile.profileCompletion.stateCompleted = true;
        }
        if (farmDetailsData.city !== undefined) {
            profile.location.city = farmDetailsData.city;
            if (farmDetailsData.city) profile.profileCompletion.cityCompleted = true;
        }
        if (farmDetailsData.district !== undefined) {
            profile.location.district = farmDetailsData.district;
            if (farmDetailsData.district) profile.profileCompletion.districtCompleted = true;
        }
        if (farmDetailsData.pincode !== undefined) {
            // Validate pincode if provided
            if (farmDetailsData.pincode && !/^\d{6}$/.test(farmDetailsData.pincode)) {
                return res.status(400).json({
                    message: "Pincode must be 6 digits"
                });
            }
            profile.location.pincode = farmDetailsData.pincode || null;
        }

        // === LAND SIZE AND DETAILS ===
        if (farmDetailsData.totalLandSize !== undefined) {
            profile.landDetails.totalLandSize = {
                value: farmDetailsData.totalLandSize || null,
                unit: farmDetailsData.landUnit || 'acres'
            };
            if (farmDetailsData.totalLandSize) {
                profile.profileCompletion.landSizeCompleted = true;
            }
        }
        
        if (farmDetailsData.landUnit !== undefined && profile.landDetails.totalLandSize) {
            profile.landDetails.totalLandSize.unit = farmDetailsData.landUnit || 'acres';
        }

        // === LAND CHARACTERISTICS ===
        if (farmDetailsData.landType !== undefined) {
            profile.landDetails.landType = farmDetailsData.landType;
        }
        if (farmDetailsData.soilType !== undefined) {
            profile.landDetails.soilType = farmDetailsData.soilType;
        }
        if (farmDetailsData.landOwnership !== undefined) {
            profile.landDetails.landOwnership = farmDetailsData.landOwnership;
        }

        // === IRRIGATION DETAILS ===
        if (farmDetailsData.irrigationMethods !== undefined) {
            profile.landDetails.irrigationMethods = Array.isArray(farmDetailsData.irrigationMethods) 
                ? farmDetailsData.irrigationMethods 
                : [farmDetailsData.irrigationMethods].filter(Boolean);
        }
        if (farmDetailsData.waterSource !== undefined) {
            profile.landDetails.waterSource = farmDetailsData.waterSource;
        }
        if (farmDetailsData.irrigationSystem !== undefined) {
            profile.landDetails.irrigationSystem = farmDetailsData.irrigationSystem;
        }

        // === LAND CERTIFICATES ===
        if (farmDetailsData.hasTitle !== undefined) {
            profile.landDetails.landCertificates.hasTitle = farmDetailsData.hasTitle;
        }
        if (farmDetailsData.titleNumber !== undefined) {
            profile.landDetails.landCertificates.titleNumber = farmDetailsData.titleNumber || null;
        }
        if (farmDetailsData.registrationNumber !== undefined) {
            profile.landDetails.landCertificates.registrationNumber = farmDetailsData.registrationNumber || null;
        }
        if (farmDetailsData.surveyNumber !== undefined) {
            profile.landDetails.landCertificates.surveyNumber = farmDetailsData.surveyNumber || null;
        }
        if (farmDetailsData.khataNumber !== undefined) {
            profile.landDetails.landCertificates.khataNumber = farmDetailsData.khataNumber || null;
        }

        // === FARMING INFRASTRUCTURE ===
        if (farmDetailsData.hasWarehouses !== undefined) {
            profile.landDetails.farmingInfrastructure.hasWarehouses = farmDetailsData.hasWarehouses;
        }
        if (farmDetailsData.warehouseCapacity !== undefined) {
            profile.landDetails.farmingInfrastructure.warehouseCapacity = farmDetailsData.warehouseCapacity || null;
        }
        if (farmDetailsData.hasProcessingUnits !== undefined) {
            profile.landDetails.farmingInfrastructure.hasProcessingUnits = farmDetailsData.hasProcessingUnits;
        }
        if (farmDetailsData.processingCapacity !== undefined) {
            profile.landDetails.farmingInfrastructure.processingCapacity = farmDetailsData.processingCapacity || null;
        }
        if (farmDetailsData.hasGreenhouse !== undefined) {
            profile.landDetails.farmingInfrastructure.hasGreenhouse = farmDetailsData.hasGreenhouse;
        }
        if (farmDetailsData.greenhouseArea !== undefined) {
            profile.landDetails.farmingInfrastructure.greenhouseArea = farmDetailsData.greenhouseArea || null;
        }
        if (farmDetailsData.hasColdStorage !== undefined) {
            profile.landDetails.farmingInfrastructure.hasColdStorage = farmDetailsData.hasColdStorage;
        }
        if (farmDetailsData.coldStorageCapacity !== undefined) {
            profile.landDetails.farmingInfrastructure.coldStorageCapacity = farmDetailsData.coldStorageCapacity || null;
        }

        // === MACHINERY AND EQUIPMENT ===
        if (farmDetailsData.machinery !== undefined) {
            if (Array.isArray(farmDetailsData.machinery)) {
                profile.landDetails.farmingInfrastructure.machinery = farmDetailsData.machinery.map(machine => ({
                    name: machine.name || null,
                    type: machine.type || null,
                    condition: machine.condition || 'good',
                    purchaseYear: machine.purchaseYear || null,
                    brand: machine.brand || null,
                    model: machine.model || null
                }));
            } else {
                profile.landDetails.farmingInfrastructure.machinery = [];
            }
        }

        // === FARMING EXPERIENCE AND METHODS ===
        if (farmDetailsData.yearsOfExperience !== undefined) {
            profile.farmingExperience.yearsOfExperience = farmDetailsData.yearsOfExperience || null;
        }
        if (farmDetailsData.farmingType !== undefined) {
            profile.farmingExperience.farmingType = farmDetailsData.farmingType;
        }
        if (farmDetailsData.farmingMethod !== undefined) {
            // Map common farming method names
            const farmingMethodMap = {
                'organic': 'organic',
                'conventional': 'traditional', 
                'traditional': 'traditional',
                'modern': 'modern',
                'mixed': 'mixed',
                'sustainable': 'modern'
            };
            profile.farmingExperience.farmingType = farmingMethodMap[farmDetailsData.farmingMethod] || farmDetailsData.farmingMethod;
        }

        // === CERTIFICATIONS ===
        if (farmDetailsData.certifications !== undefined) {
            profile.landDetails.certifications = Array.isArray(farmDetailsData.certifications) 
                ? farmDetailsData.certifications 
                : [];
        }
        if (farmDetailsData.isOrganicCertified !== undefined) {
            profile.landDetails.isOrganicCertified = farmDetailsData.isOrganicCertified;
        }
        if (farmDetailsData.organicCertificationBody !== undefined) {
            profile.landDetails.organicCertificationBody = farmDetailsData.organicCertificationBody || null;
        }

        // === FINANCIAL INFORMATION ===
        if (farmDetailsData.annualIncome !== undefined) {
            profile.landDetails.annualIncome = farmDetailsData.annualIncome || null;
        }
        if (farmDetailsData.investmentCapacity !== undefined) {
            profile.landDetails.investmentCapacity = farmDetailsData.investmentCapacity || null;
        }

        // === SOIL DETAILS (OPTIONAL BUT RECOMMENDED) ===
        if (farmDetailsData.phLevel !== undefined) {
            profile.landDetails.soilDetails.phLevel = parseFloat(farmDetailsData.phLevel) || null;
        }
        if (farmDetailsData.organicCarbon !== undefined) {
            profile.landDetails.soilDetails.organicCarbon = parseFloat(farmDetailsData.organicCarbon) || null;
        }
        if (farmDetailsData.nitrogenLevel !== undefined) {
            profile.landDetails.soilDetails.nitrogenLevel = farmDetailsData.nitrogenLevel;
        }
        if (farmDetailsData.phosphorusLevel !== undefined) {
            profile.landDetails.soilDetails.phosphorusLevel = farmDetailsData.phosphorusLevel;
        }
        if (farmDetailsData.potassiumLevel !== undefined) {
            profile.landDetails.soilDetails.potassiumLevel = farmDetailsData.potassiumLevel;
        }

        // === WATER & IRRIGATION ===
        if (farmDetailsData.irrigationSource !== undefined) {
            profile.landDetails.waterIrrigation.irrigationSource = farmDetailsData.irrigationSource;
        }
        if (farmDetailsData.irrigationMethod !== undefined) {
            profile.landDetails.waterIrrigation.irrigationMethod = farmDetailsData.irrigationMethod;
        }
        if (farmDetailsData.waterAvailability !== undefined) {
            profile.landDetails.waterIrrigation.waterAvailability = farmDetailsData.waterAvailability;
        }

        // === FARM INFRASTRUCTURE ===
        if (farmDetailsData.farmRoads !== undefined) {
            profile.landDetails.farmingInfrastructure.farmRoads = farmDetailsData.farmRoads;
        }
        if (farmDetailsData.storageFacility !== undefined) {
            profile.landDetails.farmingInfrastructure.storageFacility = farmDetailsData.storageFacility;
        }
        if (farmDetailsData.electricity !== undefined) {
            profile.landDetails.farmingInfrastructure.electricity = farmDetailsData.electricity;
        }
        if (farmDetailsData.nearestMarketDistance !== undefined) {
            profile.landDetails.farmingInfrastructure.nearestMarketDistance = parseFloat(farmDetailsData.nearestMarketDistance) || null;
        }

        // === EQUIPMENT & INPUTS ===
        if (farmDetailsData.tractorAccess !== undefined) {
            profile.landDetails.equipmentInputs.tractorAccess = farmDetailsData.tractorAccess;
        }
        if (farmDetailsData.pumpSetAccess !== undefined) {
            profile.landDetails.equipmentInputs.pumpSetAccess = farmDetailsData.pumpSetAccess;
        }
        if (farmDetailsData.fertilizerUsage !== undefined) {
            profile.landDetails.equipmentInputs.fertilizerUsage = farmDetailsData.fertilizerUsage;
        }
        if (farmDetailsData.pesticideUsage !== undefined) {
            profile.landDetails.equipmentInputs.pesticideUsage = farmDetailsData.pesticideUsage;
        }

        // === ECONOMIC INFORMATION ===
        if (farmDetailsData.monthlyInputCosts !== undefined) {
            profile.landDetails.economicInfo.monthlyInputCosts = farmDetailsData.monthlyInputCosts;
        }
        if (farmDetailsData.marketingMethod !== undefined) {
            profile.landDetails.economicInfo.marketingMethod = farmDetailsData.marketingMethod;
        }
        if (farmDetailsData.annualIncome !== undefined) {
            profile.landDetails.economicInfo.annualIncome = parseFloat(farmDetailsData.annualIncome) || null;
        }
        if (farmDetailsData.investmentCapacity !== undefined) {
            profile.landDetails.economicInfo.investmentCapacity = parseFloat(farmDetailsData.investmentCapacity) || null;
        }

        // === ADDITIONAL FARM DETAILS ===
        if (farmDetailsData.nearbyMarkets !== undefined) {
            profile.landDetails.nearbyMarkets = Array.isArray(farmDetailsData.nearbyMarkets) 
                ? farmDetailsData.nearbyMarkets 
                : [];
        }
        if (farmDetailsData.transportationAccess !== undefined) {
            profile.landDetails.transportationAccess = farmDetailsData.transportationAccess;
        }
        if (farmDetailsData.electricityAccess !== undefined) {
            profile.landDetails.electricityAccess = farmDetailsData.electricityAccess;
        }
        if (farmDetailsData.internetAccess !== undefined) {
            profile.landDetails.internetAccess = farmDetailsData.internetAccess;
        }

        // === CROPS INFORMATION ===
        if (farmDetailsData.primaryCrops !== undefined || farmDetailsData.secondaryCrops !== undefined) {
            const allCrops = [];
            
            // Handle primary crops
            if (Array.isArray(farmDetailsData.primaryCrops) && farmDetailsData.primaryCrops.length > 0) {
                const predefinedPrimary = farmDetailsData.primaryCrops.filter(crop => crop !== 'other');
                allCrops.push(...predefinedPrimary.map(crop => ({ 
                    name: crop, 
                    type: 'primary',
                    category: 'predefined' 
                })));
                
                // Add custom primary crops
                if (farmDetailsData.primaryCrops.includes('other') && farmDetailsData.customPrimaryCrops) {
                    const customPrimary = farmDetailsData.customPrimaryCrops
                        .split(',')
                        .map(crop => crop.trim())
                        .filter(crop => crop);
                    allCrops.push(...customPrimary.map(crop => ({ 
                        name: crop, 
                        type: 'primary',
                        category: 'custom' 
                    })));
                }
            }
            
            // Handle secondary crops
            if (Array.isArray(farmDetailsData.secondaryCrops) && farmDetailsData.secondaryCrops.length > 0) {
                const predefinedSecondary = farmDetailsData.secondaryCrops.filter(crop => crop !== 'other');
                allCrops.push(...predefinedSecondary.map(crop => ({ 
                    name: crop, 
                    type: 'secondary',
                    category: 'predefined' 
                })));
                
                // Add custom secondary crops
                if (farmDetailsData.secondaryCrops.includes('other') && farmDetailsData.customSecondaryCrops) {
                    const customSecondary = farmDetailsData.customSecondaryCrops
                        .split(',')
                        .map(crop => crop.trim())
                        .filter(crop => crop);
                    allCrops.push(...customSecondary.map(crop => ({ 
                        name: crop, 
                        type: 'secondary',
                        category: 'custom' 
                    })));
                }
            }
            
            // Convert to cropsGrown format
            if (allCrops.length > 0) {
                profile.cropsGrown = allCrops.map(crop => ({
                    cropName: crop.name,
                    cropType: crop.type === 'primary' ? 'cash_crop' : 'other',
                    season: 'kharif',
                    areaAllocated: {
                        value: null,
                        unit: farmDetailsData.landUnit || 'acres'
                    },
                    isActive: true,
                    isPrimary: crop.type === 'primary',
                    category: crop.category
                }));
                
                profile.profileCompletion.cropSelectionCompleted = true;
            }
        }

        // Save the profile
        await profile.save();
        await profile.populate('userId', 'fullName email');

        console.log('Farm details saved successfully for user:', userId);
        console.log('Updated profile landDetails:', JSON.stringify(profile.landDetails, null, 2));

        res.status(200).json({
            message: "Farm details saved successfully",
            profile: profile,
            completionPercentage: profile.getCompletionPercentage(),
            savedFields: Object.keys(farmDetailsData),
            debug: {
                landDetails: profile.landDetails,
                location: profile.location,
                farmingExperience: profile.farmingExperience,
                cropsCount: profile.cropsGrown.length
            }
        });
    } catch (error) {
        console.error('Save farm details error:', error);
        res.status(500).json({
            message: "Internal server error",
            error: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
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
    updateCrop,
    // Enhanced profile management functions
    updateCompletePersonalInfo,
    updateCompleteFarmDetails,
    addDetailedCrop,
    updateDetailedCrop,
    addGrowthStage,
    getFarmAnalytics,
    getCropAnalytics,
    // Comprehensive farm details save
    saveFarmDetails
};
