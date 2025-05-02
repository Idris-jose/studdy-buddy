import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Nav from './navbar.jsx';


export default function CourseInput() {
    const [courseName, setCourseName] = useState('');
    const [courseCode, setCourseCode] = useState('');
    const [unit, setUnit] = useState('');
    const [courses, setCourses] = useState([]);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = (event) => {
        event.preventDefault();
        if (!courseName || !courseCode || !unit) {
            setError('Please fill in all fields');
            return;
        }
        if (isNaN(unit) || unit < 1) {
            setError('Unit must be a positive number');
            return;
        }

        const newCourse = { courseName, courseCode, unit: parseInt(unit) };
        setCourses([...courses, newCourse]);
        setCourseName('');
        setCourseCode('');
        setUnit('');
        setError('');
    };

    const handleDone = () => {
        if (courses.length < 3) {
            setError('You must add at least 3 courses');
            return;
        }
        alert('Courses submitted successfully! Check your timetable.');
        navigate('/timetable', { state: { courses } });
        setCourses([]);
    };

    return (
        <>
        <Nav />
        <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 flex flex-col items-center justify-center p-4">
            <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 mb-8 animate-pulse">
                Course Input
            </h1>

            <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 transform hover:scale-105 transition-transform duration-300">
                <form onSubmit={handleSubmit}>
                    <div className="mb-6">
                        <label htmlFor="course-name" className="block text-gray-800 text-sm font-semibold mb-2">
                            Course Name
                        </label>
                        <input
                            type="text"
                            id="course-name"
                            value={courseName}
                            onChange={(e) => setCourseName(e.target.value)}
                            placeholder="e.g., Introduction to Programming"
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-colors"
                        />
                    </div>

                    <div className="mb-6">
                        <label htmlFor="course-code" className="block text-gray-800 text-sm font-semibold mb-2">
                            Course Code
                        </label>
                        <input
                            type="text"
                            id="course-code"
                            value={courseCode}
                            onChange={(e) => setCourseCode(e.target.value)}
                            placeholder="e.g., CS101"
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-colors"
                        />
                    </div>

                    <div className="mb-6">
                        <label htmlFor="unit" className="block text-gray-800 text-sm font-semibold mb-2">
                            Unit
                        </label>
                        <input
                            type="number"
                            id="unit"
                            value={unit}
                            onChange={(e) => setUnit(e.target.value)}
                            placeholder="e.g., 3"
                            min="1"
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-colors"
                        />
                    </div>

                    {error && (
                        <p className="text-red-500 text-sm mb-4 animate-shake">{error}</p>
                    )}

                    <button
                        type="submit"
                        className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold py-3 rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all duration-300 transform hover:scale-105"
                    >
                        Add Course
                    </button>
                </form>
            </div>

            {courses.length > 0 && (
                <div className="mt-8 w-full max-w-2xl">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">Your Courses</h2>
                    <div className="grid gap-4">
                        {courses.map((course, index) => (
                            <div
                                key={index}
                                className="bg-white rounded-lg shadow-md p-6 flex flex-col gap-2 transform hover:-translate-y-1 transition-transform duration-200"
                            >
                                <p className="text-lg font-semibold text-blue-600">{course.courseName}</p>
                                <p className="text-gray-600">Code: {course.courseCode}</p>
                                <p className="text-gray-600">Units: {course.unit}</p>
                            </div>
                        ))}
                    </div>
                    <button
                        onClick={handleDone}
                        disabled={courses.length < 3}
                        className={`mt-6 w-full py-3 rounded-lg font-bold text-white transition-all duration-300 ${
                            courses.length >= 3
                                ? 'bg-green-500 hover:bg-green-600 transform hover:scale-105'
                                : 'bg-gray-400 cursor-not-allowed'
                        }`}
                    >
                        Done ({courses.length}/3)
                    </button>
                </div>
            )}
        </div>
        </>
     
    );
}