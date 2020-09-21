const fs = require('fs')
const config = require('../config/const')

//importing product model
const products = require('../models/product')

//function to render on add product form
module.exports.showForm = (req, res, next) => {
    res.render('addProduct', { uid:req.session.user.email });
}

//function for adding products
module.exports.add = (req, res, next) => {
    try{
        if(req.files) {
            const { name } = req.body;
            const image = req.files.image;
            const img_name = image.name;
            const new_image_name = `${new Date().toISOString()}${img_name}`;
            image.mv('./upload/'+new_image_name, (err, result) => {
                if(err) throw err;
                else {
                    const newProduct = new products({
                        name:name,
                        image:new_image_name,
                        userId:req.session.user._id
                    })
                    newProduct.save().then((data) => { 
                    res.status(config.statusCode.CREATED).render('addProduct',{ msg:config.message.CREATED, uid:req.session.user.email })
                    })
                }
            })
        } else {
            res.render('addProduct', { uid:req.session.user.email , msg1:'Please select the file' })
        }
    } catch(err) {
        console.log(err);
    }
}

//function to get the product which user added
module.exports.get = async (req, res, next) => {
    try{
        const result = await products.find({ userId:req.session.user._id });
        if(result.length !== 0) {
            res.render('viewProduct',{ data:result, uid:req.session.user.email, msg:req.flash('msg'), msg1:req.flash('msg1'), msg2:req.flash('msg2') })
        } else {
            res.status(config.statusCode.NOT_FOUND).render('viewProduct',{ msg:'no data found', uid:req.session.user.email, msg2:req.flash('msg2') })
        }
    } catch(err) {
        console.log(err);
    }
}

//function to render on edit product page with product data
module.exports.edit = async (req, res, next) => {
    try{
        const { id } = req.query;
        const result = await products.findOne({ _id:id });
        res.render('editProduct', {data:result, uid:req.session.user.email });
    } catch(err) {
        console.log(err);
    }
}

//function to update a particular product
module.exports.update = async (req, res, next) => {
    try{
        const { id, name } = req.body;
        if(req.files) {
            const image = req.files.image;
            const img_name = image.name;
            const new_image_name = `${new Date().toISOString()}${img_name}`;
            image.mv('./upload/'+new_image_name, async (err) => {
                if(err) throw err;
                else{
                //update product when we choose a file
                    const result = await products.findByIdAndUpdate({ _id:id }, { $set:{ name:name,image:new_image_name }});
                    if(result && fs.existsSync('./upload/'+result.image)) {
                        fs.unlinkSync('./upload/'+result.image)
                        req.flash('msg', 'product updated')
                        res.redirect('view')
                    } else {
                        req.flash('msg1', 'product not updated')
                        res.redirect('view')
                    }
                    
                }
            })
        } else {
             //update product when we can't choose a file
            const result = await products.updateOne({ _id:id }, { $set:{ name:name }});
            if(result.nModified !== 0) {
                req.flash('msg', 'product updated')
                res.redirect('view')
            } else {
                req.flash('msg1', 'product not updated')
                res.redirect('view')
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
        const result = await products.findByIdAndDelete({ _id:id });
        if(result && fs.existsSync('./upload/'+result.image)) {
            fs.unlinkSync('./upload/'+result.image)
            req.flash('msg2', 'product deleted')
            res.redirect('view');
        } else {
            req.flash('msg1', 'product cannot deleted')
            res.redirect('view')
        }
    } catch(err) {
        console.log(err);
    }
}
