const carts = require('../models/cart')
const config = require('../config/const')

module.exports.productCheckInCart = async(req, res, next) => {
    try {
        const { id, quantity } = req.body;
        const result = await carts.findOne({ productId: id, userId: req.session.user._doc._id });
        if (result) {
            const newQuantity = parseInt(result.quantity) + parseInt(quantity);
            const newResult = await carts.updateOne({ _id: result._id }, { quantity: newQuantity });
            if (newResult.nModified !== 0) {
                req.flash('msg', 'Product added in cart')
                res.redirect('/allProduct/dummyUserView')
            } else {
                req.flash('msg1', 'Product not added in cart')
                res.redirect('/allProduct/dummyUserView')
            }
        } else {
            return next();
        }
    } catch (err) {
        console.log(err);
    }
}