const mongoose = require('mongoose')
const Str = require('@supercharge/strings')
const config = require('../config/const')
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)
const users = require('../models/user')
const carts = require('../models/cart')
const orders = require('../models/order')
const payments = require('../models/payment')

//function to render on checkout page with userdata & cart total
module.exports.checkout = async(req, res) => {
    try {
        const userData = await users.findById(req.session.user._doc._id);
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
            },
            {
                $group: {
                    _id: null,
                    grandTotal: { $sum: { $multiply: [{ $toInt: '$quantity' }, { $toInt: '$product.price' }] } }
                }
            }
        ]);
        res.render('checkout', { user: userData, gtotal: result[0].grandTotal, uid: req.session.user._doc.email, isAdmin: req.session.user.isAdmin, msg1: req.flash('msg1') })
    } catch (err) {
        res.json({ error: err.toString() })
    }
}

//function to initiate payment
module.exports.pay = (req, res) => {
    try {
        const { name, email, mobile, address, country, state, district, zip, amount } = req.body;
        const token = req.body.stripeToken;
        console.log(token);

        const customer = await stripe.customers.retrieve(
            req.session.user._doc.stripeCustomerId
        );
        console.log(customer);

        const card = await stripe.customers.createSource(customer.id, {
            source: token
        });
        console.log(card);

        console.log(amount);
        stripe.charges.create({
            amount: amount,
            currency: "inr",
            source: card.id,
            customer: customer.id,
            shipping: {
                address: {
                    country: country,
                    state: state,
                    city: district,
                    line1: address,
                    postal_code: zip
                },
                name: name,
                phone: mobile,
            }
        }, async(err, charge) => {
            console.log(charge)
            if (err) {
                console.log(err);
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
                        orderDate: new Date().toDateString(),
                        shipping: charge.shipping
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
