const express = require('express');
const router = express.Router();

//Require productControllers
const productsController = require('../controllers/productControllers');

router.get("/add-product", productsController.addGetProductPage);

router.post("/add-product", productsController.addProduct);

module.exports = router;
