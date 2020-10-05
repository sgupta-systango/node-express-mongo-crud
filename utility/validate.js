const joi = require('joi')
const config = require('../config/const');

//function to validate user signup form using joi
module.exports.signup = async(req, res, next) => {
    try {
        const validate = joi.object({
            name: joi.string().min(3).max(30).trim().required(),
            email: joi.string().email().min(5).max(30).trim().required(),
            mobile: joi.string().pattern(new RegExp('^[6-9][0-9]{9}$')).required(),
            password: joi.string().min(3).max(10).trim().required(),
            confirm_password: joi.ref('password')
        })
        await validate.validateAsync(req.body);
        return next();
    } catch (err) {
        console.log(err);
        res.status(config.statusCode.UNPROCESSABLE_ENTITY).render('signup', { msg1: err.details[0].message, index: 'index' })
    }
}

//function to validate user login form using joi
module.exports.login = async(req, res, next) => {
    try {
        const validate = joi.object({
            email: joi.string().email().min(5).max(50).trim().required(),
            password: joi.string().min(3).max(30).trim().required()
        })
        await validate.validateAsync(req.body);
        return next();
    } catch (err) {
        res.status(config.statusCode.UNPROCESSABLE_ENTITY).render('login', { msg1: err.details[0].message, index: 'index' })
    }
}

//function to validate update user profile using joi
module.exports.updateProfile = async(req, res, next) => {
    try {
        const validate = joi.object({
            name: joi.string().min(3).max(30).trim().required(),
            email: joi.string().email().min(5).max(30).trim().required(),
            mobile: joi.string().pattern(new RegExp('^[6-9][0-9]{9}$')).required()
        })
        await validate.validateAsync(req.body);
        return next();
    } catch (err) {
        req.flash('msg1', err.details[0].message)
        res.redirect('/user/editUserProfile')
    }
}

//function to validate reset product using joi
module.exports.resetPassword = async(req, res, next) => {
    try {
        const validate = joi.object({
            oldpass: joi.string().min(3).max(50).trim().required(),
            newpass: joi.string().min(3).max(50).trim().required(),
            confirmpass: joi.ref('newpass')
        })
        await validate.validateAsync(req.body);
        return next();
    } catch (err) {
        res.status(config.statusCode.UNPROCESSABLE_ENTITY).render('resetPassword', { msg1: err.details[0].message, uid: req.session.user._doc.email, isAdmin: req.session.user.isAdmin })
    }
}

//function to validate add product using joi
module.exports.product = async(req, res, next) => {
    try {
        const validate = joi.object({
            name: joi.string().min(3).max(50).trim().required()
        })
        await validate.validateAsync(req.body);
        return next();
    } catch (err) {
        res.status(config.statusCode.UNPROCESSABLE_ENTITY).render('addProduct', { msg1: err.details[0].message, uid: req.session.user._doc.email, isAdmin: req.session.user.isAdmin })
    }
}

//function to validate add poroduct ny admin using joi
module.exports.allProduct = async(req, res, next) => {
    try {
        const validate = joi.object({
            name: joi.string().min(3).max(50).trim().required(),
            price: joi.number().min(1).required()
        })
        await validate.validateAsync(req.body);
        return next();
    } catch (err) {
        res.status(config.statusCode.UNPROCESSABLE_ENTITY).render('adminAddProduct', { msg1: err.details[0].message, uid: req.session.user._doc.email, isAdmin: req.session.user.isAdmin })
    }
}

//function to validate update product using joi
module.exports.update = async(req, res, next) => {
    try {
        const validate = joi.object({
            id: joi.string().required(),
            name: joi.string().min(3).max(50).trim().required(),
            price: joi.number().min(1).required()
        })
        await validate.validateAsync(req.body);
        return next();
    } catch (err) {
        req.flash('id', err._original.id)
        req.flash('msg1', err.details[0].message)
        res.redirect('/allProduct/dummyEdit')
    }
}

//function to validate user checkout form
module.exports.checkoutForm = async(req, res, next) => {
    try {
        const validate = joi.object({
            name: joi.string().min(3).max(30).trim().required(),
            email: joi.string().email().min(5).max(30).trim().required(),
            mobile: joi.string().pattern(new RegExp('^[6-9][0-9]{9}$')).required(),
            address: joi.string().min(3).max(100).trim().required(),
            country: joi.string().min(3).max(30).trim().required(),
            state: joi.string().min(3).max(30).trim().required(),
            district: joi.string().min(3).max(30).trim().required(),
            zip: joi.string().min(3).max(30).trim().required(),
        })
        await validate.validateAsync(req.body);
        return next();
    } catch (err) {
        req.flash('msg1', err.details[0].message)
        res.redirect('/order/checkout')
    }
}
