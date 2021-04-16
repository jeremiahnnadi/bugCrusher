const { Strategy } = require('passport-local'); 
const User = require('../models/User');
const bcrypt = require('bcryptjs');

module.exports = (passport) => {
    passport.use(
        new Strategy({ usernameField: 'username' }, (username, password, done) => {
            // Match to an existing User
            username = username;
            password = password;
            User.findOne({ username: username })
                .then(user => {
                    if(!user) {
                        return done(null, false, {message: 'There is no registered user for this Username'});
                    }

                    // Match the password 
                    bcrypt.compare(password, user.password, (err, isMatch) => {
                        if (err) throw err;

                        if (isMatch) {
                            return done(null, user);
                        } else {
                            return done(null, false, {message: 'Incorrect Login Credentials'})
                        }
                    })
                })
                .catch(err => console.log(err));
        })    
    )
    passport.serializeUser((user, done)  => { 
        done(null, user.id);
    });
      
    passport.deserializeUser((id, done) => {
        User.findById(id, (err, user) => {
          done(err, user);
        });
    });
}
