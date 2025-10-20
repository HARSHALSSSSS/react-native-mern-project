const mongoose = require('mongoose');

/**
 * Venue Model
 * Represents physical locations where events are held
 */
const venueSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Venue name is required'],
      trim: true,
    },
    address: {
      type: String,
      required: [true, 'Venue address is required'],
      trim: true,
    },
    city: {
      type: String,
      required: [true, 'City is required'],
      trim: true,
    },
    state: {
      type: String,
      trim: true,
    },
    zipCode: {
      type: String,
      trim: true,
    },
    capacity: {
      type: Number,
      required: [true, 'Venue capacity is required'],
      min: [1, 'Capacity must be at least 1'],
    },
    latitude: {
      type: Number,
      default: null,
    },
    longitude: {
      type: Number,
      default: null,
    },
    contactPerson: {
      type: String,
      trim: true,
    },
    contactPhone: {
      type: String,
      trim: true,
    },
    contactEmail: {
      type: String,
      trim: true,
    },
    amenities: [String], // e.g., ["Parking", "WiFi", "AC"]
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Venue', venueSchema);
