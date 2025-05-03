import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSyllabus([]);

    // Validate inputs
    if (!selectedCourse) {
      setError('Please select a course.');
      return;
    }
    if (!topic1 || !topic2 || !topic3) {
      setError('Please enter all three topics.');
      return;
    }

    // Check if API key is available
    if (!GEMINI_API_KEY) {
      setError('API key is missing. Please contact support.');
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
      Return the syllabus as a JSON array of objects, where each object has { "week": number, "topic": string, "readings": string }. 
      Ensure readings are relevant, concise, and suitable for university-level study.
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
      console.log('Raw API Response:', data);

      // Check if candidates array exists and has content
      if (!data.candidates || !data.candidates[0] || !data.candidates[0].content || !data.candidates[0].content.parts[0]) {
        throw new Error('No syllabus data returned from API');
      }

      const content = data.candidates[0].content.parts[0].text;
      console.log('Parsed Content:', content);

      if (!content) {
        throw new Error('Empty syllabus content returned from API');
      }

      const parsedSyllabus = JSON.parse(content);
      console.log('Parsed Syllabus:', parsedSyllabus);

      if (!Array.isArray(parsedSyllabus)) {
        throw new Error('Syllabus is not an array');
      }

      setSyllabus(parsedSyllabus);
    } catch (err) {
      setError('Failed to generate syllabus: ' + err.message);
      console.error('Error details:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Nav />
      <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 flex flex-col items-center justify-center p-4">
        <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 mb-8 animate-pulse">
          Generate Reading Syllabus
        </h1>

        {error && (
          <div className="w-full max-w-2xl text-center">
            <p className="text-red-500 text-lg mb-4">{error}</p>
            <button
              onClick={() => navigate('/course-input')}
              className="bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold py-3 px-6 rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all duration-300 transform hover:scale-105"
            >
              Go to Course Input
            </button>
          </div>
        )}

        {!error && (
          <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 transform hover:scale-105 transition-transform duration-300">
            <form onSubmit={handleSubmit}>
              <div className="mb-6">
                <label
                  htmlFor="course-select"
                  className="block text-gray-800 text-sm font-semibold mb-2"
                >
                  Select Course
                </label>
                <select
                  id="course-select"
                  value={selectedCourse}
                  onChange={(e) => setSelectedCourse(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-colors"
                >
                  <option value="">Select a course</option>
                  {courses.map((course) => (
                    <option key={course.courseCode} value={course.courseCode}>
                      {course.courseName} ({course.courseCode})
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-6">
                <label
                  htmlFor="topic1"
                  className="block text-gray-800 text-sm font-semibold mb-2"
                >
                  Topic 1
                </label>
                <input
                  type="text"
                  id="topic1"
                  value={topic1}
                  onChange={(e) => setTopic1(e.target.value)}
                  placeholder="e.g., Object-Oriented Programming"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-colors"
                />
              </div>

              <div className="mb-6">
                <label
                  htmlFor="topic2"
                  className="block text-gray-800 text-sm font-semibold mb-2"
                >
                  Topic 2
                </label>
                <input
                  type="text"
                  id="topic2"
                  value={topic2}
                  onChange={(e) => setTopic2(e.target.value)}
                  placeholder="e.g., Data Structures"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-colors"
                />
              </div>

              <div className="mb-6">
                <label
                  htmlFor="topic3"
                  className="block text-gray-800 text-sm font-semibold mb-2"
                >
                  Topic 3
                </label>
                <input
                  type="text"
                  id="topic3"
                  value={topic3}
                  onChange={(e) => setTopic3(e.target.value)}
                  placeholder="e.g., Algorithms"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-colors"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`w-full py-3 rounded-lg font-bold text-white transition-all duration-300 ${
                  loading
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 transform hover:scale-105'
                }`}
              >
                {loading ? 'Generating...' : 'Generate Syllabus'}
              </button>
            </form>
          </div>
        )}

        {syllabus.length > 0 && (
          <div className="mt-8 w-full max-w-2xl">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Your Syllabus</h2>
            <div className="bg-white rounded-lg shadow-md p-6">
              {syllabus.map((entry, index) => (
                <div key={index} className="mb-4 pb-4 border-b last:border-b-0">
                  <h3 className="text-lg font-semibold text-blue-600">
                    Week {entry.week}: {entry.topic}
                  </h3>
                  <p className="text-gray-600 mt-2">{entry.readings}</p>
                </div>
              ))}
            </div>
            <button
              onClick={() => navigate('/timetable', { state: { courses } })}
              className="mt-6 w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold py-3 rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all duration-300 transform hover:scale-105"
            >
              View Timetable
            </button>
          </div>
        )}
      </div>
    </>
  );
}