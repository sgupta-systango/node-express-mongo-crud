const joi = require('joi')
const config = require('../config/const')

//function to validate user signup form using joi
module.exports.signup = async (req,res,next) => {
    try {
        const validate = joi.object({
            name:joi.string().min(3).max(30).required(),
            email:joi.string().email().min(5).max(30).required(),
            mobile:joi.number().integer().min(10).max(10).required(),
            password:joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),
            confirm_password:joi.ref('password')
        })
        await validate.validateAsync(req.body);
        return next();
    } catch (err) { 
        res.status(config.statusCode.UNPROCESSABLE_ENTITY).render('signup', { msg1:err.details[0].message })
        }
}

//function to validate user login form using joi
module.exports.login = async (req,res,next) => {
    try {
        const validate = joi.object({
            email:joi.string().email().min(5).max(50).required(),
            password:joi.string().min(3).max(30).required()
        })
        await validate.validateAsync(req.body);
        return next();
    } catch (err) { 
        res.status(config.statusCode.UNPROCESSABLE_ENTITY).render('login', { msg1:err.details[0].message })
        }
}