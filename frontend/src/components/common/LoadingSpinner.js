import React from 'react';
import PropTypes from 'prop-types';
import { LoadingSpinnerPropTypes } from '../../utils/propTypes';

const LoadingSpinner = ({ size = 'md', className = '', text = 'Loading...' }) => {
  const sizeClasses = {
    xs: 'h-3 w-3',
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
    xl: 'h-16 w-16'
  };

  return (
    <div className={`flex items-center justify-center ${className}`} role="status" aria-label={text}>
      <div className={`animate-spin rounded-full border-2 border-gray-300 border-t-primary-600 ${sizeClasses[size]}`}></div>
      {text && (
        <span className="sr-only">{text}</span>
      )}
    </div>
  );
};

LoadingSpinner.propTypes = LoadingSpinnerPropTypes;

export default LoadingSpinner; 