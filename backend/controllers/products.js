// backend/controllers/products.js
const Product = require('../models/Product');
const Category = require('../models/Category');
const fs = require('fs');
const path = require('path');
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
            include: [Category],
        });
        res.status(200).json({
            success: true,
            count: products.length,
            data: products,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: 'Error del servidor' });
    }
};

exports.getProductById = async (req, res, next) => {
    try {
        const product = await Product.findByPk(req.params.id);
        if (!product) {
            return res
                .status(404)
                .json({ success: false, error: 'Producto no encontrado' });
        }
        res.status(200).json({ success: true, data: product });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Error del servidor' });
    }
};
