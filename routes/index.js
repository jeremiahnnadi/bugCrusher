const express = require('express');
const router = express.Router();
const Ticket = require('../models/Ticket');
const { userAuth } = require('../utils/Auth'); 
const { ensureAuth, ensureGuest } = require('../config/auth');

router.get('/', ensureGuest, (req, res) => {
    res.render('welcome.hbs');
});

router.get('/dashboard', ensureAuth, async(req, res) => {
    try {
        const tickets = await Ticket.find({ user: req.user.id }).lean();
        const allTickets = await Ticket.find({}).lean();
        res.render('dashboard.hbs', {
            name: req.user.name,
            role: req.user.role,
            tickets,
            allTickets
        })
    } catch (error) {
        console.error(error);
        res.render('error/500.hbs');
    }
})

module.exports = router;