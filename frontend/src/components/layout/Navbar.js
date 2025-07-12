import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { 
  Bars3Icon, 
  XMarkIcon, 
  UserCircleIcon,
  ArrowRightOnRectangleIcon
} from '@heroicons/react/24/outline';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navigation = [
    { name: 'Home', href: '/', current: location.pathname === '/' },
    { name: 'Explore', href: '/explore', current: location.pathname === '/explore' },
    ...(isAuthenticated ? [
      { name: 'Profile', href: '/profile', current: location.pathname === '/profile' },
      { name: 'Swap Requests', href: '/swap-requests', current: location.pathname === '/swap-requests' },
    ] : []),
    ...(isAuthenticated && user?.role === 'admin' ? [
      { name: 'Admin', href: '/admin', current: location.pathname === '/admin' },
    ] : []),
  ];

  return (
    <nav className="bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <div className="h-8 w-8 bg-gradient-to-r from-primary-600 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">S</span>
              </div>
              <span className="ml-2 text-xl font-bold text-gradient">Skill Swap</span>
            </Link>
          </div>

          <div className="hidden md:flex md:items-center md:space-x-6">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                  item.current
                    ? 'bg-primary-100 text-primary-700'
                    : 'text-gray-700 hover:text-primary-600 hover:bg-gray-50'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </div>

          <div className="hidden md:flex md:items-center md:space-x-4">
            {isAuthenticated ? (
              <div className="relative group">
                <button className="flex items-center space-x-2 text-gray-700 hover:text-primary-600 transition-colors duration-200">
                  <img
                    src={user?.profilePhoto || 'https://via.placeholder.com/32x32'}
                    alt="Profile"
                    className="h-8 w-8 rounded-full object-cover"
                  />
                  <span className="text-sm font-medium">{user?.name}</span>
                </button>
                
                <div className="absolute right-0 mt-2 w-48 bg-white/90 backdrop-blur-md rounded-md shadow-lg py-1 z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                  <Link
                    to="/profile"
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <UserCircleIcon className="h-4 w-4 mr-2" />
                    Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <ArrowRightOnRectangleIcon className="h-4 w-4 mr-2" />
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  to="/login"
                  className="text-gray-700 hover:text-primary-600 font-medium text-sm"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="btn-primary text-sm"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gray-700 hover:text-primary-600 p-2"
            >
              {isMobileMenuOpen ? (
                <XMarkIcon className="h-6 w-6" />
              ) : (
                <Bars3Icon className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white/90 backdrop-blur-md border-t border-gray-200">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  item.current
                    ? 'bg-primary-100 text-primary-700'
                    : 'text-gray-700 hover:text-primary-600 hover:bg-gray-50'
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            
            {isAuthenticated ? (
              <div className="pt-4 border-t border-gray-200">
                <div className="flex items-center px-3 py-2">
                  <img
                    src={user?.profilePhoto || 'https://via.placeholder.com/32x32'}
                    alt="Profile"
                    className="h-8 w-8 rounded-full object-cover mr-3"
                  />
                  <span className="text-sm font-medium text-gray-700">{user?.name}</span>
                </div>
                <button
                  onClick={() => {
                    handleLogout();
                    setIsMobileMenuOpen(false);
                  }}
                  className="flex items-center w-full px-3 py-2 text-base font-medium text-gray-700 hover:text-primary-600 hover:bg-gray-50 rounded-md"
                >
                  <ArrowRightOnRectangleIcon className="h-4 w-4 mr-2" />
                  Logout
                </button>
              </div>
            ) : (
              <div className="pt-4 border-t border-gray-200 space-y-2">
                <Link
                  to="/login"
                  className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-primary-600 hover:bg-gray-50 rounded-md"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="block px-3 py-2 text-base font-medium bg-primary-600 text-white hover:bg-primary-700 rounded-md"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar; 