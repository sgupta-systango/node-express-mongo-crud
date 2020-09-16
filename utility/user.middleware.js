const users = require('../models/user')

module.exports.byEmailAndMobile = async (req, res, next) => {
    try{
        const { email, mobile } = req.body;
        const result = await users.findOne({$or:[{email:email},{mobile:mobile}]});
        if(result) {
            req.userResult = result;
            return next();
        }
        return next();
    } catch(err) {
        console.log(err);
    } 
}

module.exports.mobileCheck = async (req, res, next) => {
    try{
        const {mobile} = req.body;
        const result = await users.findOne({email:{$ne:req.session.user},mobile});
        console.log(result);
        if(!result) {
            return next();
        } else {
            req.flash('msg1', 'mobile no. is already exist')
            res.redirect('editUserProfile')
        }
    } catch(err) {
        console.log(err);
    } 
}
