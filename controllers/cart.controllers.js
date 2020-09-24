const mongoose = require('mongoose')
const config = require('../config/const')
const carts = require('../models/cart')
const { modelName } = require('../models/cart')

//function to add selected product in  user cart
module.exports.add = (req, res, next) => {
    try{
        const {id, quantity} = req.body;
        const newCart = new carts({
            quantity:quantity,
            productId:id,
            userId:req.session.user._doc._id
        })
        newCart.save().then((data) => { 
            req.flash('msg', 'Product added in cart')
            res.redirect('/allProduct/dummyUserView')
        })
    } catch(err) {
        console.log(err);
    }
}

//function to get all item of the cart with product details
module.exports.get = async (req, res, next) => {
    try{
        const result = await carts.aggregate([
            {
                $lookup:{
                    from:'allproducts',
                    localField:'productId',
                    foreignField:'_id',
                    as:'data'
                }    
            },
            {
                $match:{
                    userId:mongoose.Types.ObjectId(req.session.user._doc._id)
                }
            }
        ]);
        if(result.length !== 0) {
            res.render('viewCart', { cart:result, msg:req.flash('msg'), msg1:req.flash('msg1'), uid:req.session.user._doc.email, isAdmin:req.session.user.isAdmin })
        } else {
            res.status(config.statusCode.NOT_FOUND).render('viewCart', { msg:'cart is empty', uid:req.session.user._doc.email, isAdmin:req.session.user.isAdmin })
        }
    } catch(err) {
        console.log((err));
    }
}

//function to delete items from the cart
module.exports.deleteItem = async (req, res, next) => {
    try{
        const { id } = req.query;
        const result = await carts.deleteOne({_id:id});
        if(result.affectedRows !== 0) {
            req.flash('msg', 'Item deleted')
            res.redirect('viewCart')
        } else {
            req.flash('msg1', 'Item deleted')
            res.redirect('viewCart')
        }
    } catch(err) {
        console.log((err));
    }
}
