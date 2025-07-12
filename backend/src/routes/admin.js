const express = require('express');
const { authenticate, requireAdmin } = require('../middleware/auth');
const {
  getStats,
  getAllUsers,
  getAllSwaps,
  banUser,
  unbanUser,
  rejectSwap,
  downloadReport
} = require('../controllers/adminController');

const router = express.Router();

// All admin routes require authentication and admin role
router.use(authenticate);
router.use(requireAdmin);

// @route   GET /api/admin/stats
// @desc    Get admin dashboard statistics
// @access  Admin
router.get('/stats', getStats);

// @route   GET /api/admin/users
// @desc    Get all users for admin
// @access  Admin
router.get('/users', getAllUsers);

// @route   GET /api/admin/swaps
// @desc    Get all swaps for admin
// @access  Admin
router.get('/swaps', getAllSwaps);

// @route   PUT /api/admin/users/:id/ban
// @desc    Ban user
// @access  Admin
router.put('/users/:id/ban', banUser);

// @route   PUT /api/admin/users/:id/unban
// @desc    Unban user
// @access  Admin
router.put('/users/:id/unban', unbanUser);

// @route   PUT /api/admin/swaps/:id/reject
// @desc    Reject swap request
// @access  Admin
router.put('/swaps/:id/reject', rejectSwap);

// @route   GET /api/admin/reports/:type
// @desc    Download reports
// @access  Admin
router.get('/reports/:type', downloadReport);

module.exports = router; 