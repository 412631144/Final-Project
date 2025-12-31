const mongoose = require('mongoose');

const postSchema = mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please add a title'],
    },
    imageUrl: {
        type: String,
        required: [true, 'Please add an image URL'],
    },
    category: {
        type: String,
        required: [true, 'Please select a category'],
        enum: ['早安', '晚安', '節慶', '勸世', '其他'],
        default: '其他'
    },
    description: {
        type: String,
        default: ''
    },
    likes: {
        type: Number,
        default: 0
    },
    likesBy: [{ // Array of user IDs who liked this post
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    collectedBy: [{ // Array of user IDs who collected this post
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    creatorId: {
        type: String, // Can be user ID or 'system'
        required: true
    },
    creatorName: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Post', postSchema);
