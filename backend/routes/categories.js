const express = require('express');
const { getPublicCategories } = require('../controllers/categoryController');
const router = express.Router();

router.route('/').get(getPublicCategories);

module.exports = router;