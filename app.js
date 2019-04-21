// const path = require('path');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');

//Define the port to use for listening in the server
const PORT = process.env.PORT || 3000;

//Define sequelize object for database connection
const sequelize = require('./helpers/database');
//Define Models to be created with relationships
const Product = require('./models/Product');
const User = require('./models/User');
const Cart = require('./models/Cart');
const CartItem = require('./models/Cart-Item');

//Define the controllers
const errorControllers = require('./controllers/errors');
const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

//Define the template engine
app.set('view engine', 'ejs');
//Define where the views are located
app.set('views', 'views');

app.use(bodyParser.urlencoded({extended:true}));
// app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static('public'));

//Register a middleware that will handle incoming request to make a user available all the time during incoming request
app.use((req, res, next) => { //This will execute only after the server has started
    User.findByPk(1)
        .then(user=>{
            req.user = user; //Add a new fields to request object
            next();
        })
        .catch(err=>console.log(err))
})

//Define the routes
app.use('/admin', adminRoutes);
app.use(shopRoutes);

//Define the ERROR 404 route
app.use(errorControllers.getError404);


//Define the relattionship of the models to be sync
Product.belongsTo(User,{Constraints: true, onDelete: "CASCADE"});
User.hasMany(Product); // OPTIONAL: Inverse of the above line of code

User.hasOne(Cart);
Cart.belongsTo(User); // OPTIONAL: Inverse of the above line of code
Cart.belongsToMany(Product, {through: CartItem}); //will generate CartProduct model that will hold cartId and ProductId
Product.belongsToMany(Cart, {through: CartItem}); //and through is required for belongsToMany association

//Sync the defined Models fromt the database.js to the MYSQL database
sequelize
    // .sync({force:true}) //"{force:true}" <=== WARNING: FOR DEVELOPMENT STAGE ONLY and NOT FOR PRODUCTION: To overide the existing tables USE THIS PARAMETER ONCE THEN REMOVE
    .sync()
    // .then(result=>{app.listen(3000)}) <= can replace the following .then if built-in demo user not needed
        .then(result=>{
            User.findByPk(1)
                .then(user=> {
                    let demoUser;
                    if (!user) {
                        return User.create({name: "Ian", email: "ian@gmail.com", password: "1111"});
                    }
                    return user;
                })
                    .then(user=>{
                        demoUser = user;
                        return user.getCart({where: {userId:user.id}});
                    })
                        .then(cart => {
                            console.log("Built-in User Created: Username -> Ian, Password -> 1111");
                            if(cart) {
                                console.log("User cart already exists");
                            }
                            else {
                                demoUser.createCart();
                                console.log("Cart has been created");
                            }
                            app.listen(PORT, console.log(`Server has started on port ${PORT}`));   
                        
                        })
        })
        .catch(err=>{
            console.log(err);
        });

