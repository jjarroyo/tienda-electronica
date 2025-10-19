const Order = require('../models/Order');
const { MercadoPagoConfig, Payment } = require('mercadopago');

// Inicializamos el cliente de Mercado Pago
const client = new MercadoPagoConfig({ accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN });
const payment = new Payment(client);
const OrderItem = require('../models/OrderItem');
const Product = require('../models/Product');
exports.handleMercadoPagoWebhook = async (req, res) => {
  const notification = req.body;
  
  // Solo procesamos notificaciones de tipo 'payment'
  if (notification.type === 'payment') {
    const paymentId = notification.data.id;
    console.log(`Webhook recibido para el pago ID: ${paymentId}`);

    try {
      // 1. Pedimos a Mercado Pago los detalles completos de este pago
      const paymentDetails = await payment.get({ id: paymentId });

      if (paymentDetails) {
        // 2. Obtenemos nuestra 'external_reference', que es el ID de nuestra orden
        const orderId = paymentDetails.external_reference;
        const paymentStatus = paymentDetails.status;

        console.log(`Buscando orden con ID: ${orderId}, Estado del pago: ${paymentStatus}`);

        const order = await Order.findByPk(orderId);

        if (order) {
          // 3. Si el pago fue aprobado, actualizamos el estado de la orden
          if (paymentStatus === 'approved' && order.status !== 'aprobado') {
            const items = await OrderItem.findAll({ where: { OrderId: order.id } });
            
            for (const item of items) {
              const product = await Product.findByPk(item.ProductId);
              if (product) {
                product.stock = product.stock - item.quantity;
                await product.save();
              }
            }
            
            order.status = 'aprobado';
            await order.save();
            console.log(`Orden ${order.id} actualizada a 'aprobado'.`);
          } else {
            console.log(`El estado del pago es '${paymentStatus}'. No se actualiza la orden.`);
          }
        } else {
          console.log(`No se encontró la orden con ID: ${orderId}`);
        }
      }
    } catch (error) {
      console.error("Error al procesar el webhook de Mercado Pago:", error);
    }
  }

  // 4. Respondemos a Mercado Pago para confirmar la recepción
  res.status(200).send('Webhook procesado');
};