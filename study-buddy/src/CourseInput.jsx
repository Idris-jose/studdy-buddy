import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Nav from './navbar.jsx';

export default function CourseInput() {
  const [courseName, setCourseName] = useState('');
  const [courseCode, setCourseCode] = useState('');
  const [unit, setUnit] = useState('');
  const [courses, setCourses] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Animation variants
  const inputVariants = {
    focus: { scale: 1.02, borderColor: '#3B82F6', transition: { duration: 0.2 } },
    blur: { scale: 1, borderColor: '#D1D5DB', transition: { duration: 0.2 } },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
  };

  const errorVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setError('');

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

    const newCourse = { courseName: courseName.trim(), courseCode: courseCode.trim(), unit: parseInt(unit) };
    setCourses([...courses, newCourse]);
    setCourseName('');
    setCourseCode('');
    setUnit('');
  };

  const handleDelete = (index) => {
    setCourses(courses.filter((_, i) => i !== index));
  };

  const handleDone = () => {
    if (courses.length < 3) {
      setError('Add at least 3 courses to proceed');
      return;
    }
    navigate('/timetable', { state: { courses } });
  };

  return (
    <>
      <Nav />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex flex-col items-center justify-center p-6">
        <motion.h1
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-purple-700 mb-6 text-center"
        >
          Build Your Study Plan
        </motion.h1>
        <p className="text-lg text-gray-700 mb-8 text-center max-w-xl">
          Add your courses to create a personalized study schedule. Tip: Balance high-unit courses with lighter ones for an effective semester!
        </p>

        <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl p-8">
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
              <motion.input
                type="number"
                id="unit"
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                placeholder="e.g., 3"
                min="1"
                max="6"
                className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-400"
                variants={inputVariants}
                whileFocus="focus"
                initial="blur"
              />
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

            <motion.button
              type="submit"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold py-3 rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all duration-300"
            >
              Add Course
            </motion.button>
          </form>
        </div>

        {courses.length > 0 && (
          <div className="mt-10 w-full max-w-2xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-gray-800">Your Courses ({courses.length}/6)</h2>
              <span className="text-sm text-indigo-600">
                {courses.length < 3 ? `Add ${3 - courses.length} more to proceed` : 'Ready to go!'}
              </span>
            </div>
            <div className="grid gap-4">
              <AnimatePresence>
                {courses.map((course, index) => (
                  <motion.div
                    key={index}
                    variants={cardVariants}
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                    className="bg-white rounded-lg shadow-md p-6 flex justify-between items-center border-l-4 border-blue-500"
                  >
                    <div>
                      <p className="text-lg font-semibold text-blue-600">{course.courseName}</p>
                      <p className="text-gray-600">Code: {course.courseCode}</p>
                      <p className="text-gray-600">Units: {course.unit}</p>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleDelete(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      Delete
                    </motion.button>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
        
            {courses.length >= 3 && (
              <div className="mt-4 flex flex-col sm:flex-row gap-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate('/timetable', { state: { courses } })}
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold py-3 rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all duration-300"
                >
                  Go to Timetable
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate('/syllabus', { state: { courses } })}
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold py-3 rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all duration-300"
                >
                  Go to Syllabus
                </motion.button>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}