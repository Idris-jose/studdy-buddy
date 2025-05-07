import React, { useState, useEffect } from 'react';
import { Award, Clock, Brain, BarChart, BookOpen, Target } from 'lucide-react';

const Section3 = () => {
  const [activeIndex, setActiveIndex] = useState(null);
  const [animatedElements, setAnimatedElements] = useState([]);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setAnimatedElements(prev => [...prev, entry.target.id]);
        }
      });
    }, { threshold: 0.3 });
    
    document.querySelectorAll('.benefit-card').forEach(el => {
      observer.observe(el);
    });
    
    return () => observer.disconnect();
  }, []);

  const benefits = [
    {
      icon: <Clock className="w-12 h-12" />,
      title: 'Organized Study Plan',
      description:
        'Create a clear and structured study schedule tailored to your learning style. Our intelligent system helps you prioritize subjects based on your academic goals and exam dates.',
      color: 'bg-blue-50 text-blue-600',
      highlight: '93% of students report better time management',
    },
    {
      icon: <Brain className="w-12 h-12" />,
      title: 'Personalized Learning',
      description:
        'Customize your study timetable to accommodate your peak productivity hours, break preferences, and learning pace. Adapt your schedule as needed while maintaining your study goals.',
      color: 'bg-purple-50 text-purple-600',
      highlight: 'Tailored to your unique learning style',
    },
    {
      icon: <BarChart className="w-12 h-12" />,
      title: 'Improved Academic Performance',
      description:
        'Students using structured study plans see an average 15% increase in grades. Our system helps you identify knowledge gaps and allocate more time to challenging subjects.',
      color: 'bg-green-50 text-green-600',
      highlight: 'Average 15% grade improvement',
    },
    {
      icon: <BookOpen className="w-12 h-12" />,
      title: 'Comprehensive Content Coverage',
      description:
        'Never miss important topics with our syllabus-tracking feature. The system ensures you cover all required material before exams, helping you feel fully prepared.',
      color: 'bg-amber-50 text-amber-600',
      highlight: '100% syllabus coverage guaranteed',
    },
    {
      icon: <Award className="w-12 h-12" />,
      title: 'Reduced Academic Stress',
      description:
        'Breaking down your workload into manageable study sessions reduces overwhelm and anxiety. Stay on track with gentle reminders and progress tracking.',
      color: 'bg-indigo-50 text-indigo-600',
      highlight: '78% of students report less exam anxiety',
    },
    {
      icon: <Target className="w-12 h-12" />,
      title: 'Goal Achievement',
      description:
        'Set specific academic targets and watch as our system helps you methodically work toward them. Celebrate milestones along the way to stay motivated and focused.',
      color: 'bg-rose-50 text-rose-600',
      highlight: 'Turn ambitions into achievements',
    },
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-white to-gray-50 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 -mr-16 -mt-16 w-96 h-96 bg-blue-50 rounded-full opacity-30 blur-3xl"></div>
      <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-96 h-96 bg-purple-50 rounded-full opacity-30 blur-3xl"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block px-4 py-1 rounded-full bg-blue-100 text-blue-800 text-sm font-medium mb-4">
            Student Success
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Benefits That Make a <span className="text-blue-600">Difference</span>
          </h2>
          <p className="text-lg text-gray-600">
            Our study plan generator is designed to help you achieve academic excellence through
            better organization, personalization, and strategic learning approaches.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => (
            <div
              key={index}
              id={`benefit-${index}`}
              className={`benefit-card group bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden ${
                animatedElements.includes(`benefit-${index}`) ? 'animate-fade-in-up' : 'opacity-0'
              }`}
              onMouseEnter={() => setActiveIndex(index)}
              onMouseLeave={() => setActiveIndex(null)}
            >
              <div className="p-8">
                <div className={`p-4 rounded-xl ${benefit.color} inline-block mb-6 transition-transform duration-300 group-hover:scale-110`}>
                  {benefit.icon}
                </div>
                
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  {benefit.title}
                </h3>
                
                <p className="text-gray-600 mb-6">
                  {benefit.description}
                </p>
                
                <div className={`py-3 px-4 rounded-lg bg-gray-50 text-sm font-medium ${
                  activeIndex === index ? 'bg-blue-50 text-blue-700' : 'text-gray-700'
                } transition-colors duration-300`}>
                  {benefit.highlight}
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-16 text-center">
          <a
            href="#get-started"
            className="inline-flex items-center px-8 py-4 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors duration-300 shadow-lg hover:shadow-xl"
          >
            Start Building Your Study Plan
            <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </a>
        </div>
        
       
      </div>
    </section>
  );
};

export default Section3;