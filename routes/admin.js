const express = require('express');
const router = express.Router();

//Require productControllers
const adminControllers = require('../controllers/adminControllers');

// /admin/add-product => GET
router.get("/add-product", adminControllers.getAddProductPage);

// /admin/product-list => GET
router.get("/product-list", adminControllers.getAdminProductsPage);

// /admin/add-product => POST
router.post("/add-product", adminControllers.postAddProduct);

// /admin/edit-product => POST
// /admin/edit-product => POST
router.post("/edit-product", adminControllers.postEditProduct);

// /admin/delete-product => POST
router.post("/delete-product", adminControllers.postDeleteProduct);

// /admin/edit-product => GET
router.get("/edit-product/:productId", adminControllers.getEditProductPage);

module.exports = router;
