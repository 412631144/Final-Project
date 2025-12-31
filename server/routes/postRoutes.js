const express = require('express');
const router = express.Router();
const { getPosts, createPost, updatePost, deletePost, likePost, collectPost } = require('../controllers/postController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', getPosts);
router.post('/', protect, createPost);
router.delete('/:id', protect, deletePost);
router.put('/:id', protect, updatePost);
router.put('/:id/like', protect, likePost);
router.put('/:id/collect', protect, collectPost);

module.exports = router;
