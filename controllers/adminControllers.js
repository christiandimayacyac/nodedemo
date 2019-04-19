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
    
    Product.findProductById(productId,(product)=>{
        res.render('admin/edit-product',{
                    product: product, 
                    pageTitle: 'Edit Product', 
                    path: '/admin/product-list',
                    mode:'Edit'
                });
    });
}

exports.postAddProduct = (req, res, next) => {
    //Retrieve the product details from the post data
    const itemName = req.body.itemName;
    const imageURL = req.body.imageURL;
    const price = req.body.price;
    const description = req.body.description;

    //Create instance of the Product Model
    const product = new Product(itemName, imageURL, price, description, null);
    
    //Save the product
    product.save(()=>res.redirect("/"));
}

exports.postEditProduct = (req, res, next) => {
    //Retrieve the product details from the post data
    const productId = req.body.productId;
    const itemName = req.body.itemName;
    const imageURL = req.body.imageURL;
    const price = req.body.price;
    const description = req.body.description;

    const productDetails = {
                                productId,
                                itemName,
                                imageURL,
                                price,
                                description
                            };
    

    console.log('Product ready for update: ', productId);

    //Create instance of the Product Model to holde the changes
    const updatedProduct = new Product(itemName, imageURL, price, description, productId);
  
    //Save the product
    updatedProduct.save(()=>res.redirect("/"));
}

exports.postDeleteProduct = (req, res, next) => {
    //Retrieve the product id from the post data
    const productId = req.body.productId;

    //Delete product 
    Product.deleteProductById(productId, ()=>res.redirect("/admin/product-list"));
}

exports.getAdminProductsPage = (req, res, next) => {
    Product.fetchAll((products) => {
        res.render("admin/product-list",{
            products: products, 
            pageTitle: 'Shop', 
            path: '/'
        });
    });
}