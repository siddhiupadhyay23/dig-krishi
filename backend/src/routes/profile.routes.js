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
    skipStep
} = require("../controller/profile.controller");

const router = express.Router();

// Authentication middleware
const authMiddleware = require("../middleware/auth.middleware");
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

module.exports = router;
