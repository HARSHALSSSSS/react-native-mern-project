const Event = require('../models/Event');
const Booking = require('../models/Booking');
const User = require('../models/User');

/**
 * Dashboard Controller
 */

// Get Admin Dashboard Data
exports.getAdminDashboard = async (req, res) => {
  try {
    const adminId = req.admin.id;

    // Get total events created by this admin
    const totalEvents = await Event.countDocuments({ organizer: adminId });

    // Get upcoming events
    const upcomingEvents = await Event.find({
      organizer: adminId,
      startDate: { $gte: new Date() },
    })
      .populate('category venue')
      .sort({ startDate: 1 })
      .limit(5);

    // Get total tickets sold
    const eventIds = await Event.find({ organizer: adminId }).select('_id');
    const eventIdArray = eventIds.map((e) => e._id);

    const totalTicketsSold = await Booking.aggregate([
      {
        $match: {
          event: { $in: eventIdArray },
          bookingStatus: 'confirmed',
        },
      },
      {
        $group: {
          _id: null,
          totalTickets: { $sum: '$quantity' },
          totalRevenue: { $sum: '$totalPrice' },
        },
      },
    ]);

    // Get total available tickets
    const totalAvailableTickets = await Event.aggregate([
      {
        $match: {
          organizer: adminId,
        },
      },
      {
        $group: {
          _id: null,
          totalAvailable: { $sum: '$remainingCapacity' },
          totalCapacity: { $sum: '$totalCapacity' },
        },
      },
    ]);

    // Recent bookings
    const recentBookings = await Booking.find({
      event: { $in: eventIdArray },
    })
      .populate('user', 'firstName lastName email')
      .populate('event', 'title')
      .sort({ createdAt: -1 })
      .limit(10);

    res.json({
      success: true,
      message: 'Dashboard data fetched successfully',
      data: {
        statistics: {
          totalEvents,
          totalTicketsSold: totalTicketsSold[0]?.totalTickets || 0,
          totalRevenue: totalTicketsSold[0]?.totalRevenue || 0,
          totalCapacity: totalAvailableTickets[0]?.totalCapacity || 0,
          ticketsSold: totalAvailableTickets[0]?.totalCapacity - (totalAvailableTickets[0]?.totalAvailable || 0) || 0,
        },
        upcomingEvents,
        recentBookings,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching dashboard data',
      error: error.message,
    });
  }
};

module.exports = exports;
