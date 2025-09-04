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

// ===== ENHANCED PROFILE MANAGEMENT ROUTES =====

// Personal Information Management
// PUT - Update complete personal information with enhanced fields
router.put("/personal-info/complete", updateCompletePersonalInfo);

// Farm Details Management
// PUT - Update complete farm details with enhanced fields
router.put("/farm-details/complete", updateCompleteFarmDetails);

// ===== COMPREHENSIVE FARM DETAILS SAVE ROUTE =====
// POST - Save all farm details (Main route for farm details form)
router.post("/farm-details/save", saveFarmDetails);
// PUT - Save all farm details (Alternative method)
router.put("/farm-details/save", saveFarmDetails);

// Enhanced Crop Management
// POST - Add detailed crop with comprehensive information
router.post("/crops/detailed", addDetailedCrop);

// PUT - Update detailed crop information
router.put("/crops/detailed/:cropId", updateDetailedCrop);

// POST - Add growth stage to crop
router.post("/crops/:cropId/growth-stage", addGrowthStage);

// Farm Analytics Routes
// GET - Get comprehensive farm analytics
router.get("/analytics", getFarmAnalytics);

// GET - Get analytics for specific crop
router.get("/analytics/crop/:cropId", getCropAnalytics);

// ===== PROFILE SECTIONS ROUTES =====

// Personal Info Section Routes
router.get("/sections/personal-info", (req, res) => {
    // Get only personal info section
    getUserProfile(req, res);
});

// Farm Details Section Routes
router.get("/sections/farm-details", (req, res) => {
    // Get only farm details section
    getUserProfile(req, res);
});

// My Crops Section Routes
router.get("/sections/my-crops", (req, res) => {
    // Get only crops section
    getUserProfile(req, res);
});

// Analytics Section Routes
router.get("/sections/analytics", (req, res) => {
    // Get analytics section
    getFarmAnalytics(req, res);
});

module.exports = router;
