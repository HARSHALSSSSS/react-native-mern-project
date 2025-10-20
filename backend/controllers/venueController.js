const Venue = require('../models/Venue');

/**
 * Venue Management Controller
 */

// Create Venue
exports.createVenue = async (req, res) => {
  try {
    const {
      name,
      address,
      city,
      state,
      zipCode,
      capacity,
      contactPerson,
      contactPhone,
      contactEmail,
      amenities,
    } = req.body;

    if (!name || !address || !city || !capacity) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields: name, address, city, capacity',
      });
    }

    const venue = new Venue({
      name,
      address,
      city,
      state,
      zipCode,
      capacity,
      contactPerson,
      contactPhone,
      contactEmail,
      amenities: amenities || [],
    });

    await venue.save();

    res.status(201).json({
      success: true,
      message: 'Venue created successfully',
      data: { venue },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating venue',
      error: error.message,
    });
  }
};

// Get All Venues
exports.getAllVenues = async (req, res) => {
  try {
    const { isActive, city } = req.query;

    const filter = {};
    if (isActive !== undefined) {
      filter.isActive = isActive === 'true';
    }
    if (city) {
      filter.city = city;
    }

    const venues = await Venue.find(filter).sort({ createdAt: -1 });

    res.json({
      success: true,
      message: 'Venues fetched successfully',
      data: {
        venues,
        total: venues.length,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching venues',
      error: error.message,
    });
  }
};

// Get Venue by ID
exports.getVenueById = async (req, res) => {
  try {
    const { id } = req.params;

    const venue = await Venue.findById(id);

    if (!venue) {
      return res.status(404).json({
        success: false,
        message: 'Venue not found',
      });
    }

    res.json({
      success: true,
      message: 'Venue fetched successfully',
      data: { venue },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching venue',
      error: error.message,
    });
  }
};

// Update Venue
exports.updateVenue = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, address, city, state, zipCode, capacity, contactPerson, contactPhone, contactEmail, amenities, isActive } = req.body;

    const venue = await Venue.findByIdAndUpdate(
      id,
      {
        name: name || undefined,
        address: address || undefined,
        city: city || undefined,
        state: state || undefined,
        zipCode: zipCode || undefined,
        capacity: capacity || undefined,
        contactPerson: contactPerson || undefined,
        contactPhone: contactPhone || undefined,
        contactEmail: contactEmail || undefined,
        amenities: amenities || undefined,
        isActive: isActive !== undefined ? isActive : undefined,
      },
      { new: true, runValidators: true }
    );

    if (!venue) {
      return res.status(404).json({
        success: false,
        message: 'Venue not found',
      });
    }

    res.json({
      success: true,
      message: 'Venue updated successfully',
      data: { venue },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating venue',
      error: error.message,
    });
  }
};

// Delete Venue
exports.deleteVenue = async (req, res) => {
  try {
    const { id } = req.params;

    const venue = await Venue.findByIdAndDelete(id);

    if (!venue) {
      return res.status(404).json({
        success: false,
        message: 'Venue not found',
      });
    }

    res.json({
      success: true,
      message: 'Venue deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting venue',
      error: error.message,
    });
  }
};

module.exports = exports;
