import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  UserGroupIcon,
  AcademicCapIcon,
  HandThumbUpIcon,
  SparklesIcon,
  ArrowRightIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';

const Home = () => {
  const { isAuthenticated } = useAuth();

  const features = [
    {
      icon: UserGroupIcon,
      title: 'Connect with Learners',
      description: 'Find people who want to learn what you know and teach what you want to learn.'
    },
    {
      icon: AcademicCapIcon,
      title: 'Learn New Skills',
      description: 'Exchange knowledge and acquire new skills through peer-to-peer learning.'
    },
    {
      icon: HandThumbUpIcon,
      title: 'Fair Exchange',
      description: 'No money involved - just pure skill exchange in a supportive community.'
    },
    {
      icon: SparklesIcon,
      title: 'AI-Powered Matching',
      description: 'Our smart system helps you find the perfect skill swap partners.'
    }
  ];

  const stats = [
    { number: '500+', label: 'Active Users' },
    { number: '1000+', label: 'Skills Exchanged' },
    { number: '50+', label: 'Skills Available' },
    { number: '4.8', label: 'User Rating' }
  ];

  return (
    <div>
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div>
          <div className="relative z-10 pb-8 bg-white/70 backdrop-blur-md sm:pb-16 md:pb-20 lg:w-full lg:pb-28 xl:pb-32">
            <main className="mt-10 px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
              <div className="sm:text-center lg:text-left">
                <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
                  <span className="block">Learn Skills</span>
                  <span className="block text-gradient">Exchange Knowledge</span>
                </h1>
                <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                  Join a community where knowledge flows freely. Teach what you know, learn what you want. 
                  No money, just pure skill exchange in a supportive environment.
                </p>
                <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
                  {isAuthenticated ? (
                    <div className="space-y-3 sm:space-y-0 sm:space-x-3 sm:flex">
                      <Link
                        to="/explore"
                        className="btn-primary inline-flex items-center"
                      >
                        Explore Skills
                        <ArrowRightIcon className="ml-2 h-4 w-4" />
                      </Link>
                      <Link
                        to="/profile"
                        className="btn-secondary inline-flex items-center"
                      >
                        My Profile
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-3 sm:space-y-0 sm:space-x-3 sm:flex">
                      <Link
                        to="/register"
                        className="btn-primary inline-flex items-center"
                      >
                        Get Started
                        <ArrowRightIcon className="ml-2 h-4 w-4" />
                      </Link>
                      <Link
                        to="/login"
                        className="btn-secondary inline-flex items-center"
                      >
                        Sign In
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </main>
          </div>
        </div>
        <div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
          <div className="h-56 w-full bg-gradient-to-r from-primary-600 to-purple-600 sm:h-72 md:h-96 lg:w-full lg:h-full flex items-center justify-center">
            <div className="text-center text-white">
              <div className="text-6xl mb-4">🎯</div>
              <h3 className="text-2xl font-bold">Skill Swap Platform</h3>
              <p className="text-lg opacity-90">Connect • Learn • Grow</p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-gray-50/70 backdrop-blur-md py-12">
        <div>
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl font-bold text-primary-600">{stat.number}</div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 bg-white/70 backdrop-blur-md">
        <div>
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Why Choose Skill Swap?
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Experience the power of peer-to-peer learning in a supportive community
            </p>
          </div>

          <div className="mt-16">
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {features.map((feature, index) => (
                <div key={index} className="text-center">
                  <div className="flex items-center justify-center h-12 w-12 rounded-md bg-primary-500 text-white mx-auto">
                    <feature.icon className="h-6 w-6" />
                  </div>
                  <h3 className="mt-4 text-lg font-medium text-gray-900">{feature.title}</h3>
                  <p className="mt-2 text-base text-gray-500">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="bg-gray-50/70 backdrop-blur-md py-16">
        <div>
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              How It Works
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Get started in just a few simple steps
            </p>
          </div>

          <div className="mt-16">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              <div className="text-center">
                <div className="flex items-center justify-center h-16 w-16 rounded-full bg-primary-100 text-primary-600 mx-auto text-2xl font-bold">
                  1
                </div>
                <h3 className="mt-4 text-lg font-medium text-gray-900">Create Your Profile</h3>
                <p className="mt-2 text-base text-gray-500">
                  Sign up and list the skills you can offer and the skills you want to learn.
                </p>
              </div>

              <div className="text-center">
                <div className="flex items-center justify-center h-16 w-16 rounded-full bg-primary-100 text-primary-600 mx-auto text-2xl font-bold">
                  2
                </div>
                <h3 className="mt-4 text-lg font-medium text-gray-900">Find Matches</h3>
                <p className="mt-2 text-base text-gray-500">
                  Browse profiles and find people with complementary skills to yours.
                </p>
              </div>

              <div className="text-center">
                <div className="flex items-center justify-center h-16 w-16 rounded-full bg-primary-100 text-primary-600 mx-auto text-2xl font-bold">
                  3
                </div>
                <h3 className="mt-4 text-lg font-medium text-gray-900">Start Learning</h3>
                <p className="mt-2 text-base text-gray-500">
                  Send swap requests, schedule sessions, and begin your skill exchange journey.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-primary-600/90 backdrop-blur-md">
        <div className="py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between">
          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            <span className="block">Ready to start learning?</span>
            <span className="block text-primary-200">Join our community today.</span>
          </h2>
          <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0">
            <div className="inline-flex rounded-md shadow">
              {isAuthenticated ? (
                <Link
                  to="/explore"
                  className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-primary-600 bg-white hover:bg-gray-50"
                >
                  Explore Skills
                </Link>
              ) : (
                <Link
                  to="/register"
                  className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-primary-600 bg-white hover:bg-gray-50"
                >
                  Get Started
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home; 