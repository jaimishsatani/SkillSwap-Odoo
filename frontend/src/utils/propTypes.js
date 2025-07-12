import PropTypes from 'prop-types';

// Common prop types used across components
export const userPropType = PropTypes.shape({
  _id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  email: PropTypes.string.isRequired,
  profilePhoto: PropTypes.string,
  location: PropTypes.string,
  skillsOffered: PropTypes.arrayOf(PropTypes.string),
  skillsWanted: PropTypes.arrayOf(PropTypes.string),
  availability: PropTypes.arrayOf(PropTypes.string),
  averageRating: PropTypes.number,
  ratingCount: PropTypes.number,
  isPublic: PropTypes.bool,
  role: PropTypes.oneOf(['user', 'admin']),
  createdAt: PropTypes.string,
  updatedAt: PropTypes.string
});

export const swapRequestPropType = PropTypes.shape({
  _id: PropTypes.string.isRequired,
  from: userPropType,
  to: userPropType,
  offeredSkill: PropTypes.string.isRequired,
  wantedSkill: PropTypes.string.isRequired,
  message: PropTypes.string,
  status: PropTypes.oneOf(['pending', 'accepted', 'rejected', 'completed']).isRequired,
  createdAt: PropTypes.string.isRequired,
  updatedAt: PropTypes.string
});

export const statsPropType = PropTypes.shape({
  totalUsers: PropTypes.number,
  activeSwaps: PropTypes.number,
  pendingSwaps: PropTypes.number,
  completedSwaps: PropTypes.number,
  newUsersThisWeek: PropTypes.number,
  completedSwapsThisWeek: PropTypes.number,
  averageRating: PropTypes.number
});

// Component-specific prop types
export const LoadingSpinnerPropTypes = {
  size: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl']),
  className: PropTypes.string,
  text: PropTypes.string
};

export const SkillTagPropTypes = {
  skill: PropTypes.string.isRequired,
  type: PropTypes.oneOf(['offered', 'wanted', 'selected']),
  onRemove: PropTypes.func,
  clickable: PropTypes.bool,
  onClick: PropTypes.func,
  className: PropTypes.string
};

export const StarRatingPropTypes = {
  rating: PropTypes.number.isRequired,
  onRatingChange: PropTypes.func,
  readonly: PropTypes.bool,
  size: PropTypes.oneOf(['sm', 'md', 'lg'])
}; 