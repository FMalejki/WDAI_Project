const sequelize = require('../sequelize.config.cjs');
const User = require('./user.cjs');
const Product = require('./product.cjs');
const Order = require('./order.cjs');
const Review = require('./review.cjs');
const Cart = require('./cart.cjs')

// Relacje
Product.hasMany(Review, { as: 'reviews', foreignKey: 'productId' });
User.hasMany(Review, { as: 'reviews', foreignKey: 'userId' });

module.exports = { sequelize, User, Product, Order, Review, Cart };
