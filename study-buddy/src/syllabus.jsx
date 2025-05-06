import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Calendar, Globe, CheckCircle, AlertCircle, Award, ChevronDown, ChevronUp, Download, Book, Coffee, Zap } from 'lucide-react';
import Nav from './navbar.jsx';

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
  const [themeColor, setThemeColor] = useState('blue');

  // Gemini API key from environment variable
  const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

  // Redirect to course input if no courses are available
  useEffect(() => {
    if (courses.length === 0) {
      setError('No courses available. Please add courses first.');
    }
  }, [courses]);

  // Get theme colors based on selected course
  useEffect(() => {
    if (selectedCourse) {
      const courseIndex = courses.findIndex(course => course.courseCode === selectedCourse);
      const themes = ['blue', 'purple', 'emerald', 'amber', 'rose'];
      setThemeColor(themes[courseIndex % themes.length]);
    }
  }, [selectedCourse, courses]);

  // Theme color mappings
  const themeColors = {
    blue: {
      primary: 'from-blue-500 to-blue-700',
      secondary: 'bg-blue-100 text-blue-800',
      accent: 'text-blue-600',
      border: 'border-blue-200',
      button: 'from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800',
      link: 'text-blue-500'
    },
    purple: {
      primary: 'from-purple-500 to-purple-700',
      secondary: 'bg-purple-100 text-purple-800',
      accent: 'text-purple-600',
      border: 'border-purple-200',
      button: 'from-purple-500 to-purple-700 hover:from-purple-600 hover:to-purple-800',
      link: 'text-purple-500'
    },
    emerald: {
      primary: 'from-emerald-500 to-emerald-700',
      secondary: 'bg-emerald-100 text-emerald-800',
      accent: 'text-emerald-600',
      border: 'border-emerald-200',
      button: 'from-emerald-500 to-emerald-700 hover:from-emerald-600 hover:to-emerald-800',
      link: 'text-emerald-500'
    },
    amber: {
      primary: 'from-amber-500 to-amber-700',
      secondary: 'bg-amber-100 text-amber-800',
      accent: 'text-amber-600',
      border: 'border-amber-200',
      button: 'from-amber-500 to-amber-700 hover:from-amber-600 hover:to-amber-800',
      link: 'text-amber-500'
    },
    rose: {
      primary: 'from-rose-500 to-rose-700',
      secondary: 'bg-rose-100 text-rose-800',
      accent: 'text-rose-600',
      border: 'border-rose-200',
      button: 'from-rose-500 to-rose-700 hover:from-rose-600 hover:to-rose-800',
      link: 'text-rose-500'
    }
  };

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

    // Validation
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

    // Construct prompt for Gemini API
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
      // Auto-expand first week
      setExpandedWeek(1);
    } catch (err) {
      setError(`Failed to generate syllabus: ${err.message}`);
      console.error('Error details:', err);
    } finally {
      setLoading(false);
    }
  };

  // Function to generate PDF (mock for now)
  const handleDownloadPDF = () => {
    alert('PDF download feature would be implemented here!');
  };

  // Function to randomize topics for inspiration
  const generateRandomTopics = () => {
    const exampleTopics = [
      // Computer Science
      ['Artificial Intelligence', 'Machine Learning', 'Neural Networks'],
      ['Data Structures', 'Algorithms', 'Computational Complexity'],
      ['Cloud Computing', 'Serverless Architecture', 'DevOps'],
      ['Blockchain', 'Cryptocurrency', 'Smart Contracts'],
      
      // Business
      ['Marketing Analytics', 'Consumer Behavior', 'Brand Strategy'],
      ['Leadership Styles', 'Organizational Culture', 'Change Management'],
      ['Financial Markets', 'Investment Strategies', 'Risk Management'],
      
      // Art & Design
      ['Color Theory', 'Typography', 'Visual Composition'],
      ['Design Thinking', 'User Experience', 'Interface Design'],
      
      // Science
      ['Quantum Physics', 'String Theory', 'Cosmology'],
      ['Molecular Biology', 'Genetics', 'CRISPR Technology'],
      ['Climate Change', 'Sustainable Energy', 'Conservation'],
      
      // Humanities
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
      <div className={`min-h-screen bg-gradient-to-br from-${themeColor}-50 via-purple-50 to-pink-50 flex flex-col items-center justify-center p-6 pt-20`}>
        <motion.h1
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className={`text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r ${themeColors[themeColor].primary} mb-2 text-center`}
        >
          Craft Your Creative Syllabus
        </motion.h1>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="text-lg text-gray-700 mb-8 text-center max-w-xl"
        >
          <p>Transform your course into an engaging learning journey with a personalized syllabus.</p>
          <div className="flex items-center justify-center mt-2 space-x-2">
            <span className="flex items-center text-sm px-2 py-1 rounded-full bg-gray-100">
              <BookOpen size={14} className="mr-1" /> Personalized
            </span>
            <span className="flex items-center text-sm px-2 py-1 rounded-full bg-gray-100">
              <Calendar size={14} className="mr-1" /> 4-Week Plan
            </span>
            <span className="flex items-center text-sm px-2 py-1 rounded-full bg-gray-100">
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
              className={`bg-gradient-to-r ${themeColors[themeColor].button} text-white font-bold py-3 px-6 rounded-lg transition-all duration-300`}
            >
              Go to Course Input
            </motion.button>
          </motion.div>
        )}

        {!error && (
          <div className="w-full max-w-lg">
            <motion.div 
              className="bg-white rounded-2xl shadow-xl p-8 mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
            >
              <form onSubmit={handleSubmit}>
                <div className="mb-6">
                  <label
                    htmlFor="course-select"
                    className="block text-gray-800 text-sm font-semibold mb-2 flex items-center"
                  >
                    <BookOpen size={16} className="mr-2" /> Select Course
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
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-gray-800 text-sm font-semibold flex items-center">
                      <Book size={16} className="mr-2" /> Key Topics
                    </label>
                    <motion.button
                      type="button"
                      onClick={generateRandomTopics}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="text-xs px-2 py-1 rounded bg-gray-100 text-gray-600 hover:bg-gray-200 transition-all"
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
                        className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-400"
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
                      className="block text-gray-800 text-sm font-semibold mb-2"
                    >
                      Learning Style
                    </label>
                    <motion.select
                      id="learning-style"
                      value={learningStyle}
                      onChange={(e) => setLearningStyle(e.target.value)}
                      className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-400"
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
                      className="block text-gray-800 text-sm font-semibold mb-2"
                    >
                      Difficulty Level
                    </label>
                    <motion.select
                      id="difficulty"
                      value={difficulty}
                      onChange={(e) => setDifficulty(e.target.value)}
                      className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-400"
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
                      : `bg-gradient-to-r ${themeColors[themeColor].button}`
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
              <h2 className={`text-2xl font-bold ${themeColors[themeColor].accent}`}>Your Creative Syllabus</h2>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleDownloadPDF}
                className="flex items-center text-sm px-3 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-all"
              >
                <Download size={16} className="mr-1" /> Export PDF
              </motion.button>
            </div>
            
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              {selectedCourse && (
                <div className={`p-4 bg-gradient-to-r ${themeColors[themeColor].primary} text-white`}>
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
                      className={`mb-4 p-4 rounded-lg border ${themeColors[themeColor].border} overflow-hidden`}
                    >
                      <div 
                        className="cursor-pointer"
                        onClick={() => toggleWeekExpansion(entry.week)}
                      >
                        <div className="flex justify-between items-center">
                          <div className="flex items-start">
                            <div className={`h-8 w-8 rounded-full flex items-center justify-center ${themeColors[themeColor].secondary} mr-3`}>
                              {entry.week}
                            </div>
                            <div>
                              <h3 className={`text-lg font-semibold ${themeColors[themeColor].accent}`}>
                                {entry.title || `Week ${entry.week}: ${entry.topic}`}
                              </h3>
                              <p className="text-gray-600 text-sm">{entry.topic}</p>
                            </div>
                          </div>
                          <motion.div
                            animate={{ rotate: expandedWeek === entry.week ? 180 : 0 }}
                            transition={{ duration: 0.3 }}
                          >
                            <ChevronDown size={20} className="text-gray-500" />
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
                                <h4 className="text-sm font-semibold text-gray-700 mb-1">Readings & Resources</h4>
                                <p className="text-gray-600 text-sm">{entry.readings}</p>
                              </div>
                              
                              {entry.links && entry.links.length > 0 && (
                                <div className="mb-3">
                                  <h4 className="text-sm font-semibold text-gray-700 mb-1">Online Resources</h4>
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
                                        <Globe size={14} className={`mr-2 ${themeColors[themeColor].link}`} />
                                        <a
                                          href={link}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className={`${themeColors[themeColor].link} hover:underline`}
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
                                  <h4 className="text-sm font-semibold text-gray-700 mb-1 flex items-center">
                                    <Award size={14} className="mr-1" /> Weekly Challenge
                                  </h4>
                                  <p className="text-gray-600 text-sm">{entry.challenge}</p>
                                </div>
                              )}
                              
                              {entry.quote && (
                                <div className={`mt-4 p-3 rounded-lg ${themeColors[themeColor].secondary} italic`}>
                                  <p className="text-sm">"{entry.quote}"</p>
                                  {entry.author && <p className="text-right text-xs mt-1">— {entry.author}</p>}
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
                    className={`flex-1 bg-gradient-to-r ${themeColors[themeColor].button} text-white font-bold py-3 rounded-lg transition-all duration-300 flex items-center justify-center`}
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
                    className="px-4 py-3 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100 transition-all duration-300"
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