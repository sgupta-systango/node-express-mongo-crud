const express = require('express')
const router = express.Router();
const product = require('../controllers/product.controllers')
const auth = require('../utility/auth')
const validate = require('../utility/validate')

//routes for add product form
router.get('/add', auth.checkSession, auth.userCheck, product.showForm)

//routes for adding product
router.post('/addAction', auth.checkSession, auth.userCheck, validate.product, product.add)

//routes to get product data
router.get('/view', auth.checkSession, auth.userCheck, product.get)

//routes for edit product form
router.get('/edit', auth.checkSession, auth.userCheck, product.edit)

//routes to update existing products
router.post('/updateAction', auth.checkSession, auth.userCheck, product.update)

//routes for deleting product
router.get('/delete', auth.checkSession, auth.userCheck, product.delete)

module.exports = router;
