import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Nav from './navbar.jsx';

export default function MainApp() {
  const navigate = useNavigate();

  // Animation variants for cards
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
    hover: { scale: 1.03, transition: { duration: 0.3 } },
  };

  // Animation for the welcome text
  const textVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.8, ease: 'easeOut' } },
  };

  return (
    <>
      <Nav />
      <div className="flex flex-col mt-10 min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
        <div className="flex-1 flex flex-col items-center justify-center p-8">
          <motion.h1
            variants={textVariants}
            initial="hidden"
            animate="visible"
            className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-purple-700 mb-10 text-center"
          >
            Study Buddy: Your Academic Success Partner
          </motion.h1>
          <p className="text-lg text-gray-700 mb-8 text-center max-w-2xl">
            Unlock your potential with personalized study tools designed to organize your courses, optimize your time, and master your subjects.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-5xl">
            <AnimatePresence>
              <motion.div
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                whileHover="hover"
                onClick={() => navigate('/course-input')}
                className="bg-white rounded-2xl shadow-lg p-8 cursor-pointer border-l-4 border-blue-500"
              >
                <h2 className="text-2xl font-bold text-blue-600 mb-3">Course Input</h2>
                <p className="text-gray-600 mb-4">
                  Easily add your courses with details like name, code, and credits to kickstart your study plan.
                </p>
                <span className="text-sm text-blue-500 font-semibold">Why? Structure your semester efficiently!</span>
              </motion.div>

              <motion.div
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                whileHover="hover"
                onClick={() => navigate('/timetable')}
                className="bg-white rounded-2xl shadow-lg p-8 cursor-pointer border-l-4 border-purple-500"
              >
                <h2 className="text-2xl font-bold text-purple-600 mb-3">Timetable</h2>
                <p className="text-gray-600 mb-4">
                  Visualize your personalized study schedule tailored to your courses and learning pace.
                </p>
                <span className="text-sm text-purple-500 font-semibold">Why? Master time management!</span>
              </motion.div>

              <motion.div
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                whileHover="hover"
                onClick={() => navigate('/syllabus')}
                className="bg-white rounded-2xl shadow-lg p-8 cursor-pointer border-l-4 border-pink-500"
              >
                <h2 className="text-2xl font-bold text-pink-600 mb-3.ConcurrentModificationException">Syllabus</h2>
                <p className="text-gray-600 mb-4">
                  Generate detailed syllabi to break down your courses into manageable study units.
                </p>
                <span className="text-sm text-pink-500 font-semibold">Why? Stay ahead of your coursework!</span>
              </motion.div>

              <motion.div
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                whileHover="hover"
                onClick={() => navigate('/tqsolver')}
                className="bg-white rounded-2xl shadow-lg p-8 cursor-pointer border-l-4 border-green-500"
              >
                <h2 className="text-2xl font-bold text-green-600 mb-3">TQ Solver</h2>
                <p className="text-gray-600 mb-4">
                  Tackle tutorial questions with step-by-step guidance and interactive tools.
                </p>
                <span className="text-sm text-green-500 font-semibold">Why? Boost problem-solving skills!</span>
              </motion.div>

              <motion.div
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                className="bg-white rounded-2xl shadow-lg p-8 col-span-1 md:col-span-2 lg:col-span-1"
              >
                <h2 className="text-2xl font-bold text-indigo-600 mb-3">Learning Path</h2>
                <ol className="list-decimal pl-5 text-gray-600 space-y-3">
                  <li>Start by adding your courses to create a foundation.</li>
                  <li>Generate a timetable to organize your study sessions.</li>
                  <li>Build syllabi for a clear roadmap of each course.</li>
                  <li>Use TQ Solver to master challenging concepts.</li>
                </ol>
                <span className="text-sm text-indigo-500 font-semibold block mt-4">
                  Pro Tip: Consistency is key to academic success!
                </span>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </>
  );
}