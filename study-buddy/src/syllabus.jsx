import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Calendar, Globe, CheckCircle, AlertCircle, Award, ChevronDown, ChevronUp, Download, Book, Coffee, Zap } from 'lucide-react';
import Nav from './navbar.jsx';
import { useTheme } from './themecontext.jsx';

export default function SyllabusInput() {
  const location = useLocation();
  const navigate = useNavigate();
  const { courses = [] } = location.state || {};
  const [selectedCourse, setSelectedCourse] = useState('');
  const [topics, setTopics] = useState(['', '', '']);
  const [learningStyle, setLearningStyle] = useState('balanced');
  const [difficulty, setDifficulty] = useState('intermediate');
  const [syllabus, setSyllabus] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [expandedWeek, setExpandedWeek] = useState(null);
  const [generationComplete, setGenerationComplete] = useState(false);

  const { theme, themeColors } = useTheme();

  const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

  useEffect(() => {
    if (courses.length === 0) {
      setError('No courses available. Please add courses first.');
    }
  }, [courses]);

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

  const listItemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: i => ({
      opacity: 1,
      x: 0,
      transition: { delay: i * 0.1, duration: 0.3 }
    }),
    hover: { scale: 1.02, x: 5, transition: { duration: 0.2 } }
  };

  const handleTopicChange = (index, value) => {
    const newTopics = [...topics];
    newTopics[index] = value;
    setTopics(newTopics);
  };

  const toggleWeekExpansion = (weekNum) => {
    setExpandedWeek(expandedWeek === weekNum ? null : weekNum);
  };

  const getDifficultyEmoji = () => {
    switch (difficulty) {
      case 'beginner': return '☕ Easy';
      case 'intermediate': return '☕☕ Moderate';
      case 'advanced': return '☕☕☕ Challenging';
      default: return '☕☕ Moderate';
    }
  };

  const getDifficultyColor = () => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-amber-100 text-amber-800';
      case 'advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-amber-100 text-amber-800';
    }
  };

  const getLearningStyleIcon = () => {
    switch (learningStyle) {
      case 'visual': return <Globe size={18} />;
      case 'practical': return <Coffee size={18} />;
      case 'theoretical': return <Book size={18} />;
      case 'balanced': return <Zap size={18} />;
      default: return <Zap size={18} />;
    }
  };

  const getLearningStyleDescription = () => {
    switch (learningStyle) {
      case 'visual': return 'Emphasis on visual resources like videos and diagrams';
      case 'practical': return 'Focus on hands-on exercises and practical applications';
      case 'theoretical': return 'Deep theoretical foundations and academic papers';
      case 'balanced': return 'Mix of theoretical and practical resources';
      default: return 'Mix of theoretical and practical resources';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSyllabus([]);
    setGenerationComplete(false);

    if (!selectedCourse) {
      setError('Please select a course.');
      return;
    }
    if (topics.some(topic => !topic.trim())) {
      setError('Please enter all three topics.');
      return;
    }
    if (topics.some(topic => topic.length > 50)) {
      setError('Each topic must be under 50 characters.');
      return;
    }
    const uniqueTopics = new Set(topics.map(t => t.trim()));
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

    const prompt = `
      Generate a creative and engaging reading syllabus for the course "${selectedCourseData.courseName}" (Code: ${selectedCourseData.courseCode}) with the following topics: "${topics[0]}", "${topics[1]}", "${topics[2]}". 
      The syllabus is for a 4-week period, with weekly readings or resources for each topic.
      
      Learning style preference: ${learningStyle.toUpperCase()} 
      Difficulty level: ${difficulty.toUpperCase()}
      
      For each week:
      1. Include a creative, engaging week title that combines the topic with a pop culture reference, pun or metaphor
      2. Include at least one relevant online resource (articles, websites, or video lectures) with a valid URL
      3. Add a weekly challenge/activity that students can complete
      4. Include an inspirational quote related to the topic
      
      Return the syllabus as a JSON array of objects, where each object has:
      { 
        "week": number, 
        "title": string,
        "topic": string, 
        "readings": string, 
        "links": array of strings,
        "challenge": string,
        "quote": string,
        "author": string
      }
      
      Ensure readings are concise, suitable for ${difficulty} level, with a ${learningStyle} learning approach. Links should be functional, reputable sources.
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
      setGenerationComplete(true);
      setExpandedWeek(1);
    } catch (err) {
      setError(`Failed to generate syllabus: ${err.message}`);
      console.error('Error details:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPDF = () => {
    alert('PDF download feature would be implemented here!');
  };

  const generateRandomTopics = () => {
    const exampleTopics = [
      ['Artificial Intelligence', 'Machine Learning', 'Neural Networks'],
      ['Data Structures', 'Algorithms', 'Computational Complexity'],
      ['Cloud Computing', 'Serverless Architecture', 'DevOps'],
      ['Blockchain', 'Cryptocurrency', 'Smart Contracts'],
      ['Marketing Analytics', 'Consumer Behavior', 'Brand Strategy'],
      ['Leadership Styles', 'Organizational Culture', 'Change Management'],
      ['Financial Markets', 'Investment Strategies', 'Risk Management'],
      ['Color Theory', 'Typography', 'Visual Composition'],
      ['Design Thinking', 'User Experience', 'Interface Design'],
      ['Quantum Physics', 'String Theory', 'Cosmology'],
      ['Molecular Biology', 'Genetics', 'CRISPR Technology'],
      ['Climate Change', 'Sustainable Energy', 'Conservation'],
      ['Existentialism', 'Postmodernism', 'Critical Theory'],
      ['World Mythology', 'Archetypal Symbols', 'Comparative Religion'],
      ['Globalization', 'Cultural Identity', 'Diaspora Studies']
    ];
    
    const randomSet = exampleTopics[Math.floor(Math.random() * exampleTopics.length)];
    setTopics([...randomSet]);
  };

  return (
    <>
      <Nav />
      <div className={`min-h-screen bg-gradient-to-br ${themeColors[theme].bg} flex flex-col items-center justify-center p-6 pt-20`}>
        <motion.h1
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className={`text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r ${themeColors[theme].gradient} mb-2 text-center`}
        >
          Craft Your Creative Syllabus
        </motion.h1>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className={`text-lg ${themeColors[theme].text} mb-8 text-center max-w-xl`}
        >
          <p>Transform your course into an engaging learning journey with a personalized syllabus.</p>
          <div className="flex items-center justify-center mt-2 space-x-2">
            <span className="flex items-center text-sm px-2 py-1 rounded-full bg-white">
              <BookOpen size={14} className="mr-1" /> Personalized
            </span>
            <span className="flex items-center text-sm px-2 py-1 rounded-full bg-white">
              <Calendar size={14} className="mr-1" /> 4-Week Plan
            </span>
            <span className="flex items-center text-sm px-2 py-1 rounded-full bg-white">
              <Globe size={14} className="mr-1" /> Curated Resources
            </span>
          </div>
        </motion.div>

        {error && (
          <motion.div
            variants={errorVariants}
            initial="hidden"
            animate="visible"
            className="w-full max-w-2xl text-center bg-red-50 p-4 rounded-lg mb-6"
          >
            <div className="flex items-center justify-center mb-2">
              <AlertCircle size={20} className="text-red-500 mr-2" />
              <p className="text-red-500 text-lg">{error}</p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/course-input')}
              className={`bg-gradient-to-r ${themeColors[theme].gradient} ${themeColors[theme].hover} text-white font-bold py-3 px-6 rounded-lg transition-all duration-300`}
            >
              Go to Course Input
            </motion.button>
          </motion.div>
        )}

        {!error && (
          <div className="w-full max-w-lg">
            <motion.div 
              className="bg-white/10 backdrop-blur-md rounded-2xl shadow-xl p-8 mb-6 border"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
            >
              <form onSubmit={handleSubmit}>
                <div className="mb-6">
                  <label
                    htmlFor="course-select"
                    className={`block text-sm font-semibold mb-2 flex items-center ${themeColors[theme].text}`}
                  >
                    <BookOpen size={16} className="mr-2" /> Select Course
                  </label>
                  <motion.select
                    id="course-select"
                    value={selectedCourse}
                    onChange={(e) => setSelectedCourse(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-800 text-white"
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
                  <div className="flex justify-between items-center mb-2">
                    <label className={`block text-sm font-semibold flex items-center ${themeColors[theme].text}`}>
                      <Book size={16} className="mr-2" /> Key Topics
                    </label>
                    <motion.button
                      type="button"
                      onClick={generateRandomTopics}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`text-xs px-2 py-1 rounded bg-gradient-to-r ${themeColors[theme].gradient} ${themeColors[theme].hover} text-white transition-all`}
                    >
                      Inspire Me
                    </motion.button>
                  </div>

                  {topics.map((topic, index) => (
                    <motion.div 
                      key={index} 
                      className="mb-3"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1, duration: 0.3 }}
                    >
                      <motion.input
                        type="text"
                        value={topic}
                        onChange={(e) => handleTopicChange(index, e.target.value)}
                        placeholder={`Topic ${index + 1} (e.g., ${['Quantum Computing', 'Design Thinking', 'Renaissance Art'][index]})`}
                        className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-800 text-white"
                        variants={inputVariants}
                        whileFocus="focus"
                        initial="blur"
                      />
                    </motion.div>
                  ))}
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div>
                    <label
                      htmlFor="learning-style"
                      className={`block text-sm font-semibold mb-2 ${themeColors[theme].text}`}
                    >
                      Learning Style
                    </label>
                    <motion.select
                      id="learning-style"
                      value={learningStyle}
                      onChange={(e) => setLearningStyle(e.target.value)}
                      className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-800 text-white"
                      variants={inputVariants}
                      whileFocus="focus"
                      initial="blur"
                    >
                      <option value="balanced">Balanced</option>
                      <option value="visual">Visual Learner</option>
                      <option value="practical">Practical</option>
                      <option value="theoretical">Theoretical</option>
                    </motion.select>
                  </div>

                  <div>
                    <label
                      htmlFor="difficulty"
                      className={`block text-sm font-semibold mb-2 ${themeColors[theme].text}`}
                    >
                      Difficulty Level
                    </label>
                    <motion.select
                      id="difficulty"
                      value={difficulty}
                      onChange={(e) => setDifficulty(e.target.value)}
                      className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-800 text-white"
                      variants={inputVariants}
                      whileFocus="focus"
                      initial="blur"
                    >
                      <option value="beginner">Beginner</option>
                      <option value="intermediate">Intermediate</option>
                      <option value="advanced">Advanced</option>
                    </motion.select>
                  </div>
                </div>

                <motion.button
                  type="submit"
                  disabled={loading}
                  whileHover={{ scale: !loading ? 1.05 : 1 }}
                  whileTap={{ scale: !loading ? 0.95 : 1 }}
                  className={`w-full py-3 rounded-lg font-bold text-white transition-all duration-300 ${
                    loading
                      ? 'bg-gray-400 cursor-not-allowed'
                      : `bg-gradient-to-r ${themeColors[theme].gradient} ${themeColors[theme].hover}`
                  }`}
                >
                  {loading ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Crafting Your Syllabus...
                    </span>
                  ) : (
                    'Create My Syllabus'
                  )}
                </motion.button>
              </form>
            </motion.div>
          </div>
        )}

        {generationComplete && syllabus.length > 0 && (
          <motion.div 
            className="mt-4 w-full max-w-2xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className={`text-2xl font-bold ${themeColors[theme].text}`}>Your Creative Syllabus</h2>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleDownloadPDF}
                className={`flex items-center text-sm px-3 py-2 rounded-lg bg-gradient-to-r ${themeColors[theme].gradient} ${themeColors[theme].hover} text-white transition-all`}
              >
                <Download size={16} className="mr-1" /> Export PDF
              </motion.button>
            </div>
            
            <div className="bg-white/10 backdrop-blur-md rounded-lg shadow-lg overflow-hidden border">
              {selectedCourse && (
                <div className={`p-4 bg-gradient-to-r ${themeColors[theme].gradient} text-white`}>
                  <h2 className="text-lg font-semibold">
                    {courses.find(c => c.courseCode === selectedCourse)?.courseName} ({selectedCourse})
                  </h2>
                  <div className="flex items-center mt-2 text-sm">
                    <div className="flex items-center mr-4">
                      {getLearningStyleIcon()}
                      <span className="ml-1">{getLearningStyleDescription()}</span>
                    </div>
                    <div className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor()}`}>
                      {getDifficultyEmoji()}
                    </div>
                  </div>
                </div>
              )}
              
              <div className="p-6">
                <AnimatePresence>
                  {syllabus.map((entry, index) => (
                    <motion.div
                      key={index}
                      variants={cardVariants}
                      initial="hidden"
                      animate="visible"
                      transition={{ delay: index * 0.1 }}
                      className={`mb-4 p-4 rounded-lg border ${themeColors[theme].border} overflow-hidden`}
                    >
                      <div 
                        className="cursor-pointer"
                        onClick={() => toggleWeekExpansion(entry.week)}
                      >
                        <div className="flex justify-between items-center">
                          <div className="flex items-start">
                            <div className={`h-8 w-8 rounded-full flex items-center justify-center bg-gradient-to-r ${themeColors[theme].gradient} mr-3 text-white`}>
                              {entry.week}
                            </div>
                            <div>
                              <h3 className={`text-lg font-semibold ${themeColors[theme].text}`}>
                                {entry.title || `Week ${entry.week}: ${entry.topic}`}
                              </h3>
                              <p className={`text-sm ${themeColors[theme].text}`}>{entry.topic}</p>
                            </div>
                          </div>
                          <motion.div
                            animate={{ rotate: expandedWeek === entry.week ? 180 : 0 }}
                            transition={{ duration: 0.3 }}
                          >
                            <ChevronDown size={20} className="text-gray-300" />
                          </motion.div>
                        </div>
                      </div>
                      
                      <AnimatePresence>
                        {expandedWeek === entry.week && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3 }}
                            className="mt-4 overflow-hidden"
                          >
                            <div className="border-t pt-4 mt-2">
                              <div className="mb-3">
                                <h4 className={`text-sm font-semibold mb-1 ${themeColors[theme].text}`}>Readings & Resources</h4>
                                <p className={`text-sm ${themeColors[theme].text}`}>{entry.readings}</p>
                              </div>
                              
                              {entry.links && entry.links.length > 0 && (
                                <div className="mb-3">
                                  <h4 className={`text-sm font-semibold mb-1 ${themeColors[theme].text}`}>Online Resources</h4>
                                  <ul className="space-y-1">
                                    {entry.links.map((link, linkIndex) => (
                                      <motion.li 
                                        key={linkIndex}
                                        custom={linkIndex}
                                        variants={listItemVariants}
                                        initial="hidden"
                                        animate="visible"
                                        whileHover="hover"
                                        className="flex items-center text-sm"
                                      >
                                        <Globe size={14} className={`mr-2 ${themeColors[theme].text}`} />
                                        <a
                                          href={link}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className={`${themeColors[theme].text} hover:underline`}
                                        >
                                          {link.length > 60 ? link.substring(0, 60) + '...' : link}
                                        </a>
                                      </motion.li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                              
                              {entry.challenge && (
                                <div className="mb-3">
                                  <h4 className={`text-sm font-semibold mb-1 flex items-center ${themeColors[theme].text}`}>
                                    <Award size={14} className="mr-1" /> Weekly Challenge
                                  </h4>
                                  <p className={`text-sm ${themeColors[theme].text}`}>{entry.challenge}</p>
                                </div>
                              )}
                              
                              {entry.quote && (
                                <div className={`mt-4 p-3 rounded-lg bg-white/10 backdrop-blur-md italic`}>
                                  <p className={`text-sm ${themeColors[theme].text}`}>"{entry.quote}"</p>
                                  {entry.author && <p className={`text-right text-xs mt-1 ${themeColors[theme].text}`}>— {entry.author}</p>}
                                </div>
                              )}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  ))}
                </AnimatePresence>
                
                <div className="flex mt-6 space-x-4">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => navigate('/timetable', { state: { courses } })}
                    className={`flex-1 bg-gradient-to-r ${themeColors[theme].gradient} ${themeColors[theme].hover} text-white font-bold py-3 rounded-lg transition-all duration-300 flex items-center justify-center`}
                  >
                    <Calendar size={18} className="mr-2" /> View Timetable
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      setSyllabus([]);
                      setGenerationComplete(false);
                    }}
                    className={`px-4 py-3 rounded-lg border ${themeColors[theme].border} text-gray-300 hover:bg-gray-800/20 transition-all duration-300`}
                  >
                    Start Over
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </>
  );
}