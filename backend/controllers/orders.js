const { MercadoPagoConfig, Preference } = require('mercadopago');
const Order = require('../models/Order');
const OrderItem = require('../models/OrderItem');
const sendEmail = require('../utils/sendEmail'); 
const client = new MercadoPagoConfig({ accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN });
const Product = require('../models/Product');

exports.createOrder = async (req, res) => {
  const { customerData, cartItems, paymentMethod } = req.body;
  const shippingCost = 8000;
  const subtotal = cartItems.reduce((sum, item) => sum + item.precio * item.quantity, 0);
  const total = subtotal + shippingCost;

  try {
    // 1. Crear la orden en la base de datos
    const order = await Order.create({
      customerName: customerData.name,
      address: customerData.address,
      city: customerData.city,
      phone: customerData.phone,
      email: customerData.email,
      shippingCost,
      subtotal,
      total,
      paymentMethod,
      status: paymentMethod === 'contraentrega' ? 'aprobado' : 'pendiente'
    });

    // 2. Crear los items de la orden
    const orderItemsData = cartItems.map(item => ({
      quantity: item.quantity,
      price: item.precio,
      OrderId: order.id,
      ProductId: item.id
    }));
    await OrderItem.bulkCreate(orderItemsData);

    const itemsListHtml = cartItems.map(item => `
      <div class="item">
        <span>${item.nombre} (x${item.quantity})</span>
        <span>$${(item.precio * item.quantity).toLocaleString('es-CO')}</span>
      </div>
    `).join('');

    const shippingAddressHtml = `${order.address}, ${order.city}`;


    // 3. Si es "contraentrega", terminamos aquí.
    if (paymentMethod === 'contraentrega') {

        for (const item of cartItems) {
          const product = await Product.findByPk(item.id);
          if (product) {
            product.stock = product.stock - item.quantity;
            await product.save();
          }
        }


        await sendEmail({
          email: order.email,
          subject: `Confirmación de tu Orden #${order.id} en ElectroShop`,
          template: 'order_confirmation_template',
          replacements: {
            customerName: order.customerName,
            orderId: order.id,
            itemsList: itemsListHtml,
            subtotal: order.subtotal.toLocaleString('es-CO'),
            shippingCost: order.shippingCost.toLocaleString('es-CO'),
            total: order.total.toLocaleString('es-CO'),
            shippingAddress: shippingAddressHtml,
          }
        });

        await sendEmail({
          email: process.env.ADMIN_EMAIL,
          subject: `¡Nueva Venta! Orden #${order.id} (Contraentrega)`,
          template: 'order_confirmation_template',
          replacements: {
            customerName: order.customerName,
            orderId: order.id,
            itemsList: itemsListHtml,
            subtotal: order.subtotal.toLocaleString('es-CO'),
            shippingCost: order.shippingCost.toLocaleString('es-CO'),
            total: order.total.toLocaleString('es-CO'),
            shippingAddress: shippingAddressHtml,
          }
        });

        return res.status(201).json({ success: true, message: 'Orden creada con éxito.', orderId: order.id });
    }

    // 4. Si es "mercadopago", crear la preferencia de pago
    const preference = new Preference(client);
    const preferenceResult = await preference.create({
      body: {
        items: cartItems.map(item => ({
          id: item.id,
          title: item.nombre,
          quantity: item.quantity,
          unit_price: item.precio
        })),
        shipments: {
            cost: shippingCost,
            mode: 'not_specified',
        },
        back_urls: {
          /*success: `http://localhost:5173/order-confirmation`, // URL a la que volverá el cliente
          failure: `http://localhost:5173/cart`,
          pending: `http://localhost:5173/cart`,*/
            success: `https://tienda-electronica-kt5cz9xnp-jj-arroyos-projects.vercel.app//order-confirmation`, // <-- USA TU URL DE NGROK
            failure: `https://tienda-electronica-kt5cz9xnp-jj-arroyos-projects.vercel.app//cart`,
            pending: `https://tienda-electronica-kt5cz9xnp-jj-arroyos-projects.vercel.app//cart`,
        },
        auto_return: 'approved',
        external_reference: order.id.toString(),
        notification_url: `https://tienda-electronica-3grv.onrender.com/api/webhooks/mercadopago`,

      }
    });

    // Guardar el preferenceId en la orden
    await order.update({ mercadoPagoPreferenceId: preferenceResult.id });


    res.status(201).json({ success: true, init_point: preferenceResult.init_point, orderId: order.id });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Error al crear la orden.' });
  }
};