const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const QRCode = require('qrcode');

/**
 * Generate JWT token
 */
const generateToken = (payload, expiresIn = process.env.JWT_EXPIRY) => {
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn });
};

/**
 * Generate unique booking reference
 */
const generateBookingReference = () => {
  return 'BK' + Date.now() + Math.random().toString(36).substr(2, 9).toUpperCase();
};

/**
 * Generate QR code data
 */
const generateQRData = (bookingId, eventId) => {
  return crypto
    .createHash('sha256')
    .update(`${bookingId}:${eventId}:${Date.now()}`)
    .digest('hex');
};

/**
 * Generate QR code image
 */
const generateQRCode = async (data) => {
  try {
    const qrCodeDataUrl = await QRCode.toDataURL(data);
    return qrCodeDataUrl;
  } catch (error) {
    console.error('QR Code generation error:', error);
    throw error;
  }
};

/**
 * Format response
 */
const formatResponse = (success, message, data = null, statusCode = 200) => {
  return {
    statusCode,
    body: {
      success,
      message,
      ...(data && { data }),
    },
  };
};

/**
 * Calculate event status based on dates
 */
const calculateEventStatus = (startDate, endDate) => {
  const now = new Date();
  if (now < startDate) return 'upcoming';
  if (now > endDate) return 'completed';
  return 'ongoing';
};

module.exports = {
  generateToken,
  generateBookingReference,
  generateQRData,
  generateQRCode,
  formatResponse,
  calculateEventStatus,
};
