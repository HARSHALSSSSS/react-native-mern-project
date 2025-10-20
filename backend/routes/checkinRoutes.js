const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/auth');
const checkinController = require('../controllers/checkinController');

/**
 * Check-In Routes
 */

// Check-in user via QR code (admin/staff)
router.post('/checkin', authMiddleware, checkinController.checkInUser);

// Get check-in statistics (admin)
router.get('/stats/:eventId', authMiddleware, checkinController.getCheckInStats);

module.exports = router;
