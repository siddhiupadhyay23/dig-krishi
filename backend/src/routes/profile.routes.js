const express = require("express");
const { 
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
} = require("../controller/profile.controller");

const router = express.Router();

// Authentication middleware
const { authMiddleware } = require("../middlewares/auth.middleware");
router.use(authMiddleware);

// GET - Get user profile data
router.get("/", getUserProfile);

// POST - Update profile steps
router.post("/welcome", updateWelcomeStep);
router.post("/phone", updatePhoneNumber);
router.post("/state", updateState);
router.post("/city", updateCity);
router.post("/district", updateDistrict);
router.post("/land-size", updateLandSize);
router.post("/crops", updateCropSelection);

// POST - Skip optional steps
router.post("/skip", skipStep);

// POST - Update complete personal information
router.put("/personal-info", updatePersonalInfo);

// POST - Update complete farm details
router.put("/farm-details", updateFarmDetails);

// POST - Update farming experience
router.put("/farming-experience", updateFarmingExperience);

// POST - Add new crop
router.post("/crop/add", addCrop);

// DELETE - Remove crop
router.delete("/crop/:cropId", removeCrop);

// PUT - Update crop
router.put("/crop/:cropId", updateCrop);

module.exports = router;
