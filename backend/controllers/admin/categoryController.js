const Category = require('../../models/Category');

// GET /api/admin/categories
exports.getAllCategories = async (req, res) => {
  const categories = await Category.findAll({ order: [['name', 'ASC']] });
  res.status(200).json({ success: true, data: categories });
};

// POST /api/admin/categories
exports.createCategory = async (req, res) => {
  try {
    const category = await Category.create(req.body);
    res.status(201).json({ success: true, data: category });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// DELETE /api/admin/categories/:id
exports.deleteCategory = async (req, res) => {
  const category = await Category.findByPk(req.params.id);
  if (!category) {
    return res.status(404).json({ success: false, error: 'Categoría no encontrada' });
  }
  await category.destroy();
  res.status(200).json({ success: true, message: 'Categoría eliminada' });
};