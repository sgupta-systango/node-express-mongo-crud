const express = require('express')
const router = express.Router();
const product = require('../controllers/product.controllers')
const checkSession = require('../utility/auth')

// router.get('/userHome',(req,res)=>{
//     res.redirect('/userHome')
// })

// router.get('/profile',(req,res)=>{
//     res.redirect('/profile')
// })

// router.get('/resetPassword',(req,res)=>{
//     res.redirect('/resetPassword')
// })

// router.get('/logout',(req,res)=>{
//     res.redirect('/logout')
// })

router.get('/add', checkSession, product.showForm)

router.post('/addAction', checkSession, product.add)

router.get('/view', checkSession, product.get)

router.get('/edit', checkSession, product.edit)

router.post('/updateAction', checkSession, product.update)

router.get('/delete', checkSession, product.delete)

module.exports = router;
