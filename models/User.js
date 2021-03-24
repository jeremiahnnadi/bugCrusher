const { Schema, model } = require('mongoose');

const UserSchema = new Schema ({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    role: {
        type: String,
        default: "user",
        enum: ["user","admin","superadmin","developer","tester"]
    }
})