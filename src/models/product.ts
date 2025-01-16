const { DataTypes } = require('sequelize');
const sequelize = require('../sequelize.config.cjs');

const Product = sequelize.define('Product', {
  title: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.TEXT },
  price: { type: DataTypes.FLOAT, allowNull: false },
  category: { type: DataTypes.STRING },
  image: { type: DataTypes.STRING },
  quantity: { type: DataTypes.INTEGER, defaultValue: 0 },
});

module.exports = Product;
