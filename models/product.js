const Sequelize = require('sequelize');
//Require the database.js as sequelize object
const sequelize = require('../helpers/database');

//Define the PRODUCT MODEL
const Product = sequelize.define('product', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    itemName: Sequelize.STRING,
    price: {
        type: Sequelize.DOUBLE,
        allowNull: false
    },
    description: {
        type: Sequelize.TEXT,
        allowNull: false
    },
    imageURL: {
        type: Sequelize.STRING,
        allowNull: false
    }
});

module.exports = Product;  