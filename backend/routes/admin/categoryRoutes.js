const express = require('express');
const { getAllCategories, createCategory, deleteCategory } = require('../../controllers/admin/categoryController');
const { protect } = require('../../middleware/auth');

const router = express.Router();
router.use(protect);

router.route('/').get(getAllCategories).post(createCategory);
router.route('/:id').delete(deleteCategory);

module.exports = router;