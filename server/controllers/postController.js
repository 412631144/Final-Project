const asyncHandler = require('express-async-handler');
const Post = require('../models/Post');

// @desc    Get all posts
// @route   GET /api/posts
// @access  Public
const getPosts = asyncHandler(async (req, res) => {
    const { category, creatorId } = req.query;
    let query = {};

    if (category) {
        query.category = category;
    }

    if (creatorId) {
        query.creatorId = creatorId;
    }

    const posts = await Post.find(query).sort({ createdAt: -1 });
    res.status(200).json(posts);
});

// @desc    Create a new post
// @route   POST /api/posts
// @access  Private
const createPost = asyncHandler(async (req, res) => {
    const { title, imageUrl, category, description } = req.body;

    // User from auth middleware
    const user = req.user;

    if (!title || !imageUrl || !category) {
        res.status(400);
        throw new Error('Please include all required fields');
    }

    const post = await Post.create({
        title,
        imageUrl,
        category,
        description,
        creatorId: user._id,
        creatorName: user.name
    });

    res.status(201).json(post);
});

// @desc    Delete a post
// @route   DELETE /api/posts/:id
// @access  Private
const deletePost = asyncHandler(async (req, res) => {
    const post = await Post.findById(req.params.id);

    if (!post) {
        res.status(404);
        throw new Error('Post not found');
    }

    // Check user (only creator or admin can delete)
    const isCreator = post.creatorId === req.user.id || post.creatorId === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';

    console.log(`[DeletePost] PostID: ${req.params.id}, UserID: ${req.user.id}, Role: ${req.user.role} -> isCreator: ${isCreator}, isAdmin: ${isAdmin}`);

    if (!isCreator && !isAdmin) {
        res.status(401);
        throw new Error('User not authorized');
    }

    await post.deleteOne();

    res.status(200).json({ id: req.params.id });
});

// @desc    Update a post
// @route   PUT /api/posts/:id
// @access  Private
const updatePost = asyncHandler(async (req, res) => {
    const post = await Post.findById(req.params.id);

    if (!post) {
        res.status(404);
        throw new Error('Post not found');
    }

    // Check user (only creator or admin can update)
    const isCreator = post.creatorId === req.user.id || post.creatorId === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isCreator && !isAdmin) {
        res.status(401);
        throw new Error('User not authorized');
    }

    // Prevent changing the creator
    const { creatorId, creatorName, ...updateData } = req.body;

    const updatedPost = await Post.findByIdAndUpdate(req.params.id, updateData, {
        new: true,
        runValidators: true // Ensure enum validation runs
    });

    res.status(200).json(updatedPost);
});

// @desc    Like a post
// @route   PUT /api/posts/:id/like
// @access  Private
const likePost = asyncHandler(async (req, res) => {
    const post = await Post.findById(req.params.id);
    const userId = req.user.id;

    if (!post) {
        res.status(404);
        throw new Error('Post not found');
    }

    let isLiked = false;

    if (post.likesBy.includes(userId)) {
        // Unlike
        post.likesBy = post.likesBy.filter(id => id.toString() !== userId);
        post.likes = Math.max(0, post.likes - 1);
        isLiked = false;
    } else {
        // Like
        post.likesBy.push(userId);
        post.likes += 1;
        isLiked = true;
    }

    await post.save();

    res.status(200).json({
        id: post._id,
        likes: post.likes,
        isLiked,
        likesBy: post.likesBy
    });
});

// @desc    Collect a post
// @route   PUT /api/posts/:id/collect
// @access  Private
const collectPost = asyncHandler(async (req, res) => {
    const post = await Post.findById(req.params.id);
    const userId = req.user.id;

    if (!post) {
        res.status(404);
        throw new Error('Post not found');
    }

    // Initialize if undefined (for old records)
    if (!post.collectedBy) post.collectedBy = [];

    let isCollected = false;

    if (post.collectedBy.includes(userId)) {
        // Uncollect
        post.collectedBy = post.collectedBy.filter(id => id.toString() !== userId);
        isCollected = false;
    } else {
        // Collect
        post.collectedBy.push(userId);
        isCollected = true;
    }

    await post.save();

    res.status(200).json({
        id: post._id,
        isCollected,
        collectedBy: post.collectedBy
    });
});

module.exports = {
    getPosts,
    createPost,
    updatePost,
    deletePost,
    likePost,
    collectPost
};
