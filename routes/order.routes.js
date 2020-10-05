const express = require('express')
const router = express.Router();
const auth = require('../utility/auth')
const order = require('../controllers/order.controllers');

//routes for order details
router.get('/details', auth.checkSession, auth.userCheck, order.details)

//routes for 
router.get('/checkout', auth.checkSession, auth.userCheck, order.checkout)

//route for payment
router.post('/pay', auth.checkSession, auth.userCheck, order.pay);

//routes for Payment details
router.get('/payment', auth.checkSession, auth.userCheck, order.payment)

module.exports = router;
