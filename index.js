const cors = require('cors');
const express = require('express');
const { connect } = require('mongoose');
const { success, error } = require('consola');
const morgan = require('morgan');

// Bring in the constants 
const { DB, PORT } = require("./config");
const connectDB = require('./config/db');

// Initialize the application
var app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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


 

