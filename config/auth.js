module.exports = {
    ensureAuth: function(req, res, next) {
        if(req.isAuthenticated()) {
            return next();
        }
        req.flash('error_msg', 'Log In For Access');
        res.redirect('/users/login');
    },
    ensureGuest: function(req, res, next) {
        if(req.isAuthenticated()) {
            res.redirect('/dashboard');
        } else {
            return next();
        }
    }
}