import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  BookOpen, 
  Calendar, 
  Globe, 
  AlertCircle, 
  Award, 
  ChevronDown, 
  Download, 
  Book, 
  Monitor, 
  Settings, 
  Users, 
  GraduationCap,
  Clock,
  Target,
  Lightbulb
} from 'lucide-react';
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

  const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

  useEffect(() => {
    if (courses.length === 0) {
      setError('No courses available. Please add courses first.');
    }
  }, [courses]);

  const handleTopicChange = (index, value) => {
    const newTopics = [...topics];
    newTopics[index] = value;
    setTopics(newTopics);
  };

  const toggleWeekExpansion = (weekNum) => {
    setExpandedWeek(expandedWeek === weekNum ? null : weekNum);
  };

  const getDifficultyLevel = () => {
    switch (difficulty) {
      case 'beginner': return { text: 'Beginner Level', color: 'bg-green-100 text-green-800 border-green-200' };
      case 'intermediate': return { text: 'Intermediate Level', color: 'bg-yellow-100 text-yellow-800 border-yellow-200' };
      case 'advanced': return { text: 'Advanced Level', color: 'bg-red-100 text-red-800 border-red-200' };
      default: return { text: 'Intermediate Level', color: 'bg-yellow-100 text-yellow-800 border-yellow-200' };
    }
  };

  const getLearningStyleInfo = () => {
    switch (learningStyle) {
      case 'visual': return { icon: Monitor, text: 'Visual Learning', desc: 'Emphasis on visual resources like videos and diagrams' };
      case 'practical': return { icon: Settings, text: 'Practical Learning', desc: 'Focus on hands-on exercises and practical applications' };
      case 'theoretical': return { icon: Book, text: 'Theoretical Learning', desc: 'Deep theoretical foundations and academic papers' };
      case 'balanced': return { icon: Users, text: 'Balanced Learning', desc: 'Mix of theoretical and practical resources' };
      default: return { icon: Users, text: 'Balanced Learning', desc: 'Mix of theoretical and practical resources' };
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
      1. Include a creative, engaging week title that combines the topic with a professional academic approach
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

  const difficultyInfo = getDifficultyLevel();
  const learningStyleInfo = getLearningStyleInfo();

  return (
    <>
      <Nav />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex flex-col items-center justify-center p-6 pt-20">
        <div className="w-full max-w-4xl">
          <h1 className="text-4xl font-bold text-blue-900 mb-2 text-center">
            Syllabus Generator
          </h1>
          
          <div className="text-blue-700 mb-8 text-center max-w-2xl mx-auto">
            <p className="text-lg mb-4">Create a comprehensive 4-week learning plan tailored to your course and preferences.</p>
            <div className="flex items-center justify-center flex-wrap gap-2">
              <span className="flex items-center text-sm px-3 py-1 rounded-full bg-blue-100 text-blue-800">
                <BookOpen size={14} className="mr-1" /> Personalized Content
              </span>
              <span className="flex items-center text-sm px-3 py-1 rounded-full bg-blue-100 text-blue-800">
                <Calendar size={14} className="mr-1" /> 4-Week Structure
              </span>
              <span className="flex items-center text-sm px-3 py-1 rounded-full bg-blue-100 text-blue-800">
                <Globe size={14} className="mr-1" /> Curated Resources
              </span>
            </div>
          </div>

          {error && (
            <div className="w-full max-w-2xl mx-auto text-center bg-red-50 border border-red-200 rounded-lg p-6 mb-6">
              <div className="flex items-center justify-center mb-4">
                <AlertCircle size={24} className="text-red-500 mr-2" />
                <p className="text-red-700 text-lg font-medium">{error}</p>
              </div>
              <button
                onClick={() => navigate('/course-input')}
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200"
              >
                Go to Course Input
              </button>
            </div>
          )}

          {!error && (
            <div className="w-full max-w-2xl mx-auto">
              <div className="bg-white rounded-lg shadow-md p-8 mb-6">
                <form onSubmit={handleSubmit}>
                  {/* Course Selection */}
                  <div className="mb-6">
                    <label
                      htmlFor="course-select"
                      className="block text-sm font-medium mb-2 flex items-center text-gray-700"
                    >
                      <GraduationCap size={16} className="mr-2 text-blue-600" /> Select Course
                    </label>
                    <select
                      id="course-select"
                      value={selectedCourse}
                      onChange={(e) => setSelectedCourse(e.target.value)}
                      className="w-full px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900"
                    >
                      <option value="">Choose a course...</option>
                      {courses.map((course) => (
                        <option key={course.courseCode} value={course.courseCode}>
                          {course.courseName} ({course.courseCode})
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Topics Section */}
                  <div className="mb-6">
                    <div className="flex justify-between items-center mb-3">
                      <label className="block text-sm font-medium flex items-center text-gray-700">
                        <Book size={16} className="mr-2 text-blue-600" /> Key Topics
                      </label>
                      <button
                        type="button"
                        onClick={generateRandomTopics}
                        className="flex items-center text-sm px-3 py-1 rounded-md bg-blue-100 hover:bg-blue-200 text-blue-700 transition-colors duration-200"
                      >
                        <Lightbulb size={14} className="mr-1" />
                        Get Suggestions
                      </button>
                    </div>

                    {topics.map((topic, index) => (
                      <div key={index} className="mb-3">
                        <input
                          type="text"
                          value={topic}
                          onChange={(e) => handleTopicChange(index, e.target.value)}
                          placeholder={`Topic ${index + 1} (e.g., ${['Quantum Computing', 'Design Thinking', 'Renaissance Art'][index]})`}
                          className="w-full px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900"
                        />
                      </div>
                    ))}
                  </div>

                  {/* Learning Preferences */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div>
                      <label
                        htmlFor="learning-style"
                        className="block text-sm font-medium mb-2 text-gray-700 flex items-center"
                      >
                        <Users size={16} className="mr-2 text-blue-600" /> Learning Style
                      </label>
                      <select
                        id="learning-style"
                        value={learningStyle}
                        onChange={(e) => setLearningStyle(e.target.value)}
                        className="w-full px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900"
                      >
                        <option value="balanced">Balanced Approach</option>
                        <option value="visual">Visual Learning</option>
                        <option value="practical">Practical Focus</option>
                        <option value="theoretical">Theoretical Depth</option>
                      </select>
                    </div>

                    <div>
                      <label
                        htmlFor="difficulty"
                        className="block text-sm font-medium mb-2 text-gray-700 flex items-center"
                      >
                        <Target size={16} className="mr-2 text-blue-600" /> Difficulty Level
                      </label>
                      <select
                        id="difficulty"
                        value={difficulty}
                        onChange={(e) => setDifficulty(e.target.value)}
                        className="w-full px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900"
                      >
                        <option value="beginner">Beginner</option>
                        <option value="intermediate">Intermediate</option>
                        <option value="advanced">Advanced</option>
                      </select>
                    </div>
                  </div>

                  {/* Current Selections Preview */}
                  {(learningStyle !== 'balanced' || difficulty !== 'intermediate') && (
                    <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <h3 className="text-sm font-medium text-blue-900 mb-2">Your Preferences:</h3>
                      <div className="flex flex-wrap gap-2">
                        <div className="flex items-center text-sm px-2 py-1 bg-blue-100 text-blue-800 rounded">
                          {React.createElement(learningStyleInfo.icon, { size: 14, className: "mr-1" })}
                          {learningStyleInfo.text}
                        </div>
                        <div className={`text-sm px-2 py-1 rounded border ${difficultyInfo.color}`}>
                          {difficultyInfo.text}
                        </div>
                      </div>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className={`w-full py-3 rounded-md font-medium text-white transition-colors duration-200 ${
                      loading
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-blue-600 hover:bg-blue-700'
                    }`}
                  >
                    {loading ? (
                      <span className="flex items-center justify-center">
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                        Generating Syllabus...
                      </span>
                    ) : (
                      'Generate Syllabus'
                    )}
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* Generated Syllabus Display */}
          {generationComplete && syllabus.length > 0 && (
            <div className="w-full max-w-4xl mx-auto mt-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                <h2 className="text-2xl font-bold text-blue-900">Your Custom Syllabus</h2>
                <button
                  onClick={handleDownloadPDF}
                  className="flex items-center text-sm px-4 py-2 rounded-md bg-blue-600 hover:bg-blue-700 text-white transition-colors duration-200"
                >
                  <Download size={16} className="mr-2" /> Export PDF
                </button>
              </div>
              
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                {/* Course Header */}
                {selectedCourse && (
                  <div className="p-6 bg-blue-600 text-white">
                    <h2 className="text-xl font-semibold mb-2">
                      {courses.find(c => c.courseCode === selectedCourse)?.courseName} ({selectedCourse})
                    </h2>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-sm">
                      <div className="flex items-center">
                        {React.createElement(learningStyleInfo.icon, { size: 16, className: "mr-1" })}
                        <span>{learningStyleInfo.desc}</span>
                      </div>
                      <div className="hidden sm:block text-blue-200">•</div>
                      <div className={`px-2 py-1 rounded text-xs font-medium ${difficultyInfo.color}`}>
                        {difficultyInfo.text}
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Weekly Content */}
                <div className="p-6">
                  {syllabus.map((entry, index) => (
                    <div
                      key={index}
                      className="mb-4 border border-gray-200 rounded-lg overflow-hidden"
                    >
                      <div 
                        className="cursor-pointer p-4 hover:bg-gray-50 transition-colors duration-200"
                        onClick={() => toggleWeekExpansion(entry.week)}
                      >
                        <div className="flex justify-between items-center">
                          <div className="flex items-center">
                            <div className="w-8 h-8 rounded-full flex items-center justify-center bg-blue-600 text-white font-medium mr-3">
                              {entry.week}
                            </div>
                            <div>
                              <h3 className="text-lg font-semibold text-gray-900">
                                {entry.title || `Week ${entry.week}: ${entry.topic}`}
                              </h3>
                              <p className="text-sm text-gray-600">{entry.topic}</p>
                            </div>
                          </div>
                          <div className={`transform transition-transform duration-200 ${expandedWeek === entry.week ? 'rotate-180' : ''}`}>
                            <ChevronDown size={20} className="text-gray-400" />
                          </div>
                        </div>
                      </div>
                      
                      {expandedWeek === entry.week && (
                        <div className="px-4 pb-4 border-t border-gray-100 bg-gray-50">
                          <div className="pt-4 space-y-4">
                            {/* Readings */}
                            <div>
                              <h4 className="text-sm font-semibold mb-2 flex items-center text-gray-700">
                                <BookOpen size={14} className="mr-1 text-blue-600" />
                                Readings & Resources
                              </h4>
                              <p className="text-sm text-gray-600 leading-relaxed">{entry.readings}</p>
                            </div>
                            
                            {/* Online Resources */}
                            {entry.links && entry.links.length > 0 && (
                              <div>
                                <h4 className="text-sm font-semibold mb-2 flex items-center text-gray-700">
                                  <Globe size={14} className="mr-1 text-blue-600" />
                                  Online Resources
                                </h4>
                                <ul className="space-y-2">
                                  {entry.links.map((link, linkIndex) => (
                                    <li key={linkIndex} className="flex items-start">
                                      <Globe size={14} className="mr-2 mt-0.5 text-blue-500 flex-shrink-0" />
                                      <a
                                        href={link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-sm text-blue-600 hover:text-blue-800 hover:underline break-all"
                                      >
                                        {link.length > 60 ? link.substring(0, 60) + '...' : link}
                                      </a>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                            
                            {/* Weekly Challenge */}
                            {entry.challenge && (
                              <div>
                                <h4 className="text-sm font-semibold mb-2 flex items-center text-gray-700">
                                  <Award size={14} className="mr-1 text-blue-600" />
                                  Weekly Challenge
                                </h4>
                                <p className="text-sm text-gray-600 leading-relaxed">{entry.challenge}</p>
                              </div>
                            )}
                            
                          
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                  
                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-4 mt-8">
                    <button
                      onClick={() => navigate('/timetable', { state: { courses } })}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-md transition-colors duration-200 flex items-center justify-center"
                    >
                      <Calendar size={18} className="mr-2" />
                      View Timetable
                    </button>
                    
                    <button
                      onClick={() => {
                        setSyllabus([]);
                        setGenerationComplete(false);
                      }}
                      className="px-6 py-3 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                    >
                      Create New Syllabus
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}