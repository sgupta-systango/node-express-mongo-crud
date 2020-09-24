const express = require('express')
const router = express.Router();
const allProduct = require('../controllers/allProduct.controllers')
const auth = require('../utility/auth')
const validate = require('../utility/validate')

//routes for addproduct form
router.get('/dummyAdd', auth.checkSession, auth.adminCheck, allProduct.showForm)

//routes for adding product
router.post('/dummyAddAction', auth.checkSession, auth.adminCheck, validate.allProduct, allProduct.add)

//routes to get product data
router.get('/dummyView', auth.checkSession, auth.adminCheck, allProduct.get)

//routes to get product data
router.get('/dummyUserView', auth.checkSession, auth.userCheck, allProduct.allGet)

//routes for edit product form
router.get('/dummyEdit', auth.checkSession, auth.adminCheck, allProduct.edit)

//routes to update existing products
router.post('/dummyUpdateAction', auth.checkSession, auth.adminCheck, allProduct.update)

//routes for deleting product
router.get('/dummyDelete', auth.checkSession, auth.adminCheck, allProduct.delete)

module.exports = router;
