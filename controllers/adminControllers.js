//Require Product Model
const Product = require('../models/Product');

exports.getAddProductPage = (req, res, next) => {
    res.render('admin/add-product', {
        pageTitle: 'Add Product', 
        path: '/admin/add-product',
        mode:'Add'
    });
}

exports.getEditProductPage = (req, res, next) => {
    const productId = req.params.productId;
    //Get the product by id under a certain user only
    req.user.getProducts({where: {id:productId}}) //.getProducts method <=automatically created method based on models association; uses "where" for where clause 
        .then(products=>{
            const product = products[0]; //Get the first element in the array
            if (!product) { 
                res.redirect('/');
            }
            console.log(product);
            res.render('admin/edit-product',{
                product: product, 
                pageTitle: 'Edit Product', 
                path: '/admin/product-list',
                mode:'Edit'
            })
        })
        .catch(err=>console.log(err))
}


exports.postAddProduct = (req, res, next) => {
    //Retrieve the product details from the post data
    const itemName = req.body.itemName;
    const imageURL = req.body.imageURL;
    const price = req.body.price;
    const description = req.body.description;
    //Save the new product with automatic userId value insertion due to model associations from the app.js
    req.user
        .createProduct({ //createProduct is method automatically created based on the model associations i.e. User.hasMany(Products) or Product.belongsTo(User) => "user creates product"
            itemName: itemName,
            price: price,
            description: description,
            imageURL: imageURL
        })
        .then(result=>{
            console.log("Product created in the database");
            res.redirect("/admin/product-list");
        })
        .catch(err=>{
            console.log(err);
            res.redirect("/admin/product-list");
        });
}

exports.postEditProduct = (req, res, next) => {
    //Retrieve the product details from the post data
    const productId = req.body.productId;
    const itemName = req.body.itemName;
    const imageURL = req.body.imageURL;
    const price = req.body.price;
    const description = req.body.description;

    //Find product to be updated
    Product.findByPk(productId)
        //Assign new values of the found product
        .then(product=>{
            product.itemName = itemName;
            product.price = price;
            product.description = description;
            product.imageURL = imageURL;
            //Apply changes to the Database
            return product.save(); //Used return to avoid promises nesting. Return value is passed to the following .then
        })
            .then(result=> { //This .then receives the return value of the above .then => return product.save()
                console.log("Product is successfully updated!")
                res.redirect("/");
            }) 
        .catch(err=>{
            console.log(err)
            res.redirect("/");
        });
}

exports.postDeleteProduct = (req, res, next) => {
    //Retrieve the product id from the post data
    const productId = req.body.productId;

    //Delete product 
    Product.findByPk(productId)
        .then(product=>{
            return product.destroy();
        })
            .then(result=>{
                console.log("Product is deleted successfully!");
                res.redirect("/admin/product-list");
            })
        .catch(err=>{
            console.log(err);
            res.redirect("/admin/product-list");
        });
}

exports.getAdminProductsPage = (req, res, next) => {
    //Retrieve all products using automatically generated getProducts method based on model associations using sequelize
    req.user.getProducts()
        .then(products=>{
            res.render("admin/product-list",{
                products: products, 
                pageTitle: 'Shop', 
                path: '/'
            });
        })
        .catch(err=>console.log(err));
}