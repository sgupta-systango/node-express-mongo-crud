const { response } = require("express")
const config = require('../config/const')
const flash = require('connect-flash')

//importing user model
const user = require('../models/user')

//rendering to website home page
module.exports.index = (req, res) => {
    res.render('index',{ index:'index' })
}

//rendering to user signup page
module.exports.signup = (req, res) => {
    res.render('signup',{ index:'index' })
}

//function for create user through signup page 
module.exports.signupAction = async (req, res, next) => {
    try{
        const { name, email, mobile ,password } = req.body;
        const resultUser = await user.findOne({$or:[{email:email},{mobile:mobile}]});
        if(resultUser != null) {
            if(resultUser.email == email) {
                res.status(config.statusCode.UNPROCESSABLE_ENTITY).render('signup',{ msg1:'email already exist' })
            } else if(resultUser.mobile == mobile) {
                res.status(config.statusCode.UNPROCESSABLE_ENTITY).render('signup',{ msg1:'mobile no. already exist' })
            }
        } else {
            const newUser = new user()
            newUser.name=name,
            newUser.email=email,
            newUser.mobile=mobile,
            newUser.setPassword(password)
            newUser.save((err,user) => {
                if(err) throw err;
                else {
                    res.status(config.statusCode.CREATED).render('login',{msg:'registration successful', index:'index'})
                }
            })
        }
        } catch(err) {
        console.log(err);
    }
}

//rendering to user login page
module.exports.login = (req, res) => {
    res.render('login',{ index:'index' })
}

//function for login user that check user is exist in database or not if exist then login
module.exports.loginAction = async (req, res, next) => {
    try{
        const { email, password } = req.body;
        const resultUser = await user.findOne({ email:email });
        console.log(resultUser);
            if(resultUser != null) {
                if (resultUser.validPassword(password)) { 
                    req.session.user = email;
                    res.render('userHome',{uid:req.session.user}) 
                } else { 
                    res.status(config.statusCode.UNPROCESSABLE_ENTITY).render('login',{msg1:config.message.UNPROCESSABLE_ENTITY+' Wrong password', index:'index'})
                }     
            } else {
                res.status(config.statusCode.UNPROCESSABLE_ENTITY).render('login',{msg1:' User not exist', index:'index'})
            }
    } catch(err) {
        console.log(err);
    }
}

//rendering to user home page after successful login
module.exports.home = (req, res, next) => {
    res.render('userHome',{ uid:req.session.user })
}

//function to get user profile who have loggged in
module.exports.profile = async (req, res, next) => {
    try{
        const resultUser = await user.findOne({email:req.session.user});
            if(resultUser != null) {
                res.render('userProfile',{userData:resultUser, uid:req.session.user, msg:req.flash('msg'), msg1:req.flash('msg1')})
            }
    } catch(err) {
        console.log(err);
    }
}

//function for rendering on edit profile page with user data
module.exports.editProfile = async (req, res, next) => {
    try{
        const resultUser = await user.findOne({email:req.session.user});
            if(resultUser != null) {
                res.render('updateProfile',{ data:resultUser, uid:req.session.user} )
            }
    } catch(err) {
        console.log(err);
    }
}

//function to update profile of user who logged in
module.exports.updateProfile = async (req, res, next) => {
    try{
        const { name, email, mobile } = req.body
        const resultUser = await user.updateOne({ email:email },{ name:name, mobile:mobile });
            if(resultUser.nModified != 0) {
                req.flash('msg','Profile Updated')
                res.redirect('profile')
            } else {
                req.flash('msg1','Profile cannot be update')
                res.redirect('profile')
            }
    } catch(err) {
        console.log(err);
    }
}

//rendering to change password page when session exist
module.exports.password = (req, res, next) => {
    res.render('resetPassword',{ uid:req.session.user })
}

//function to change user password using crypto
module.exports.passwordAction = async (req, res, next) => {
    try{
        const { oldpass, newpass } = req.body
        const resultUser = await user.findOne({email:req.session.user});
        if(resultUser != null) {
                if(resultUser.validPassword(oldpass)) {
                    resultUser.setPassword(newpass)
                    resultUser.save()
                    res.render('resetPassword',{msg:'change password successfull', uid:req.session.user})
                } else {
                    res.status(config.statusCode.UNPROCESSABLE_ENTITY).render('resetPassword',{msg1:'password not matched', uid:req.session.user})
                }
            }
    } catch(err) {
        console.log(err);
    }
}

//function for logout user and destroy there session
module.exports.logout = (req, res, next) => {
    req.session.destroy();
    res.render('login',{msg:'Logout Successfull', index:'index'})
}