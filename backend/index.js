// backend/index.js
require('dotenv').config();
const express = require('express');
const sequelize = require('./db'); 
const cors = require('cors'); 
const Product = require('./models/Product');
const User = require('./models/User');
const Order = require('./models/Order'); 
const OrderItem = require('./models/OrderItem');

// Rutas
const productRoutes = require('./routes/products');
const authRoutes = require('./routes/auth');
const orderRoutes = require('./routes/orders'); 
const adminOrderRoutes = require('./routes/admin/orderRoutes');
const webhookRoutes = require('./routes/webhookRoutes');
const adminDashboardRoutes = require('./routes/admin/dashboardRoutes');  
const adminCategoryRoutes = require('./routes/admin/categoryRoutes'); 
const publicCategoryRoutes = require('./routes/categories');

const app = express();
app.use(cors());
app.use(express.json());

// Montar las rutas
app.use('/api/productos', productRoutes);
app.use('/api/auth', authRoutes); 
app.use('/api/orders', orderRoutes);
app.use('/api/admin/orders', adminOrderRoutes);
app.use('/api/webhooks', webhookRoutes);
app.use('/api/admin/orders', adminOrderRoutes);
app.use('/api/admin/dashboard', adminDashboardRoutes); 
app.use('/api/admin/categories', adminCategoryRoutes); 
app.use('/api/categories', publicCategoryRoutes); 

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    // Sincroniza los modelos con la base de datos
    // Esto creará las tablas si no existen
    await sequelize.sync({ alter: true });

    console.log('Conexión a la base de datos establecida y modelos sincronizados.');
    app.listen(PORT, () => {
      console.log(`Servidor corriendo en el puerto ${PORT}`);
    });
  } catch (error) {
    console.error('No se pudo conectar a la base de datos:', error);
  }
};

startServer();