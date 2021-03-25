const express = require('express');
const router = express.Router();
const { userRegister, userLogin } = require('../utils/Auth');

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

// Tester Registration Route
router.post("/register-tester", async (req, res) => {});

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

// Tester Login Route
router.post("/login-tester", async (req, res) => {});

// Profile Route 
router.get('profile', async (req, res) => {});

// User Protected Route
router.post("/user-protected", async (req, res) => {});

// Admin Protected Route
router.post("/admin-protected", async (req, res) => {});

// Developer Protected Route
router.post("/developer-protected", async (req, res) => {});

// Tester Protected Route
router.post("/tester-protected", async (req, res) => {});

module.exports = router;