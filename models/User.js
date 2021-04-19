const { Schema, model } = require('mongoose');
const { nanoid } = require('nanoid');

const UserSchema = new Schema (
    {
        _id: {
            type: String,
            default: () => nanoid(12)
        },
        name: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true,
            trim: true
        },
        role: {
            type: String,
            default: "user",
            enum: ["user","admin","developer","tester"]
        },
        username: {
            type: String,
            required: true
        }, 
        password: {
            type: String,
            required: true
        }
    }, 
    { timestamps: true }
);

module.exports = model('User', UserSchema);