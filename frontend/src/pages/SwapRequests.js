import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { 
  InboxIcon, 
  PaperAirplaneIcon,
  CheckIcon,
  XMarkIcon,
  ClockIcon,
  UserCircleIcon
} from '@heroicons/react/24/outline';
import axios from 'axios';
import toast from 'react-hot-toast';
import LoadingSpinner from '../components/common/LoadingSpinner';

const SwapRequests = () => {
  const { user } = useAuth();
  const [requests, setRequests] = useState({ sent: [], received: [] });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('received');

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/swaps/requests');
      setRequests(response.data);
    } catch (error) {
      console.error('Error fetching requests:', error);
      toast.error('Failed to load swap requests');
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async (requestId) => {
    try {
      await axios.put(`/api/swaps/${requestId}/accept`);
      toast.success('Swap request accepted!');
      fetchRequests();
    } catch (error) {
      console.error('Error accepting request:', error);
      toast.error('Failed to accept request');
    }
  };

  const handleReject = async (requestId) => {
    try {
      await axios.put(`/api/swaps/${requestId}/reject`);
      toast.success('Swap request rejected');
      fetchRequests();
    } catch (error) {
      console.error('Error rejecting request:', error);
      toast.error('Failed to reject request');
    }
  };

  const handleCancel = async (requestId) => {
    try {
      await axios.delete(`/api/swaps/${requestId}`);
      toast.success('Swap request cancelled');
      fetchRequests();
    } catch (error) {
      console.error('Error cancelling request:', error);
      toast.error('Failed to cancel request');
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { color: 'bg-yellow-100 text-yellow-800', icon: ClockIcon },
      accepted: { color: 'bg-green-100 text-green-800', icon: CheckIcon },
      rejected: { color: 'bg-red-100 text-red-800', icon: XMarkIcon },
      completed: { color: 'bg-blue-100 text-blue-800', icon: CheckIcon }
    };

    const config = statusConfig[status] || statusConfig.pending;
    const Icon = config.icon;

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
        <Icon className="h-3 w-3 mr-1" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
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
          <h1 className="text-3xl font-bold text-gray-900">Swap Requests</h1>
          <p className="mt-2 text-gray-600">
            Manage your incoming and outgoing skill swap requests
          </p>
        </div>

        {/* Tabs */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('received')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'received'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <InboxIcon className="h-5 w-5 inline mr-2" />
                Received ({requests.received.length})
              </button>
              <button
                onClick={() => setActiveTab('sent')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'sent'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <PaperAirplaneIcon className="h-5 w-5 inline mr-2" />
                Sent ({requests.sent.length})
              </button>
            </nav>
          </div>
        </div>

        {/* Requests List */}
        <div className="space-y-6">
          {activeTab === 'received' ? (
            requests.received.length === 0 ? (
              <div className="text-center py-12">
                <InboxIcon className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No received requests</h3>
                <p className="mt-1 text-sm text-gray-500">
                  You haven't received any swap requests yet.
                </p>
              </div>
            ) : (
              requests.received.map((request) => (
                <div key={request._id} className="card">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4">
                      <img
                        src={request.from.profilePhoto || 'https://via.placeholder.com/48x48'}
                        alt={request.from.name}
                        className="h-12 w-12 rounded-full object-cover"
                      />
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className="text-lg font-medium text-gray-900">
                            {request.from.name}
                          </h3>
                          {getStatusBadge(request.status)}
                        </div>
                        <div className="text-sm text-gray-600 mb-3">
                          <p><strong>Offering:</strong> {request.offeredSkill}</p>
                          <p><strong>Wanting:</strong> {request.wantedSkill}</p>
                          {request.message && (
                            <p className="mt-2 italic">"{request.message}"</p>
                          )}
                        </div>
                        <div className="text-xs text-gray-500">
                          Requested {new Date(request.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    {request.status === 'pending' && (
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleAccept(request._id)}
                          className="btn-primary text-sm"
                        >
                          <CheckIcon className="h-4 w-4 mr-1" />
                          Accept
                        </button>
                        <button
                          onClick={() => handleReject(request._id)}
                          className="btn-danger text-sm"
                        >
                          <XMarkIcon className="h-4 w-4 mr-1" />
                          Reject
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )
          ) : (
            requests.sent.length === 0 ? (
              <div className="text-center py-12">
                <PaperAirplaneIcon className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No sent requests</h3>
                <p className="mt-1 text-sm text-gray-500">
                  You haven't sent any swap requests yet.
                </p>
              </div>
            ) : (
              requests.sent.map((request) => (
                <div key={request._id} className="card">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4">
                      <img
                        src={request.to.profilePhoto || 'https://via.placeholder.com/48x48'}
                        alt={request.to.name}
                        className="h-12 w-12 rounded-full object-cover"
                      />
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className="text-lg font-medium text-gray-900">
                            {request.to.name}
                          </h3>
                          {getStatusBadge(request.status)}
                        </div>
                        <div className="text-sm text-gray-600 mb-3">
                          <p><strong>Offering:</strong> {request.offeredSkill}</p>
                          <p><strong>Wanting:</strong> {request.wantedSkill}</p>
                          {request.message && (
                            <p className="mt-2 italic">"{request.message}"</p>
                          )}
                        </div>
                        <div className="text-xs text-gray-500">
                          Sent {new Date(request.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    {request.status === 'pending' && (
                      <button
                        onClick={() => handleCancel(request._id)}
                        className="btn-secondary text-sm"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </div>
              ))
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default SwapRequests; 