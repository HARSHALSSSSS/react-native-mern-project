const mongoose = require('mongoose');

/**
 * Booking Model
 * Represents ticket bookings by users
 */
const bookingSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
    },
    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Event',
      required: [true, 'Event ID is required'],
    },
    quantity: {
      type: Number,
      required: [true, 'Ticket quantity is required'],
      min: [1, 'Quantity must be at least 1'],
    },
    totalPrice: {
      type: Number,
      required: [true, 'Total price is required'],
      min: [0, 'Price cannot be negative'],
    },
    bookingStatus: {
      type: String,
      enum: ['pending', 'confirmed', 'cancelled'],
      default: 'confirmed',
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'failed'],
      default: 'paid',
    },
    paymentMethod: {
      type: String,
      enum: ['credit_card', 'debit_card', 'upi', 'wallet', 'bank_transfer'],
      default: 'credit_card',
    },
    transactionId: {
      type: String,
      default: null,
    },
    qrCode: {
      type: String, // URL to QR code image
      default: null,
    },
    qrData: {
      type: String, // Hashed booking data for QR
      default: null,
    },
    checkedIn: {
      type: Boolean,
      default: false,
    },
    checkedInAt: {
      type: Date,
      default: null,
    },
    checkedInBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Admin',
      default: null,
    },
    bookingReference: {
      type: String,
      unique: true,
      required: true,
    },
    notes: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Index for better query performance
bookingSchema.index({ user: 1, event: 1 });
bookingSchema.index({ bookingReference: 1 });
bookingSchema.index({ event: 1 });

module.exports = mongoose.model('Booking', bookingSchema);
