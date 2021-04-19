const { Schema, model } = require('mongoose');
const { nanoid } = require('nanoid');

const CommentSchema = new Schema(
    {
        _id: {
            type: String,
            default: () => nanoid(12)
        },
        user: {
            type: String, 
            ref: 'User'
        },
        author: {
            type: String
        },
        content: {
            type: String,
            required: true,
            trim: true
        },
        posted: {
            type: Date,
            default: Date.now
        },
        ticketId: {
            type: String
        }
    }, {timestamps: true}
);

module.exports = model('Comment', CommentSchema)