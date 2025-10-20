const express = require('express');
const router = express.Router();
const { userAuthMiddleware } = require('../middleware/auth');
const userAuthController = require('../controllers/userAuthController');

/**
 * User Authentication Routes (Mobile App)
 */

// Public routes
router.post('/register', userAuthController.userRegister);
router.post('/login', userAuthController.userLogin);

// Protected routes
router.get('/profile', userAuthMiddleware, userAuthController.getUserProfile);
router.put('/profile', userAuthMiddleware, userAuthController.updateUserProfile);
router.post('/push-token', userAuthMiddleware, userAuthController.updatePushToken);

module.exports = router;
