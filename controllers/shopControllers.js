//Declare an array that will hold the products
const Product = require('../models/Product');
const Cart = require('../models/Cart');


// /product-list => GET
exports.getProductsListPage = (req, res, next) => {
    //Pass the anonumous function as a callback for Product.fetchAll; this callback will be executed only after the fetchAll finishes executing the readFile callback
    //Product.fetchAll will be the one to pass products parameter a value of [] or JSON data after fetchAll finishes it execution
    Product.fetchAll((products) => {
        res.render("shop/product-list",{
            products: products, 
            pageTitle: 'Product List', 
            path: '/product-list'
        });
    });
}

// / => GET
exports.getIndexPage = (req, res, next) => {
    //Pass the anonumous function as a callback for Product.fetchAll; this callback will be executed only after the fetchAll finishes executing the readFile callback
    //Product.fetchAll will be the one to pass products parameter a value of [] or JSON data after fetchAll finishes it execution
    Product.fetchAll((products) => {
        res.render("shop/index",{
            products: products, 
            pageTitle: 'Shop', 
            path: '/'
        });
    });
}

// /cart => GET
exports.getProductDetails = (req, res, next) => {
    //Get and assign the product id from the post data
    const productId = req.params.productId;
    
    Product.findProductById(productId, (product) =>{
        //Render view with the product object
        res.render("shop/product-detail", {
            pageTitle: 'Product Detail',
            product: product,
            path: '/product-list'
        });
    });
}

// /cart => GET
exports.getCartPage = (req, res, next) => {
    
    console.log("getting cart page");
    //Retrive
    Product.fetchAll(products=> {
        console.log(products);
        //Initialize cartProucts to hold cart items with details
        const cartProducts = [];    
        // Retrieve cart products
        Cart.getCart(cart=>{
            //Match each product in the cart to the complete product list and add to Products array
            for (cartProduct of cart.products) {
                const matchingProductIndex = products.findIndex(prod=>prod.id === cartProduct.id);
                if (matchingProductIndex >= 0) {
                    cartProducts.push({id:products[matchingProductIndex].id, itemName:products[matchingProductIndex].itemName, qty: cartProduct.qty});
                }
            }

            //Render the products in the view
            res.render("shop/cart",{
                pageTitle: 'Your Cart', 
                path: '/cart',
                products: cartProducts
            });
        });

        

    });

    console.log("end getting cart page");
}

// /cart => POST
exports.postCart = (req, res, next) => {
    console.log(req.body.productId);
    //Get the POST DATA
    const productId = req.body.productId;
    const price = req.body.price;
    const qty = 1;

    Cart.addProduct (productId, price, qty);

    res.redirect("/");
}


// /cart-delete-product => POST
exports.deleteCartProduct = (req, res, next) => {
    const productId = req.body.productId;
    console.log(productId);
    //Retrieve the price of the product to delete
    Product.findProductById(productId,(product) => {
        //Delete product item from the cart
        const productPrice = product.price;
        Cart.deleteProductById(productId, productPrice);
        res.redirect("/cart");
    });
    
}

// /cart => GET
exports.getOrdersPage = (req, res, next) => {
    res.render("shop/orders",{
        pageTitle: 'Your Orders', 
        path: '/orders'
    });
}

// /checkout => GET
exports.getCheckoutPage = (req, res, next) => {
    res.render("shop/checkout",{
        pageTitle: 'Check Out', 
        path: '/checkout'
    });
}
