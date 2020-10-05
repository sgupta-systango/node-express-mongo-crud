const { date } = require('joi')
const mongoose = require('mongoose')
const allProduct = require('./allProduct')
const user = require('./user')

// order model
const orderSchema = mongoose.Schema({
    orderId: { type: mongoose.Types.ObjectId, required: true },
    userId: { type: mongoose.Types.ObjectId, ref: user },
    productId: { type: mongoose.Types.ObjectId, ref: allProduct },
    quantity: { type: String, required: true },
    amount: { type: String, required: true },
    refString: { type: String, required: true, unique: true },
    orderDate: { type: String },
    shipping: {}
})

module.exports = mongoose.model('order', orderSchema)
