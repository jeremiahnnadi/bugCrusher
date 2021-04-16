const express = require('express');
const router = express.Router();
const { registerUser, checkRole } = require('../utils/Auth');
const passport = require('passport');

// Login Page
router.get('/login', (req, res) =>  {
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
router.get('/register', (req, res) => {
    res.render('register.ejs')
});

// Register Handle 
router.post('/register', async (req, res) => {
    await registerUser(req, res);
});

// User Registration Route
router.post("/register-user", async (req, res) => {
    await userRegister(req.body, 'user', res);
});

// Admin Registration Route
router.post("/register-admin", async (req, res) => {
    await userRegister(req.body, 'admin', res);
});

// Developer Registration Route
router.post("/register-developer", async (req, res) => {
    await userRegister(req.body, 'developer', res);
});


// User Login Route
router.post("/login-user", async (req, res) => {
    await userLogin(req.body, 'user', res);
});

// Admin Login Route
router.post("/login-admin", async (req, res) => {
    await userLogin(req.body, 'admin', res);
});

// Developer Login Route
router.post("/login-developer", async (req, res) => {});


// // Profile Route 
// router.get('/profile', userAuth , async (req, res) => {
//     return res.json(serializeUser(req.user)); 
// });

// // User Protected Route
// router.get("/user-protected", userAuth,  checkRole(["user"]), async (req, res) => {
//     return res.json("Hello User");
// });

// // Admin Protected Route
// router.get("/admin-protected", userAuth, checkRole(["admin"]), async (req, res) => {
//     return res.json("Hello Admin");
// });

// // Developer Protected Route
// router.get("/developer-protected", userAuth, checkRole(["developer"]), async (req, res) => {
//     return res.json("Hello Developer");
// });

// // Admin + Developer Protected Route
// router.get("/admindeveloper-protected", userAuth, checkRole(["admin", "developer"]), async (req, res) => {
//     return res.json("Hello Developer \/ Admin");
// });


module.exports = router;