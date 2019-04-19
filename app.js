// const path = require('path');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');

const errorControllers = require('./controllers/errors');
const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(bodyParser.urlencoded({extended:true}));
// app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static('public'));

app.use('/admin', adminRoutes);
app.use(shopRoutes);

//ERROR 404 Route
app.use(errorControllers.getError404);



app.listen(3000);