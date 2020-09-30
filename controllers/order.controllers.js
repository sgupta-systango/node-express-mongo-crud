const mongoose = require('mongoose')
const Str = require('@supercharge/strings')
const config = require('../config/const')
const stripe = require('stripe')('sk_test_GrF1OPlJ39fDLRmLLyFYaWIM00gGq6a8Tj')
const carts = require('../models/cart')
const orders = require('../models/order')

//function to initiate payment
module.exports.pay = async(req, res) => {
    try {
        const token = req.body.stripeToken;
        const chargeamt = req.body.amount;
        console.log(chargeamt);
        const charge = stripe.charges.create({
            amount: chargeamt,
            currency: "inr",
            source: token
        }, (err, result) => {
            console.log(result)
            if (err) {
                console.log("Card Decliend");
                req.flash('msg1', 'Card Decliend');
                res.redirect('/cart/viewCart')
            } else
                res.redirect('/order/checkoutAction');
        });
    } catch (err) {
        res.json({ error: err.toString() })
    }
}

//function to save checkout data in order and delete the cart
module.exports.checkoutAction = async(req, res) => {
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
        const orderId = Date.now()
        finaldata.forEach((data) => {
            const newOrder = new orders({
                orderId: orderId,
                userId: req.session.user._doc._id,
                productId: data.productId,
                quantity: data.quantity,
                amount: data.fprice,
                refString: Str.random(8),
                orderDate: new Date().toDateString()
            })
            newOrder.save()
        })

        const delCart = await carts.deleteMany({ userId: req.session.user._doc._id });
        if (delCart.deletedCount !== 0) {
            req.flash('msg2', 'Order Placed')
            res.redirect('/cart/viewCart')
        } else {
            req.flash('msg1', 'Order cannot be Placed')
            res.redirect('/cart/viewCart')
        }
    } catch (err) {
        res.json({ error: err.toString() })
    }
}

//fun to get order history
module.exports.details = async(req, res) => {
    try {
        const result = await orders.aggregate([{
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
        if (result.length !== 0) {
            res.render('orderDetails', { order: result, uid: req.session.user._doc.email, isAdmin: req.session.user.isAdmin })
        } else {
            res.status(config.statusCode.NOT_FOUND).render('orderDetails', { msg: 'No data found', uid: req.session.user._doc.email, isAdmin: req.session.user.isAdmin })
        }
    } catch (err) {
        res.json({ error: err.toString() })
    }
}
