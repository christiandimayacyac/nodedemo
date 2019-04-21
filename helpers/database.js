const Sequelize = require('sequelize');

const sequelize = new Sequelize('nodedemo', 'ziemdi', '123456', {dialect: 'mysql', host: 'localhost'});

//Check database connection
sequelize.authenticate()
    .then(()=>console.log("Database connected..."))
    .catch(err=>console.log("Error connecting to the database: ", err))

module.exports = sequelize;