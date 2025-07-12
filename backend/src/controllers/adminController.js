const User = require('../models/User');
const SwapRequest = require('../models/SwapRequest');

// @desc    Get admin dashboard statistics
// @route   GET /api/admin/stats
// @access  Admin
const getStats = async (req, res) => {
  try {
    // Get user statistics
    const totalUsers = await User.countDocuments();
    const newUsersThisWeek = await User.countDocuments({
      createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
    });

    // Get swap statistics
    const totalSwaps = await SwapRequest.countDocuments();
    const activeSwaps = await SwapRequest.countDocuments({ status: 'accepted' });
    const pendingSwaps = await SwapRequest.countDocuments({ status: 'pending' });
    const completedSwaps = await SwapRequest.countDocuments({ status: 'completed' });
    const completedSwapsThisWeek = await SwapRequest.countDocuments({
      status: 'completed',
      completedAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
    });

    // Calculate average rating
    const usersWithRatings = await User.find({ averageRating: { $gt: 0 } });
    const averageRating = usersWithRatings.length > 0 
      ? usersWithRatings.reduce((sum, user) => sum + user.averageRating, 0) / usersWithRatings.length
      : 0;

    res.json({
      totalUsers,
      newUsersThisWeek,
      totalSwaps,
      activeSwaps,
      pendingSwaps,
      completedSwaps,
      completedSwapsThisWeek,
      averageRating
    });
  } catch (error) {
    console.error('Get admin stats error:', error);
    res.status(500).json({
      message: 'Failed to get admin statistics'
    });
  }
};

// @desc    Get all users for admin
// @route   GET /api/admin/users
// @access  Admin
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find()
      .select('name email profilePhoto location skillsOffered skillsWanted availability isPublic isBanned role averageRating ratingCount createdAt')
      .sort({ createdAt: -1 });

    res.json(users);
  } catch (error) {
    console.error('Get all users error:', error);
    res.status(500).json({
      message: 'Failed to get users'
    });
  }
};

// @desc    Get all swaps for admin
// @route   GET /api/admin/swaps
// @access  Admin
const getAllSwaps = async (req, res) => {
  try {
    const swaps = await SwapRequest.find()
      .populate('from', 'name profilePhoto')
      .populate('to', 'name profilePhoto')
      .sort({ createdAt: -1 });

    res.json(swaps);
  } catch (error) {
    console.error('Get all swaps error:', error);
    res.status(500).json({
      message: 'Failed to get swaps'
    });
  }
};

// @desc    Ban user
// @route   PUT /api/admin/users/:id/ban
// @access  Admin
const banUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({
        message: 'User not found'
      });
    }

    // Prevent banning admins
    if (user.role === 'admin') {
      return res.status(400).json({
        message: 'Cannot ban admin users'
      });
    }

    user.isBanned = true;
    await user.save();

    res.json({
      message: 'User banned successfully',
      user
    });
  } catch (error) {
    console.error('Ban user error:', error);
    res.status(500).json({
      message: 'Failed to ban user'
    });
  }
};

// @desc    Unban user
// @route   PUT /api/admin/users/:id/unban
// @access  Admin
const unbanUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({
        message: 'User not found'
      });
    }

    user.isBanned = false;
    await user.save();

    res.json({
      message: 'User unbanned successfully',
      user
    });
  } catch (error) {
    console.error('Unban user error:', error);
    res.status(500).json({
      message: 'Failed to unban user'
    });
  }
};

// @desc    Reject swap request
// @route   PUT /api/admin/swaps/:id/reject
// @access  Admin
const rejectSwap = async (req, res) => {
  try {
    const swap = await SwapRequest.findById(req.params.id);
    
    if (!swap) {
      return res.status(404).json({
        message: 'Swap request not found'
      });
    }

    if (swap.status !== 'pending') {
      return res.status(400).json({
        message: 'Only pending swaps can be rejected'
      });
    }

    swap.status = 'rejected';
    await swap.save();

    res.json({
      message: 'Swap rejected successfully',
      swap
    });
  } catch (error) {
    console.error('Reject swap error:', error);
    res.status(500).json({
      message: 'Failed to reject swap'
    });
  }
};

// @desc    Download reports
// @route   GET /api/admin/reports/:type
// @access  Admin
const downloadReport = async (req, res) => {
  try {
    const { type } = req.params;
    
    let data = [];
    let filename = '';
    
    switch (type) {
      case 'users':
        data = await User.find()
          .select('name email location skillsOffered skillsWanted availability isPublic isBanned role averageRating ratingCount createdAt')
          .lean();
        filename = 'users-report.csv';
        break;
        
      case 'swaps':
        data = await SwapRequest.find()
          .populate('from', 'name email')
          .populate('to', 'name email')
          .lean();
        filename = 'swaps-report.csv';
        break;
        
      case 'feedback':
        data = await User.find({ 'feedbacks.0': { $exists: true } })
          .select('name email feedbacks')
          .lean();
        filename = 'feedback-report.csv';
        break;
        
      case 'platform':
        const stats = await getStats(req, res);
        data = [stats];
        filename = 'platform-overview.csv';
        break;
        
      default:
      return res.status(400).json({
          message: 'Invalid report type'
        });
    }
    
    // Convert to CSV format
    const csv = convertToCSV(data);
    
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.send(csv);
    
  } catch (error) {
    console.error('Download report error:', error);
    res.status(500).json({
      message: 'Failed to download report'
    });
  }
};

// Helper function to convert data to CSV
const convertToCSV = (data) => {
  if (data.length === 0) return '';
  
  const headers = Object.keys(data[0]);
  const csvRows = [headers.join(',')];
  
  for (const row of data) {
    const values = headers.map(header => {
      const value = row[header];
      if (typeof value === 'object') {
        return JSON.stringify(value);
      }
      return value || '';
    });
    csvRows.push(values.join(','));
  }
  
  return csvRows.join('\n');
};

module.exports = {
  getStats,
  getAllUsers,
  getAllSwaps,
  banUser,
  unbanUser,
  rejectSwap,
  downloadReport
}; 