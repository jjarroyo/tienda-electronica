const Category = require('../models/Category');

// GET /api/categories
exports.getPublicCategories = async (req, res) => {
  try {
    const categories = await Category.findAll({ order: [['name', 'ASC']] });
    res.status(200).json({ success: true, data: categories });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Error del servidor' });
  }
};