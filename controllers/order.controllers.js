const mongoose = require('mongoose')
const Str = require('@supercharge/strings')
const config = require('../config/const')
const stripe = require('stripe')('sk_test_GrF1OPlJ39fDLRmLLyFYaWIM00gGq6a8Tj')
const carts = require('../models/cart')
const orders = require('../models/order')
const payments = require('../models/payment')

module.exports.checkout = (req, res) => {
    const { gtotal } = req.query;
    res.render('checkout', { gtotal: gtotal, uid: req.session.user._doc.email, isAdmin: req.session.user.isAdmin })
}

//function to initiate payment
module.exports.pay = (req, res) => {
    try {
        const token = req.body.stripeToken;
        const chargeamt = req.body.amount;
        console.log(chargeamt);
        stripe.charges.create({
            amount: chargeamt,
            currency: "inr",
            source: token
        }, async(err, charge) => {
            console.log(charge)
            if (err) {
                console.log("Card Decliend");
                req.flash('msg1', 'Card Decliend');
                res.redirect('/cart/viewCart')
            } else {
                const orderId = new mongoose.Types.ObjectId
                const newPayment = new payments({
                    tokenId: token,
                    chargeId: charge.id,
                    transactionId: charge.balance_transaction,
                    orderId: orderId,
                    // userId: req.session.user._doc._id,
                    mode: charge.payment_method_details.type,
                    amount: charge.amount,
                    paymentDate: new Date().toUTCString(),
                    status: charge.status
                })
                await newPayment.save()
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
            }
        });
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

module.exports.payment = async(req, res) => {
    try {
        const result = await orders.aggregate([{
                $match: {
                    userId: mongoose.Types.ObjectId(req.session.user._doc._id)
                }
            },
            {
                $lookup: {
                    from: 'payments',
                    localField: 'orderId',
                    foreignField: 'orderId',
                    as: 'payment'
                }
            },
            {
                $unwind: '$payment',

            },
            {
                $group: {
                    _id: '$orderId',
                    orderedItems: { $sum: 1 },
                    tokenId: { $first: '$payment.tokenId' },
                    chargeId: { $first: '$payment.chargeId' },
                    transactionId: { $first: '$payment.transactionId' },
                    mode: { $first: '$payment.mode' },
                    amount: { $first: '$payment.amount' },
                    paymentDate: { $first: '$payment.paymentDate' },
                    status: { $first: '$payment.status' },
                }
            },
            {
                $sort: { paymentDate: -1 }
            }
        ]);
        if (result.length !== 0) {
            res.render('paymentDetails', { payment: result, uid: req.session.user._doc.email, isAdmin: req.session.user.isAdmin })
        } else {
            res.status(config.statusCode.NOT_FOUND).render('paymentDetails', { msg: 'No data found', uid: req.session.user._doc.email, isAdmin: req.session.user.isAdmin })
        }
    } catch (err) {
        res.json({ error: err.toString() })
    }
}
