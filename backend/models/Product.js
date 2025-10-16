// backend/models/Product.js
const { DataTypes } = require('sequelize');
const sequelize = require('../db'); // Importamos la conexión
const Category = require('./Category');
const Product = sequelize.define('Product', {
  // Sequelize crea un 'id' automáticamente (PK, auto-incremental)
  nombre: {
    type: DataTypes.STRING,
    allowNull: false // Equivale a 'required: true'
  },
  descripcion: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  precio: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  stock: {
    type: DataTypes.INTEGER,
    defaultValue: 0 // Valor por defecto
  },
  imagenUrl: {
    type: DataTypes.STRING,
    allowNull: false
  },
  
});
Category.hasMany(Product); 
Product.belongsTo(Category); 

module.exports = Product;