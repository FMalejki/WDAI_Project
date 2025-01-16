const { DataTypes } = require('sequelize');
const sequelize = require('../sequelize.config.cjs');
const Product = require('./product.ts');

const Order = sequelize.define('Order', {
  date: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  status: { type: DataTypes.STRING, defaultValue: 'pending' },
});

Order.belongsToMany(Product, { through: 'OrderProducts' });

module.exports = Order;
