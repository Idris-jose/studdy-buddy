import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import Nav from './navbar.jsx';

export default function MainApp() {
  const navigate = useNavigate();
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);
  
  // Motivational quotes for students
  const quotes = [
    "The expert in anything was once a beginner. — Helen Hayes",
    "Education is not the filling of a pot but the lighting of a fire. — W.B. Yeats",
    "The beautiful thing about learning is that no one can take it away from you. — B.B. King",
    "Success is the sum of small efforts, repeated day in and day out. — Robert Collier"
  ];
  
  useEffect(() => {
    // Change quote every 5 seconds
    const quoteInterval = setInterval(() => {
      setCurrentQuoteIndex((prev) => (prev + 1) % quotes.length);
    }, 5000);
    
    return () => clearInterval(quoteInterval);
  }, []);
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      }
    }
  };
  
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { duration: 0.5, ease: "easeOut" } 
    },
    hover: { 
      scale: 1.03, 
      transition: { duration: 0.3 } 
    }
  };
  
  const textVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { duration: 0.8, ease: "easeOut" } 
    }
  };
  
  const features = [
    {
      title: "Course Input",
      description: "Easily add your courses with details like name, code, and credits to kickstart your study plan.",
      tagline: "Structure your semester efficiently!",
      color: "blue",
      path: "/course-input",
      icon: "📝"
    },
    {
      title: "Timetable",
      description: "Visualize your personalized study schedule tailored to your courses and learning pace.",
      tagline: "Master time management!",
      color: "purple",
      path: "/timetable",
      icon: "⏰"
    },
    {
      title: "Syllabus",
      description: "Generate detailed syllabi to break down your courses into manageable study units.",
      tagline: "Stay ahead of your coursework!",
      color: "pink",
      path: "/syllabus",
      icon: "📚"
    },
    {
      title: "TQ Solver",
      description: "Tackle tutorial questions with step-by-step guidance and interactive tools.",
      tagline: "Boost problem-solving skills!",
      color: "green",
      path: "/tqsolver",
      icon: "🧩"
    },
    {
      title: "Note Generator",
      description: "Create concise, organized notes from your study materials to enhance retention.",
      tagline: "Simplify your learning process!",
      color: "yellow",
      path: "/notegenerator",
      icon: "🗒️"
    }
  ];

  const steps = [
    "Start by adding your courses to create a foundation",
    "Generate a timetable to organize your study sessions",
    "Build syllabi for a clear roadmap of each course",
    "Use TQ Solver to master challenging concepts",
    "create comprehensive notes to aid in reading"
  ];

  return (
    <>
      <Nav />
      <div className="flex flex-col min-h-screen mt-15 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
        <div className="flex-1 flex flex-col items-center justify-center p-8">
          {/* Animated Title Section */}
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
          >
            <motion.h1
              variants={textVariants}
              initial="hidden"
              animate="visible"
              className="text-5xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-700 via-purple-600 to-pink-600 mb-6"
            >
              Study Buddy
            </motion.h1>
            
            <motion.h2
              variants={textVariants}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.2 }}
              className="text-2xl font-bold text-gray-800 mb-4"
            >
              Your Academic Success Partner
            </motion.h2>
            
            <motion.p
              variants={textVariants}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.3 }}
              className="text-lg text-gray-700 max-w-2xl mx-auto"
            >
              Unlock your potential with personalized study tools designed to organize your courses, 
              optimize your time, and master your subjects.
            </motion.p>
          </motion.div>
          
          {/* Motivational Quote */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentQuoteIndex}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.5 }}
              className="bg-white rounded-lg px-6 py-3 shadow-md mb-12 max-w-2xl"
            >
              <p className="text-gray-700 italic text-center">"{quotes[currentQuoteIndex]}"</p>
            </motion.div>
          </AnimatePresence>

          {/* Feature Cards */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full max-w-6xl mb-12"
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                variants={cardVariants}
                whileHover="hover"
                onClick={() => navigate(feature.path)}
                className={`bg-white rounded-2xl shadow-lg p-6 cursor-pointer border-l-4 border-${feature.color}-500 hover:shadow-xl transition-shadow duration-300`}
              >
                <div className="flex items-center mb-4">
                  <span className="text-3xl mr-3">{feature.icon}</span>
                  <h2 className={`text-2xl font-bold text-${feature.color}-600`}>{feature.title}</h2>
                </div>
                
                <p className="text-gray-600 mb-4">
                  {feature.description}
                </p>
                
                <div className={`text-sm text-${feature.color}-500 font-semibold flex items-center justify-between`}>
                  <span>Why? {feature.tagline}</span>
                  <span className="text-xl">→</span>
                </div>
              </motion.div>
            ))}
          </motion.div>
          
          {/* Learning Path */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="bg-white rounded-2xl shadow-lg p-8 max-w-3xl w-full"
          >
            <div className="flex items-center mb-6">
              <span className="text-3xl mr-3">💡</span>
              <h2 className="text-2xl font-bold text-indigo-600">Your Learning Path</h2>
            </div>
            
            <ol className="relative border-l border-indigo-200 ml-3 pl-8 space-y-6 mb-6">
              {steps.map((step, index) => (
                <motion.li 
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ 
                    opacity: 1, 
                    x: 0,
                    transition: { delay: 0.6 + (index * 0.1) } 
                  }}
                  className="relative"
                >
                  <div className="absolute -left-12 mt-1 flex items-center justify-center w-6 h-6 bg-indigo-100 rounded-full">
                    <span className="text-indigo-600 font-semibold text-sm">{index + 1}</span>
                  </div>
                  <p className="text-gray-600">{step}.</p>
                </motion.li>
              ))}
            </ol>
            
            <div className="bg-indigo-50 rounded-lg p-4 border border-indigo-100">
              <p className="text-indigo-700 font-medium flex items-center">
                <span className="mr-2">💡</span>
                Pro Tip: Consistency is key to academic success! Dedicate just 25 minutes daily to each subject.
              </p>
            </div>
          </motion.div>
          
          {/* Get Started Button */}
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ 
              opacity: 1, 
              y: 0,
              transition: { delay: 0.8, duration: 0.5 } 
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/course-input')}
            className="mt-10 px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-full shadow-lg"
          >
            Get Started Now
          </motion.button>
        </div>
      </div>
    </>
  );
}