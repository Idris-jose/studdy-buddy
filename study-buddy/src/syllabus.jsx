import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Nav from './navbar.jsx';

export default function SyllabusInput() {
  const location = useLocation();
  const navigate = useNavigate();
  const { courses = [] } = location.state || {};
  const [selectedCourse, setSelectedCourse] = useState('');
  const [topic1, setTopic1] = useState('');
  const [topic2, setTopic2] = useState('');
  const [topic3, setTopic3] = useState('');
  const [syllabus, setSyllabus] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Gemini API key from environment variable
  const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

  // Redirect to course input if no courses are available
  useEffect(() => {
    if (courses.length === 0) {
      setError('No courses available. Please add courses first.');
    }
  }, [courses]);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSyllabus([]);

    // Validation
    if (!selectedCourse) {
      setError('Please select a course.');
      return;
    }
    if (!topic1.trim() || !topic2.trim() || !topic3.trim()) {
      setError('Please enter all three topics.');
      return;
    }
    if ([topic1, topic2, topic3].some((topic) => topic.length > 50)) {
      setError('Each topic must be under 50 characters.');
      return;
    }
    const uniqueTopics = new Set([topic1.trim(), topic2.trim(), topic3.trim()]);
    if (uniqueTopics.size < 3) {
      setError('Topics must be unique.');
      return;
    }
    if (!GEMINI_API_KEY) {
      setError('API configuration error. Please contact support.');
      return;
    }

    setLoading(true);
    const selectedCourseData = courses.find(
      (course) => course.courseCode === selectedCourse
    );

    // Construct prompt for Gemini API
    const prompt = `
      Generate a reading syllabus for the course "${selectedCourseData.courseName}" (Code: ${selectedCourseData.courseCode}) with the following topics: "${topic1}", "${topic2}", "${topic3}". 
      The syllabus should cover a 4-week period, with weekly readings or resources for each topic. 
      For each week, include at least one relevant, accessible online resource (e.g., open-access articles, educational websites, or video lectures) with a valid URL.
      Return the syllabus as a JSON array of objects, where each object has { "week": number, "topic": string, "readings": string, "links": array of strings }. 
      Ensure readings are concise, suitable for university-level study, and links are functional, reputable sources.
    `;

    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: { response_mime_type: 'application/json' },
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }

      const data = await response.json();

      if (!data.candidates || !data.candidates[0]?.content?.parts[0]?.text) {
        throw new Error('No syllabus data returned from API');
      }

      const content = data.candidates[0].content.parts[0].text;
      const parsedSyllabus = JSON.parse(content);

      if (!Array.isArray(parsedSyllabus)) {
        throw new Error('Syllabus is not an array');
      }

      setSyllabus(parsedSyllabus);
    } catch (err) {
      setError(`Failed to generate syllabus: ${err.message}`);
      console.error('Error details:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Nav />
      <div className="min-h-screen mt-10 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex flex-col items-center justify-center p-6">
        <motion.h1
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-purple-700 mb-6 text-center"
        >
          Craft Your Course Syllabus
        </motion.h1>
        <p className="text-lg text-gray-700 mb-8 text-center max-w-xl">
          Create a structured syllabus with key topics and access curated online resources. Tip: Use the provided links to deepen your understanding of each topic!
        </p>

        {error && (
          <motion.div
            variants={errorVariants}
            initial="hidden"
            animate="visible"
            className="w-full max-w-2xl text-center bg-red-50 p-4 rounded-lg"
          >
            <p className="text-red-500 text-lg mb-4">{error}</p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/course-input')}
              className="bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold py-3 px-6 rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all duration-300"
            >
              Go to Course Input
            </motion.button>
          </motion.div>
        )}

        {!error && (
          <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl p-8">
            <form onSubmit={handleSubmit}>
              <div className="mb-6">
                <label
                  htmlFor="course-select"
                  className="block text-gray-800 text-sm font-semibold mb-2"
                >
                  Select Course
                </label>
                <motion.select
                  id="course-select"
                  value={selectedCourse}
                  onChange={(e) => setSelectedCourse(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-400"
                  variants={inputVariants}
                  whileFocus="focus"
                  initial="blur"
                >
                  <option value="">Select a course</option>
                  {courses.map((course) => (
                    <option key={course.courseCode} value={course.courseCode}>
                      {course.courseName} ({course.courseCode})
                    </option>
                  ))}
                </motion.select>
              </div>

              <div className="mb-6">
                <label
                  htmlFor="topic1"
                  className="block text-gray-800 text-sm font-semibold mb-2"
                >
                  Topic 1
                </label>
                <motion.input
                  type="text"
                  id="topic1"
                  value={topic1}
                  onChange={(e) => setTopic1(e.target.value)}
                  placeholder="e.g., Object-Oriented Programming"
                  className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-400"
                  variants={inputVariants}
                  whileFocus="focus"
                  initial="blur"
                />
              </div>

              <div className="mb-6">
                <label
                  htmlFor="topic2"
                  className="block text-gray-800 text-sm font-semibold mb-2"
                >
                  Topic 2
                </label>
                <motion.input
                  type="text"
                  id="topic2"
                  value={topic2}
                  onChange={(e) => setTopic2(e.target.value)}
                  placeholder="e.g., Data Structures"
                  className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-400"
                  variants={inputVariants}
                  whileFocus="focus"
                  initial="blur"
                />
              </div>

              <div className="mb-6">
                <label
                  htmlFor="topic3"
                  className="block text-gray-800 text-sm font-semibold mb-2"
                >
                  Topic 3
                </label>
                <motion.input
                  type="text"
                  id="topic3"
                  value={topic3}
                  onChange={(e) => setTopic3(e.target.value)}
                  placeholder="e.g., Algorithms"
                  className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-400"
                  variants={inputVariants}
                  whileFocus="focus"
                  initial="blur"
                />
              </div>

              <motion.button
                type="submit"
                disabled={loading}
                whileHover={{ scale: !loading ? 1.05 : 1 }}
                whileTap={{ scale: !loading ? 0.95 : 1 }}
                className={`w-full py-3 rounded-lg font-bold text-white transition-all duration-300 ${
                  loading
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600'
                }`}
              >
                {loading ? 'Generating...' : 'Generate Syllabus'}
              </motion.button>
            </form>
          </div>
        )}

        {syllabus.length > 0 && (
          <div className="mt-10 w-full max-w-2xl">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Your Syllabus</h2>
            <div className="bg-white rounded-lg shadow-md p-6">
              <AnimatePresence>
                {syllabus.map((entry, index) => (
                  <motion.div
                    key={index}
                    variants={cardVariants}
                    initial="hidden"
                    animate="visible"
                    className="mb-4 pb-4 border-b last:border-b-0"
                  >
                    <h3 className="text-lg font-semibold text-blue-600">
                      Week {entry.week}: {entry.topic}
                    </h3>
                    <p className="text-gray-600 mt-2">{entry.readings}</p>
                    {entry.links && entry.links.length > 0 && (
                      <div className="mt-2">
                        <p className="text-sm font-semibold text-gray-800">Resources:</p>
                        <ul className="list-disc pl-5 text-sm">
                          {entry.links.map((link, linkIndex) => (
                            <li key={linkIndex}>
                              <a
                                href={link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-500 hover:underline"
                              >
                                {link}
                              </a>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/timetable', { state: { courses } })}
              className="mt-6 w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold py-3 rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all duration-300"
            >
              View Timetable
            </motion.button>
          </div>
        )}
      </div>
    </>
  );
}