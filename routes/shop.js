// const path = require('path');

const express = require('express');

const shopControllers = require('../controllers/shopControllers');

const router = express.Router();

router.get("/", shopControllers.getIndexPage);
// router.get("/", shopControllers.getCart);
router.get("/product-list", shopControllers.getProductsListPage);
router.get("/product/:productId", shopControllers.getProductDetails);
router.get("/cart", shopControllers.getCartPage);
router.post("/cart", shopControllers.postCart);
router.post("/cart-delete-product", shopControllers.deleteCartProduct);
router.post("/place-order", shopControllers.postOrder);
router.get("/checkout", shopControllers.getCheckoutPage);
router.get("/orders", shopControllers.getOrdersPage);

module.exports = router;