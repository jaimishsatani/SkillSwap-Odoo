const express = require('express');
const { body } = require('express-validator');
const { authenticateToken, optionalAuth } = require('../middleware/auth');
const {
  getUsers,
  getUser,
  getMyProfile,
  addFeedback,
  getPopularSkills,
  searchBySkills
} = require('../controllers/userController');

const router = express.Router();

// Validation middleware
const validateFeedback = [
  body('rating')
    .isInt({ min: 1, max: 5 })
    .withMessage('Rating must be between 1 and 5'),
  body('message')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Feedback message cannot exceed 500 characters')
];

// Public routes
router.get('/', optionalAuth, getUsers);
router.get('/skills/popular', getPopularSkills);
router.get('/search/skills', searchBySkills);
router.get('/:id', optionalAuth, getUser);

// Protected routes
router.get('/me/profile', authenticateToken, getMyProfile);
router.post('/:id/feedback', authenticateToken, validateFeedback, addFeedback);

module.exports = router; 