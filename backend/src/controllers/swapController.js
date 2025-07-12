const SwapRequest = require('../models/SwapRequest');
const User = require('../models/User');

// @desc    Test swap functionality
// @route   GET /api/swaps/test
// @access  Private
const testSwapFunctionality = async (req, res) => {
  try {
    res.json({
      message: 'Swap functionality is working!',
      user: req.user._id,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Test swap functionality error:', error);
    res.status(500).json({
      message: 'Test failed'
    });
  }
};

// @desc    Get user's swap requests
// @route   GET /api/swaps/requests
// @access  Private
const getSwapRequests = async (req, res) => {
  try {
    const userId = req.user._id;
    
    // Get received requests
    const received = await SwapRequest.find({ to: userId })
      .populate('from', 'name profilePhoto skillsOffered averageRating ratingCount')
      .sort({ createdAt: -1 });
    
    // Get sent requests
    const sent = await SwapRequest.find({ from: userId })
      .populate('to', 'name profilePhoto skillsWanted averageRating ratingCount')
      .sort({ createdAt: -1 });

    res.json({
      received,
      sent
    });
  } catch (error) {
    console.error('Get swap requests error:', error);
    res.status(500).json({
      message: 'Failed to get swap requests'
    });
  }
};

// @desc    Create swap request
// @route   POST /api/swaps
// @access  Private
const createSwapRequest = async (req, res) => {
  try {
    const { toUserId, offeredSkill, wantedSkill, message } = req.body;
    const fromUserId = req.user._id;

    // Validate required fields
    if (!toUserId || !offeredSkill || !wantedSkill) {
      return res.status(400).json({
        message: 'To user, offered skill, and wanted skill are required'
      });
    }

    // Check if user is trying to request from themselves
    if (fromUserId.toString() === toUserId) {
      return res.status(400).json({
        message: 'Cannot create swap request with yourself'
      });
    }

    // Check if target user exists and is public
    const targetUser = await User.findById(toUserId);
    if (!targetUser) {
      return res.status(404).json({
        message: 'User not found'
      });
    }

    if (!targetUser.isPublic) {
      return res.status(403).json({
        message: 'This user is not accepting swap requests'
      });
    }

    if (targetUser.isBanned) {
      return res.status(403).json({
        message: 'This user has been banned'
      });
    }

    // Check if there's already a pending request between these users
    const existingRequest = await SwapRequest.findOne({
      from: fromUserId,
      to: toUserId,
      status: 'pending'
    });

    if (existingRequest) {
      return res.status(400).json({
        message: 'You already have a pending request with this user'
      });
    }

    // Create swap request
    const swapRequest = await SwapRequest.create({
      from: fromUserId,
      to: toUserId,
      offeredSkill: offeredSkill.trim(),
      wantedSkill: wantedSkill.trim(),
      message: message ? message.trim() : '',
      status: 'pending'
    });

    // Populate user data for response
    await swapRequest.populate('from', 'name profilePhoto');
    await swapRequest.populate('to', 'name profilePhoto');

    res.status(201).json({
      message: 'Swap request sent successfully',
      swapRequest
    });
  } catch (error) {
    console.error('Create swap request error:', error);
    
    // Handle specific MongoDB errors
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        message: 'Validation error',
        errors: Object.values(error.errors).map(err => err.message)
      });
    }
    
    if (error.name === 'CastError') {
      return res.status(400).json({
        message: 'Invalid user ID format'
      });
    }
    
    res.status(500).json({
      message: 'Failed to create swap request'
    });
  }
};

// @desc    Accept swap request
// @route   PUT /api/swaps/:id/accept
// @access  Private
const acceptSwapRequest = async (req, res) => {
  try {
    const swapRequest = await SwapRequest.findById(req.params.id);
    
    if (!swapRequest) {
      return res.status(404).json({
        message: 'Swap request not found'
      });
    }

    // Check if user is the recipient
    if (swapRequest.to.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: 'Not authorized to accept this request'
      });
    }

    // Check if request is still pending
    if (swapRequest.status !== 'pending') {
      return res.status(400).json({
        message: 'Request is no longer pending'
      });
    }

    // Accept the request
    await swapRequest.accept();

    // Populate user data for response
    await swapRequest.populate('from', 'name profilePhoto');
    await swapRequest.populate('to', 'name profilePhoto');

    res.json(swapRequest);
  } catch (error) {
    console.error('Accept swap request error:', error);
    res.status(500).json({
      message: 'Failed to accept swap request'
    });
  }
};

// @desc    Reject swap request
// @route   PUT /api/swaps/:id/reject
// @access  Private
const rejectSwapRequest = async (req, res) => {
  try {
    const swapRequest = await SwapRequest.findById(req.params.id);
    
    if (!swapRequest) {
      return res.status(404).json({
        message: 'Swap request not found'
      });
    }

    // Check if user is the recipient
    if (swapRequest.to.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: 'Not authorized to reject this request'
      });
    }

    // Check if request is still pending
    if (swapRequest.status !== 'pending') {
      return res.status(400).json({
        message: 'Request is no longer pending'
      });
    }

    // Reject the request
    await swapRequest.reject();

    // Populate user data for response
    await swapRequest.populate('from', 'name profilePhoto');
    await swapRequest.populate('to', 'name profilePhoto');

    res.json(swapRequest);
  } catch (error) {
    console.error('Reject swap request error:', error);
    res.status(500).json({
      message: 'Failed to reject swap request'
    });
  }
};

// @desc    Cancel swap request
// @route   DELETE /api/swaps/:id
// @access  Private
const cancelSwapRequest = async (req, res) => {
  try {
    const swapRequest = await SwapRequest.findById(req.params.id);
    
    if (!swapRequest) {
      return res.status(404).json({
        message: 'Swap request not found'
      });
    }

    // Check if user is the sender
    if (swapRequest.from.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: 'Not authorized to cancel this request'
      });
    }

    // Check if request is still pending
    if (swapRequest.status !== 'pending') {
      return res.status(400).json({
        message: 'Request is no longer pending'
      });
    }

    // Cancel the request
    await swapRequest.cancel();

    res.json({
      message: 'Swap request cancelled successfully'
    });
  } catch (error) {
    console.error('Cancel swap request error:', error);
    res.status(500).json({
      message: 'Failed to cancel swap request'
    });
  }
};

// @desc    Complete swap request
// @route   PUT /api/swaps/:id/complete
// @access  Private
const completeSwapRequest = async (req, res) => {
  try {
    const swapRequest = await SwapRequest.findById(req.params.id);
    
    if (!swapRequest) {
      return res.status(404).json({
        message: 'Swap request not found'
      });
    }

    // Check if user is involved in the swap
    if (swapRequest.from.toString() !== req.user._id.toString() && 
        swapRequest.to.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: 'Not authorized to complete this request'
      });
    }

    // Check if request is accepted
    if (swapRequest.status !== 'accepted') {
      return res.status(400).json({
        message: 'Request must be accepted before completion'
      });
    }

    // Complete the request
    await swapRequest.complete();

    // Populate user data for response
    await swapRequest.populate('from', 'name profilePhoto');
    await swapRequest.populate('to', 'name profilePhoto');

    res.json(swapRequest);
  } catch (error) {
    console.error('Complete swap request error:', error);
    res.status(500).json({
      message: 'Failed to complete swap request'
    });
  }
};

// @desc    Get swap request by ID
// @route   GET /api/swaps/:id
// @access  Private
const getSwapRequest = async (req, res) => {
  try {
    const swapRequest = await SwapRequest.findById(req.params.id)
      .populate('from', 'name profilePhoto skillsOffered')
      .populate('to', 'name profilePhoto skillsWanted');
    
    if (!swapRequest) {
      return res.status(404).json({
        message: 'Swap request not found'
      });
    }

    // Check if user is involved in the swap
    if (swapRequest.from._id.toString() !== req.user._id.toString() && 
        swapRequest.to._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: 'Not authorized to view this request'
      });
    }

    res.json(swapRequest);
  } catch (error) {
    console.error('Get swap request error:', error);
    res.status(500).json({
      message: 'Failed to get swap request'
    });
  }
};

// @desc    Get swap statistics
// @route   GET /api/swaps/stats
// @access  Private
const getSwapStats = async (req, res) => {
  try {
    const userId = req.user._id;
    
    const stats = await SwapRequest.aggregate([
      {
        $match: {
          $or: [{ from: userId }, { to: userId }]
        }
      },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    const statsMap = {
      pending: 0,
      accepted: 0,
      rejected: 0,
      cancelled: 0,
      completed: 0
    };

    stats.forEach(stat => {
      statsMap[stat._id] = stat.count;
    });

    res.json(statsMap);
  } catch (error) {
    console.error('Get swap stats error:', error);
    res.status(500).json({
      message: 'Failed to get swap statistics'
    });
  }
};

module.exports = {
  testSwapFunctionality,
  getSwapRequests,
  createSwapRequest,
  acceptSwapRequest,
  rejectSwapRequest,
  cancelSwapRequest,
  completeSwapRequest,
  getSwapRequest,
  getSwapStats
}; 