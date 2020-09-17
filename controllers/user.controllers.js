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
module.exports.signupAction = (req, res, next) => {
    try{
        const { name, email, mobile ,password } = req.body;
        const newUser = new user({
        name : name,
        email : email,
        mobile : mobile
        });
        newUser.setPassword(password);
        newUser.save((err) => {
            if(err) throw err;
            else {
                res.status(config.statusCode.CREATED).render('login',{msg:'registration successful', index:'index'})
            }
        })
    } catch(err) {
    console.log(err);
    }
}

//rendering to user login page
module.exports.login = (req, res) => {
    res.render('login',{ index:'index' })
}

//function for login user that check user is exist in database or not if exist then login
module.exports.loginAction =  async (req, res, next) => {
    try{
        const { email, password } = req.body;
        const result = await user.findOne({email:email});
            if(result) {
                if (result.validPassword(password)) { 
                    req.session.user = result;
                    res.render('userHome',{uid:result.email}) 
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
    res.render('userHome',{ uid:req.session.user.email })
}

//function to get user profile who have loggged in
module.exports.profile = (req, res, next) => {
    try{
        const result = req.session.user;
        res.render('userProfile',{userData:result, uid:result.email, msg:req.flash('msg'), msg1:req.flash('msg1')})
    } catch(err) {
        console.log(err);
    }
}

//function for rendering on edit profile page with user data
module.exports.editProfile = (req, res, next) => {
    try{
        const result = req.session.user;
        res.render('updateProfile',{ data:result, uid:result.email, msg1:req.flash('msg1')} )

    } catch(err) {
        console.log(err);
    }
}

//function to update profile of user who logged in
module.exports.updateProfile = async (req, res, next) => {
    try{
        const { name, email, mobile } = req.body;
            const result = await user.findOneAndUpdate({email},{$set:{ name:name, mobile:mobile }}, { new:true });
            if(result) {
                req.session.user = result;
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
module.exports.passwordAction = (req, res, next) => {
    try{
        const { oldpass, newpass } = req.body
        const result = req.session.user;
            if(result.validPassword(oldpass)) {
                result.setPassword(newpass)
                result.save()
                res.render('resetPassword',{msg:'change password successfull', uid:result.email})
            } else {
                res.status(config.statusCode.UNPROCESSABLE_ENTITY).render('resetPassword',{msg1:'password not matched', uid:result.email})
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
