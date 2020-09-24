
//function to chek user session is expire or not 
module.exports.checkSession = (req, res, next) => {
    try{
        if(!req.session.user) {
            res.render('login',{ msg1:'session expire', index:'index' })
        } else {
            return next();
        }
    } catch(err) {
        console.log(err);
    }
}

module.exports.adminCheck = (req, res, next) => {
    if(req.session.user._doc.role === 'admin') {
        return next();
    } else {
        res.render('login',{msg1:'Unauthorised user', index:'index'})
    }
} 

module.exports.userCheck = (req, res, next) => {
    if(req.session.user._doc.role === 'user') {
        return next();
    } else {
        res.render('login',{msg1:'Unauthorised user', index:'index'})
    }
} 
