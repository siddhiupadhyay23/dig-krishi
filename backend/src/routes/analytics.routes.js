const express = require('express');
const router = express.Router();
const analyticsController = require('../controller/analytics.controller');
const { authMiddleware } = require('../middlewares/auth.middleware');

// Get comprehensive farm analytics
router.get('/farm', authMiddleware, analyticsController.getFarmAnalytics);

// Get analytics summary (lighter endpoint)
router.get('/summary', authMiddleware, analyticsController.getAnalyticsSummary);

module.exports = router;
