const express = require('express')
const router = express.Router();
const user = require('../controllers/user.controllers')
const validate = require('../utility/validate')
const checkSession = require('../utility/auth')
const userMiddleware = require('../utility/user.middleware')

//route for user signup
router.get('/signup', user.signup)

//route for user login
router.get('/login', user.login)

//route for user signupAction
router.post('/signupAction', validate.signup, userMiddleware.emailAndMobileCheck, user.signupAction)

//route for user loginAction
router.post('/loginAction', validate.login, user.loginAction)

//route for user home
router.get('/userHome', checkSession, user.home)

//route for user profile
router.get('/profile', checkSession, user.profile)

//route for user password
router.get('/resetPassword', checkSession, user.password)

//route for user passwordAction
router.post('/resetPasswordAction', checkSession, user.passwordAction)

//route for user editProfile
router.get('/editUserProfile', checkSession,  user.editProfile)

//route for user updateProfile
router.post('/updateProfileAction', checkSession, userMiddleware.mobileCheckForUpdate, user.updateProfile)

//route for user logout
router.get('/logout', user.logout)

// Exporting module to allow it to be imported in other files 
module.exports = router
