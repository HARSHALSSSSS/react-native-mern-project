const mongoose = require('mongoose');

/**
 * Category Model
 * Represents event categories (Music, Tech, Sports, etc.)
 */
const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Category name is required'],
      unique: true,
      trim: true,
      minlength: [3, 'Category name must be at least 3 characters'],
    },
    description: {
      type: String,
      trim: true,
    },
    icon: {
      type: String, // URL to icon
      default: null,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Category', categorySchema);
