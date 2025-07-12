import React from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';

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

  return (
    <span 
      className={`${baseClasses} ${typeClasses[type]} ${clickable ? 'cursor-pointer' : ''} ${className}`}
      onClick={handleClick}
    >
      {skill}
      {onRemove && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRemove(skill);
          }}
          className="ml-1 hover:bg-black hover:bg-opacity-10 rounded-full p-0.5 transition-colors duration-200"
        >
          <XMarkIcon className="h-3 w-3" />
        </button>
      )}
    </span>
  );
};

export default SkillTag; 