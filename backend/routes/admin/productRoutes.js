// backend/routes/admin/productRoutes.js (EJEMPLO)
const express = require('express');
const {
    createProduct,
    updateProduct,
    deleteProduct,
} = require('../../controllers/admin/productController');
const { protect } = require('../../middleware/auth');
const uploadMiddleware = require('../../middleware/upload');

const router = express.Router();

router.use(protect);

router.post('/', uploadMiddleware, createProduct);

router.put('/:id', uploadMiddleware, updateProduct);

router.delete('/:id', deleteProduct);

module.exports = router;
