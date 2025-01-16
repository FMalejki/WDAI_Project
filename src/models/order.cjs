const { DataTypes } = require('sequelize');
const sequelize = require('../sequelize.config.cjs');

const Order = sequelize.define('Order', {
  date: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  status: { type: DataTypes.STRING, defaultValue: 'pending' },
  products: { type: DataTypes.JSON, allowNull: false },
}, {tableName: 'Orders'});

module.exports = Order;
