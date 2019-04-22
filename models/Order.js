//Require Sequelize
const Sequelize = require('sequelize');

//Require the database.js as sequelize object
const sequelize = require('../helpers/database');

const Order = sequelize.define('order', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    }
});

module.exports = Order;