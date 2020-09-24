const fs = require('fs')
const config = require('../config/const')

//importing product model
const allProducts = require('../models/allProduct')

//function to render on add product form
module.exports.showForm = (req, res, next) => {
    res.render('adminAddProduct', { uid:req.session.user._doc.email, isAdmin:req.session.user.isAdmin });
}

//function for adding products
module.exports.add = (req, res, next) => {
    try{
        if(req.files) {
            const { name, price } = req.body;
            const image = req.files.image;
            const img_name = image.name;
            const new_image_name = `${new Date().toISOString()}${img_name}`;
            image.mv('./upload/'+new_image_name, (err, result) => {
                if(err) throw err;
                else {
                    const newProduct = new allProducts({
                        name:name,
                        image:new_image_name,
                        price:price
                    })
                    newProduct.save().then((data) => { 
                    res.status(config.statusCode.CREATED).render('adminAddProduct',{ msg:config.message.CREATED, uid:req.session.user._doc.email, isAdmin:req.session.user.isAdmin })
                    })
                }
            })
        } else {
            res.render('adminAddProduct', { uid:req.session.user._doc.email, isAdmin:req.session.user.isAdmin , msg1:'Please select the file' })
        }
    } catch(err) {
        console.log(err);
    }
}

//function to get the product which user added
module.exports.get = async (req, res, next) => {
    try{
        const result = await allProducts.find({});
        if(result.length !== 0) {
            res.render('adminViewProduct',{ data:result, uid:req.session.user._doc.email, isAdmin:req.session.user.isAdmin, msg:req.flash('msg'), msg1:req.flash('msg1'), msg2:req.flash('msg2') })
        } else {
            res.status(config.statusCode.NOT_FOUND).render('adminViewProduct',{ msg:'no data found', uid:req.session.user._doc.email, isAdmin:req.session.user.isAdmin, msg2:req.flash('msg2') })
        }
    } catch(err) {
        console.log(err);
    }
}

//function to get all product for user portal
module.exports.allGet = async (req, res, next) => {
    try{
        const result = await allProducts.find({});
        if(result.length !== 0) {
            res.render('userViewProduct',{ data:result, uid:req.session.user._doc.email, isAdmin:req.session.user.isAdmin, msg:req.flash('msg'), msg1:req.flash('msg1') })
        } else {
            res.status(config.statusCode.NOT_FOUND).render('userViewProduct',{ msg:'no data found', uid:req.session.user._doc.email,isAdmin:req.session.user.isAdmin })
        }
    } catch(err) {
        console.log(err);
    }
}

//function to render on edit product page with product data
module.exports.edit = async (req, res, next) => {
    try{
        const { id } = req.query;
        const result = await allProducts.findOne({ _id:id });
        res.render('adminEditProduct', {data:result, uid:req.session.user._doc.email, isAdmin:req.session.user.isAdmin });
    } catch(err) {
        console.log(err);
    }
}

//function to update a particular product
module.exports.update = async (req, res, next) => {
    try{
        const { id, name, price } = req.body;
        if(req.files) {
            const image = req.files.image;
            const img_name = image.name;
            const new_image_name = `${new Date().toISOString()}${img_name}`;
            image.mv('./upload/'+new_image_name, async (err) => {
                if(err) throw err;
                else{
                //update product when we choose a file
                    const result = await allProducts.findByIdAndUpdate({ _id:id }, { $set:{ name:name,image:new_image_name, price:price }});
                    if(result && fs.existsSync('./upload/'+result.image)) {
                        fs.unlinkSync('./upload/'+result.image)
                        req.flash('msg', 'product updated')
                        res.redirect('dummyView')
                    } else {
                        req.flash('msg1', 'product not updated')
                        res.redirect('dummyEdit')
                    }
                    
                }
            })
        } else {
             //update product when we can't choose a file
            const result = await allProducts.updateOne({ _id:id }, { $set:{ name:name, price:price }});
            if(result.nModified !== 0) {
                req.flash('msg', 'product updated')
                res.redirect('dummyView')
            } else {
                req.flash('msg1', 'product not updated')
                res.redirect('dummyEdit')
            }
        }
    } catch(err) {
        console.log(err);
    }
}

//function to delete a particular product which user wants
module.exports.delete = async (req, res, next) => {
    try{
        const { id } = req.query;
        const result = await allProducts.findByIdAndDelete({ _id:id });
        if(result && fs.existsSync('./upload/'+result.image)) {
            fs.unlinkSync('./upload/'+result.image)
            req.flash('msg2', 'product deleted')
            res.redirect('dummyView');
        } else {
            req.flash('msg1', 'product cannot deleted')
            res.redirect('dummyView')
        }
    } catch(err) {
        console.log(err);
    }
}
