const Order = require('../../models/Order');
const Product = require('../../models/Product');
const { Sequelize } = require('sequelize');

// @desc    Obtener estadísticas para el dashboard
// @route   GET /api/admin/dashboard
exports.getStats = async (req, res) => {
  try {
    // 1. Calcular el total de ventas (solo de órdenes aprobadas)
    const totalSales = await Order.sum('total', {
      where: { status: 'aprobado' }
    });

    // 2. Contar el número total de órdenes
    const totalOrders = await Order.count();

    // 3. Contar el número total de productos
    const totalProducts = await Product.count();
    
    // 4. Contar las órdenes pendientes
    const pendingOrders = await Order.count({
        where: { status: 'pendiente' }
    });

    res.status(200).json({
      success: true,
      data: {
        totalSales: totalSales || 0, // Si no hay ventas, devuelve 0
        totalOrders,
        totalProducts,
        pendingOrders
      }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Error del servidor' });
  }
};