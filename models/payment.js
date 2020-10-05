const { string } = require('joi')
const mongoose = require('mongoose')
const order = require('./order')
const user = require('./user')
    // payment model
const paymentSchema = mongoose.Schema({
    tokenId: { type: String, required: true },
    chargeId: { type: String, required: true },
    transactionId: { type: String, required: true },
    orderId: { type: mongoose.Types.ObjectId, ref: order },
    mode: { type: String, required: true },
    amount: { type: String, required: true },
    paymentDate: { type: String },
    status: String
})

module.exports = mongoose.model('payment', paymentSchema)
