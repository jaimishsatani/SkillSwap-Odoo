import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  PencilIcon, 
  MapPinIcon, 
  ClockIcon, 
  StarIcon,
  CameraIcon,
  CheckIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { StarIcon as StarSolidIcon } from '@heroicons/react/24/solid';
import axios from 'axios';
import toast from 'react-hot-toast';
import LoadingSpinner from '../components/common/LoadingSpinner';
import SkillTag from '../components/common/SkillTag';
import StarRating from '../components/common/StarRating';

const Profile = () => {
  const { userId } = useParams();
  const { user: currentUser, updateUser } = useAuth();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [skillInput, setSkillInput] = useState('');
  const [wantedSkillInput, setWantedSkillInput] = useState('');
  const [uploadingPhoto, setUploadingPhoto] = useState(false);

  const isOwnProfile = !userId || userId === currentUser?._id;

  useEffect(() => {
    fetchUser();
  }, [userId]);

  const fetchUser = async () => {
    try {
      setLoading(true);
      const endpoint = isOwnProfile ? '/api/users/profile' : `/api/users/${userId}`;
      const response = await axios.get(endpoint);
      setUser(response.data);
      setFormData(response.data);
    } catch (error) {
      console.error('Error fetching user:', error);
      toast.error('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      const response = await axios.put('/api/users/profile', formData);
      setUser(response.data);
      updateUser(response.data);
      setEditing(false);
      toast.success('Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    }
  };

  const handleCancel = () => {
    setFormData(user);
    setEditing(false);
  };

  const handlePhotoUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      toast.error('Please select a valid image file (JPEG, PNG, or GIF)');
      return;
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      toast.error('File size must be less than 5MB');
      return;
    }

    const formData = new FormData();
    formData.append('profilePhoto', file);

    try {
      setUploadingPhoto(true);
      const response = await axios.post('/api/users/upload-photo', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setUser(prev => ({ ...prev, profilePhoto: response.data.profilePhoto }));
      updateUser({ ...user, profilePhoto: response.data.profilePhoto });
      toast.success('Profile photo updated');
    } catch (error) {
      console.error('Error uploading photo:', error);
      const message = error.response?.data?.message || 'Failed to upload photo';
      toast.error(message);
    } finally {
      setUploadingPhoto(false);
      // Clean up the file input
      event.target.value = '';
    }
  };

  const addSkillOffered = () => {
    if (skillInput.trim() && !formData.skillsOffered?.includes(skillInput.trim())) {
      setFormData(prev => ({
        ...prev,
        skillsOffered: [...(prev.skillsOffered || []), skillInput.trim()]
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
    if (wantedSkillInput.trim() && !formData.skillsWanted?.includes(wantedSkillInput.trim())) {
      setFormData(prev => ({
        ...prev,
        skillsWanted: [...(prev.skillsWanted || []), wantedSkillInput.trim()]
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

  const handleAvailabilityChange = (option) => {
    setFormData(prev => ({
      ...prev,
      availability: prev.availability?.includes(option)
        ? prev.availability.filter(item => item !== option)
        : [...(prev.availability || []), option]
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">Profile not found</h2>
          <p className="text-gray-600">The user profile you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Header */}
        <div className="card mb-8">
          <div className="flex items-start justify-between">
            <div className="flex items-center">
              <div className="relative">
                <img
                  src={user.profilePhoto || 'https://via.placeholder.com/120x120'}
                  alt={user.name}
                  className="h-24 w-24 rounded-full object-cover"
                />
                {isOwnProfile && !editing && (
                  <label className="absolute bottom-0 right-0 bg-white rounded-full p-1 shadow-md cursor-pointer hover:bg-gray-50">
                    <CameraIcon className="h-4 w-4 text-gray-600" />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoUpload}
                      className="hidden"
                      disabled={uploadingPhoto}
                    />
                  </label>
                )}
                {uploadingPhoto && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
                    <LoadingSpinner size="sm" />
                  </div>
                )}
              </div>
              <div className="ml-6">
                <h1 className="text-2xl font-bold text-gray-900">{user.name}</h1>
                {user.location && (
                  <div className="flex items-center text-gray-600 mt-1">
                    <MapPinIcon className="h-4 w-4 mr-1" />
                    {user.location}
                  </div>
                )}
                {user.averageRating && (
                  <div className="flex items-center mt-2">
                    <StarSolidIcon className="h-4 w-4 text-yellow-400" />
                    <span className="ml-1 text-sm text-gray-600">
                      {user.averageRating.toFixed(1)} ({user.ratingCount || 0} reviews)
                    </span>
                  </div>
                )}
              </div>
            </div>
            {isOwnProfile && (
              <button
                onClick={() => setEditing(!editing)}
                className="btn-secondary inline-flex items-center"
              >
                <PencilIcon className="h-4 w-4 mr-2" />
                {editing ? 'Cancel' : 'Edit Profile'}
              </button>
            )}
          </div>
        </div>

        {/* Profile Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Skills Offered */}
            <div className="card">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Skills Offered</h2>
              {editing ? (
                <div>
                  <div className="flex gap-2 mb-4">
                    <input
                      type="text"
                      value={skillInput}
                      onChange={(e) => setSkillInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkillOffered())}
                      className="flex-1 input-field"
                      placeholder="Add a skill you can offer"
                    />
                    <button onClick={addSkillOffered} className="btn-primary">
                      Add
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {formData.skillsOffered?.map((skill, index) => (
                      <SkillTag
                        key={index}
                        skill={skill}
                        type="offered"
                        onRemove={removeSkillOffered}
                      />
                    ))}
                  </div>
                </div>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {user.skillsOffered?.map((skill, index) => (
                    <SkillTag key={index} skill={skill} type="offered" />
                  ))}
                </div>
              )}
            </div>

            {/* Skills Wanted */}
            <div className="card">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Skills Wanted</h2>
              {editing ? (
                <div>
                  <div className="flex gap-2 mb-4">
                    <input
                      type="text"
                      value={wantedSkillInput}
                      onChange={(e) => setWantedSkillInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkillWanted())}
                      className="flex-1 input-field"
                      placeholder="Add a skill you want to learn"
                    />
                    <button onClick={addSkillWanted} className="btn-primary">
                      Add
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {formData.skillsWanted?.map((skill, index) => (
                      <SkillTag
                        key={index}
                        skill={skill}
                        type="wanted"
                        onRemove={removeSkillWanted}
                      />
                    ))}
                  </div>
                </div>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {user.skillsWanted?.map((skill, index) => (
                    <SkillTag key={index} skill={skill} type="wanted" />
                  ))}
                </div>
              )}
            </div>

            {/* Availability */}
            <div className="card">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Availability</h2>
              {editing ? (
                <div className="grid grid-cols-2 gap-2">
                  {['Weekdays', 'Weekends', 'Evenings', 'Mornings', 'Flexible'].map((option) => (
                    <label key={option} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.availability?.includes(option)}
                        onChange={() => handleAvailabilityChange(option)}
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                      />
                      <span className="ml-2 text-sm text-gray-700">{option}</span>
                    </label>
                  ))}
                </div>
              ) : (
                <div className="flex items-center text-gray-600">
                  <ClockIcon className="h-4 w-4 mr-2" />
                  {user.availability?.join(', ') || 'Not specified'}
                </div>
              )}
            </div>

            {/* Profile Visibility */}
            {isOwnProfile && (
              <div className="card">
                <h2 className="text-lg font-medium text-gray-900 mb-4">Profile Visibility</h2>
                {editing ? (
                  <div className="flex items-center">
                    <input
                      id="isPublic"
                      type="checkbox"
                      checked={formData.isPublic}
                      onChange={(e) => setFormData(prev => ({ ...prev, isPublic: e.target.checked }))}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    />
                    <label htmlFor="isPublic" className="ml-2 text-sm text-gray-700">
                      Make my profile public (others can see and request swaps)
                    </label>
                  </div>
                ) : (
                  <div className="flex items-center text-gray-600">
                    <span className="text-sm">
                      Profile is {user.isPublic ? 'public' : 'private'}
                    </span>
                  </div>
                )}
              </div>
            )}

            {/* Edit Actions */}
            {editing && (
              <div className="flex gap-3">
                <button onClick={handleSave} className="btn-primary">
                  <CheckIcon className="h-4 w-4 mr-2" />
                  Save Changes
                </button>
                <button onClick={handleCancel} className="btn-secondary">
                  <XMarkIcon className="h-4 w-4 mr-2" />
                  Cancel
                </button>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <div className="card">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Stats</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Skills Offered</span>
                  <span className="font-medium">{user.skillsOffered?.length || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Skills Wanted</span>
                  <span className="font-medium">{user.skillsWanted?.length || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Member Since</span>
                  <span className="font-medium">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="card">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Activity</h3>
              <div className="text-sm text-gray-600">
                <p>No recent activity to show.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile; 