import React, { useState } from 'react';
import PropTypes from 'prop-types';
import LoadingSpinner from './LoadingSpinner';

const SkillSwapRequestModal = ({
  isOpen,
  onClose,
  targetUser,
  currentUser,
  onRequestSent
}) => {
  const [offeredSkill, setOfferedSkill] = useState('');
  const [wantedSkill, setWantedSkill] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!offeredSkill || !wantedSkill) {
      setError('Please select both skills.');
      return;
    }
    setLoading(true);
    try {
      const axios = (await import('axios')).default;
      await axios.post('/api/swaps', {
        toUserId: targetUser._id,
        offeredSkill,
        wantedSkill,
        message
      });
      if (onRequestSent) onRequestSent();
      onClose();
    } catch (err) {
      setError(
        err.response?.data?.message || 'Failed to send swap request.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 animate-fade-in">
      <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md relative animate-slide-up">
        <button
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 text-2xl font-bold"
          onClick={onClose}
          aria-label="Close"
        >
          &times;
        </button>
        <h2 className="text-xl font-semibold mb-4 text-gray-900">Request Skill Swap</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Your Offered Skill</label>
            <select
              className="input-field"
              value={offeredSkill}
              onChange={e => setOfferedSkill(e.target.value)}
              required
            >
              <option value="">Select a skill</option>
              {currentUser?.skillsOffered?.map(skill => (
                <option key={skill} value={skill}>{skill}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Their Wanted Skill</label>
            <select
              className="input-field"
              value={wantedSkill}
              onChange={e => setWantedSkill(e.target.value)}
              required
            >
              <option value="">Select a skill</option>
              {targetUser?.skillsWanted?.map(skill => (
                <option key={skill} value={skill}>{skill}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Message (optional)</label>
            <textarea
              className="input-field"
              value={message}
              onChange={e => setMessage(e.target.value)}
              rows={3}
              maxLength={500}
              placeholder="Add a message..."
            />
          </div>
          {error && <div className="text-red-600 text-sm">{error}</div>}
          <div className="flex justify-end">
            <button
              type="submit"
              className="btn-primary min-w-[120px]"
              disabled={loading}
            >
              {loading ? <LoadingSpinner size="sm" text="" /> : 'Send Request'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

SkillSwapRequestModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  targetUser: PropTypes.object.isRequired,
  currentUser: PropTypes.object.isRequired,
  onRequestSent: PropTypes.func
};

export default SkillSwapRequestModal; 