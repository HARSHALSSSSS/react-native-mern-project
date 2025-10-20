const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/auth');
const venueController = require('../controllers/venueController');

/**
 * Venue Management Routes
 */

// Create venue
router.post('/', authMiddleware, venueController.createVenue);

// Get all venues
router.get('/', venueController.getAllVenues);

// Get venue by ID
router.get('/:id', venueController.getVenueById);

// Update venue
router.put('/:id', authMiddleware, venueController.updateVenue);

// Delete venue
router.delete('/:id', authMiddleware, venueController.deleteVenue);

module.exports = router;
