const Order = require('../../models/Order');
const OrderItem = require('../../models/OrderItem');
const Product = require('../../models/Product');
const sendEmail = require('../../utils/sendEmail');
// @desc    Obtener todas las órdenes (para el admin)
// @route   GET /api/admin/orders
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.findAll({
      // Ordenar por fecha de creación, las más nuevas primero
      order: [['createdAt', 'DESC']],
      // Incluir los items de la orden y los detalles del producto asociado
      include: {
        model: OrderItem,
        include: {
          model: Product,
          // Seleccionar solo los atributos necesarios del producto
          attributes: ['nombre', 'imagenUrl']
        }
      }
    });
    res.status(200).json({ success: true, count: orders.length, data: orders });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Error del servidor' });
  }
};

// @desc    Eliminar una orden (para el admin)
// @route   DELETE /api/admin/orders/:id
exports.deleteOrder = async (req, res) => {
  try {
    const order = await Order.findByPk(req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, error: 'Orden no encontrada' });
    }

    // Sequelize se encargará de eliminar los OrderItems asociados gracias a la relación
    await order.destroy();

    res.status(200).json({ success: true, message: 'Orden eliminada con éxito' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Error del servidor' });
  }
};

// @desc    Obtener una sola orden por ID (para el admin)
// @route   GET /api/admin/orders/:id
exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findByPk(req.params.id, {
      include: {
        model: OrderItem,
        include: {
          model: Product,
          attributes: ['nombre', 'imagenUrl']
        }
      }
    });

    if (!order) {
      return res.status(404).json({ success: false, error: 'Orden no encontrada' });
    }

    res.status(200).json({ success: true, data: order });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Error del servidor' });
  }
};

// @desc    Actualizar el estado de una orden (para el admin)
// @route   PUT /api/admin/orders/:id/status
exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findByPk(req.params.id);

    if (!order) {
      return res.status(404).json({ success: false, error: 'Orden no encontrada' });
    }

    // Actualizamos solo el campo 'status'
    order.status = status;
    await order.save();

    if (status === 'enviado') {
        await sendEmail({
            email: order.email,
            subject: `Tu Orden #${order.id} de ElectroShop ha sido enviada`,
            template: 'shipping_template', // Nombre del archivo de la plantilla
            replacements: { // Datos para reemplazar en la plantilla
                customerName: order.customerName,
                orderId: order.id,
                trackingUrl: order.trackingUrl
            }
        });
    }

    res.status(200).json({ success: true, data: order });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Error al actualizar el estado de la orden.' });
  }
};