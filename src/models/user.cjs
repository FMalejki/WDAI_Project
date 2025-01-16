const DataTypes = require('sequelize')
const bcrypt = require('bcrypt')
const sequelize = require('../sequelize.config.cjs')

const User = sequelize.define('User', {
  username: { type: DataTypes.STRING, allowNull: false, unique: true },
  password: { type: DataTypes.STRING, allowNull: false },
  role: { type: DataTypes.STRING, defaultValue: 'user' },
  token: { type: DataTypes.STRING, allowNull: true },  // Jeśli będziesz przechowywał token JWT w bazie
});

// Hashowanie hasła przed zapisaniem do bazy
User.beforeCreate(async (user) => {
  if (user.password) {
    user.password = await bcrypt.hash(user.password, 10);
  }
});

// Metoda do porównywania hasła wprowadzonego przez użytkownika z tym zapisanym w bazie
User.prototype.validPassword = async function (password) {
  return bcrypt.compare(password, this.password); // Porównaj hasła
};

module.exports = User;

