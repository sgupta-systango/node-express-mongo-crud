const mongoose = require('mongoose')

// all product model
const allProductSchema=mongoose.Schema({
    name:{ type:String, require:true },
    image:{ type:String, unique:true, require:true },
    price:{type:String, required:true}
})

module.exports=mongoose.model('allProduct',allProductSchema)
