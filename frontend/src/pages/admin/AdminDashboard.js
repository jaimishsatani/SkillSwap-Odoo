import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { 
  UsersIcon, 
  HandThumbUpIcon, 
  ExclamationTriangleIcon,
  ChartBarIcon,
  EyeIcon,
  BanIcon,
  CheckIcon,
  XMarkIcon,
  DocumentArrowDownIcon
} from '@heroicons/react/24/outline';
import axios from 'axios';
import toast from 'react-hot-toast';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({});
  const [users, setUsers] = useState([]);
  const [swaps, setSwaps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [statsRes, usersRes, swapsRes] = await Promise.all([
        axios.get('/api/admin/stats'),
        axios.get('/api/admin/users'),
        axios.get('/api/admin/swaps')
      ]);
      
      setStats(statsRes.data);
      setUsers(usersRes.data);
      setSwaps(swapsRes.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleBanUser = async (userId) => {
    try {
      await axios.put(`/api/admin/users/${userId}/ban`);
      toast.success('User banned successfully');
      fetchDashboardData();
    } catch (error) {
      console.error('Error banning user:', error);
      toast.error('Failed to ban user');
    }
  };

  const handleUnbanUser = async (userId) => {
    try {
      await axios.put(`/api/admin/users/${userId}/unban`);
      toast.success('User unbanned successfully');
      fetchDashboardData();
    } catch (error) {
      console.error('Error unbanning user:', error);
      toast.error('Failed to unban user');
    }
  };

  const handleRejectSwap = async (swapId) => {
    try {
      await axios.put(`/api/admin/swaps/${swapId}/reject`);
      toast.success('Swap rejected successfully');
      fetchDashboardData();
    } catch (error) {
      console.error('Error rejecting swap:', error);
      toast.error('Failed to reject swap');
    }
  };

  const downloadReport = async (type) => {
    try {
      const response = await axios.get(`/api/admin/reports/${type}`, {
        responseType: 'blob'
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${type}-report.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      
      toast.success(`${type} report downloaded`);
    } catch (error) {
      console.error('Error downloading report:', error);
      toast.error('Failed to download report');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/70 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="mt-2 text-gray-600">
            Manage users, monitor swaps, and view platform statistics
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="card bg-white/80 backdrop-blur-md">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <UsersIcon className="h-8 w-8 text-primary-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Users</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.totalUsers || 0}</p>
              </div>
            </div>
          </div>

          <div className="card bg-white/80 backdrop-blur-md">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <HandThumbUpIcon className="h-8 w-8 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Active Swaps</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.activeSwaps || 0}</p>
              </div>
            </div>
          </div>

          <div className="card bg-white/80 backdrop-blur-md">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <ExclamationTriangleIcon className="h-8 w-8 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Pending Swaps</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.pendingSwaps || 0}</p>
              </div>
            </div>
          </div>

          <div className="card bg-white/80 backdrop-blur-md">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <ChartBarIcon className="h-8 w-8 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Completed Swaps</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.completedSwaps || 0}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {[
                { id: 'overview', name: 'Overview', icon: ChartBarIcon },
                { id: 'users', name: 'User Management', icon: UsersIcon },
                { id: 'swaps', name: 'Swap Monitoring', icon: HandThumbUpIcon },
                { id: 'reports', name: 'Reports', icon: DocumentArrowDownIcon }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center ${
                    activeTab === tab.id
                      ? 'border-primary-500 text-primary-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <tab.icon className="h-5 w-5 mr-2" />
                  {tab.name}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        <div className="space-y-6">
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="card bg-white/80 backdrop-blur-md">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Activity</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">New users this week</span>
                    <span className="font-medium">{stats.newUsersThisWeek || 0}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Swaps completed this week</span>
                    <span className="font-medium">{stats.completedSwapsThisWeek || 0}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Average rating</span>
                    <span className="font-medium">{stats.averageRating?.toFixed(1) || 'N/A'}</span>
                  </div>
                </div>
              </div>

              <div className="card bg-white/80 backdrop-blur-md">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <button
                    onClick={() => downloadReport('users')}
                    className="w-full btn-secondary text-left"
                  >
                    <DocumentArrowDownIcon className="h-4 w-4 mr-2 inline" />
                    Download User Report
                  </button>
                  <button
                    onClick={() => downloadReport('swaps')}
                    className="w-full btn-secondary text-left"
                  >
                    <DocumentArrowDownIcon className="h-4 w-4 mr-2 inline" />
                    Download Swap Report
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'users' && (
            <div className="card bg-white/80 backdrop-blur-md">
              <h3 className="text-lg font-medium text-gray-900 mb-4">User Management</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        User
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Joined
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {users.map((userItem) => (
                      <tr key={userItem._id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <img
                              src={userItem.profilePhoto || 'https://via.placeholder.com/32x32'}
                              alt={userItem.name}
                              className="h-8 w-8 rounded-full"
                            />
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{userItem.name}</div>
                              <div className="text-sm text-gray-500">{userItem.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            userItem.isBanned 
                              ? 'bg-red-100 text-red-800' 
                              : 'bg-green-100 text-green-800'
                          }`}>
                            {userItem.isBanned ? 'Banned' : 'Active'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(userItem.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          {userItem.isBanned ? (
                            <button
                              onClick={() => handleUnbanUser(userItem._id)}
                              className="text-green-600 hover:text-green-900"
                            >
                              Unban
                            </button>
                          ) : (
                            <button
                              onClick={() => handleBanUser(userItem._id)}
                              className="text-red-600 hover:text-red-900"
                            >
                              Ban
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'swaps' && (
            <div className="card bg-white/80 backdrop-blur-md">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Swap Monitoring</h3>
              <div className="space-y-4">
                {swaps.map((swap) => (
                  <div key={swap._id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center space-x-2 mb-2">
                          <span className="text-sm font-medium text-gray-900">
                            {swap.from.name} ↔ {swap.to.name}
                          </span>
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            swap.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                            swap.status === 'accepted' ? 'bg-green-100 text-green-800' :
                            swap.status === 'rejected' ? 'bg-red-100 text-red-800' :
                            'bg-blue-100 text-blue-800'
                          }`}>
                            {swap.status.charAt(0).toUpperCase() + swap.status.slice(1)}
                          </span>
                        </div>
                        <div className="text-sm text-gray-600">
                          <p><strong>Offering:</strong> {swap.offeredSkill}</p>
                          <p><strong>Wanting:</strong> {swap.wantedSkill}</p>
                          <p className="text-xs text-gray-500">
                            Created {new Date(swap.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      {swap.status === 'pending' && (
                        <button
                          onClick={() => handleRejectSwap(swap._id)}
                          className="btn-danger text-sm"
                        >
                          <XMarkIcon className="h-4 w-4 mr-1" />
                          Reject
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'reports' && (
            <div className="card bg-white/80 backdrop-blur-md">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Download Reports</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button
                  onClick={() => downloadReport('users')}
                  className="btn-secondary text-left p-4"
                >
                  <DocumentArrowDownIcon className="h-6 w-6 mb-2" />
                  <h4 className="font-medium">User Activity Report</h4>
                  <p className="text-sm text-gray-600">Download user registration and activity data</p>
                </button>
                <button
                  onClick={() => downloadReport('swaps')}
                  className="btn-secondary text-left p-4"
                >
                  <DocumentArrowDownIcon className="h-6 w-6 mb-2" />
                  <h4 className="font-medium">Swap Statistics Report</h4>
                  <p className="text-sm text-gray-600">Download swap request and completion data</p>
                </button>
                <button
                  onClick={() => downloadReport('feedback')}
                  className="btn-secondary text-left p-4"
                >
                  <DocumentArrowDownIcon className="h-6 w-6 mb-2" />
                  <h4 className="font-medium">Feedback Report</h4>
                  <p className="text-sm text-gray-600">Download user ratings and feedback data</p>
                </button>
                <button
                  onClick={() => downloadReport('platform')}
                  className="btn-secondary text-left p-4"
                >
                  <DocumentArrowDownIcon className="h-6 w-6 mb-2" />
                  <h4 className="font-medium">Platform Overview</h4>
                  <p className="text-sm text-gray-600">Download comprehensive platform statistics</p>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard; 