import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  BookOpen, 
  Code, 
  Calculator, 
  Settings, 
  Microscope, 
  FlaskConical, 
  Atom, 
  Palette, 
  Scroll, 
  MessageCircle, 
  Music, 
  Brain, 
  TrendingUp, 
  Trash2, 
  Clock, 
  FileText,
  AlertCircle,
  CheckCircle,
  Plus,
  BarChart3
} from 'lucide-react';
import Nav from './navbar.jsx';

export default function CourseInput() {
  const [courseName, setCourseName] = useState(() => {
    const savedCourseName = localStorage.getItem('courseName');
    return savedCourseName ? JSON.parse(savedCourseName) : '';
  });
  const [courseCode, setCourseCode] = useState('');
  const [unit, setUnit] = useState('');
const [courses, setCourses] = useState(() => {
  const savedCourses = localStorage.getItem('courses');
  return savedCourses ? JSON.parse(savedCourses) : [];
});

  useEffect(() => {
    localStorage.setItem('courseName', JSON.stringify(courseName));
  }, [courseName]);

  useEffect(() => {
    localStorage.setItem('courses', JSON.stringify(courses));
  }, [courses]);

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  // Course icon mappings for different types of courses
  const courseIcons = {
    'cs': Code,
    'math': Calculator,
    'eng': Settings,
    'bio': Microscope,
    'chem': FlaskConical,
    'phys': Atom,
    'art': Palette,
    'hist': Scroll,
    'lang': MessageCircle,
    'music': Music,
    'psych': Brain,
    'econ': TrendingUp,
    'default': BookOpen
  };

const getIconKey = (code) => {
  const lowerCode = code.toLowerCase();
  for (const prefix in courseIcons) {
    if (lowerCode.startsWith(prefix)) {
      return prefix;
    }
  }
  return 'default';
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

  // Check for duplicate course codes
  if (courses.some(course => course.courseCode.toLowerCase() === courseCode.trim().toLowerCase())) {
    setError('Course code already exists');
    return;
  }

  const newCourse = { 
    courseName: courseName.trim(), 
    courseCode: courseCode.trim(), 
    unit: parseInt(unit),
    iconKey: getIconKey(courseCode.trim()) // Now this will work
  };

  // Remove the duplicate getIconKey function from here
  setCourses([...courses, newCourse]);
  setCourseName('');
  setCourseCode('');
  setUnit('');
  
  // Show success message
  setSuccess(`${newCourse.courseName} added successfully!`);
  
  // Clear success message after 3 seconds
  setTimeout(() => {
    setSuccess('');
  }, 3000);
};


  const handleDelete = (index) => {
    setCourses(courses.filter((_, i) => i !== index));
  };

  const totalUnits = courses.reduce((sum, course) => sum + course.unit, 0);
  const unitPercent = Math.min(totalUnits / 18 * 100, 100); // Assuming 18 is max units

  return (
    <>
      <Nav />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex flex-col items-center justify-center p-6 pt-20">
        <div className="w-full max-w-4xl">
          <div className="mb-8 text-center">
            <h1 className="text-4xl font-bold text-blue-900 mb-4">
              Course Management
            </h1>
            <p className="text-lg text-blue-700 mb-2 max-w-2xl mx-auto">
              Add your courses to create a personalized study schedule and syllabus.
            </p>
            <p className="text-sm text-blue-600">
              Build your academic foundation with organized course planning.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Course Input Form */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                <Plus className="w-5 h-5 mr-2 text-blue-600" />
                Add New Course
              </h2>

              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label htmlFor="course-name" className="block text-gray-700 text-sm font-medium mb-2">
                    Course Name
                  </label>
                  <input
                    type="text"
                    id="course-name"
                    value={courseName}
                    onChange={(e) => setCourseName(e.target.value)}
                    placeholder="e.g., Introduction to Programming"
                    className="w-full px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div className="mb-4">
                  <label htmlFor="course-code" className="block text-gray-700 text-sm font-medium mb-2">
                    Course Code
                  </label>
                  <input
                    type="text"
                    id="course-code"
                    value={courseCode}
                    onChange={(e) => setCourseCode(e.target.value)}
                    placeholder="e.g., CS101"
                    className="w-full px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div className="mb-6">
                  <label htmlFor="unit" className="block text-gray-700 text-sm font-medium mb-2">
                    Units (Credit Hours)
                  </label>
                  <div className="flex items-center space-x-4">
                    <input
                      type="range"
                      id="unit-range"
                      min="1"
                      max="6"
                      value={unit || 1}
                      onChange={(e) => setUnit(e.target.value)}
                      className="flex-1 h-2 bg-blue-200 rounded-lg appearance-none cursor-pointer slider"
                    />
                    <input
                      type="number"
                      id="unit"
                      value={unit}
                      onChange={(e) => setUnit(e.target.value)}
                      placeholder="3"
                      min="1"
                      max="6"
                      className="w-16 px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center"
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Select between 1-6 credit hours</p>
                </div>

                {/* Error Message */}
                {error && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md flex items-center">
                    <AlertCircle className="w-4 h-4 text-red-500 mr-2 flex-shrink-0" />
                    <p className="text-red-700 text-sm">{error}</p>
                  </div>
                )}

                {/* Success Message */}
                {success && (
                  <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-md flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                    <p className="text-green-700 text-sm">{success}</p>
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-md transition-colors duration-200"
                >
                  Add Course
                </button>
              </form>
            </div>

            {/* Course List */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                  <BookOpen className="w-5 h-5 mr-2 text-blue-600" />
                  Your Courses ({courses.length})
                </h2>
                {courses.length > 0 && (
                  <span className={`text-sm px-2 py-1 rounded-full ${courses.length < 3 ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`}>
                    {courses.length < 3 ? `${3 - courses.length} more needed` : 'Ready to proceed'}
                  </span>
                )}
              </div>
              
              {/* Units Progress Bar */}
              {courses.length > 0 && (
                <div className="mb-6">
                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>Total Units: {totalUnits}</span>
                    <span>Target: 18 units</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${unitPercent}%` }}
                    ></div>
                  </div>
                </div>
              )}
              
              {/* Course Cards */}
              {courses.length > 0 ? (
                <div className="space-y-3 max-h-80 overflow-y-auto">
               {courses.map((course, index) => {
  const IconComponent = courseIcons[course.iconKey] || courseIcons.default;
  return (
    <div key={index} className="bg-gray-50 rounded-lg p-4 border border-gray-200 hover:border-blue-300 transition-colors duration-200">
      <div className="flex justify-between items-start">
        <div className="flex items-start space-x-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <IconComponent className="w-5 h-5 text-blue-600" />
          </div>
                            <div className="flex-1">
                              <h3 className="font-medium text-gray-900">{course.courseName}</h3>
                              <p className="text-sm text-gray-600 mb-1">Code: {course.courseCode}</p>
                              <div className="flex items-center">
                                <BarChart3 className="w-4 h-4 text-blue-500 mr-1" />
                                <span className="text-sm text-gray-600">{course.unit} units</span>
                                <div className="flex ml-2">
                                  {[...Array(course.unit)].map((_, i) => (
                                    <div key={i} className="w-2 h-2 bg-blue-500 rounded-full mr-1" />
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>
                          <button
                            onClick={() => handleDelete(index)}
                            className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors duration-200"
                            title="Delete course"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-8">
                  <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-2">No courses added yet</p>
                  <p className="text-sm text-gray-500">Add at least 3 courses to proceed to timetable and syllabus generation.</p>
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          {courses.length >= 3 && (
            <div className="mt-8 bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Next Steps</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button
                  onClick={() => navigate('/timetable', { state: { courses } })}
                  className="flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-md transition-colors duration-200"
                >
                  <Clock className="w-5 h-5 mr-2" />
                  Generate Timetable
                </button>
                <button
                  onClick={() => navigate('/syllabus', { state: { courses } })}
                  className="flex items-center justify-center bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-4 rounded-md transition-colors duration-200"
                >
                  <FileText className="w-5 h-5 mr-2" />
                  Create Syllabus
                </button>
              </div>
            </div>
          )}

          {/* Course Statistics */}
          {courses.length > 0 && (
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white rounded-lg shadow-md p-4 text-center">
                <BookOpen className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-gray-900">{courses.length}</p>
                <p className="text-sm text-gray-600">Total Courses</p>
              </div>
              <div className="bg-white rounded-lg shadow-md p-4 text-center">
                <BarChart3 className="w-8 h-8 text-green-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-gray-900">{totalUnits}</p>
                <p className="text-sm text-gray-600">Total Units</p>
              </div>
              <div className="bg-white rounded-lg shadow-md p-4 text-center">
                <TrendingUp className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-gray-900">{Math.round(totalUnits / courses.length * 10) / 10}</p>
                <p className="text-sm text-gray-600">Avg. Units/Course</p>
              </div>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #2563eb;
          cursor: pointer;
        }
        .slider::-moz-range-thumb {
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #2563eb;
          cursor: pointer;
          border: none;
        }
      `}</style>
    </>
  );
}