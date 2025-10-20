const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/auth');
const dashboardController = require('../controllers/dashboardController');

/**
 * Dashboard Routes
 */

// Get admin dashboard
router.get('/admin', authMiddleware, dashboardController.getAdminDashboard);

module.exports = router;
