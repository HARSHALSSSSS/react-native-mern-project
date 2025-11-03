const Event = require('../models/Event');
const Booking = require('../models/Booking');
const Category = require('../models/Category');
const Venue = require('../models/Venue');
const { calculateEventStatus } = require('../utils/helpers');

/**
 * Event Management Controller
 */

// Create Event
exports.createEvent = async (req, res) => {
  try {
    console.log('=== EVENT CREATION START ===');
    console.log('Body:', req.body);
    console.log('File:', req.file ? { fieldname: req.file.fieldname, size: req.file.size } : 'No file');
    console.log('Admin:', req.admin);

    const {
      title,
      description,
      category,
      venue,
      startDate,
      endDate,
      startTime,
      endTime,
      totalCapacity,
      ticketPrice,
      tags,
      featured,
    } = req.body;

    console.log('Form fields:', { title, description, category, venue, startDate, startTime, endTime, totalCapacity, ticketPrice });

    // Validate required fields
    if (!title || !description || !category || !venue || !startDate || !totalCapacity || ticketPrice === undefined) {
      console.log('VALIDATION FAILED - Missing required fields');
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields',
        received: { title, description, category, venue, startDate, totalCapacity, ticketPrice },
      });
    }

    // Validate startTime and endTime (provide defaults if not provided)
    const finalStartTime = startTime || '09:00';
    const finalEndTime = endTime || '17:00';

    console.log('Using times:', { startTime: finalStartTime, endTime: finalEndTime });

    console.log('Validation passed. Checking category...');
    // Check if category exists
    const categoryExists = await Category.findById(category);
    if (!categoryExists) {
      console.log('Category not found:', category);
      return res.status(404).json({
        success: false,
        message: 'Category not found',
      });
    }

    console.log('Category found. Checking venue...');
    // Check if venue exists
    const venueExists = await Venue.findById(venue);
    if (!venueExists) {
      console.log('Venue not found:', venue);
      return res.status(404).json({
        success: false,
        message: 'Venue not found',
      });
    }

    console.log('Venue found. Creating event object...');
    const event = new Event({
      title,
      description,
      category,
      venue,
      startDate,
      endDate: endDate || startDate,
      startTime: finalStartTime,
      endTime: finalEndTime,
      totalCapacity,
      remainingCapacity: totalCapacity,
      ticketPrice,
      organizer: req.admin.id,
      tags: tags || [],
      featured: featured || false,
    });

    // Add poster if file was uploaded (optional)
    if (req.file) {
      console.log('Processing file upload...');
      // For memory storage (production), store as base64
      if (process.env.NODE_ENV === 'production' && req.file.buffer) {
        const base64 = req.file.buffer.toString('base64');
        event.poster = `data:${req.file.mimetype};base64,${base64.substring(0, 50)}...`;
      } else {
        // For disk storage (development)
        event.poster = `/uploads/${req.file.filename}`;
      }
    }

    console.log('Saving event to database...');
    await event.save();
    console.log('Event saved with ID:', event._id);

    console.log('Populating references...');
    // Populate references
    await event.populate('category venue');

    console.log('=== EVENT CREATION SUCCESS ===');
    res.status(201).json({
      success: true,
      message: 'Event created successfully',
      data: { event },
    });
  } catch (error) {
    console.error('=== EVENT CREATION ERROR ===');
    console.error('Error:', error.message);
    console.error('Stack:', error.stack);
    res.status(500).json({
      success: false,
      message: 'Error creating event',
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
    });
  }
};

// Get All Events
exports.getAllEvents = async (req, res) => {
  try {
    const { category, status, featured, skip = 0, limit = 20 } = req.query;

    const filter = { isActive: true };

    if (category) {
      filter.category = category;
    }

    if (status) {
      filter.status = status;
    }

    if (featured !== undefined) {
      filter.featured = featured === 'true';
    }

    const events = await Event.find(filter)
      .populate('category venue organizer', 'name firstName lastName email')
      .sort({ startDate: 1 })
      .skip(parseInt(skip))
      .limit(parseInt(limit));

    const total = await Event.countDocuments(filter);

    res.json({
      success: true,
      message: 'Events fetched successfully',
      data: {
        events,
        total,
        page: Math.floor(parseInt(skip) / parseInt(limit)) + 1,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching events',
      error: error.message,
    });
  }
};

// Get Event by ID
exports.getEventById = async (req, res) => {
  try {
    const { id } = req.params;

    const event = await Event.findById(id).populate('category venue organizer', 'name firstName lastName email phone address');

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found',
      });
    }

    res.json({
      success: true,
      message: 'Event fetched successfully',
      data: { event },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching event',
      error: error.message,
    });
  }
};

// Update Event
exports.updateEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, category, venue, startDate, endDate, startTime, endTime, ticketPrice, tags, featured, isActive } = req.body;

    const event = await Event.findById(id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found',
      });
    }

    // Update fields
    if (title) event.title = title;
    if (description) event.description = description;
    if (category) event.category = category;
    if (venue) event.venue = venue;
    if (startDate) event.startDate = startDate;
    if (endDate) event.endDate = endDate;
    if (startTime) event.startTime = startTime;
    if (endTime) event.endTime = endTime;
    if (ticketPrice !== undefined) event.ticketPrice = ticketPrice;
    if (tags) event.tags = tags;
    if (featured !== undefined) event.featured = featured;
    if (isActive !== undefined) event.isActive = isActive;

    // Update poster if new file uploaded
    if (req.file) {
      event.poster = `/uploads/${req.file.filename}`;
    }

    await event.save();
    await event.populate('category venue organizer');

    res.json({
      success: true,
      message: 'Event updated successfully',
      data: { event },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating event',
      error: error.message,
    });
  }
};

// Delete Event
exports.deleteEvent = async (req, res) => {
  try {
    const { id } = req.params;

    const event = await Event.findByIdAndDelete(id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found',
      });
    }

    res.json({
      success: true,
      message: 'Event deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting event',
      error: error.message,
    });
  }
};

// Get events by organizer
exports.getEventsByOrganizer = async (req, res) => {
  try {
    const adminId = req.admin.id;
    const { skip = 0, limit = 20 } = req.query;

    const events = await Event.find({ organizer: adminId })
      .populate('category venue')
      .sort({ startDate: -1 })
      .skip(parseInt(skip))
      .limit(parseInt(limit));

    const total = await Event.countDocuments({ organizer: adminId });

    res.json({
      success: true,
      message: 'Events fetched successfully',
      data: {
        events,
        total,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching events',
      error: error.message,
    });
  }
};

// Get Event Participants (Bookings for an event)
exports.getEventParticipants = async (req, res) => {
  try {
    const { eventId } = req.params;

    // Get event to verify it exists
    const event = await Event.findById(eventId).populate('category venue');

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found',
      });
    }

    // Get all bookings for this event
    const bookings = await Booking.find({ event: eventId })
      .populate('user', 'firstName lastName email phone address')
      .sort({ createdAt: -1 });

    // Calculate stats
    const stats = {
      totalBookings: bookings.length,
      confirmedBookings: bookings.filter((b) => b.bookingStatus === 'confirmed').length,
      totalTickets: bookings.reduce((sum, b) => sum + b.quantity, 0),
      totalRevenue: bookings.reduce((sum, b) => sum + b.totalPrice, 0),
      checkedIn: bookings.filter((b) => b.checkedIn).length,
    };

    res.json({
      success: true,
      message: 'Event participants fetched successfully',
      data: {
        event,
        bookings,
        stats,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching event participants',
      error: error.message,
    });
  }
};

module.exports = exports;
