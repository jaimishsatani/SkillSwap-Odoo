const User = require('../models/User');

// @desc    Get all public users with pagination and search
// @route   GET /api/users
// @access  Public
const getUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || '';
    const skillFilter = req.query.skill || '';
    const locationFilter = req.query.location || '';

    const skip = (page - 1) * limit;

    // Build query
    let query = { 
      profileStatus: 'public',
      isBanned: false 
    };

    // Add search functionality
    if (search) {
      query.$text = { $search: search };
    }

    // Add skill filter
    if (skillFilter) {
      query.$or = [
        { skillsOffered: { $regex: skillFilter, $options: 'i' } },
        { skillsWanted: { $regex: skillFilter, $options: 'i' } }
      ];
    }

    // Add location filter
    if (locationFilter) {
      query.location = { $regex: locationFilter, $options: 'i' };
    }

    // Execute query
    const users = await User.find(query)
      .select('name profilePhotoUrl location skillsOffered skillsWanted availability averageRating totalRatings lastActive')
      .sort({ averageRating: -1, lastActive: -1 })
      .skip(skip)
      .limit(limit);

    // Get total count for pagination
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
    console.error('Get users error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch users'
    });
  }
};

// @desc    Get single user profile (public)
// @route   GET /api/users/:id
// @access  Public
const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select('name profilePhotoUrl location skillsOffered skillsWanted availability averageRating totalRatings lastActive profileStatus')
      .populate('feedbacks.userId', 'name profilePhotoUrl');

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    // Check if profile is private and user is not the owner
    if (user.profileStatus === 'private' && 
        (!req.user || req.user._id.toString() !== req.params.id)) {
      return res.status(403).json({
        success: false,
        error: 'Profile is private'
      });
    }

    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch user'
    });
  }
};

// @desc    Get current user's full profile
// @route   GET /api/users/me/profile
// @access  Private
const getMyProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .select('-password')
      .populate('feedbacks.userId', 'name profilePhotoUrl');

    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error('Get my profile error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch profile'
    });
  }
};

// @desc    Add feedback/rating to user
// @route   POST /api/users/:id/feedback
// @access  Private
const addFeedback = async (req, res) => {
  try {
    const { rating, message } = req.body;
    const targetUserId = req.params.id;

    // Validate rating
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        error: 'Rating must be between 1 and 5'
      });
    }

    // Check if user is trying to rate themselves
    if (req.user._id.toString() === targetUserId) {
      return res.status(400).json({
        success: false,
        error: 'Cannot rate yourself'
      });
    }

    // Check if target user exists
    const targetUser = await User.findById(targetUserId);
    if (!targetUser) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    // Add feedback
    targetUser.addFeedback(req.user._id, rating, message);
    await targetUser.save();

    res.json({
      success: true,
      message: 'Feedback added successfully',
      data: {
        averageRating: targetUser.averageRating,
        totalRatings: targetUser.totalRatings
      }
    });
  } catch (error) {
    console.error('Add feedback error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to add feedback'
    });
  }
};

// @desc    Get popular skills
// @route   GET /api/users/skills/popular
// @access  Public
const getPopularSkills = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;

    // Aggregate to get popular skills
    const offeredSkills = await User.aggregate([
      { $unwind: '$skillsOffered' },
      { $group: { _id: '$skillsOffered', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: limit }
    ]);

    const wantedSkills = await User.aggregate([
      { $unwind: '$skillsWanted' },
      { $group: { _id: '$skillsWanted', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: limit }
    ]);

    res.json({
      success: true,
      data: {
        offered: offeredSkills,
        wanted: wantedSkills
      }
    });
  } catch (error) {
    console.error('Get popular skills error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch popular skills'
    });
  }
};

// @desc    Search users by skills
// @route   GET /api/users/search/skills
// @access  Public
const searchBySkills = async (req, res) => {
  try {
    const { skill } = req.query;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    if (!skill) {
      return res.status(400).json({
        success: false,
        error: 'Skill parameter is required'
      });
    }

    const query = {
      profileStatus: 'public',
      isBanned: false,
      $or: [
        { skillsOffered: { $regex: skill, $options: 'i' } },
        { skillsWanted: { $regex: skill, $options: 'i' } }
      ]
    };

    const users = await User.find(query)
      .select('name profilePhotoUrl location skillsOffered skillsWanted availability averageRating')
      .sort({ averageRating: -1 })
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
    console.error('Search by skills error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to search users'
    });
  }
};

module.exports = {
  getUsers,
  getUser,
  getMyProfile,
  addFeedback,
  getPopularSkills,
  searchBySkills
}; 