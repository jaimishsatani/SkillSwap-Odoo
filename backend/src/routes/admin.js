const express = require('express');
const { body } = require('express-validator');
const { authenticateToken, requireAdmin } = require('../middleware/auth');
const {
  getStats,
  getAllUsers,
  toggleUserBan,
  deleteUser,
  getAllSwaps,
  getAdminLogs,
  createAnnouncement
} = require('../controllers/adminController');

const router = express.Router();

// All routes require authentication and admin privileges
router.use(authenticateToken);
router.use(requireAdmin);

// Validation middleware
const validateAnnouncement = [
  body('title')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Title must be between 1 and 100 characters'),
  body('message')
    .trim()
    .isLength({ min: 1, max: 1000 })
    .withMessage('Message must be between 1 and 1000 characters')
];

const validateBanUser = [
  body('reason')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Reason cannot exceed 500 characters')
];

// Routes
router.get('/stats', getStats);
router.get('/users', getAllUsers);
router.get('/swaps', getAllSwaps);
router.get('/logs', getAdminLogs);

router.put('/users/:id/ban', validateBanUser, toggleUserBan);
router.delete('/users/:id', deleteUser);
router.post('/announcements', validateAnnouncement, createAnnouncement);

module.exports = router; 