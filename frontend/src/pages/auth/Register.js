import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { EyeIcon, EyeSlashIcon, PlusIcon, XMarkIcon } from '@heroicons/react/24/outline';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import SkillTag from '../../components/common/SkillTag';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    location: '',
    skillsOffered: [],
    skillsWanted: [],
    availability: [],
    isPublic: true
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [skillInput, setSkillInput] = useState('');
  const [wantedSkillInput, setWantedSkillInput] = useState('');

  const { register } = useAuth();
  const navigate = useNavigate();

  const availabilityOptions = [
    'Weekdays',
    'Weekends',
    'Evenings',
    'Mornings',
    'Flexible'
  ];

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (formData.skillsOffered.length === 0) {
      newErrors.skillsOffered = 'At least one skill offered is required';
    }

    if (formData.skillsWanted.length === 0) {
      newErrors.skillsWanted = 'At least one skill wanted is required';
    }

    if (formData.availability.length === 0) {
      newErrors.availability = 'Please select at least one availability option';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    try {
      const result = await register(formData);
      if (result.success) {
        navigate('/');
      }
    } catch (error) {
      console.error('Registration error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleAvailabilityChange = (option) => {
    setFormData(prev => ({
      ...prev,
      availability: prev.availability.includes(option)
        ? prev.availability.filter(item => item !== option)
        : [...prev.availability, option]
    }));
  };

  const addSkillOffered = () => {
    if (skillInput.trim() && !formData.skillsOffered.includes(skillInput.trim())) {
      setFormData(prev => ({
        ...prev,
        skillsOffered: [...prev.skillsOffered, skillInput.trim()]
      }));
      setSkillInput('');
    }
  };

  const removeSkillOffered = (skill) => {
    setFormData(prev => ({
      ...prev,
      skillsOffered: prev.skillsOffered.filter(s => s !== skill)
    }));
  };

  const addSkillWanted = () => {
    if (wantedSkillInput.trim() && !formData.skillsWanted.includes(wantedSkillInput.trim())) {
      setFormData(prev => ({
        ...prev,
        skillsWanted: [...prev.skillsWanted, wantedSkillInput.trim()]
      }));
      setWantedSkillInput('');
    }
  };

  const removeSkillWanted = (skill) => {
    setFormData(prev => ({
      ...prev,
      skillsWanted: prev.skillsWanted.filter(s => s !== skill)
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex justify-center">
            <div className="h-12 w-12 bg-gradient-to-r from-primary-600 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">S</span>
            </div>
          </div>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Create your account
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Join the Skill Swap community and start exchanging skills
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="card">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Basic Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Full Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`mt-1 input-field ${errors.name ? 'border-red-500' : ''}`}
                  placeholder="Enter your full name"
                />
                {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
              </div>

              <div>
                <label htmlFor="location" className="block text-sm font-medium text-gray-700">
                  Location
                </label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  className="mt-1 input-field"
                  placeholder="City, Country"
                />
              </div>
            </div>

            <div className="mt-4">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email Address *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`mt-1 input-field ${errors.email ? 'border-red-500' : ''}`}
                placeholder="Enter your email"
              />
              {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password *
                </label>
                <div className="mt-1 relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className={`input-field pr-10 ${errors.password ? 'border-red-500' : ''}`}
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeSlashIcon className="h-5 w-5 text-gray-400" />
                    ) : (
                      <EyeIcon className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                </div>
                {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                  Confirm Password *
                </label>
                <div className="mt-1 relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className={`input-field pr-10 ${errors.confirmPassword ? 'border-red-500' : ''}`}
                    placeholder="Confirm your password"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeSlashIcon className="h-5 w-5 text-gray-400" />
                    ) : (
                      <EyeIcon className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                </div>
                {errors.confirmPassword && <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>}
              </div>
            </div>
          </div>

          <div className="card">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Skills & Availability</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Skills You Can Offer *
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkillOffered())}
                    className="flex-1 input-field"
                    placeholder="e.g., JavaScript, Cooking, Photography"
                  />
                  <button
                    type="button"
                    onClick={addSkillOffered}
                    className="btn-primary"
                  >
                    <PlusIcon className="h-4 w-4" />
                  </button>
                </div>
                {formData.skillsOffered.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {formData.skillsOffered.map((skill, index) => (
                      <SkillTag
                        key={index}
                        skill={skill}
                        type="offered"
                        onRemove={removeSkillOffered}
                      />
                    ))}
                  </div>
                )}
                {errors.skillsOffered && <p className="mt-1 text-sm text-red-600">{errors.skillsOffered}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Skills You Want to Learn *
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={wantedSkillInput}
                    onChange={(e) => setWantedSkillInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkillWanted())}
                    className="flex-1 input-field"
                    placeholder="e.g., Python, Guitar, Spanish"
                  />
                  <button
                    type="button"
                    onClick={addSkillWanted}
                    className="btn-primary"
                  >
                    <PlusIcon className="h-4 w-4" />
                  </button>
                </div>
                {formData.skillsWanted.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {formData.skillsWanted.map((skill, index) => (
                      <SkillTag
                        key={index}
                        skill={skill}
                        type="wanted"
                        onRemove={removeSkillWanted}
                      />
                    ))}
                  </div>
                )}
                {errors.skillsWanted && <p className="mt-1 text-sm text-red-600">{errors.skillsWanted}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Availability *
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {availabilityOptions.map((option) => (
                    <label key={option} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.availability.includes(option)}
                        onChange={() => handleAvailabilityChange(option)}
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                      />
                      <span className="ml-2 text-sm text-gray-700">{option}</span>
                    </label>
                  ))}
                </div>
                {errors.availability && <p className="mt-1 text-sm text-red-600">{errors.availability}</p>}
              </div>

              <div className="flex items-center">
                <input
                  id="isPublic"
                  name="isPublic"
                  type="checkbox"
                  checked={formData.isPublic}
                  onChange={handleChange}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
                <label htmlFor="isPublic" className="ml-2 block text-sm text-gray-700">
                  Make my profile public (others can see and request swaps)
                </label>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <Link
              to="/login"
              className="text-sm font-medium text-primary-600 hover:text-primary-500"
            >
              Already have an account? Sign in
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary px-8"
            >
              {loading ? <LoadingSpinner size="sm" /> : 'Create Account'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register; 