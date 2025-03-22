const express = require('express');
const verifyToken = require('../middleware/verify-token.js');
const Post = require('../models/post.js');
const { verify } = require('jsonwebtoken');
const router = express.Router();

// routes here

//create new post
router.post('/', verifyToken, async (req, res) => {
    try {
        req.body.author = req.user._id;
        const post = await Post.create(req.body);
        post._doc.author = req.user;
        res.status(201).json(post);
    } catch(err) {
        res.status(500).json({ err: err.message });
    }
});

//show all posts from logged in user
router.get('/', verifyToken, async (req, res) => {
    try {
        const posts = await Post.find({})
            .populate("author")
            .sort({ createdAt: "desc" });
        res.status(200).json(posts);
    } catch (err) {
        res.status(500).json({ err: err.message });
    }
});

//show one post
router.get('/:postId', verifyToken, async (req, res) => {
    try {
        const post = await Post.findById(req.params.postId).populate([
            'author',
            'comments.author',
        ]);
        res.status(200).json(post);
    } catch (err) {
        res.status(500).json({ err: err.message });
    }
});

//update
router.put('/:postId', verifyToken, async (req, res) => {
    try {
        const post = await Post.findById(req.params.postId);
        if(!post.author.equals(req.user._id)) {
            return res.status(403).send("You can't do that!");
        }
        const updatedPost = await Post.findByIdAndUpdate(
            req.params.postId,
            req.body,
            { new: true }
        );
        updatedPost._doc.author = req.user;
        res.status(200).json(updatedPost);
    } catch (err) {
        res.status(500).json({ err: err.message });
    }
});

//delete
router.delete('/:postId', verifyToken, async (req, res) => {
    try {
        const post = await Post.findById(req.params.postId);
        if(!post.author.equals(req.user._id)) {
            return res.status(403).send("You can't do that!");
        }
        const deletedPost = await Post.findByIdAndDelete(req.params.postId);
        res.status(200).json(deletedPost);
    } catch(err) {
        res.status(500).json({ err: err.message });
    }
});

//create comment
router.post('/:postId/comments', verifyToken, async (req, res) => {
    try {
        req.body.author = req.user._id;
        const post = await Post.findById(req.params.postId);
        post.comments.push(req.body);
        await post.save();
        const newComment = post.comments[post.comments.length - 1];
        newComment._doc.author = req.user;
        res.status(201).json(newComment);
    } catch(err) {
        res.status(500).json({ err: err.message });
    }
});

//update one comment
router.put('/:postId/comments/:commentId', verifyToken, async (req, res) => {
    try {
        const post = await Post.findById(req.params.postId);
        const comment = post.comments.id(req.params.commentId);
        if(comment.author.toString() !== req.user._id) {
            return res
                .status(403)
                .json({ message: "You can't edit this comment!" });
        }
        comment.text = req.body.text;
        await post.save();
        res.status(200).json({ message: "Comment updated succesfully!" });
    } catch(err) {
        res.status(500).json({ err: err.message });
    }
});

//delete one comment
router.delete('/:postId/comments/:commentId', verifyToken, async (req, res) => {
    try {
        const post = await Post.findById(req.params.postId);
        const comment = post.comments.id(req.params.commentId);
        if(comment.author.toString() !== req.user._id) {
            return res
                .status(403)
                .json({ message: "You can't edit this comment!" });
        }
        post.comments.remove({ _id: req.params.commentId });
        await post.save();
        res.status(200).json({ message: "Comment deleted successfully!" });
    } catch(err) {
        res.status(500).json({ err: err.message });
    }
});

module.exports = router;