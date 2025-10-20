// backend/controllers/products.js
const Product = require('../models/Product');
const Category = require('../models/Category');
const { Sequelize } = require('sequelize');
// @desc    Obtener todos los productos
// @route   GET /api/productos
exports.getProducts = async (req, res, next) => {
  try {
    const { search } = req.query;  
    let whereClause = {};

    if (search) {
      whereClause.nombre = { [Sequelize.Op.like]: `%${search}%` }; 
    }

    const products = await Product.findAll({
      where: whereClause,  
      include: [Category] 
    });
    res.status(200).json({ success: true, count: products.length, data: products });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Error del servidor' });
  }
};

// @desc    Crear un nuevo producto
// @route   POST /api/productos
exports.createProduct = async (req, res, next) => {
  try {
    const product = await Product.create(req.body); // Método de Sequelize
    res.status(201).json({ success: true, data: product });
  } catch (error) {
    console.error(error);
    res.status(400).json({ success: false, error: error.message });
  }
};

exports.getProductById = async (req, res, next) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, error: 'Producto no encontrado' });
    }
    res.status(200).json({ success: true, data: product });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Error del servidor' });
  }
};

// @desc    Actualizar un producto
// @route   PUT /api/productos/:id
exports.updateProduct = async (req, res, next) => {
  try {
    let product = await Product.findByPk(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, error: 'Producto no encontrado' });
    }
    product = await product.update(req.body);
    res.status(200).json({ success: true, data: product });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Error del servidor' });
  }
};

// @desc    Eliminar un producto
// @route   DELETE /api/productos/:id
exports.deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, error: 'Producto no encontrado' });
    }
    await product.destroy();
    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Error del servidor' });
  }
};