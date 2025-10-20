const { Parser } = require('json2csv');

/**
 * Export bookings to CSV
 */
const exportBookingsToCSV = (bookings) => {
  try {
    const fields = ['bookingReference', 'user', 'quantity', 'totalPrice', 'bookingStatus', 'checkedIn', 'createdAt'];
    const parser = new Parser({ fields });
    const csv = parser.parse(bookings);
    return csv;
  } catch (error) {
    console.error('CSV export error:', error);
    throw error;
  }
};

module.exports = {
  exportBookingsToCSV,
};
