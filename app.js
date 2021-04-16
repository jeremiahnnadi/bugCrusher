const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const ejs = require('ejs');
const expressLayouts = require('express-ejs-layouts');
const exphbs = require('express-handlebars');
const passport = require('passport');
const { connect } = require('mongoose');
const { success, error } = require('consola');
const engines = require('consolidate');
const path = require('path');
const flash =  require('connect-flash');
const session = require('express-session'); 
const mongoose = require('mongoose');

// Passport Config
require('./config/passport')(passport);

// Bring in the constants 
const { DB, PORT } = require("./config");
const connectDB = require('./config/db');

// Initialize the application
var app = express();

// BodyParser Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Express Session
app.use(session({
    secret: 'louisiana tiller',
    receive: true,
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 60000000 } // 10 Minutes
}));

// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

// Connect Flash 
app.use(flash());

// Global Variables for Message Colors
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
})

// Setting up Morgan (Development)
if (process.env.NODE_ENV == 'development') {
    app.use(morgan('dev'))
}

// Static Folder 
app.use(express.static(path.join(__dirname, 'public')));

// Connect the Database
connectDB();

// Introduce the Handlebars Helpers 
const { formatDate, ifEquals, contains, select, eq } = require('./helpers/helpers');

// Enable the Handlebars view engine 
app.engine('hbs', exphbs({ 
    helpers: { formatDate, ifEquals, contains, select, eq },
    layoutsDir: path.join(__dirname, '/views/layouts'),
    defaultLayout: 'main', 
    extname: '.hbs',
    partialsDir: path.join(__dirname, '/views/partials')
}));
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));

// Enable the EJS view engine 
app.use(expressLayouts);
app.set('view engine', 'ejs');

// Routes 
app.use('/', require('./routes/index'))
app.use('/users', require('./routes/users'))
app.use('/tickets', require('./routes/tickets'))

// Start listening for the server on PORT
app.listen(PORT, () => {
    success({ message: `Server started on PORT ${PORT}`, badge: true })
});


 

