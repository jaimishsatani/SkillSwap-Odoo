const User = require('../models/User');
const SwapRequest = require('../models/SwapRequest');
const AdminLog = require('../models/AdminLog');

// @desc    Get admin dashboard statistics
// @route   GET /api/admin/stats
// @access  Private/Admin
const getStats = async (req, res) => {
  try {
    // Get user statistics
    const totalUsers = await User.countDocuments();
    const activeUsers = await User.countDocuments({ lastActive: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } });
    const bannedUsers = await User.countDocuments({ isBanned: true });

    // Get swap statistics
    const totalSwaps = await SwapRequest.countDocuments();
    const pendingSwaps = await SwapRequest.countDocuments({ status: 'pending' });
    const completedSwaps = await SwapRequest.countDocuments({ status: 'accepted' });

    // Get popular skills
    const popularOfferedSkills = await User.aggregate([
      { $unwind: '$skillsOffered' },
      { $group: { _id: '$skillsOffered', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 }
    ]);

    const popularWantedSkills = await User.aggregate([
      { $unwind: '$skillsWanted' },
      { $group: { _id: '$skillsWanted', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 }
    ]);

    // Get recent activity
    const recentSwaps = await SwapRequest.find()
      .populate('fromUser', 'name')
      .populate('toUser', 'name')
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({
      success: true,
      data: {
        users: {
          total: totalUsers,
          active: activeUsers,
          banned: bannedUsers
        },
        swaps: {
          total: totalSwaps,
          pending: pendingSwaps,
          completed: completedSwaps
        },
        skills: {
          offered: popularOfferedSkills,
          wanted: popularWantedSkills
        },
        recentActivity: recentSwaps
      }
    });
  } catch (error) {
    console.error('Get admin stats error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch statistics'
    });
  }
};

// @desc    Get all users (admin view)
// @route   GET /api/admin/users
// @access  Private/Admin
const getAllUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const search = req.query.search || '';
    const status = req.query.status || '';

    const skip = (page - 1) * limit;

    let query = {};

    // Add search functionality
    if (search) {
      query.$text = { $search: search };
    }

    // Add status filter
    if (status === 'banned') {
      query.isBanned = true;
    } else if (status === 'active') {
      query.isBanned = false;
    }

    const users = await User.find(query)
      .select('-password')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await User.countDocuments(query);

    res.json({
      success: true,
      data: {
        users,
        pagination: {
          current: page,
          total: Math.ceil(total / limit),
          hasNext: page * limit < total,
          hasPrev: page > 1,
          totalUsers: total
        }
      }
    });
  } catch (error) {
    console.error('Get all users error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch users'
    });
  }
};

// @desc    Ban/Unban user
// @route   PUT /api/admin/users/:id/ban
// @access  Private/Admin
const toggleUserBan = async (req, res) => {
  try {
    const { reason } = req.body;
    const userId = req.params.id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    // Toggle ban status
    user.isBanned = !user.isBanned;
    await user.save();

    // Log admin action
    await AdminLog.createLog({
      type: user.isBanned ? 'ban' : 'unban',
      adminId: req.user._id,
      targetUserId: userId,
      description: user.isBanned ? `User banned: ${reason || 'No reason provided'}` : 'User unbanned',
      details: { reason },
      ipAddress: req.ip,
      userAgent: req.get('User-Agent')
    });

    res.json({
      success: true,
      data: {
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          isBanned: user.isBanned
        }
      },
      message: `User ${user.isBanned ? 'banned' : 'unbanned'} successfully`
    });
  } catch (error) {
    console.error('Toggle user ban error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update user status'
    });
  }
};

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
const deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    // Check if user is admin
    if (user.isAdmin) {
      return res.status(400).json({
        success: false,
        error: 'Cannot delete admin user'
      });
    }

    // Delete user's swap requests
    await SwapRequest.deleteMany({
      $or: [
        { fromUser: userId },
        { toUser: userId }
      ]
    });

    // Delete user
    await User.findByIdAndDelete(userId);

    // Log admin action
    await AdminLog.createLog({
      type: 'user_deletion',
      adminId: req.user._id,
      targetUserId: userId,
      description: `User deleted: ${user.name} (${user.email})`,
      ipAddress: req.ip,
      userAgent: req.get('User-Agent')
    });

    res.json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete user'
    });
  }
};

// @desc    Get all swap requests (admin view)
// @route   GET /api/admin/swaps
// @access  Private/Admin
const getAllSwaps = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const status = req.query.status || '';

    const skip = (page - 1) * limit;

    let query = {};

    // Add status filter
    if (status && ['pending', 'accepted', 'rejected', 'cancelled'].includes(status)) {
      query.status = status;
    }

    const swaps = await SwapRequest.find(query)
      .populate('fromUser', 'name email')
      .populate('toUser', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await SwapRequest.countDocuments(query);

    res.json({
      success: true,
      data: {
        swaps,
        pagination: {
          current: page,
          total: Math.ceil(total / limit),
          hasNext: page * limit < total,
          hasPrev: page > 1,
          totalSwaps: total
        }
      }
    });
  } catch (error) {
    console.error('Get all swaps error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch swaps'
    });
  }
};

// @desc    Get admin logs
// @route   GET /api/admin/logs
// @access  Private/Admin
const getAdminLogs = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    const type = req.query.type || '';

    const skip = (page - 1) * limit;

    let query = {};

    // Add type filter
    if (type && ['ban', 'unban', 'announcement', 'flag', 'skill_moderation', 'user_deletion'].includes(type)) {
      query.type = type;
    }

    const logs = await AdminLog.find(query)
      .populate('adminId', 'name email')
      .populate('targetUserId', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await AdminLog.countDocuments(query);

    res.json({
      success: true,
      data: {
        logs,
        pagination: {
          current: page,
          total: Math.ceil(total / limit),
          hasNext: page * limit < total,
          hasPrev: page > 1,
          totalLogs: total
        }
      }
    });
  } catch (error) {
    console.error('Get admin logs error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch admin logs'
    });
  }
};

// @desc    Create announcement
// @route   POST /api/admin/announcements
// @access  Private/Admin
const createAnnouncement = async (req, res) => {
  try {
    const { title, message } = req.body;

    if (!title || !message) {
      return res.status(400).json({
        success: false,
        error: 'Title and message are required'
      });
    }

    // Log admin action
    await AdminLog.createLog({
      type: 'announcement',
      adminId: req.user._id,
      description: `Announcement: ${title}`,
      details: { title, message },
      ipAddress: req.ip,
      userAgent: req.get('User-Agent')
    });

    res.json({
      success: true,
      message: 'Announcement created successfully'
    });
  } catch (error) {
    console.error('Create announcement error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create announcement'
    });
  }
};

module.exports = {
  getStats,
  getAllUsers,
  toggleUserBan,
  deleteUser,
  getAllSwaps,
  getAdminLogs,
  createAnnouncement
}; 