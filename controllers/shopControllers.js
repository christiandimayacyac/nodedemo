//Declare an array that will hold the products
const Product = require('../models/Product');
const Cart = require('../models/Cart');




// /product-list => GET
exports.getProductsListPage = (req, res, next) => {
    //Retrieve all products using the sequelize .findAll method
    Product.findAll()
        .then(products=>{
            res.render("shop/product-list",{
                products: products, 
                pageTitle: 'Product List', 
                path: '/product-list'
            });
        })
        .catch(err=>console.log(err));
}

// / => GET
exports.getIndexPage = (req, res, next) => {
    //Retrieve all products using the sequelize .findAll method
    Product.findAll()
        .then(products=>{
        res.render("shop/index",{
            products: products,
            pageTitle: 'Shop', 
            path: '/'
        });
    })
    .catch(err=>console.log(err));
}

// /cart => GET
exports.getProductDetails = (req, res, next) => {
    //Get and assign the product id from the post data
    const productId = req.params.productId;

    //Retrieve all products using the sequelize .findByPk method
    Product.findByPk(productId)
        .then(product=>{
            //Render view with the product object
            res.render("shop/product-detail", {
                pageTitle: 'Product Detail',
                product: product,
                path: '/product-list'
            });
        })
        .catch(err=>console.log(err));
}

// /cart => GET
exports.getCartPage = (req, res, next) => {
    //Retrive
    req.user.getCart()
        .then(cart=>{
            const cartProducts = [];
            if (!cart) {
                console.log("User has no cart");
            }
            else{
                console.log("User has a cart");
                cart.getProducts()
                    .then(cartProducts=>{
                        // console.log(cartProducts);
                        // Render the products in the view
                        res.render("shop/cart",{
                            pageTitle: 'Your Cart', 
                            path: '/cart',
                            products: cartProducts //"cartItems" table is also accessible in the views as it is inbetween table of cart and products
                        });
                    })
                    .catch(err=>console.log(err))
            }
        })
        .catch(err=>console.log(err))
        
}

// /cart => POST
exports.postCart = (req, res, next) => {
    //Get the POST DATA
    const productId = req.body.productId;
    const price = req.body.price;
    let newQty = 1;

    let userCart;
    req.user.getCart()
        .then(cart=>{ //SELECT `id`, `createdAt`, `updatedAt`, `userId` FROM `carts` AS `cart` WHERE `cart`.`userId` = 1 LIMIT 1;
            // console.log("CART FOUND:", cart);
            //Retrieve a product that is found in cart of the user
            userCart = cart;
            return cart.getProducts({where: {id: productId}});  //SELECT `product`.`id`, `product`.`itemName`, `product`.`price`, `product`.`description`, `product`.`imageURL`, `product`.`createdAt`, `product`.`updatedAt`, `product`.`userId`, `cartItems`.`id` AS `cartItems.id`, `cartItems`.`qty` AS `cartItems.qty`, `cartItems`.`createdAt` AS `cartItems.createdAt`, `cartItems`.`updatedAt` AS `cartItems.updatedAt`, `cartItems`.`cartId` AS `cartItems.cartId`, `cartItems`.`productId` AS `cartItems.productId` FROM `products` AS `product` INNER JOIN `cartItems` AS `cartItems` ON `product`.`id` = `cartItems`.`productId` AND `cartItems`.`cartId` = 1 WHERE (`product`.`id` = '1');
        })
            .then(products=>{
                //If product exists in the cart, increment the quantity
                if (products.length > 0) {
                    console.log("Product already exists in the Cart");
                    const product = products[0]; //Array expected so get the first element only
                    //Get the current quantity of the product in the cart
                    const currentQty =  product.cartItem.qty;
                    console.log("QUANTITY OF THE PRODUCT: ", product.cartItem.qty);
                    newQty = currentQty + 1;
                    //Increment Quantity and save
                    return product;
                }
                //If product does not exist in cart get the product from the product list
                else {
                    console.log("Product does not exists in the Cart");
                    //Retrieve the product details from the products table to be added in the cart
                    return Product.findByPk(productId)
                }
            })
                //Save the new product or incremented qty
                .then(product=> {
                    return userCart.addProduct(product, {through : {qty: newQty}});
                })
                .then(result=>{
                    //Handle the result of the adding product to the cart
                    console.log("Product is added in the cart");
                })
                .catch(err=>console.log(err))
        .catch(err=>console.log(err))
    // Cart.addProduct (productId, price, qty);

    res.redirect("/");
}


// /cart-delete-product => POST
exports.deleteCartProduct = (req, res, next) => {
    const productId = req.body.productId;

    req.user.getCart()
        .then(cart=>{
            return cart.getProducts({where: {id: productId}});
        })
        .catch(err=>console.log(err))
            .then(products=>{
                if (products.length > 0) {
                    const product = products[0];
                    console.log("product to DESTROY:  ",product);
                    return product.cartItem.destroy(); //
                }
                else {
                    console.log("Product is not found in the cart.");
                }
            })
                .then(result=>res.redirect("/cart"))
                .catch(err=>console.log(err))
            .catch(err=>console.log(err))
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
