const express = require('express');
const router = express.Router();
const { registerUser, checkRole } = require('../utils/Auth');
const { ensureAuth, ensureGuest } = require('../config/auth');
const passport = require('passport');

// Login Page
router.get('/login', ensureGuest,  (req, res) =>  {
    res.render('login.ejs');
});

// Login Handle
router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/dashboard',
        failureRedirect: '/users/login',
        failureFlash: true
    })(req, res, next);
});

// Logout Handle
router.get('/logout', (req, res) => {
    req.logout();
    req.flash('success_msg', 'You have been logged out!');
    res.redirect('/users/login');
})

// Register Page 
router.get('/register', ensureAuth, checkRole(["admin"]), (req, res) => {
    res.render('register.ejs')
});

// Register Handle 
router.post('/register', ensureAuth, checkRole(["admin"]), async (req, res) => {
    await registerUser(req, res);
});

module.exports = router;