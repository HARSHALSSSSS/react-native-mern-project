const Booking = require('../models/Booking');
const Event = require('../models/Event');

/**
 * Check-In Controller
 */

// Check-in user via QR code
exports.checkInUser = async (req, res) => {
  try {
    const { bookingReference } = req.body;

    if (!bookingReference) {
      return res.status(400).json({
        success: false,
        message: 'Booking reference is required',
      });
    }

    // Find booking by reference
    const booking = await Booking.findOne({ bookingReference }).populate('event user');

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found',
      });
    }

    // Check if already checked in
    if (booking.checkedIn) {
      return res.status(400).json({
        success: false,
        message: 'This booking is already checked in',
      });
    }

    // Mark as checked in
    booking.checkedIn = true;
    booking.checkedInAt = new Date();
    booking.checkedInBy = req.admin.id;
    await booking.save();

    res.json({
      success: true,
      message: 'Check-in successful',
      data: {
        booking,
        user: {
          firstName: booking.user.firstName,
          lastName: booking.user.lastName,
          email: booking.user.email,
        },
        event: {
          title: booking.event.title,
        },
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error checking in user',
      error: error.message,
    });
  }
};

// Get check-in statistics for an event
exports.getCheckInStats = async (req, res) => {
  try {
    const { eventId } = req.params;

    const event = await Event.findById(eventId);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found',
      });
    }

    const totalBookings = await Booking.countDocuments({ event: eventId });
    const checkedIn = await Booking.countDocuments({ event: eventId, checkedIn: true });
    const pending = totalBookings - checkedIn;

    res.json({
      success: true,
      message: 'Check-in statistics fetched successfully',
      data: {
        event: {
          title: event.title,
          totalCapacity: event.totalCapacity,
        },
        statistics: {
          totalBookings,
          checkedIn,
          pending,
          checkinPercentage: totalBookings > 0 ? ((checkedIn / totalBookings) * 100).toFixed(2) : 0,
        },
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching check-in statistics',
      error: error.message,
    });
  }
};

module.exports = exports;
