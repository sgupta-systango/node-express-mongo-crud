const mongoose = require('mongoose')
const user = require('./user')

//product model
const productSchema=mongoose.Schema({
    name:{ type:String, require:true },
    image:{ type:String, unique:true, require:true },
    userId:{ type:mongoose.Schema.ObjectId, required:true, ref:user }
})

module.exports=mongoose.model('product',productSchema)