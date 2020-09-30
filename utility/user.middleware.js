const users = require('../models/user')
const config = require('../config/const')

module.exports.emailAndMobileCheck = async(req, res, next) => {
    try {
        const { email, mobile } = req.body;
        const result = await users.findOne({ $or: [{ email: email }, { mobile: mobile }] });
        if (result) {
            if (result.email === email) {
                res.status(config.statusCode.CONFLICT).render('signup', { msg1: 'email' + config.message.CONFLICT, index: 'index' })
            } else if (result.mobile === mobile) {
                res.status(config.statusCode.CONFLICT).render('signup', { msg1: 'mobile no.' + config.message.CONFLICT, index: 'index' })
            }
        } else {
            return next();
        }
    } catch (err) {
        res.json({ error: err.toString() })
    }
}

module.exports.mobileCheckForUpdate = async(req, res, next) => {
    try {
        const { mobile } = req.body;
        const result = await users.findOne({ email: { $ne: req.session.user._doc.email }, mobile });
        if (!result) {
            return next();
        } else {
            req.flash('msg1', 'mobile no. is already exist')
            res.redirect('editUserProfile')
        }
    } catch (err) {
        res.json({ error: err.toString() })
    }
}
