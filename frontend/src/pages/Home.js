import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  UserGroupIcon,
  AcademicCapIcon,
  HandThumbUpIcon,
  SparklesIcon,
  ArrowRightIcon
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
      description: 'No money involved — just pure skill exchange in a supportive community.'
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
        <div className="grid lg:grid-cols-2 items-center">
          
          {/* Left Content */}
          <div className="z-10 p-8 bg-white/80 backdrop-blur-md">
            <main className="max-w-3xl mx-auto">
              <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
                <span className="block">Learn Skills</span>
                <span className="block text-gradient">Exchange Knowledge</span>
              </h1>
              <p className="mt-5 text-lg text-gray-600">
                Join a community where knowledge flows freely. Teach what you know, learn what you want. 
                No money, just pure skill exchange in a supportive environment.
              </p>

              <div className="mt-8 flex space-x-4">
                {isAuthenticated ? (
                  <>
                    <Link to="/explore" className="btn-primary inline-flex items-center">
                      Explore Skills <ArrowRightIcon className="ml-2 h-4 w-4" />
                    </Link>
                    <Link to="/profile" className="btn-secondary inline-flex items-center">
                      My Profile
                    </Link>
                  </>
                ) : (
                  <>
                    <Link to="/register" className="btn-primary inline-flex items-center">
                      Get Started <ArrowRightIcon className="ml-2 h-4 w-4" />
                    </Link>
                    <Link to="/login" className="btn-secondary inline-flex items-center">
                      Sign In
                    </Link>
                  </>
                )}
              </div>
            </main>
          </div>

          {/* Right Side Graphic */}
          <div className="h-full w-full bg-gradient-to-r from-primary-600 to-purple-600 flex items-center justify-center text-white p-12">
            <div className="text-center">
              <div className="text-6xl mb-4">🎯</div>
              <h3 className="text-2xl font-bold">Skill Swap Platform</h3>
              <p className="text-lg opacity-90">Connect • Learn • Grow</p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-gray-50/80 backdrop-blur-md py-12">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4 text-center">
          {stats.map((stat, index) => (
            <div key={index}>
              <div className="text-3xl font-bold text-primary-600">{stat.number}</div>
              <div className="text-sm text-gray-600">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 bg-white/80 backdrop-blur-md">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Why Choose Skill Swap?
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            Experience the power of peer-to-peer learning in a supportive community
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => (
            <div key={index} className="text-center">
              <div className="flex items-center justify-center h-12 w-12 mx-auto rounded-md bg-primary-500 text-white">
                <feature.icon className="h-6 w-6" />
              </div>
              <h3 className="mt-4 text-lg font-medium text-gray-900">{feature.title}</h3>
              <p className="mt-2 text-base text-gray-500">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* How It Works Section */}
      <div className="bg-gray-50/80 backdrop-blur-md py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            How It Works
          </h2>
          <p className="mt-4 text-lg text-gray-600">Get started in just a few simple steps</p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3 text-center">
          {[
            {
              step: 1,
              title: 'Create Your Profile',
              text: 'Sign up and list the skills you can offer and the skills you want to learn.'
            },
            {
              step: 2,
              title: 'Find Matches',
              text: 'Browse profiles and find people with complementary skills to yours.'
            },
            {
              step: 3,
              title: 'Start Learning',
              text: 'Send swap requests, schedule sessions, and begin your skill exchange journey.'
            }
          ].map((item) => (
            <div key={item.step}>
              <div className="h-16 w-16 mx-auto rounded-full bg-primary-100 text-primary-600 flex items-center justify-center text-2xl font-bold">
                {item.step}
              </div>
              <h3 className="mt-4 text-lg font-medium text-gray-900">{item.title}</h3>
              <p className="mt-2 text-base text-gray-500">{item.text}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-primary-600/90 backdrop-blur-md text-white py-12 px-6 lg:flex lg:items-center lg:justify-between">
        <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
          <span className="block">Ready to start learning?</span>
          <span className="block text-primary-200">Join our community today.</span>
        </h2>
        <div className="mt-8 lg:mt-0">
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
  );
};

export default Home;
