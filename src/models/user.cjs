const DataTypes = require('sequelize')
const bcrypt = require('bcrypt')
const sequelize = require('../sequelize.config.cjs')

const User = sequelize.define('User', {
  username: { type: DataTypes.STRING, allowNull: false, unique: true },
  password: { type: DataTypes.STRING, allowNull: false },
  role: { type: DataTypes.STRING, defaultValue: 'user' },
  token: { type: DataTypes.STRING, allowNull: true },
});

User.beforeCreate(async (user) => {
  if (user.password) {
    user.password = await bcrypt.hash(user.password, 10);
  }
});

User.prototype.validPassword = async function (password) {
  return bcrypt.compare(password, this.password);
};

module.exports = User;

