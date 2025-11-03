const express = require('express');
const router = express.Router();
const { authMiddleware, userAuthMiddleware } = require('../middleware/auth');
const upload = require('../middleware/upload');
const eventController = require('../controllers/eventController');

/**
 * Event Management Routes
 */

// Create event (admin only)
router.post('/', authMiddleware, upload.single('poster'), eventController.createEvent);

// Get all events (public)
router.get('/', eventController.getAllEvents);

// Get events by organizer (admin)
router.get('/organizer/events', authMiddleware, eventController.getEventsByOrganizer);

// Get event by ID (public)
router.get('/:id', eventController.getEventById);

// Get event participants (admin only)
router.get('/:eventId/participants', authMiddleware, eventController.getEventParticipants);

// Update event (admin only)
router.put('/:id', authMiddleware, upload.single('poster'), eventController.updateEvent);

// Delete event (admin only)
router.delete('/:id', authMiddleware, eventController.deleteEvent);

module.exports = router;
