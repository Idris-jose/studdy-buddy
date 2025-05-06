import React, { useEffect, useRef } from 'react';
import { NavLink } from 'react-router-dom';
import studyImage from './assets/pexels-ivan-samkov-4458554.jpg';
import { BookOpen, Calendar, Clock, Sparkles } from 'lucide-react';

export default function Section1() {
  const headingRef = useRef(null);
  const statsRef = useRef(null);

  useEffect(() => {
    // Simple animation for the heading and stats when component mounts
    if (headingRef.current) {
      headingRef.current.classList.add('animate-fade-in');
    }
    if (statsRef.current) {
      statsRef.current.classList.add('animate-slide-up');
    }
  }, []);

  const stats = [
    { icon: <Clock className="w-5 h-5" />, value: '87%', label: 'Improvement in time management' },
    { icon: <BookOpen className="w-5 h-5" />, value: '92%', label: 'Students report better grades' },
    { icon: <Sparkles className="w-5 h-5" />, value: '24/7', label: 'Access to study tools' },
  ];

  return (
    <section className="relative px-6 py-20 overflow-hidden bg-gradient-to-b from-white to-blue-50">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-64 h-64 bg-blue-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-purple-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-1/2 w-64 h-64 bg-yellow-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      <div className="container mx-auto max-w-7xl">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
          {/* Text content */}
          <div className="max-w-xl z-10" ref={headingRef}>
            <div className="inline-flex items-center px-4 py-1 rounded-full bg-blue-100 text-blue-800 text-sm font-medium mb-6">
              <Calendar className="w-4 h-4 mr-2" />
              <span>Smart Study Planning</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight text-gray-900">
              Your <span className="text-blue-600">Intelligent</span> Study Assistant
            </h1>
            
            <p className="text-lg md:text-xl mb-8 text-gray-700 leading-relaxed">
              Transform your academic journey with AI-powered study plans, personalized scheduling, and 
              intelligent tools designed to help you excel in every subject.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <NavLink
                to="/demo"
                className="bg-blue-600 text-white px-8 py-4 rounded-lg font-medium hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center"
                aria-label="Request a demo of Study Buddy"
              >
                <span>Try it Free</span>
                <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </NavLink>
              
              <NavLink
                to="/signup"
                className="border-2 border-blue-600 text-blue-600 px-8 py-4 rounded-lg font-medium hover:bg-blue-50 focus:ring-4 focus:ring-blue-300 transition-all duration-300"
                aria-label="Join Study Buddy now"
              >
                Learn More
              </NavLink>
            </div>
            
            {/* Stats section */}
            <div ref={statsRef} className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {stats.map((stat, index) => (
                <div key={index} className="flex flex-col items-center sm:items-start">
                  <div className="flex items-center mb-2">
                    <div className="p-2 rounded-full bg-blue-100 text-blue-600 mr-2">
                      {stat.icon}
                    </div>
                    <span className="text-2xl font-bold text-gray-900">{stat.value}</span>
                  </div>
                  <p className="text-sm text-gray-600">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
          
          {/* Image container */}
          <div className="relative z-10 w-full max-w-md lg:max-w-lg">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl transform rotate-3 scale-105 opacity-20 blur-sm"></div>
            <div className="relative overflow-hidden rounded-2xl shadow-2xl transform transition-all duration-500 hover:scale-105">
              <img
                src={studyImage}
                alt="Student using Study Buddy app"
                className="w-full h-auto object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-blue-900/70 to-transparent opacity-60"></div>
              
              {/* Floating testimonial */}
              <div className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur-sm p-4 rounded-lg shadow-lg">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                      <span className="text-blue-600 font-bold">JD</span>
                    </div>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">"Study Buddy helped me improve my grades by 15% in just one semester!"</p>
                    <p className="text-xs text-gray-500">- Jane Doe, Computer Science Student</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Floating feature badge */}
            <div className="absolute -top-4 -right-4 bg-white rounded-full shadow-lg p-3 flex items-center">
              <div className="p-2 rounded-full bg-purple-100 text-purple-600 mr-2">
                <Sparkles className="w-5 h-5" />
              </div>
              <span className="text-sm font-medium">AI-Powered</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}