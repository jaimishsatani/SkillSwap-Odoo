const User = require('../models/User');
const SwapRequest = require('../models/SwapRequest');

// @desc    Get public users for exploration
// @route   GET /api/users/explore
// @access  Public
const getPublicUsers = async (req, res) => {
  try {
    const users = await User.find({ 
      isPublic: true, 
      isBanned: false 
    })
    .select('name profilePhoto location skillsOffered skillsWanted availability averageRating ratingCount')
    .sort({ lastActive: -1 });

    res.json(users);
  } catch (error) {
    console.error('Get public users error:', error);
    res.status(500).json({
      message: 'Failed to fetch users'
    });
  }
};

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.json(user);
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      message: 'Failed to get profile'
    });
  }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateProfile = async (req, res) => {
  try {
    const { 
      name, 
      location, 
      skillsOffered, 
      skillsWanted, 
      availability, 
      isPublic 
    } = req.body;
    
    const updateData = {};
    if (name) updateData.name = name;
    if (location !== undefined) updateData.location = location;
    if (skillsOffered) updateData.skillsOffered = skillsOffered;
    if (skillsWanted) updateData.skillsWanted = skillsWanted;
    if (availability) updateData.availability = availability;
    if (isPublic !== undefined) updateData.isPublic = isPublic;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      updateData,
      { new: true, runValidators: true }
    ).select('-password');

    res.json(user);
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      message: 'Failed to update profile'
    });
  }
};

// @desc    Upload profile photo
// @route   POST /api/users/upload-photo
// @access  Private
const uploadProfilePhoto = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        message: 'No file uploaded'
      });
    }

    const fileUrl = `/uploads/${req.file.filename}`;
    
    // Update user profile photo
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { profilePhoto: fileUrl },
      { new: true }
    ).select('-password');

    res.json({
      profilePhoto: fileUrl,
      user
    });
  } catch (error) {
    console.error('Upload photo error:', error);
    res.status(500).json({
      message: 'Failed to upload photo'
    });
  }
};

// @desc    Get user by ID (public profile)
// @route   GET /api/users/:id
// @access  Public
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select('name profilePhoto location skillsOffered skillsWanted availability averageRating ratingCount createdAt')
      .where({ isPublic: true, isBanned: false });

    if (!user) {
      return res.status(404).json({
        message: 'User not found'
      });
    }

    res.json(user);
  } catch (error) {
    console.error('Get user by ID error:', error);
    res.status(500).json({
      message: 'Failed to get user'
    });
  }
};

// @desc    Search users
// @route   GET /api/users/search
// @access  Public
const searchUsers = async (req, res) => {
  try {
    const { q, skill, availability } = req.query;
    
    let query = { isPublic: true, isBanned: false };
    
    // Text search
    if (q) {
      query.$text = { $search: q };
    }
    
    // Skill filter
    if (skill) {
      query.$or = [
        { skillsOffered: skill },
        { skillsWanted: skill }
      ];
    }
    
    // Availability filter
    if (availability) {
      query.availability = availability;
    }

    const users = await User.find(query)
      .select('name profilePhoto location skillsOffered skillsWanted availability averageRating ratingCount')
      .sort({ lastActive: -1 });

    res.json(users);
  } catch (error) {
    console.error('Search users error:', error);
    res.status(500).json({
      message: 'Failed to search users'
    });
  }
};

// @desc    Get user statistics
// @route   GET /api/users/stats
// @access  Private
const getUserStats = async (req, res) => {
  try {
    const userId = req.user._id;
    
    // Get swap statistics
    const totalSwaps = await SwapRequest.countDocuments({
      $or: [{ from: userId }, { to: userId }]
    });
    
    const completedSwaps = await SwapRequest.countDocuments({
      $or: [{ from: userId }, { to: userId }],
      status: 'completed'
    });
    
    const pendingSwaps = await SwapRequest.countDocuments({
      $or: [{ from: userId }, { to: userId }],
      status: 'pending'
    });

    res.json({
      totalSwaps,
      completedSwaps,
      pendingSwaps
    });
  } catch (error) {
    console.error('Get user stats error:', error);
    res.status(500).json({
      message: 'Failed to get user statistics'
    });
  }
};

// @desc    Delete user account
// @route   DELETE /api/users/profile
// @access  Private
const deleteAccount = async (req, res) => {
  try {
    // Delete user's swap requests
    await SwapRequest.deleteMany({
      $or: [{ from: req.user._id }, { to: req.user._id }]
    });
    
    // Delete user
    await User.findByIdAndDelete(req.user._id);

    res.json({
      message: 'Account deleted successfully'
    });
  } catch (error) {
    console.error('Delete account error:', error);
    res.status(500).json({
      message: 'Failed to delete account'
    });
  }
};

module.exports = {
  getPublicUsers,
  getProfile,
  updateProfile,
  uploadProfilePhoto,
  getUserById,
  searchUsers,
  getUserStats,
  deleteAccount
}; 