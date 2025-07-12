const SwapRequest = require('../models/SwapRequest');
const User = require('../models/User');

// @desc    Create a new swap request
// @route   POST /api/swaps
// @access  Private
const createSwapRequest = async (req, res) => {
  try {
    const { toUserId, offeredSkill, requestedSkill, message } = req.body;

    // Validate required fields
    if (!toUserId || !offeredSkill || !requestedSkill || !message) {
      return res.status(400).json({
        success: false,
        error: 'All fields are required'
      });
    }

    // Check if user is trying to request from themselves
    if (req.user._id.toString() === toUserId) {
      return res.status(400).json({
        success: false,
        error: 'Cannot create swap request with yourself'
      });
    }

    // Check if target user exists and is not banned
    const targetUser = await User.findById(toUserId);
    if (!targetUser) {
      return res.status(404).json({
        success: false,
        error: 'Target user not found'
      });
    }

    if (targetUser.isBanned) {
      return res.status(400).json({
        success: false,
        error: 'Cannot create swap request with banned user'
      });
    }

    // Check if user has the offered skill
    if (!req.user.skillsOffered.includes(offeredSkill)) {
      return res.status(400).json({
        success: false,
        error: 'You do not offer this skill'
      });
    }

    // Check if target user wants the requested skill
    if (!targetUser.skillsWanted.includes(requestedSkill)) {
      return res.status(400).json({
        success: false,
        error: 'Target user does not want this skill'
      });
    }

    // Check if there's already a pending request between these users
    const existingRequest = await SwapRequest.findOne({
      fromUser: req.user._id,
      toUser: toUserId,
      status: 'pending'
    });

    if (existingRequest) {
      return res.status(400).json({
        success: false,
        error: 'You already have a pending request with this user'
      });
    }

    // Create swap request
    const swapRequest = await SwapRequest.create({
      fromUser: req.user._id,
      toUser: toUserId,
      offeredSkill,
      requestedSkill,
      message
    });

    // Populate user data
    await swapRequest.populate('fromUser', 'name profilePhotoUrl');
    await swapRequest.populate('toUser', 'name profilePhotoUrl');

    res.status(201).json({
      success: true,
      data: swapRequest
    });
  } catch (error) {
    console.error('Create swap request error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create swap request'
    });
  }
};

// @desc    Get user's swap requests
// @route   GET /api/swaps
// @access  Private
const getMySwaps = async (req, res) => {
  try {
    const { status, type } = req.query;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    let query = {};

    // Filter by type (sent/received)
    if (type === 'sent') {
      query.fromUser = req.user._id;
    } else if (type === 'received') {
      query.toUser = req.user._id;
    } else {
      // Get all swaps for user
      query.$or = [
        { fromUser: req.user._id },
        { toUser: req.user._id }
      ];
    }

    // Filter by status
    if (status && ['pending', 'accepted', 'rejected', 'cancelled'].includes(status)) {
      query.status = status;
    }

    const swaps = await SwapRequest.find(query)
      .populate('fromUser', 'name profilePhotoUrl')
      .populate('toUser', 'name profilePhotoUrl')
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
    console.error('Get my swaps error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch swap requests'
    });
  }
};

// @desc    Get single swap request
// @route   GET /api/swaps/:id
// @access  Private
const getSwapRequest = async (req, res) => {
  try {
    const swapRequest = await SwapRequest.findById(req.params.id)
      .populate('fromUser', 'name profilePhotoUrl skillsOffered')
      .populate('toUser', 'name profilePhotoUrl skillsWanted');

    if (!swapRequest) {
      return res.status(404).json({
        success: false,
        error: 'Swap request not found'
      });
    }

    // Check if user is involved in this swap
    if (swapRequest.fromUser._id.toString() !== req.user._id.toString() &&
        swapRequest.toUser._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        error: 'Access denied'
      });
    }

    res.json({
      success: true,
      data: swapRequest
    });
  } catch (error) {
    console.error('Get swap request error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch swap request'
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
        success: false,
        error: 'Swap request not found'
      });
    }

    // Check if user is the recipient
    if (swapRequest.toUser.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        error: 'Only the recipient can accept the request'
      });
    }

    // Check if request is pending
    if (swapRequest.status !== 'pending') {
      return res.status(400).json({
        success: false,
        error: 'Request is not pending'
      });
    }

    // Accept the request
    await swapRequest.accept();

    // Populate user data
    await swapRequest.populate('fromUser', 'name profilePhotoUrl');
    await swapRequest.populate('toUser', 'name profilePhotoUrl');

    res.json({
      success: true,
      data: swapRequest,
      message: 'Swap request accepted successfully'
    });
  } catch (error) {
    console.error('Accept swap request error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to accept swap request'
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
        success: false,
        error: 'Swap request not found'
      });
    }

    // Check if user is the recipient
    if (swapRequest.toUser.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        error: 'Only the recipient can reject the request'
      });
    }

    // Check if request is pending
    if (swapRequest.status !== 'pending') {
      return res.status(400).json({
        success: false,
        error: 'Request is not pending'
      });
    }

    // Reject the request
    await swapRequest.reject();

    // Populate user data
    await swapRequest.populate('fromUser', 'name profilePhotoUrl');
    await swapRequest.populate('toUser', 'name profilePhotoUrl');

    res.json({
      success: true,
      data: swapRequest,
      message: 'Swap request rejected successfully'
    });
  } catch (error) {
    console.error('Reject swap request error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to reject swap request'
    });
  }
};

// @desc    Cancel swap request
// @route   PUT /api/swaps/:id/cancel
// @access  Private
const cancelSwapRequest = async (req, res) => {
  try {
    const swapRequest = await SwapRequest.findById(req.params.id);

    if (!swapRequest) {
      return res.status(404).json({
        success: false,
        error: 'Swap request not found'
      });
    }

    // Check if user is the sender
    if (swapRequest.fromUser.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        error: 'Only the sender can cancel the request'
      });
    }

    // Check if request is pending
    if (swapRequest.status !== 'pending') {
      return res.status(400).json({
        success: false,
        error: 'Request is not pending'
      });
    }

    // Cancel the request
    await swapRequest.cancel();

    // Populate user data
    await swapRequest.populate('fromUser', 'name profilePhotoUrl');
    await swapRequest.populate('toUser', 'name profilePhotoUrl');

    res.json({
      success: true,
      data: swapRequest,
      message: 'Swap request cancelled successfully'
    });
  } catch (error) {
    console.error('Cancel swap request error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to cancel swap request'
    });
  }
};

// @desc    Mark feedback as given
// @route   PUT /api/swaps/:id/feedback-given
// @access  Private
const markFeedbackGiven = async (req, res) => {
  try {
    const swapRequest = await SwapRequest.findById(req.params.id);

    if (!swapRequest) {
      return res.status(404).json({
        success: false,
        error: 'Swap request not found'
      });
    }

    // Check if user is involved in this swap
    if (swapRequest.fromUser.toString() !== req.user._id.toString() &&
        swapRequest.toUser.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        error: 'Access denied'
      });
    }

    // Check if swap is completed
    if (swapRequest.status !== 'accepted') {
      return res.status(400).json({
        success: false,
        error: 'Swap must be accepted to mark feedback'
      });
    }

    // Mark feedback as given
    await swapRequest.markFeedbackGiven();

    res.json({
      success: true,
      data: swapRequest,
      message: 'Feedback marked as given'
    });
  } catch (error) {
    console.error('Mark feedback given error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to mark feedback'
    });
  }
};

module.exports = {
  createSwapRequest,
  getMySwaps,
  getSwapRequest,
  acceptSwapRequest,
  rejectSwapRequest,
  cancelSwapRequest,
  markFeedbackGiven
}; 