const cors = require('cors');
const express = require('express');
const passport = require('passport');
const morgan = require('morgan');
const { connect } = require('mongoose');
const { success, error } = require('consola');

// Bring in the constants 
const { DB, PORT } = require("./config");
const connectDB = require('./config/db');

// Initialize the application
var app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Passport Middleware
app.use(passport.initialize());
require('./middleware/passport')(passport);

// User Router Middleware
app.use('/api/users', require('./routes/auth'));

// Setting up Morgan (Development)
if (process.env.NODE_ENV == 'development') {
    app.use(morgan('dev'))
}

// Connect the Database
connectDB();

// Start listening for the server on PORT
app.listen(PORT, () => {
    success({ message: `Server started on PORT ${PORT}`, badge: true })
});


 

