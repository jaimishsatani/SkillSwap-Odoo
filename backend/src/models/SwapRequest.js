const mongoose = require('mongoose');

const swapRequestSchema = new mongoose.Schema({
  fromUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  toUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  offeredSkill: {
    type: String,
    required: [true, 'Offered skill is required'],
    trim: true,
    maxlength: [50, 'Skill name cannot be more than 50 characters']
  },
  requestedSkill: {
    type: String,
    required: [true, 'Requested skill is required'],
    trim: true,
    maxlength: [50, 'Skill name cannot be more than 50 characters']
  },
  message: {
    type: String,
    required: [true, 'Message is required'],
    trim: true,
    maxlength: [500, 'Message cannot be more than 500 characters']
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected', 'cancelled'],
    default: 'pending'
  },
  completedAt: {
    type: Date,
    default: null
  },
  feedbackGiven: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Index for efficient queries
swapRequestSchema.index({ fromUser: 1, status: 1 });
swapRequestSchema.index({ toUser: 1, status: 1 });
swapRequestSchema.index({ status: 1, createdAt: -1 });

// Virtual for populated data
swapRequestSchema.virtual('fromUserData', {
  ref: 'User',
  localField: 'fromUser',
  foreignField: '_id',
  justOne: true
});

swapRequestSchema.virtual('toUserData', {
  ref: 'User',
  localField: 'toUser',
  foreignField: '_id',
  justOne: true
});

// Method to accept swap request
swapRequestSchema.methods.accept = function() {
  this.status = 'accepted';
  this.completedAt = new Date();
  return this.save();
};

// Method to reject swap request
swapRequestSchema.methods.reject = function() {
  this.status = 'rejected';
  return this.save();
};

// Method to cancel swap request
swapRequestSchema.methods.cancel = function() {
  this.status = 'cancelled';
  return this.save();
};

// Method to mark feedback as given
swapRequestSchema.methods.markFeedbackGiven = function() {
  this.feedbackGiven = true;
  return this.save();
};

// Static method to get user's swap requests
swapRequestSchema.statics.getUserSwaps = function(userId, status = null) {
  const query = {
    $or: [
      { fromUser: userId },
      { toUser: userId }
    ]
  };
  
  if (status) {
    query.status = status;
  }
  
  return this.find(query)
    .populate('fromUser', 'name profilePhotoUrl')
    .populate('toUser', 'name profilePhotoUrl')
    .sort({ createdAt: -1 });
};

// Static method to get pending requests for a user
swapRequestSchema.statics.getPendingForUser = function(userId) {
  return this.find({ toUser: userId, status: 'pending' })
    .populate('fromUser', 'name profilePhotoUrl skillsOffered')
    .sort({ createdAt: -1 });
};

// Static method to get sent requests by a user
swapRequestSchema.statics.getSentByUser = function(userId) {
  return this.find({ fromUser: userId })
    .populate('toUser', 'name profilePhotoUrl skillsWanted')
    .sort({ createdAt: -1 });
};

// Ensure virtuals are serialized
swapRequestSchema.set('toJSON', { virtuals: true });
swapRequestSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('SwapRequest', swapRequestSchema); 