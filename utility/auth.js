//function to chek user session is expire or not 
module.exports.checkSession = (req, res, next) => {
    try {
        if (!req.session.user) {
            res.render('login', { msg1: 'session expire', index: 'index' })
        } else {
            return next();
        }
    } catch (err) {
        res.json({ error: err.toString() })
    }
}

//functon to check role is admin or not
module.exports.adminCheck = (req, res, next) => {
    try {
        if (req.session.user._doc.role === 'admin') {
            return next();
        } else {
            res.render('login', { msg1: 'Unauthorised user', index: 'index' })
        }
    } catch (err) {
        res.json({ error: err.toString() })
    }
}

//function to check role is user or not
module.exports.userCheck = (req, res, next) => {
    try {
        if (req.session.user._doc.role === 'user') {
            return next();
        } else {
            res.render('login', { msg1: 'Unauthorised user', index: 'index' })
        }
    } catch (err) {
        res.json({ error: err.toString() })
    }
}
