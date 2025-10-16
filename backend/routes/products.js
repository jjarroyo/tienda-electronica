// backend/routes/products.js
const express = require('express');
const {  
    getProducts, 
    createProduct,
    getProductById,
    updateProduct,
    deleteProduct 
} = require('../controllers/products');
const { protect } = require('../middleware/auth');

const router = express.Router();


router
  .route('/')
  .get(getProducts)
  .post(protect, createProduct);

router
  .route('/:id')
  .get(getProductById) 
  .put(protect, updateProduct)    
  .delete(protect, deleteProduct); 

module.exports = router;