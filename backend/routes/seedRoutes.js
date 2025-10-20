const express = require('express');
const router = express.Router();
const seedController = require('../controllers/seedController');

/**
 * Seed Database Route
 * Call this endpoint once to populate database with initial data
 */

// POST /api/seed
router.post('/', seedController.seedDatabase);

module.exports = router;
