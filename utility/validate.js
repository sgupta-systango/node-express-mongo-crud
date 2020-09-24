const joi = require('joi')
const config = require('../config/const');
const { ValidationError } = require('joi');

//function to validate user signup form using joi
module.exports.signup = async (req, res, next) => {
    const validate = joi.object({
        name:joi.string().min(3).max(30).required(),
        email:joi.string().email().min(5).max(30).required(),
        mobile:joi.number().integer().required(),
        password:joi.string().min(3).max(10).required(),
        confirm_password:joi.ref('password')
    })
    const result = await validate.validateAsync(req.body);
    if(result.error) {
        res.status(config.statusCode.UNPROCESSABLE_ENTITY).render('signup', { msg1:result.error.detail, index:'index' })
    } else {
    return next();
    }
}

//function to validate user login form using joi
module.exports.login = async (req, res, next) => {
    const validate = joi.object({
        email:joi.string().email().min(5).max(50).required(),
        password:joi.string().min(3).max(30).required()
    })
    const result = await validate.validateAsync(req.body);
    if(result.error) {
        res.status(config.statusCode.UNPROCESSABLE_ENTITY).render('login', { msg1:result.error.detail, index:'index'})
    } else {
    return next();
    }
}

//function to validate user login form using joi
module.exports.product = async (req, res, next) => {
    const validate = joi.object({
        name:joi.string().min(3).max(50).required()
    })
    const result = await validate.validateAsync(req.body);
    if(result.error) {
        res.status(config.statusCode.UNPROCESSABLE_ENTITY).render('addProduct', { msg1:result.error.detail, uid:req.session.user._doc.email, isAdmin:req.session.user.isAdmin })
    } else {
    return next();
    }
}

//function to validate user login form using joi
module.exports.allProduct = async (req, res, next) => {
    const validate = joi.object({
        name:joi.string().min(3).max(50).required(),
        price:joi.number().required()
    })
    const result = await validate.validateAsync(req.body);
    if(result.error) {
        res.status(config.statusCode.UNPROCESSABLE_ENTITY).render('adminAddProduct', { msg1:result.error.detail, uid:req.session.user._doc.email, isAdmin:req.session.user.isAdmin })
    } else {
    return next();
    }
}
