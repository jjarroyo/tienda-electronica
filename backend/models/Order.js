const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const Order = sequelize.define('Order', {
  customerName: { type: DataTypes.STRING, allowNull: false },
  address: { type: DataTypes.STRING, allowNull: false },
  city: { type: DataTypes.STRING, allowNull: false },
  phone: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, allowNull: false, validate: { isEmail: true } },
  shippingCost: { type: DataTypes.FLOAT, allowNull: false },
  subtotal: { type: DataTypes.FLOAT, allowNull: false },
  total: { type: DataTypes.FLOAT, allowNull: false },
  paymentMethod: { type: DataTypes.STRING, allowNull: false },  
  status: { 
        type: DataTypes.ENUM('pendiente', 'aprobado', 'enviado', 'entregado', 'cancelado'),
        defaultValue: 'pendiente' 
    },
  mercadoPagoPreferenceId: { type: DataTypes.STRING },
  trackingUrl: { type: DataTypes.STRING, allowNull: true }
});

module.exports = Order;