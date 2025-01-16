const sequelize = require('../sequelize.config.cjs');
const User = require('./user.ts');
const Product = require('./product.ts');
const Order = require('./order.ts');
const Review = require('./review.ts');

// Relacje
Product.hasMany(Review, { as: 'reviews', foreignKey: 'productId' });
User.hasMany(Review, { as: 'reviews', foreignKey: 'userId' });

module.exports = { sequelize, User, Product, Order, Review };
