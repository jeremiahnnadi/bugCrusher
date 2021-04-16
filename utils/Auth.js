const express = require('express');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const User = require('../models/User');

// Check Role Function
const checkRole = (roles) => (req, res, next) => {
    if (roles.includes(req.user.role)) {
        return next();
    }
    res.render('../views/error/401.hbs');
};

// Register User Function
const registerUser = async (req, res) => {
    var { role, name, email, username, password, password1  } = req.body;
    let errors = []; 

    /**
     * VALIDATION
     */

    try {
        // Check required fields
        if(!role || !name || !email || !username || !password || !password1){
            errors.push({ msg: 'Please fill in all required fields'});
        }
    
        // Check if passwords match
        if(password !== password1) {
            errors.push({ msg: 'The passwords are not a match' });
        }
    
        // Check password length
        if(password.length < 12) {
            errors.push({ msg: 'Password should be at least 12 characters long' });
        }
    
        // Ensure that password contains at least 1 letter
        if(password.search(/[a-z]/) < 0){
            errors.push({ msg: 'Password should contain at least one letter' });
        }
    
        // Ensure that password contains at least 1 Uppercase letter
        if(password.search(/[A-Z]/) < 0){
            errors.push({ msg: 'Password should contain at least one uppercase character' });
        }
    
        // Ensure that password contains at least 1 number
        if(password.search(/[0-9]/) < 0){
            errors.push({ msg: 'Password should contain at least one number' });
        }
    
        // Ensure that password contains at least 1 special character
        if(password.search(/\W/) < 0){
            errors.push({ msg: 'Password should contain at least one special character' });
        }
        
        if(errors.length > 0) {
            // Failed Validation
            res.render('register.ejs', {errors, role, name, email, username, password, password1})
        } else {
            // Passed Validation
            const user = await User.findOne({ username: username })
            if(user){
                // User already exists 
                errors.push({ msg: 'This Username is already registered to a user'});
                res.render('register.ejs', {errors, role, name, email, username, password, password1})
            } else {
                // User does not exist 
                
                // Hash the password 
                const hashedPassword = await bcrypt.hash(password, 12);
                
                // Create the new User with the hashed password
                const newUser = new User({
                    role,
                    username,
                    name,
                    email,
                    password: hashedPassword
                })
    
                // Save the new User in the database
                await newUser.save()
                    .then(user => {
                        req.flash('success_msg', 'Registration Complete! Please log in to view your account.')
                        res.redirect('/users/login')
                        return;
                    })
                    .catch(err => console.log(err));
        
                // // Flash the message to the user 
                // req.flash('success_msg', 'Registration Complete! Please log in to view your account.')
                // res.redirect('/users/login');
                // return;
            }
        }
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            message: "Unable to create your account.",
            success: false
        });
    }
}


module.exports = {
    registerUser,
    checkRole
}