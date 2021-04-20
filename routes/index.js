const express = require('express');
const router = express.Router();
const Ticket = require('../models/Ticket');
const { checkRole } = require('../utils/Auth');
const User =  require('../models/User');
const { ensureAuth, ensureGuest } = require('../config/auth');
const sanitize = require('mongo-sanitize');

// Welcome Page 
router.get('/', ensureGuest, (req, res) => {
    res.render('welcome.hbs');
});

// Dashboard Page 
router.get('/dashboard', ensureAuth, async(req, res) => {
    if(!req.query.search) {
        try {
            const tickets = await Ticket.find({ user: req.user.id }).lean();
            const allTickets = await Ticket.find({}).lean();
            res.render('dashboard.hbs', {
                name: req.user.name,
                role: req.user.role,
                username: req.user.username,
                tickets,
                allTickets
            })
        } catch (error) {
            console.error(error);
            res.render('error/500.hbs');
        }
    } else {
        const regex = new RegExp(escapeRegex(sanitize(req.query.search)), 'gi');
        try {   
            const allTickets = await Ticket.find({$or: [{title: regex}, {description: regex}]}).lean();
            if(allTickets.length < 1) {
                console.log("Nothing found");
                res.render('dashboard.hbs', {
                    result: "Nothing Found"
                })
            } else {
                res.render('dashboard.hbs', {
                    name: req.user.name,
                    role: req.user.role,
                    username: req.user.username,
                    allTickets
                })
            }
        } catch (error) {
            console.error(error);
            res.render('error/500.hbs');
        }
    }
})

// Open Tickets Filter Page 
router.get('/open', ensureAuth, checkRole(["admin","developer","user"]), async (req, res) => {
    try {
        const tickets = await Ticket.find({ user: req.user.id, ticketStatus: "Open" }).lean();
        const allTickets = await Ticket.find({ ticketStatus: "Open" }).lean();
        res.render('dashboard.hbs', {
            name: req.user.name,
            role: req.user.role,
            username: req.user.username,
            statusopen: "open",
            tickets,
            allTickets
        })
    } catch (error) {
        console.error(error);
        res.render('error/500.hbs');
    }
})

// Resolved Tickets Filter Page 
router.get('/resolved', ensureAuth, checkRole(["admin","developer","user"]), async (req, res) => {
    try {
        const tickets = await Ticket.find({ user: req.user.id, ticketStatus: "Resolved" }).lean();
        const allTickets = await Ticket.find({ ticketStatus: "Resolved" }).lean();
        res.render('dashboard.hbs', {
            name: req.user.name,
            role: req.user.role,
            username: req.user.username,
            statusresolved: "resolved",
            tickets,
            allTickets
        })
    } catch (error) {
        console.error(error);
        res.render('error/500.hbs');
    }
})

// Closed Tickets Filter Page 
router.get('/closed', ensureAuth, checkRole(["admin","developer","user"]), async (req, res) => {
    try {
        const tickets = await Ticket.find({ user: req.user.id, ticketStatus: "Closed" }).lean();
        const allTickets = await Ticket.find({ ticketStatus: "Closed" }).lean();
        res.render('dashboard.hbs', {
            name: req.user.name,
            role: req.user.role,
            username: req.user.username,
            statusclosed: "Closed",
            tickets,
            allTickets
        })
    } catch (error) {
        console.error(error);
        res.render('error/500.hbs');
    }
})

function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};

module.exports = router;