const { Schema, model } = require('mongoose');

const CommentSchema = new Schema(
    {
        content: {
            type: String,
        },
        posted: {
            type: Date,
            default: Date.now
        },
        author: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    }, {timestamps: true}
);

module.exports = model('Comment', CommentSchema)