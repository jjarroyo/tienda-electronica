const express = require('express');
const { getAllOrders, deleteOrder, getOrderById,updateOrderStatus,handleOrderAction} = require('../../controllers/admin/orderController');
const { protect } = require('../../middleware/auth');

const router = express.Router();

// Aplicamos el middleware 'protect' a todas las rutas de este archivo
router.use(protect);

// Definimos las rutas
router.route('/')
  .get(getAllOrders);

router.route('/:id')
    .get(getOrderById) 
    .delete(deleteOrder);

router.route('/:id/status')
  .put(updateOrderStatus);

router.route('/:id/action')
  .put(handleOrderAction);

module.exports = router;