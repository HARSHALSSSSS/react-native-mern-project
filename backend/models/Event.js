const mongoose = require('mongoose');

/**
 * Event Model
 * Represents events created by admins with all details
 */
const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Event title is required'],
      trim: true,
      minlength: [3, 'Title must be at least 3 characters'],
    },
    description: {
      type: String,
      required: [true, 'Event description is required'],
      trim: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: [true, 'Event category is required'],
    },
    venue: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Venue',
      required: [true, 'Event venue is required'],
    },
    startDate: {
      type: Date,
      required: [true, 'Event start date is required'],
    },
    endDate: {
      type: Date,
      required: [true, 'Event end date is required'],
    },
    startTime: {
      type: String, // Format: "HH:MM"
      required: [true, 'Event start time is required'],
    },
    endTime: {
      type: String,
      required: [true, 'Event end time is required'],
    },
    totalCapacity: {
      type: Number,
      required: [true, 'Event capacity is required'],
      min: [1, 'Capacity must be at least 1'],
    },
    remainingCapacity: {
      type: Number,
      required: [true, 'Remaining capacity is required'],
    },
    ticketPrice: {
      type: Number,
      required: [true, 'Ticket price is required'],
      min: [0, 'Ticket price cannot be negative'],
    },
    poster: {
      type: String, // URL to poster image
      default: null,
    },
    status: {
      type: String,
      enum: ['upcoming', 'ongoing', 'completed', 'cancelled'],
      default: 'upcoming',
    },
    organizer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Admin',
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    tags: [String],
    featured: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Index for better query performance
eventSchema.index({ category: 1, startDate: 1 });
eventSchema.index({ status: 1 });
eventSchema.index({ organizer: 1 });

module.exports = mongoose.model('Event', eventSchema);
