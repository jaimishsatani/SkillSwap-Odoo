import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  MagnifyingGlassIcon, 
  FunnelIcon,
  MapPinIcon,
  ClockIcon,
  StarIcon,
  UserCircleIcon
} from '@heroicons/react/24/outline';
import { StarIcon as StarSolidIcon } from '@heroicons/react/24/solid';
import axios from 'axios';
import toast from 'react-hot-toast';
import LoadingSpinner from '../components/common/LoadingSpinner';
import SkillTag from '../components/common/SkillTag';

const Explore = () => {
  const { user, isAuthenticated } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSkill, setSelectedSkill] = useState('');
  const [selectedAvailability, setSelectedAvailability] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const availabilityOptions = [
    'Weekdays',
    'Weekends',
    'Evenings',
    'Mornings',
    'Flexible'
  ];

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/users/explore');
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.skillsOffered.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase())) ||
                         user.skillsWanted.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesSkill = !selectedSkill || 
                        user.skillsOffered.includes(selectedSkill) ||
                        user.skillsWanted.includes(selectedSkill);
    
    const matchesAvailability = !selectedAvailability || 
                              user.availability.includes(selectedAvailability);

    return matchesSearch && matchesSkill && matchesAvailability;
  });

  const handleSwapRequest = async (targetUserId) => {
    if (!isAuthenticated) {
      toast.error('Please login to send swap requests');
      return;
    }

    // This would typically open a modal or navigate to a swap request form
    toast.success('Swap request feature coming soon!');
  };

  const getAllSkills = () => {
    const skills = new Set();
    users.forEach(user => {
      user.skillsOffered.forEach(skill => skills.add(skill));
      user.skillsWanted.forEach(skill => skills.add(skill));
    });
    return Array.from(skills).sort();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Explore Skills</h1>
          <p className="mt-2 text-gray-600">
            Discover people with skills to share and find your perfect learning partner
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name or skills..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="btn-secondary inline-flex items-center"
            >
              <FunnelIcon className="h-4 w-4 mr-2" />
              Filters
            </button>
          </div>

          {/* Filter Options */}
          {showFilters && (
            <div className="mt-4 p-4 bg-white rounded-lg border border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Filter by Skill
                  </label>
                  <select
                    value={selectedSkill}
                    onChange={(e) => setSelectedSkill(e.target.value)}
                    className="w-full input-field"
                  >
                    <option value="">All Skills</option>
                    {getAllSkills().map(skill => (
                      <option key={skill} value={skill}>{skill}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Filter by Availability
                  </label>
                  <select
                    value={selectedAvailability}
                    onChange={(e) => setSelectedAvailability(e.target.value)}
                    className="w-full input-field"
                  >
                    <option value="">All Availability</option>
                    {availabilityOptions.map(option => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600">
            Showing {filteredUsers.length} of {users.length} users
          </p>
        </div>

        {/* Users Grid */}
        {filteredUsers.length === 0 ? (
          <div className="text-center py-12">
            <UserCircleIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No users found</h3>
            <p className="mt-1 text-sm text-gray-500">
              Try adjusting your search or filters to find more users.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredUsers.map((userProfile) => (
              <div key={userProfile._id} className="card hover:shadow-md transition-shadow duration-200">
                {/* User Header */}
                <div className="flex items-center mb-4">
                  <img
                    src={userProfile.profilePhoto || 'https://via.placeholder.com/48x48'}
                    alt={userProfile.name}
                    className="h-12 w-12 rounded-full object-cover"
                  />
                  <div className="ml-3 flex-1">
                    <h3 className="text-lg font-medium text-gray-900">{userProfile.name}</h3>
                    {userProfile.location && (
                      <div className="flex items-center text-sm text-gray-500">
                        <MapPinIcon className="h-4 w-4 mr-1" />
                        {userProfile.location}
                      </div>
                    )}
                  </div>
                  {userProfile.averageRating && (
                    <div className="flex items-center">
                      <StarSolidIcon className="h-4 w-4 text-yellow-400" />
                      <span className="ml-1 text-sm text-gray-600">
                        {userProfile.averageRating.toFixed(1)}
                      </span>
                    </div>
                  )}
                </div>

                {/* Skills Offered */}
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Skills Offered</h4>
                  <div className="flex flex-wrap gap-1">
                    {userProfile.skillsOffered.slice(0, 3).map((skill, index) => (
                      <SkillTag key={index} skill={skill} type="offered" />
                    ))}
                    {userProfile.skillsOffered.length > 3 && (
                      <span className="text-xs text-gray-500">
                        +{userProfile.skillsOffered.length - 3} more
                      </span>
                    )}
                  </div>
                </div>

                {/* Skills Wanted */}
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Skills Wanted</h4>
                  <div className="flex flex-wrap gap-1">
                    {userProfile.skillsWanted.slice(0, 3).map((skill, index) => (
                      <SkillTag key={index} skill={skill} type="wanted" />
                    ))}
                    {userProfile.skillsWanted.length > 3 && (
                      <span className="text-xs text-gray-500">
                        +{userProfile.skillsWanted.length - 3} more
                      </span>
                    )}
                  </div>
                </div>

                {/* Availability */}
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Availability</h4>
                  <div className="flex items-center text-sm text-gray-600">
                    <ClockIcon className="h-4 w-4 mr-1" />
                    {userProfile.availability.join(', ')}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <Link
                    to={`/profile/${userProfile._id}`}
                    className="flex-1 btn-secondary text-center"
                  >
                    View Profile
                  </Link>
                  {isAuthenticated && user._id !== userProfile._id && (
                    <button
                      onClick={() => handleSwapRequest(userProfile._id)}
                      className="flex-1 btn-primary"
                    >
                      Request Swap
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Explore; 