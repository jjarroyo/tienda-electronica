// backend/models/User.js
const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const User = sequelize.define('User', {
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true, // Cada email debe ser único
    validate: {
      isEmail: true // Valida que el formato sea de email
    }
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  }
});

module.exports = User;