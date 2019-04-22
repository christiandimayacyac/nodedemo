//Require Sequelize
const Sequelize = require('sequelize');

//Require the database.js as sequelize object
const sequelize = require('../helpers/database');

const OrderItem = sequelize.define('orderItem', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    qty: Sequelize.INTEGER
});

module.exports = OrderItem;