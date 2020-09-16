
//function to chek user session is expire or not 
function checkSession(req, res, next) {
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

module.exports = checkSession;
