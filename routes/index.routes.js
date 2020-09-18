const express = require('express')
const router = express.Router();

//route for user index
router.get('/', (req,res) => {
    res.render('index', {index:'index'})
})

module.exports = router;