const express = require('express');
const { authenticate } = require('../middleware/auth');
const { uploadProfilePhoto } = require('../middleware/upload');
const {
  getPublicUsers,
  getProfile,
  updateProfile,
  uploadProfilePhoto: uploadPhoto,
  getUserById,
  searchUsers,
  getUserStats,
  deleteAccount
} = require('../controllers/userController');

const router = express.Router();

// @route   GET /api/users/explore
// @desc    Get public users for exploration
// @access  Public
router.get('/explore', getPublicUsers);

// @route   GET /api/users/profile
// @desc    Get current user's profile
// @access  Private
router.get('/profile', authenticate, getProfile);

// @route   PUT /api/users/profile
// @desc    Update current user's profile
// @access  Private
router.put('/profile', authenticate, updateProfile);

// @route   POST /api/users/upload-photo
// @desc    Upload profile photo
// @access  Private
router.post('/upload-photo', authenticate, uploadProfilePhoto, uploadPhoto);

// @route   GET /api/users/:id
// @desc    Get user by ID (public profile)
// @access  Public
router.get('/:id', getUserById);

// @route   GET /api/users/search
// @desc    Search users
// @access  Public
router.get('/search', searchUsers);

// @route   GET /api/users/stats
// @desc    Get user statistics
// @access  Private
router.get('/stats', authenticate, getUserStats);

// @route   DELETE /api/users/profile
// @desc    Delete user account
// @access  Private
router.delete('/profile', authenticate, deleteAccount);

module.exports = router; 