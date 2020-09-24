const mongoose = require('mongoose')
const crypto = require('crypto')

//user model
const userSchema=mongoose.Schema({
    name:{ type:String, require:true},
    email:{ type:String, unique:true, require:true},
    mobile:{ type:String, unique:true, require:true},
    role:String,
    hash : String, 
    salt : String 
})

//Method to set salt and hash the password for a user 
userSchema.methods.setPassword = function(password) { 
    this.salt = crypto.randomBytes(16).toString('hex');  
    this.hash = crypto.pbkdf2Sync(password, this.salt,1000, 64, `sha512`).toString(`hex`); 
}; 

// Method to check the entered password is correct or not 
userSchema.methods.validPassword = function(password) { 
    let hash = crypto.pbkdf2Sync(password,  
    this.salt, 1000, 64, `sha512`).toString(`hex`); 
    return this.hash === hash; 
}; 

module.exports=mongoose.model('user',userSchema)
