const express = require('express')
const router = express.Router();
const auth = require('../utility/auth')
const order = require('../controllers/order.controllers');

//route for payment
router.post('/pay', auth.checkSession, order.pay);

//route for checkout(save order details & delete data from cart)
router.get('/checkoutAction', auth.checkSession, order.checkoutAction)

//routes for order details
router.get('/details', auth.checkSession, order.details)

module.exports = router;
