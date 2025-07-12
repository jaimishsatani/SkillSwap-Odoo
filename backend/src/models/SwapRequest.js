const mongoose = require('mongoose');

const swapRequestSchema = new mongoose.Schema({
  from: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  to: {
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
  wantedSkill: {
    type: String,
    required: [true, 'Wanted skill is required'],
    trim: true,
    maxlength: [50, 'Skill name cannot be more than 50 characters']
  },
  message: {
    type: String,
    trim: true,
    maxlength: [500, 'Message cannot be more than 500 characters']
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected', 'cancelled', 'completed'],
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
swapRequestSchema.index({ from: 1, status: 1 });
swapRequestSchema.index({ to: 1, status: 1 });
swapRequestSchema.index({ status: 1, createdAt: -1 });

// Virtual for populated data
swapRequestSchema.virtual('fromUserData', {
  ref: 'User',
  localField: 'from',
  foreignField: '_id',
  justOne: true
});

swapRequestSchema.virtual('toUserData', {
  ref: 'User',
  localField: 'to',
  foreignField: '_id',
  justOne: true
});

// Method to accept swap request
swapRequestSchema.methods.accept = function() {
  this.status = 'accepted';
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

// Method to complete swap request
swapRequestSchema.methods.complete = function() {
  this.status = 'completed';
  this.completedAt = new Date();
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
      { from: userId },
      { to: userId }
    ]
  };
  
  if (status) {
    query.status = status;
  }
  
  return this.find(query)
    .populate('from', 'name profilePhoto')
    .populate('to', 'name profilePhoto')
    .sort({ createdAt: -1 });
};

// Static method to get pending requests for a user
swapRequestSchema.statics.getPendingForUser = function(userId) {
  return this.find({ to: userId, status: 'pending' })
    .populate('from', 'name profilePhoto skillsOffered')
    .sort({ createdAt: -1 });
};

// Static method to get sent requests by a user
swapRequestSchema.statics.getSentByUser = function(userId) {
  return this.find({ from: userId })
    .populate('to', 'name profilePhoto skillsWanted')
    .sort({ createdAt: -1 });
};

// Ensure virtuals are serialized
swapRequestSchema.set('toJSON', { virtuals: true });
swapRequestSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('SwapRequest', swapRequestSchema); 