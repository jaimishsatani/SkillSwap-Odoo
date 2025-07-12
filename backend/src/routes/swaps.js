const express = require('express');
const { body } = require('express-validator');
const { validateRequest } = require('../middleware/validateRequest');
const { authenticate } = require('../middleware/auth');
const {
  testSwapFunctionality,
  getSwapRequests,
  createSwapRequest,
  acceptSwapRequest,
  rejectSwapRequest,
  cancelSwapRequest,
  completeSwapRequest,
  getSwapRequest,
  getSwapStats
} = require('../controllers/swapController');

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// @route   GET /api/swaps/test
// @desc    Test swap functionality
// @access  Private
router.get('/test', testSwapFunctionality);

// @route   GET /api/swaps/requests
// @desc    Get user's swap requests
// @access  Private
router.get('/requests', getSwapRequests);

// @route   POST /api/swaps
// @desc    Create swap request
// @access  Private
router.post('/', [
  body('toUserId')
    .isMongoId()
    .withMessage('Valid user ID is required'),
  body('offeredSkill')
    .trim()
    .notEmpty()
    .withMessage('Offered skill is required'),
  body('wantedSkill')
    .trim()
    .notEmpty()
    .withMessage('Wanted skill is required'),
  body('message')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Message cannot exceed 500 characters'),
  validateRequest
], createSwapRequest);

// @route   PUT /api/swaps/:id/accept
// @desc    Accept swap request
// @access  Private
router.put('/:id/accept', acceptSwapRequest);

// @route   PUT /api/swaps/:id/reject
// @desc    Reject swap request
// @access  Private
router.put('/:id/reject', rejectSwapRequest);

// @route   DELETE /api/swaps/:id
// @desc    Cancel swap request
// @access  Private
router.delete('/:id', cancelSwapRequest);

// @route   PUT /api/swaps/:id/complete
// @desc    Complete swap request
// @access  Private
router.put('/:id/complete', completeSwapRequest);

// @route   GET /api/swaps/:id
// @desc    Get swap request by ID
// @access  Private
router.get('/:id', getSwapRequest);

// @route   GET /api/swaps/stats
// @desc    Get swap statistics
// @access  Private
router.get('/stats', getSwapStats);

module.exports = router; 