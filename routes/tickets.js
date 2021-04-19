const express = require('express');
const router = express.Router();
const Ticket = require('../models/Ticket');
const User = require('../models/User');
const Comment = require('../models/Comment');
const { checkRole } = require('../utils/Auth');
const { ensureAuth } = require('../config/auth');
const createDOMPurify = require('dompurify');
const { JSDOM } = require('jsdom');
const sanitize = require('mongo-sanitize');

// Bring in DOMPurify
const window = new JSDOM('').window;
const DOMPurify = createDOMPurify(window);

// Add Ticket Page 
router.get('/add', ensureAuth, async (req, res) => {
    try {
        const user = await User.find({ user: req.user.id }).lean();
        res.render('tickets/add.hbs', {
            name: req.user.name,
            role: req.user.role
        });
    } catch (error) {
        console.error(error);
        res.render('error/500.hbs');
    }
})

// Add Ticket Handler 
router.post('/add', ensureAuth, async (req, res) => {
    try {
        req.user.id = DOMPurify.sanitize(req.user.id)
        req.body.user = DOMPurify.sanitize(req.body.user);
        req.body.user = req.user.id;
        await Ticket.create(req.body);
        res.redirect('/dashboard')
    } catch (error) {
        console.error(error);
        res.render('error/500.hbs');
    }
})

// Individual Ticket Page
router.get('/:id', ensureAuth, async (req, res) => {
    try {
        const user = await User.findOne({ user: req.user.id }).lean();
        const ticket = await Ticket.findOne({ _id: req.params.id }).lean();
        const comments = await Comment.find({ ticketId: req.params.id }).lean();
        if(!ticket) {
            return res.render('../views/error/404.hbs');
        } else {
            res.render('../views/tickets/ticket.hbs', {
                user,
                comments,
                ticket,
                name: req.user.name,
                role: req.user.role
            })
        }
    } catch (error) {
        console.error(error);
        res.render('error/500.hbs');
    }
})

// Delete Ticket Handler
router.get('/delete/:id', ensureAuth, checkRole(["admin"]), async (req, res) => {
    try {
        await Ticket.remove({ _id: req.params.id });
        res.redirect('/dashboard');
    } catch (error) {
        return res.render('error/500.hbs');
    }
})

// Edit Ticket Page
router.get('/update/:id', ensureAuth, async (req, res) => {
    try {
       let ticket = await Ticket.findOne({ _id: req.params.id }).lean()
       if(!ticket) {
       return res.render('error/404.hbs');
       } 
       res.render('tickets/update.hbs', {
            name: req.user.name,
            role: req.user.role,
            ticket
        });
    } catch (error) {
        console.error(error);
        return res.render('error/500.hbs');
    }
}) 

// Edit Page Handler 
router.post('/update/:id', ensureAuth, checkRole(["admin", "developer", "tester"]), async (req, res) => {
    try {
        var backURL="/tickets/" + req.params.id
        // req.params.id = DOMPurify.sanitize(req.params.id);
        // req.body = DOMPurify.sanitize(req.body);
        let ticket = await Ticket.findById(req.params.id);
        ticket = await Ticket.findOneAndUpdate({ _id: sanitizes(req.params.id) }, sanitize(req.body), {
            new: true,
        });
        res.redirect(backURL);
    } catch (err) {
        return res.render('error/500.hbs');
    }
})

// Add a Comment Handler
router.post('/addComment', ensureAuth, async (req, res) => {
    try {
        req.body.user = DOMPurify.sanitize(req.body.user);
        req.user.id = DOMPurify.sanitize(req.user.id);
        req.body.user = req.user.id
        await Comment.create(req.body)
        res.redirect('back');
    } catch (error) {
        console.error(error);
        res.render('error/500.hbs');
    }
})

module.exports = router;