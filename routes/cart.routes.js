const express = require('express')
const router = express.Router();
const cart = require('../controllers/cart.controllers')
const auth = require('../utility/auth');
const cartMiddleware = require('../utility/cart.middleware')
const { route } = require('./user.routes');

//routes for adding item to user cart
router.post('/addCartAction', auth.checkSession, auth.userCheck, cartMiddleware.productCheckInCart, cart.add)

//routes for view cart that user added
router.get('/viewCart', auth.checkSession, auth.userCheck, cart.get)

//routes to delete items from cart
router.get('/deleteCartItem', auth.checkSession, auth.userCheck, cart.deleteItem)

module.exports = router;
