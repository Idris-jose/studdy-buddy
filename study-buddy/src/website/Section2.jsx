import React, { useState } from 'react';
import { Clock, Calendar, FileDown, BookOpen, FileText, Star } from 'lucide-react';

export default function Section2() {
  const [activeFeature, setActiveFeature] = useState(0);
  
  const features = [
    {
      title: 'Generate Study Timetable',
      description:
        'Effortlessly create a personalized study timetable that allocates time for each subject based on your exam schedule and syllabus. Our smart algorithm optimizes your study sessions for maximum retention.',
      icon: <Clock className="w-6 h-6" />,
      color: 'bg-purple-100 text-purple-600',
    },
    {
      title: 'Visual Time Management',
      description:
        'Visualize your study plan with our intuitive calendar view. Color-coded subjects and progress tracking help you stay on top of your study goals with ease.',
      icon: <Calendar className="w-6 h-6" />,
      color: 'bg-blue-100 text-blue-600',
    },
    {
      title: 'Export Timetable',
      description: 'Save your study timetable as a CSV, PDF, or sync directly with Google Calendar for seamless integration with your digital life.',
      icon: <FileDown className="w-6 h-6" />,
      color: 'bg-green-100 text-green-600',
    },
    {
      title: 'Generate Study Notes',
      description: 'Transform class material into concise, memorable study notes using our AI-powered tool. Highlight key concepts and create flashcards with a single click.',
      icon: <BookOpen className="w-6 h-6" />,
      color: 'bg-yellow-100 text-yellow-600',
    },
    {
      title: 'Solve Past Papers',
      description:
        'Ace your exams by practicing with past papers. Receive instant AI-powered feedback that identifies knowledge gaps and suggests targeted study materials.',
      icon: <FileText className="w-6 h-6" />,
      color: 'bg-red-100 text-red-600',
    },
    {
      title: 'Study Analytics',
      description: 'Track your study habits and performance over time with detailed analytics. Identify your peak productivity hours and optimize your study schedule accordingly.',
      icon: <Star className="w-6 h-6" />,
      color: 'bg-indigo-100 text-indigo-600',
    }
  ];

  return (
    <section
      className="px-4 py-16 flex items-center justify-center min-h-screen bg-gradient-to-br from-white to-blue-50"
      aria-labelledby="features-heading"
    >
      {/* Removed image section */}
      
      <div className="max-w-xl flex flex-col items-start">
        <div className="mb-8">
          <span className="px-4 py-1 rounded-full bg-blue-100 text-blue-800 text-sm font-medium mb-3 inline-block">Study Tools</span>
          <h2 id="features-heading" className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Supercharge Your <span className="text-blue-600">Study Sessions</span>
          </h2>
          <p className="text-gray-600 text-lg">
            Our comprehensive suite of study tools helps you prepare for exams with confidence and efficiency.
          </p>
        </div>
        
        <div className="grid grid-cols-2 gap-4 mb-8 w-full">
          {features.map((feature, index) => (
            <button
              key={index}
              className={`p-4 rounded-lg border transition-all duration-300 text-left ${
                activeFeature === index 
                  ? 'border-blue-500 shadow-md' 
                  : 'border-gray-200 hover:border-blue-300'
              }`}
              onClick={() => setActiveFeature(index)}
              aria-expanded={activeFeature === index}
              aria-controls={`feature-detail-${index}`}
            >
              <div className={`w-10 h-10 rounded-full ${feature.color} flex items-center justify-center mb-2`}>
                {feature.icon}
              </div>
              <h3 className="font-semibold text-gray-900">{feature.title}</h3>
            </button>
          ))}
        </div>
        
        <div 
          id={`feature-detail-${activeFeature}`}
          className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-blue-500 w-full transition-all duration-300"
        >
          <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2`}>
                {features[activeFeature].icon}
              </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">{features[activeFeature].title}</h3>
          <p className="text-gray-700">{features[activeFeature].description}</p>
        </div>
        
        <button className="mt-8 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-md transition-all duration-300 flex items-center">
          Explore Features
          <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </button>
      </div>
    </section>
  );
}