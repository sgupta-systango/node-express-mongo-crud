const mongoose = require('mongoose')
const allProduct = require('./allProduct')
const user = require('./user')

// cart model
const cartSchema=mongoose.Schema({
    quantity:{type:String, required:true},
    productId:{type:mongoose.Types.ObjectId, ref:allProduct},
    userId:{type:mongoose.Types.ObjectId, ref:user}
})

module.exports=mongoose.model('cart',cartSchema)