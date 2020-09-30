const mongoose = require('mongoose')
const config = require('../config/const')
const carts = require('../models/cart')
const { modelName } = require('../models/cart')

//function to add selected product in  user cart
module.exports.add = (req, res, next) => {
    try {
        const { id, quantity } = req.body;
        const newCart = new carts({
            quantity: quantity,
            productId: id,
            userId: req.session.user._doc._id
        })
        newCart.save().then((data) => {
            req.flash('msg', 'Product added in cart')
            res.redirect('/allProduct/dummyUserView')
        })
    } catch (err) {
        res.json({ error: err.toString() })
    }
}

//function to get all item of the cart with product details
module.exports.get = async(req, res, next) => {
    try {
        const result = await carts.aggregate([{
                $lookup: {
                    from: 'allproducts',
                    localField: 'productId',
                    foreignField: '_id',
                    as: 'product'
                }
            },
            {
                $match: {
                    userId: mongoose.Types.ObjectId(req.session.user._doc._id)
                }
            },
            {
                $unwind: '$product',

            }
        ]);
        const fprice = result.map((rec) => {
            return rec.product.price * rec.quantity;
        })

        const finaldata = result.map((rec, index) => {
            var pair = { fprice: fprice[index] };
            var objs = {...rec, ...pair }
            return objs;
        })

        const grandTotal = fprice.reduce((total, num) => {
            return total + num
        }, 0)
        if (result.length !== 0) {
            res.render('viewCart', { cart: finaldata, gTotal: grandTotal, msg: req.flash('msg'), msg1: req.flash('msg1'), uid: req.session.user._doc.email, isAdmin: req.session.user.isAdmin })
        } else {
            res.status(config.statusCode.NOT_FOUND).render('viewCart', { msg: 'cart is empty', msg2: req.flash('msg2'), gTotal: grandTotal, uid: req.session.user._doc.email, isAdmin: req.session.user.isAdmin })
        }
    } catch (err) {
        res.json({ error: err.toString() })
    }
}

//function to delete items from the cart
module.exports.deleteItem = async(req, res, next) => {
    try {
        const { id } = req.query;
        const result = await carts.deleteOne({ _id: id });
        if (result.affectedRows !== 0) {
            req.flash('msg', 'Item deleted')
            res.redirect('viewCart')
        } else {
            req.flash('msg1', 'Item deleted')
            res.redirect('viewCart')
        }
    } catch (err) {
        res.json({ error: err.toString() })
    }
}
