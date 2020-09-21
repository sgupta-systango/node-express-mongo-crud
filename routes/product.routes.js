const express = require('express')
const router = express.Router();
const product = require('../controllers/product.controllers')
const checkSession = require('../utility/auth')
const validate = require('../utility/validate')

//routes for add product form
router.get('/add', checkSession, product.showForm)

//routes for adding product
router.post('/addAction', checkSession, validate.product, product.add)

//routes to get product data
router.get('/view', checkSession, product.get)

//routes for edit product form
router.get('/edit', checkSession, product.edit)

//routes to update existing products
router.post('/updateAction', checkSession, product.update)

//routes for deleting product
router.get('/delete', checkSession, product.delete)

module.exports = router;
