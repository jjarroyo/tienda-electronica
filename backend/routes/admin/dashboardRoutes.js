const express = require('express');
const { getStats } = require('../../controllers/admin/dashboardController');
const { protect } = require('../../middleware/auth');

const router = express.Router();

// Protegemos la ruta para que solo los admins puedan acceder
router.get('/', protect, getStats);

module.exports = router;