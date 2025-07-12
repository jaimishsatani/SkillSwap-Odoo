import React from 'react';
import PropTypes from 'prop-types';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { SkillTagPropTypes } from '../../utils/propTypes';

const SkillTag = ({ 
  skill, 
  type = 'offered', 
  onRemove, 
  clickable = false, 
  onClick,
  className = '' 
}) => {
  const baseClasses = 'inline-flex items-center px-3 py-1 rounded-full text-sm font-medium transition-all duration-200';
  
  const typeClasses = {
    offered: 'bg-primary-100 text-primary-800 hover:bg-primary-200',
    wanted: 'bg-green-100 text-green-800 hover:bg-green-200',
    selected: 'bg-primary-600 text-white hover:bg-primary-700'
  };

  const handleClick = () => {
    if (clickable && onClick) {
      onClick(skill);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClick();
    }
  };

  const handleRemove = (e) => {
    e.stopPropagation();
    if (onRemove) {
      onRemove(skill);
    }
  };

  const handleRemoveKeyPress = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleRemove(e);
    }
  };

  return (
    <span 
      className={`${baseClasses} ${typeClasses[type]} ${clickable ? 'cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2' : ''} ${className}`}
      onClick={handleClick}
      onKeyPress={clickable ? handleKeyPress : undefined}
      tabIndex={clickable ? 0 : undefined}
      role={clickable ? 'button' : undefined}
      aria-label={clickable ? `Select ${skill} skill` : `${skill} skill`}
    >
      {skill}
      {onRemove && (
        <button
          onClick={handleRemove}
          onKeyPress={handleRemoveKeyPress}
          className="ml-1 hover:bg-black hover:bg-opacity-10 rounded-full p-0.5 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
          aria-label={`Remove ${skill} skill`}
          tabIndex={0}
        >
          <XMarkIcon className="h-3 w-3" />
        </button>
      )}
    </span>
  );
};

SkillTag.propTypes = SkillTagPropTypes;

export default SkillTag; 