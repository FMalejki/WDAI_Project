const { DataTypes } = require("sequelize");
const sequelize = require("../sequelize.config.cjs");
const User = require("./user.cjs");

const Cart = sequelize.define("Cart", {
  title: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.STRING, allowNull: false },
  price: { type: DataTypes.FLOAT, allowNull: false },
  category: { type: DataTypes.STRING },
  image: { type: DataTypes.STRING },
  quantity: { type: DataTypes.INTEGER, defaultValue: 1 },
});

Cart.belongsTo(User);

module.exports = Cart;
