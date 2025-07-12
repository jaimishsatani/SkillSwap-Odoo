const express = require('express');
const { body } = require('express-validator');
const { authenticateToken } = require('../middleware/auth');
const {
  createSwapRequest,
  getMySwaps,
  getSwapRequest,
  acceptSwapRequest,
  rejectSwapRequest,
  cancelSwapRequest,
  markFeedbackGiven
} = require('../controllers/swapController');

const router = express.Router();

// Validation middleware
const validateSwapRequest = [
  body('toUserId')
    .isMongoId()
    .withMessage('Valid user ID is required'),
  body('offeredSkill')
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('Offered skill must be between 1 and 50 characters'),
  body('requestedSkill')
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('Requested skill must be between 1 and 50 characters'),
  body('message')
    .trim()
    .isLength({ min: 1, max: 500 })
    .withMessage('Message must be between 1 and 500 characters')
];

// All routes require authentication
router.use(authenticateToken);

// Routes
router.post('/', validateSwapRequest, createSwapRequest);
router.get('/', getMySwaps);
router.get('/:id', getSwapRequest);
router.put('/:id/accept', acceptSwapRequest);
router.put('/:id/reject', rejectSwapRequest);
router.put('/:id/cancel', cancelSwapRequest);
router.put('/:id/feedback-given', markFeedbackGiven);

module.exports = router; 