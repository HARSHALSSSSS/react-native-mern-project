const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/auth');
const categoryController = require('../controllers/categoryController');

/**
 * Category Management Routes
 */

// Create category
router.post('/', authMiddleware, categoryController.createCategory);

// Get all categories
router.get('/', categoryController.getAllCategories);

// Get category by ID
router.get('/:id', categoryController.getCategoryById);

// Update category
router.put('/:id', authMiddleware, categoryController.updateCategory);

// Delete category
router.delete('/:id', authMiddleware, categoryController.deleteCategory);

module.exports = router;
