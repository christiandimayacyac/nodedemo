//Declare an array that will hold the products
const Product = require('../models/product');

exports.addGetProductPage = (req, res, next) => {
    res.render('add-product', {
        pageTitle: 'Add Product', 
        path: '/admin/add-product'
    });
}

exports.addProduct = (req, res, next) => {
    const product = new Product(req.body.itemName);
    product.save();
    res.redirect("/");
}

exports.getProductsList = (req, res, next) => {
    //Pass the anonumous function as a callback for Product.fetchAll; this callback will be executed only after the fetchAll finishes executing the readFile callback
    //Product.fetchAll will be the one to pass products parameter a value of [] or JSON data after fetchAll finishes it execution
    Product.fetchAll((products) => {
        console.log("products received: ", products);
        res.render("shop",{
            products: products, 
            pageTitle: 'Shop - Product List', 
            path: '/'
        });
    });
    
}

// exports.products = products;