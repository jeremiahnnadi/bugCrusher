const mongoose = require('mongoose');
require("dotenv").config();
const {DB} = require("../config");
const { success, error } = require('consola');

const connectDB = async () => {
    try {
        const conn = await mongoose.connect( DB, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false
        });
        success({ message: `Database Connected: ${conn.connection.host}`, badge: true });

    } catch (err) {
        error({ message: `Connection Failed: ${err}`, badge: true })
        process.exit(1)
    }
} 

module.exports = connectDB;