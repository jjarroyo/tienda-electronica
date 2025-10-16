const express = require('express');
const { handleMercadoPagoWebhook } = require('../controllers/webhookController');
const router = express.Router();

router.post('/mercadopago', handleMercadoPagoWebhook);

module.exports = router;