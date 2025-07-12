const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const feedbackSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  message: {
    type: String,
    maxlength: 500
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [50, 'Name cannot be more than 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters']
  },
  profilePhoto: {
    type: String,
    default: null
  },
  location: {
    type: String,
    trim: true,
    maxlength: [100, 'Location cannot be more than 100 characters']
  },
  skillsOffered: [{
    type: String,
    trim: true,
    maxlength: [50, 'Skill name cannot be more than 50 characters']
  }],
  skillsWanted: [{
    type: String,
    trim: true,
    maxlength: [50, 'Skill name cannot be more than 50 characters']
  }],
  availability: [{
    type: String,
    enum: ['Weekdays', 'Weekends', 'Evenings', 'Mornings', 'Flexible'],
    default: []
  }],
  isPublic: {
    type: Boolean,
    default: true
  },
  isBanned: {
    type: Boolean,
    default: false
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  averageRating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  ratingCount: {
    type: Number,
    default: 0
  },
  feedbacks: [feedbackSchema],
  lastActive: {
    type: Date,
    default: Date.now
  },
  resetPasswordToken: {
    type: String,
    default: null
  },
  resetPasswordExpires: {
    type: Date,
    default: null
  }
}, {
  timestamps: true
});

// Index for search functionality
userSchema.index({ 
  name: 'text', 
  skillsOffered: 'text', 
  skillsWanted: 'text',
  location: 'text'
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare password
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Method to update average rating
userSchema.methods.updateAverageRating = function() {
  if (this.feedbacks.length === 0) {
    this.averageRating = 0;
    this.ratingCount = 0;
    return;
  }

  const totalRating = this.feedbacks.reduce((sum, feedback) => sum + feedback.rating, 0);
  this.averageRating = Math.round((totalRating / this.feedbacks.length) * 10) / 10;
  this.ratingCount = this.feedbacks.length;
};

// Method to add feedback
userSchema.methods.addFeedback = function(userId, rating, message) {
  // Remove existing feedback from the same user
  this.feedbacks = this.feedbacks.filter(feedback => 
    feedback.userId.toString() !== userId.toString()
  );
  
  // Add new feedback
  this.feedbacks.push({ userId, rating, message });
  
  // Update average rating
  this.updateAverageRating();
};

// Virtual for public profile data
userSchema.virtual('publicProfile').get(function() {
  return {
    _id: this._id,
    name: this.name,
    profilePhoto: this.profilePhoto,
    location: this.location,
    skillsOffered: this.skillsOffered,
    skillsWanted: this.skillsWanted,
    availability: this.availability,
    averageRating: this.averageRating,
    ratingCount: this.ratingCount,
    lastActive: this.lastActive
  };
});

// Ensure virtuals are serialized
userSchema.set('toJSON', { virtuals: true });
userSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('User', userSchema); 