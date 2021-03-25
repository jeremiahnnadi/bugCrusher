const User = require('../models/User');
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');
const {SECRET} = require('../config');

/**
 * @DESC To REGISTER a user (Role Non-Specific)
 */
const userRegister = async (userDetails, role, res) => {
    try {
        // Validate the username
        let usernameNotTaken = await validateUsername(userDetails.username);
        if (!usernameNotTaken) {
            return res.status(400).json({
                message: `Username is already taken`,
                success: false
            });
        }

        // Validate the email
        let emailRegistered = await validateEmail(userDetails.email);
        if (!emailRegistered) {
            return res.status(400).json({
                message: `Email is already registered`,
                success: false
            });
        }

        // Get the hashed password
        const hashedPassword = await bcrypt.hash(userDetails.password, 12);
        // Create a new user 
        const newUser = new User({
            ... userDetails,
            password: hashedPassword,
            role: role
        });
        await newUser.save();
        return res.status(201).json({
            message: "Registration Successful.",
            success: true
        });
        
    } catch (error) {
        // Implement logger function
        return res.status(500).json({
            message: "Unable to create your account.",
            success: false
        });
    }
};

/**
 * @DESC To LOGIN a user (Role Non-Specific)
 */
const userLogin = async (userCredentials, role, res) => {
    let { username, password } = userCredentials;

    // Check if the username is in the database
    const user = await User.findOne({ username });
    if (!user) {
        return res.status(404).json({
            message: "Username not found. Invalid login credentials",
            success: false
        });
    }

    // Check the role 
    if (user.role !== role) {
        return res.status(403).json({
            message: "Please ensure that you are attempting a login from the correct portal",
            success: false
        });
    }

    // Compare the passwords 
    let isMatch = await bcrypt.compare(password, user.password);
    if(isMatch) {
        // Sign in the token and issue it to the user 
        let token = jwt.sign(
            {
                user_id: user._id,
                role: user.role,
                username: user.username,
                email: user.email
            },
            SECRET,
            { expiresIn: "3h"}
        );

        // Assign token and user details to variable 
        let result = {
            username: user.username,
            role: user.role,
            token: `Bearer: ${token}`,
            expiresIn: 10800
        };

        return res.status(200).json({
            ... result,
            message: "Login Successful",
            success: true
        });

    } else {
        return res.status(403).json({
            message: "Incorrect password.",
            success: false
        });
    }
};


const validateUsername = async username => {
    let user = await User.findOne ({ username });
    return user ? false : true;
};

const validateEmail = async email => {
    let user = await User.findOne ({ email });
    return user ? false : true;
};

module.exports = {
    userRegister,
    userLogin
};