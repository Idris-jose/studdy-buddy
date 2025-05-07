import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Nav from './navbar.jsx';
import { useTheme } from './themecontext.jsx';

export default function CourseInput() {
  const [courseName, setCourseName] = useState('');
  const [courseCode, setCourseCode] = useState('');
  const [unit, setUnit] = useState('');
  const [courses, setCourses] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const [showConfetti, setShowConfetti] = useState(false);
  const navigate = useNavigate();

  // Course themes with colors
  
const {changeTheme} = useTheme()
const {theme} = useTheme()
const {themeColors} = useTheme()
  // Fun emoji mappings for different types of courses
  const courseEmojis = {
    'cs': '💻',
    'math': '🧮',
    'eng': '🔧',
    'bio': '🧬',
    'chem': '🧪',
    'phys': '⚛️',
    'art': '🎨',
    'hist': '📜',
    'lang': '🗣️',
    'music': '🎵',
    'psych': '🧠',
    'econ': '📊',
    'default': '📚'
  };

  // Random motivational quotes
  const quotes = [
    "Study hard what interests you the most in the most undisciplined way possible.",
    "Learning is not attained by chance, it must be sought for with ardor and diligence.",
    "The beautiful thing about learning is that no one can take it away from you.",
    "The expert in anything was once a beginner.",
    "Education is not the filling of a pail, but the lighting of a fire.",
    "Education is the most powerful weapon which you can use to change the world.",
    "The more that you read, the more things you will know. The more that you learn, the more places you'll go."
  ];

  const [quote, setQuote] = useState('');

  useEffect(() => {
    // Set random quote on mount
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    setQuote(randomQuote);
  }, []);

  // Animation variants
  const inputVariants = {
    focus: { scale: 1.02, borderColor: '#3B82F6', boxShadow: '0 0 0 2px rgba(59, 130, 246, 0.3)', transition: { duration: 0.2 } },
    blur: { scale: 1, borderColor: '#D1D5DB', boxShadow: 'none', transition: { duration: 0.2 } },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
  };

  const errorVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  };

  const successVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.4, type: 'spring', stiffness: 200 } },
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1
      }
    }
  };

  const getEmoji = (code) => {
    code = code.toLowerCase();
    // Check if code starts with any of the keys in courseEmojis
    for (const prefix in courseEmojis) {
      if (code.startsWith(prefix)) {
        return courseEmojis[prefix];
      }
    }
    return courseEmojis.default;
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setError('');
    setSuccess('');

    // Validation
    if (!courseName.trim() || !courseCode.trim() || !unit) {
      setError('All fields are required');
      return;
    }
    if (isNaN(unit) || unit < 1 || unit > 6) {
      setError('Units must be a number between 1 and 6');
      return;
    }
    if (courseName.length > 50) {
      setError('Course name must be under 50 characters');
      return;
    }

    const newCourse = { 
      courseName: courseName.trim(), 
      courseCode: courseCode.trim(), 
      unit: parseInt(unit),
      emoji: getEmoji(courseCode.trim())
    };
    
    setCourses([...courses, newCourse]);
    setCourseName('');
    setCourseCode('');
    setUnit('');
    
    // Show success message
    setSuccess(`${newCourse.emoji} ${newCourse.courseName} added successfully!`);
    
    // Clear success message after 3 seconds
    setTimeout(() => {
      setSuccess('');
    }, 3000);

    // Show confetti when adding 3rd course
    if (courses.length === 2) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
    }
  };

  const handleDelete = (index) => {
    setCourses(courses.filter((_, i) => i !== index));
  };


 
  const totalUnits = courses.reduce((sum, course) => sum + course.unit, 0);
  const unitPercent = Math.min(totalUnits / 18 * 100, 100); // Assuming 18 is max units

  return (
    <>
      <Nav />
      <div className={`min-h-screen bg-gradient-to-br ${themeColors[theme].bg} flex flex-col mt-15 items-center justify-center p-6 transition-colors duration-700`}>
        {showConfetti && (
          <div className="fixed inset-0 pointer-events-none z-50">
            {[...Array(50)].map((_, i) => {
              const size = Math.random() * 10 + 5;
              const color = ['#FF6B6B', '#4ECDC4', '#FFE66D', '#1A535C', '#FF9F1C'][Math.floor(Math.random() * 5)];
              const left = Math.random() * 100;
              const animDuration = Math.random() * 3 + 2;
              const delay = Math.random() * 0.5;
              
              return (
                <motion.div 
                  key={i}
                  className="absolute rounded-full"
                  style={{ 
                    width: size, 
                    height: size, 
                    backgroundColor: color,
                    left: `${left}%`,
                    top: '-10px',
                  }}
                  initial={{ y: -20, opacity: 1 }}
                  animate={{ 
                    y: window.innerHeight + 20,
                    opacity: [1, 1, 0],
                    rotate: Math.random() * 360
                  }}
                  transition={{ 
                    duration: animDuration, 
                    delay: delay,
                    ease: [0.1, 0.4, 0.8, 1]
                  }}
                />
              );
            })}
          </div>
        )}
        
        <motion.div
          className="mb-8 text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          <motion.h1
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className={`text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r ${themeColors[theme].gradient} mb-4 text-center`}
          >
            Build Your Study Plan
          </motion.h1>
          <p className="text-lg text-gray-700 mb-2 text-center max-w-xl">
            Add your courses to create a personalized study schedule.
          </p>
          <p className="text-sm italic text-gray-500 mb-4">"{quote}"</p>
          
          <motion.button
            onClick={changeTheme}
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
            className={`w-10 h-10 rounded-full flex items-center justify-center text-xl bg-gradient-to-r ${themeColors[theme].gradient} text-white ${themeColors[theme].hover}`}
          >
            🎨
          </motion.button>
        </motion.div>

        <div className="w-full max-w-lg">
          <motion.div 
            className="bg-white rounded-2xl shadow-xl p-8 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <form onSubmit={handleSubmit}>
              <div className="mb-6">
                <label htmlFor="course-name" className="block text-gray-800 text-sm font-semibold mb-2">
                  Course Name
                </label>
                <motion.input
                  type="text"
                  id="course-name"
                  value={courseName}
                  onChange={(e) => setCourseName(e.target.value)}
                  placeholder="e.g., Introduction to Programming"
                  className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-400"
                  variants={inputVariants}
                  whileFocus="focus"
                  initial="blur"
                />
              </div>

              <div className="mb-6">
                <label htmlFor="course-code" className="block text-gray-800 text-sm font-semibold mb-2">
                  Course Code
                </label>
                <motion.input
                  type="text"
                  id="course-code"
                  value={courseCode}
                  onChange={(e) => setCourseCode(e.target.value)}
                  placeholder="e.g., CS101"
                  className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-400"
                  variants={inputVariants}
                  whileFocus="focus"
                  initial="blur"
                />
              </div>

              <div className="mb-6">
                <label htmlFor="unit" className="block text-gray-800 text-sm font-semibold mb-2">
                  Units
                </label>
                <motion.div className="flex items-center">
                  <motion.input
                    type="range"
                    id="unit-range"
                    min="1"
                    max="6"
                    value={unit || 1}
                    onChange={(e) => setUnit(e.target.value)}
                    className="w-full mr-4"
                  />
                  <motion.input
                    type="number"
                    id="unit"
                    value={unit}
                    onChange={(e) => setUnit(e.target.value)}
                    placeholder="e.g., 3"
                    min="1"
                    max="6"
                    className="w-16 px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-400 text-center"
                    variants={inputVariants}
                    whileFocus="focus"
                    initial="blur"
                  />
                </motion.div>
              </div>

              <AnimatePresence>
                {error && (
                  <motion.p
                    variants={errorVariants}
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                    className="text-red-500 text-sm mb-4 bg-red-50 p-3 rounded-lg"
                  >
                    {error}
                  </motion.p>
                )}
              </AnimatePresence>

              <AnimatePresence>
                {success && (
                  <motion.p
                    variants={successVariants}
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                    className="text-green-500 text-sm mb-4 bg-green-50 p-3 rounded-lg"
                  >
                    {success}
                  </motion.p>
                )}
              </AnimatePresence>

              <motion.button
                type="submit"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`w-full bg-gradient-to-r ${themeColors[theme].gradient} text-white font-bold py-3 rounded-lg ${themeColors[theme].hover} transition-all duration-300`}
              >
                Add Course
              </motion.button>
            </form>
          </motion.div>
          
          {courses.length > 0 && (
            <motion.div 
              className="mb-8 bg-white rounded-2xl shadow-xl p-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-gray-800">Your Courses ({courses.length}/6)</h2>
                <span className={`text-sm ${courses.length < 3 ? 'text-amber-600' : 'text-green-600'}`}>
                  {courses.length < 3 ? `Add ${3 - courses.length} more to proceed` : 'Ready to go!'}
                </span>
              </div>
              
              <div className="mb-4">
                <div className="h-2 bg-gray-200 rounded-full">
                  <motion.div 
                    className={`h-2 rounded-full bg-gradient-to-r ${themeColors[theme].gradient}`}
                    initial={{ width: 0 }}
                    animate={{ width: `${unitPercent}%` }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>0 units</span>
                  <span>Total: {totalUnits} units</span>
                  <span>18 units</span>
                </div>
              </div>
              
              <motion.div 
                className="grid gap-4"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                <AnimatePresence>
                  {courses.map((course, index) => (
                    <motion.div
                      key={index}
                      variants={cardVariants}
                      initial="hidden"
                      animate="visible"
                      exit="hidden"
                      className={`bg-white rounded-lg shadow-md p-6 flex justify-between items-center border-l-4 ${themeColors[theme].border} hover:shadow-lg transition-shadow duration-300`}
                      whileHover={{ y: -5, transition: { duration: 0.2 } }}
                    >
                      <div className="flex items-center">
                        <span className="text-2xl mr-3">{course.emoji}</span>
                        <div>
                          <p className={`text-lg font-semibold ${themeColors[theme].text}`}>{course.courseName}</p>
                          <p className="text-gray-600">Code: {course.courseCode}</p>
                          <div className="flex items-center mt-1">
                            <p className="text-gray-600 mr-2">Units: {course.unit}</p>
                            <div className="flex">
                              {[...Array(course.unit)].map((_, i) => (
                                <motion.div 
                                  key={i}
                                  className={`w-2 h-2 rounded-full ${themeColors[theme].text} mr-1`}
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                  transition={{ delay: i * 0.1 }}
                                />
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleDelete(index)}
                        className="text-red-500 hover:text-red-700 bg-red-50 p-2 rounded-full"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                      </motion.button>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
              
              {courses.length >= 3 && (
                <motion.div 
                  className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.5 }}
                >
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => navigate('/timetable', { state: { courses } })}
                    className={`w-full bg-gradient-to-r ${themeColors[theme].gradient} text-white font-bold py-3 rounded-lg ${themeColors[theme].hover} transition-all duration-300 flex items-center justify-center`}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                    </svg>
                    Go to Timetable
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => navigate('/syllabus', { state: { courses } })}
                    className={`w-full bg-gradient-to-r ${themeColors[theme].gradient} text-white font-bold py-3 rounded-lg ${themeColors[theme].hover} transition-all duration-300 flex items-center justify-center`}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
                    </svg>
                    Go to Syllabus
                  </motion.button>
                </motion.div>
              )}
            </motion.div>
          )}
        </div>
      </div>
    </>
  );
}