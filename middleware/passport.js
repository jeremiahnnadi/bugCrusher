const User = require('../models/User');
const { SECRET } = require('../config');
const { Strategy, ExtractJwt } = require('passport-jwt');

const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = SECRET;


module.exports = (passport) => {
    passport.use(new Strategy(opts, async(payload, done) => {
        await User.findById(payload.user_id)
            .then(user => {
                if (user) {
                    return done(null, user);
                } else {
                    return done(null, false); // added the else block
                }
            })
            .catch(err => {
                return done(err, false); // used to be null 
            })
        })
    );
};

