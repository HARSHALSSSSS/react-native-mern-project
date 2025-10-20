const express = require('express');
const router = express.Router();
const { userAuthMiddleware, authMiddleware } = require('../middleware/auth');
const bookingController = require('../controllers/bookingController');

/**
 * Booking Management Routes
 */

// Create booking (user)
router.post('/', userAuthMiddleware, bookingController.createBooking);

// Get user bookings (user)
router.get('/user/my-bookings', userAuthMiddleware, bookingController.getUserBookings);

// Get booking by ID
router.get('/:id', bookingController.getBookingById);

// Cancel booking (user)
router.post('/:id/cancel', userAuthMiddleware, bookingController.cancelBooking);

// Get event bookings (admin)
router.get('/event/:eventId', authMiddleware, bookingController.getEventBookings);

// Export bookings as CSV (admin)
router.get('/event/:eventId/export-csv', authMiddleware, bookingController.exportBookingsCSV);

module.exports = router;
