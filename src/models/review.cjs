const { DataTypes } = require('sequelize');
const sequelize = require('../sequelize.config.cjs');
const User = require('./user.cjs');
const Product = require('./product.cjs');

const Review = sequelize.define('Review', {
  email: { type: DataTypes.STRING, allowNull:false},
  rating: { type: DataTypes.INTEGER, allowNull: false },
  message: { type: DataTypes.TEXT, allowNull: false },
});

Review.belongsTo(User, { as: 'user', foreignKey: 'userId' });
Review.belongsTo(Product, { as: 'product', foreignKey: 'productId' });

module.exports = Review;
