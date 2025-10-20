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

    // Validate required fields
    if (!title || !description || !category || !venue || !startDate || !totalCapacity || ticketPrice === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields',
      });
    }

    // Check if category exists
    const categoryExists = await Category.findById(category);
    if (!categoryExists) {
      return res.status(404).json({
        success: false,
        message: 'Category not found',
      });
    }

    // Check if venue exists
    const venueExists = await Venue.findById(venue);
    if (!venueExists) {
      return res.status(404).json({
        success: false,
        message: 'Venue not found',
      });
    }

    const event = new Event({
      title,
      description,
      category,
      venue,
      startDate,
      endDate: endDate || startDate,
      startTime,
      endTime,
      totalCapacity,
      remainingCapacity: totalCapacity,
      ticketPrice,
      organizer: req.admin.id,
      tags: tags || [],
      featured: featured || false,
    });

    // Add poster if file was uploaded
    if (req.file) {
      event.poster = `/uploads/${req.file.filename}`;
    }

    await event.save();

    // Populate references
    await event.populate('category venue');

    res.status(201).json({
      success: true,
      message: 'Event created successfully',
      data: { event },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating event',
      error: error.message,
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

module.exports = exports;
