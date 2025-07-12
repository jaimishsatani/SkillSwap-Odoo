const mongoose = require('mongoose');

const adminLogSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['ban', 'unban', 'announcement', 'flag', 'skill_moderation', 'user_deletion'],
    required: true
  },
  adminId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  targetUserId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false // Not required for announcements
  },
  description: {
    type: String,
    required: true,
    maxlength: [1000, 'Description cannot be more than 1000 characters']
  },
  details: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  ipAddress: {
    type: String,
    required: false
  },
  userAgent: {
    type: String,
    required: false
  }
}, {
  timestamps: true
});

// Index for efficient queries
adminLogSchema.index({ type: 1, createdAt: -1 });
adminLogSchema.index({ adminId: 1, createdAt: -1 });
adminLogSchema.index({ targetUserId: 1, createdAt: -1 });

// Virtual for admin data
adminLogSchema.virtual('adminData', {
  ref: 'User',
  localField: 'adminId',
  foreignField: '_id',
  justOne: true
});

// Virtual for target user data
adminLogSchema.virtual('targetUserData', {
  ref: 'User',
  localField: 'targetUserId',
  foreignField: '_id',
  justOne: true
});

// Static method to get logs by type
adminLogSchema.statics.getLogsByType = function(type, limit = 50) {
  return this.find({ type })
    .populate('adminId', 'name email')
    .populate('targetUserId', 'name email')
    .sort({ createdAt: -1 })
    .limit(limit);
};

// Static method to get logs for a specific user
adminLogSchema.statics.getLogsForUser = function(userId, limit = 50) {
  return this.find({ targetUserId: userId })
    .populate('adminId', 'name email')
    .sort({ createdAt: -1 })
    .limit(limit);
};

// Static method to get recent admin activity
adminLogSchema.statics.getRecentActivity = function(limit = 100) {
  return this.find()
    .populate('adminId', 'name email')
    .populate('targetUserId', 'name email')
    .sort({ createdAt: -1 })
    .limit(limit);
};

// Static method to create log entry
adminLogSchema.statics.createLog = function(data) {
  return this.create({
    ...data,
    createdAt: new Date()
  });
};

// Ensure virtuals are serialized
adminLogSchema.set('toJSON', { virtuals: true });
adminLogSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('AdminLog', adminLogSchema); 