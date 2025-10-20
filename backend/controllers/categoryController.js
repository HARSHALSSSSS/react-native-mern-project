const Category = require('../models/Category');

/**
 * Category Management Controller
 */

// Create Category
exports.createCategory = async (req, res) => {
  try {
    const { name, description, icon } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: 'Category name is required',
      });
    }

    // Check if category already exists
    const existingCategory = await Category.findOne({ name });
    if (existingCategory) {
      return res.status(400).json({
        success: false,
        message: 'Category with this name already exists',
      });
    }

    const category = new Category({
      name,
      description,
      icon,
    });

    await category.save();

    res.status(201).json({
      success: true,
      message: 'Category created successfully',
      data: { category },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating category',
      error: error.message,
    });
  }
};

// Get All Categories
exports.getAllCategories = async (req, res) => {
  try {
    const { isActive } = req.query;

    const filter = {};
    if (isActive !== undefined) {
      filter.isActive = isActive === 'true';
    }

    const categories = await Category.find(filter).sort({ createdAt: -1 });

    res.json({
      success: true,
      message: 'Categories fetched successfully',
      data: {
        categories,
        total: categories.length,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching categories',
      error: error.message,
    });
  }
};

// Get Category by ID
exports.getCategoryById = async (req, res) => {
  try {
    const { id } = req.params;

    const category = await Category.findById(id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found',
      });
    }

    res.json({
      success: true,
      message: 'Category fetched successfully',
      data: { category },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching category',
      error: error.message,
    });
  }
};

// Update Category
exports.updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, icon, isActive } = req.body;

    const category = await Category.findByIdAndUpdate(
      id,
      {
        name: name || undefined,
        description: description || undefined,
        icon: icon || undefined,
        isActive: isActive !== undefined ? isActive : undefined,
      },
      { new: true, runValidators: true }
    );

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found',
      });
    }

    res.json({
      success: true,
      message: 'Category updated successfully',
      data: { category },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating category',
      error: error.message,
    });
  }
};

// Delete Category
exports.deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const category = await Category.findByIdAndDelete(id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found',
      });
    }

    res.json({
      success: true,
      message: 'Category deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting category',
      error: error.message,
    });
  }
};

module.exports = exports;
