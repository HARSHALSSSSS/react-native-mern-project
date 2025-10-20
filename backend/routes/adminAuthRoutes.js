const express = require('express');
const router = express.Router();
const { authMiddleware, roleMiddleware } = require('../middleware/auth');
const upload = require('../middleware/upload');
const adminAuthController = require('../controllers/adminAuthController');

/**
 * Admin Authentication Routes
 */

// Public routes
router.post('/register', adminAuthController.adminRegister);
router.post('/login', adminAuthController.adminLogin);

// Protected routes (require authentication)
router.get('/profile', authMiddleware, adminAuthController.getAdminProfile);
router.put('/profile', authMiddleware, adminAuthController.updateAdminProfile);
router.post('/change-password', authMiddleware, adminAuthController.changePassword);

module.exports = router;
