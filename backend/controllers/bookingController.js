const Booking = require('../models/Booking');
const Event = require('../models/Event');
const User = require('../models/User');
const { generateBookingReference, generateQRData, generateQRCode } = require('../utils/helpers');
const { sendBookingConfirmationEmail } = require('../utils/emailService');
const { exportBookingsToCSV } = require('../utils/csvExport');

/**
 * Booking Management Controller
 */

// Create Booking
exports.createBooking = async (req, res) => {
  try {
    const { eventId, quantity } = req.body;
    const userId = req.user.id;

    // Validate required fields
    if (!eventId || !quantity || quantity < 1) {
      return res.status(400).json({
        success: false,
        message: 'Please provide valid event ID and ticket quantity',
      });
    }

    // Check if event exists
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found',
      });
    }

    // Check available capacity
    if (event.remainingCapacity < quantity) {
      return res.status(400).json({
        success: false,
        message: `Only ${event.remainingCapacity} tickets available`,
      });
    }

    // Calculate total price
    const totalPrice = event.ticketPrice * quantity;

    // Generate booking reference
    const bookingReference = generateBookingReference();

    // Create booking
    const booking = new Booking({
      user: userId,
      event: eventId,
      quantity,
      totalPrice,
      bookingReference,
      bookingStatus: 'confirmed',
      paymentStatus: 'paid',
    });

    // Generate QR Code
    const qrData = generateQRData(booking._id, eventId);
    booking.qrData = qrData;

    try {
      const qrCodeImage = await generateQRCode(qrData);
      booking.qrCode = qrCodeImage;
    } catch (qrError) {
      console.error('QR Code generation failed, continuing without QR:', qrError);
    }

    await booking.save();

    // Update event capacity
    event.remainingCapacity -= quantity;
    await event.save();

    // Get user data for email
    const user = await User.findById(userId);

    // Send confirmation email
    await sendBookingConfirmationEmail(user, booking, event);

    res.status(201).json({
      success: true,
      message: 'Booking created successfully',
      data: { booking },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating booking',
      error: error.message,
    });
  }
};

// Get User Bookings (My Tickets)
exports.getUserBookings = async (req, res) => {
  try {
    const userId = req.user.id;
    const { skip = 0, limit = 20 } = req.query;

    const bookings = await Booking.find({ user: userId })
      .populate('event', 'title description poster startDate endDate startTime venue ticketPrice')
      .populate('event.venue', 'name address city')
      .sort({ createdAt: -1 })
      .skip(parseInt(skip))
      .limit(parseInt(limit));

    const total = await Booking.countDocuments({ user: userId });

    res.json({
      success: true,
      message: 'Bookings fetched successfully',
      data: {
        bookings,
        total,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching bookings',
      error: error.message,
    });
  }
};

// Get Booking Details
exports.getBookingById = async (req, res) => {
  try {
    const { id } = req.params;

    const booking = await Booking.findById(id)
      .populate('user', 'firstName lastName email phone')
      .populate('event', 'title description poster startDate endDate venue ticketPrice')
      .populate('event.venue', 'name address city phone');

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found',
      });
    }

    res.json({
      success: true,
      message: 'Booking fetched successfully',
      data: { booking },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching booking',
      error: error.message,
    });
  }
};

// Cancel Booking
exports.cancelBooking = async (req, res) => {
  try {
    const { id } = req.params;

    const booking = await Booking.findById(id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found',
      });
    }

    // Check if booking can be cancelled
    if (booking.bookingStatus === 'cancelled') {
      return res.status(400).json({
        success: false,
        message: 'Booking is already cancelled',
      });
    }

    // Update booking status
    booking.bookingStatus = 'cancelled';
    await booking.save();

    // Restore event capacity
    const event = await Event.findById(booking.event);
    event.remainingCapacity += booking.quantity;
    await event.save();

    res.json({
      success: true,
      message: 'Booking cancelled successfully',
      data: { booking },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error cancelling booking',
      error: error.message,
    });
  }
};

// Get Bookings for an Event (Admin)
exports.getEventBookings = async (req, res) => {
  try {
    const { eventId } = req.params;
    const { skip = 0, limit = 100 } = req.query;

    const bookings = await Booking.find({ event: eventId })
      .populate('user', 'firstName lastName email phone')
      .sort({ createdAt: -1 })
      .skip(parseInt(skip))
      .limit(parseInt(limit));

    const total = await Booking.countDocuments({ event: eventId });

    res.json({
      success: true,
      message: 'Event bookings fetched successfully',
      data: {
        bookings,
        total,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching event bookings',
      error: error.message,
    });
  }
};

// Export Bookings as CSV
exports.exportBookingsCSV = async (req, res) => {
  try {
    const { eventId } = req.params;

    const bookings = await Booking.find({ event: eventId })
      .populate('user', 'firstName lastName email phone')
      .lean();

    // Transform data for CSV
    const csvData = bookings.map((booking) => ({
      bookingReference: booking.bookingReference,
      userName: `${booking.user.firstName} ${booking.user.lastName}`,
      userEmail: booking.user.email,
      userPhone: booking.user.phone,
      quantity: booking.quantity,
      totalPrice: booking.totalPrice,
      status: booking.bookingStatus,
      paymentStatus: booking.paymentStatus,
      checkedIn: booking.checkedIn ? 'Yes' : 'No',
      createdAt: booking.createdAt,
    }));

    const csv = exportBookingsToCSV(csvData);

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=bookings.csv');
    res.send(csv);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error exporting bookings',
      error: error.message,
    });
  }
};

module.exports = exports;
