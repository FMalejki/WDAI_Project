const { Sequelize } = require('sequelize');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './database.sqlite', // Lokalizacja pliku bazy danych
  logging: false, // Wyłącz logi SQL w konsoli
});

module.exports = sequelize;
