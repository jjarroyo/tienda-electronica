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

exports.handleOrderAction = async (req, res) => {
    const { action } = req.body; // action: 'returnAndDelete', 'returnAndMark', 'markOnly'
    const { id } = req.params;

    try {
        const order = await Order.findByPk(id);
        if (!order) return res.status(404).json({ success: false, error: 'Orden no encontrada' });

        switch (action) {
            case 'returnAndDelete':
                await restockOrderItems(id);
                await order.destroy();
                res.status(200).json({ success: true, message: 'Orden eliminada y stock repuesto.' });
                break;
            case 'returnAndMark':
                await restockOrderItems(id);
                order.status = 'devuelto';
                await order.save();
                res.status(200).json({ success: true, data: order });
                break;
            case 'markOnly':
                order.status = 'devuelto'; // O 'cancelado' si prefieres diferenciar
                await order.save();
                res.status(200).json({ success: true, data: order });
                break;
            default:
                res.status(400).json({ success: false, error: 'Acción no válida' });
        }
    } catch (error) {
        console.error("Error handling order action:", error);
        res.status(500).json({ success: false, error: 'Error del servidor' });
    }
};

const restockOrderItems = async (orderId) => {
    const items = await OrderItem.findAll({ where: { OrderId: orderId } });
    for (const item of items) {
        const product = await Product.findByPk(item.ProductId);
        if (product) {
            product.stock = product.stock + item.quantity;
            await product.save();
        }
    }
    console.log(`Stock repuesto para orden ${orderId}`);
};

exports.deleteOrder = async (req, res) => {
    // Recibimos la opción desde el query parameter
    const returnInventory = req.query.returnInventory === 'true'; 

    try {
        const order = await Order.findByPk(req.params.id);
        if (!order) return res.status(404).json({ success: false, error: 'Orden no encontrada' });

        if (returnInventory) {
            await restockOrderItems(req.params.id);
        }

        await order.destroy();

        const message = returnInventory 
            ? 'Orden eliminada y stock repuesto.' 
            : 'Orden eliminada (sin reponer stock).';
        res.status(200).json({ success: true, message });

    } catch (error) {
        console.error("Error al eliminar la orden:", error);
        res.status(500).json({ success: false, error: 'Error del servidor' });
    }
};