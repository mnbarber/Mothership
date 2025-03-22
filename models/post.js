const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema(
    {
        text: {
            type: String,
            required: true
        },
        author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
    },
    { timestamps: true }
);

const postSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
        },
        text: {
            type: String,
            required: true,
        },
        author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        comments: [commentSchema],
    },
    { timestamps: true }
);

const Post = mongoose.model('Post', postSchema);

module.exports = Post;