// const path = require('path');

const express = require('express');

const productControllers = require('../controllers/productControllers');

const router = express.Router();

router.get("/", productControllers.getProductsList);

module.exports = router;