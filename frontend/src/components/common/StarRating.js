import React from 'react';
import PropTypes from 'prop-types';
import { StarIcon } from '@heroicons/react/24/solid';
import { StarIcon as StarOutlineIcon } from '@heroicons/react/24/outline';
import { StarRatingPropTypes } from '../../utils/propTypes';

const StarRating = ({ rating, onRatingChange, readonly = false, size = 'md' }) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6'
  };

  const handleClick = (value) => {
    if (!readonly && onRatingChange) {
      onRatingChange(value);
    }
  };

  const handleKeyPress = (e, value) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClick(value);
    }
  };

  return (
    <div 
      className="flex items-center space-x-1" 
      role="group" 
      aria-label={readonly ? `Rating: ${rating} out of 5 stars` : 'Rate this item'}
    >
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => handleClick(star)}
          onKeyPress={(e) => handleKeyPress(e, star)}
          disabled={readonly}
          className={`${readonly ? 'cursor-default' : 'cursor-pointer hover:scale-110 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2'} transition-transform duration-150`}
          aria-label={readonly ? `${star} star${star !== 1 ? 's' : ''}` : `Rate ${star} star${star !== 1 ? 's' : ''}`}
          tabIndex={readonly ? -1 : 0}
        >
          {star <= rating ? (
            <StarIcon className={`${sizeClasses[size]} text-yellow-400`} />
          ) : (
            <StarOutlineIcon className={`${sizeClasses[size]} text-gray-300`} />
          )}
        </button>
      ))}
      {!readonly && (
        <span className="sr-only">
          Current rating: {rating} out of 5 stars. Use arrow keys or click to change rating.
        </span>
      )}
    </div>
  );
};

StarRating.propTypes = StarRatingPropTypes;

export default StarRating; 