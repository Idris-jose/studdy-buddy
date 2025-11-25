import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

import { 
    Download, 
    Calendar, 
    Clock, 
    BookOpen, 
    BarChart3, 
    TrendingUp, 
    Users, 
    Award 
} from 'lucide-react';
import Nav from './navbar.jsx';

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

export default function Timetable() {
    const location = useLocation();
    const { courses = [] } = location.state || {};
    const [timetable, setTimetable] = useState(() => {
        const savedTimetable = localStorage.getItem('timetable');
        return savedTimetable ? JSON.parse(savedTimetable) : [];
    });

    useEffect(() => {
        localStorage.setItem('timetable', JSON.stringify(timetable));
    }, [timetable]);
    
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [rawResponse, setRawResponse] = useState(null);
    const [view, setView] = useState('weekly');
    const [selectedDay, setSelectedDay] = useState('Monday');

    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const timeSlots = [
        '9:00 AM - 10:00 AM','11:00 AM - 12:00 PM','1:00 PM - 2:00 PM','3:00 PM - 4:00 PM','6:00 PM - 7:00 PM', '7:00 PM - 8:00 PM'
    ];

    const getCourseIcon = (courseName) => {
        const name = courseName.toLowerCase();
        if (name.includes('math') || name.includes('calculus')) return BarChart3;
        if (name.includes('science') || name.includes('physics')) return TrendingUp;
        if (name.includes('computer') || name.includes('programming')) return Users;
        if (name.includes('art') || name.includes('design')) return Award;
        if (name.includes('language') || name.includes('english')) return BookOpen;
        return BookOpen;
    };

    const downloadCSV = () => {
        try {
            let csvContent = "data:text/csv;charset=utf-8,";
            csvContent += "Time," + days.join(",") + "\r\n";
            timeSlots.forEach(time => {
                const row = [`"${time}"`];
                days.forEach(day => {
                    const slot = timetable.find(entry => entry.day === day && entry.time === time);
                    row.push(slot ? `"${slot.courseName} (${slot.courseCode})"` : '"-"');
                });
                csvContent += row.join(",") + "\r\n";
            });
            const encodedUri = encodeURI(csvContent);
            const link = document.createElement("a");
            link.setAttribute("href", encodedUri);
            link.setAttribute("download", "reading-timetable.csv");
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (error) {
            console.error('CSV generation error:', error);
            alert('Failed to generate CSV. Please try again.');
        }
    };

    const calculateStats = () => {
        if (timetable.length === 0) return null;
        const courseHours = {};
        const dayHours = {};
        
        courses.forEach(course => {
            courseHours[course.courseCode] = 0;
        });
        days.forEach(day => {
            dayHours[day] = 0;
        });
        
        timetable.forEach(slot => {
            courseHours[slot.courseCode] = (courseHours[slot.courseCode] || 0) + 1;
            dayHours[slot.day] = (dayHours[slot.day] || 0) + 1;
        });
        
        let busiestDay = days[0];
        let mostStudiedCourse = courses[0]?.courseCode || '';
        
        days.forEach(day => {
            if (dayHours[day] > dayHours[busiestDay]) {
                busiestDay = day;
            }
        });
        
        Object.keys(courseHours).forEach(code => {
            if (courseHours[code] > courseHours[mostStudiedCourse]) {
                mostStudiedCourse = code;
            }
        });
        
        const totalHours = timetable.length;
        const mostStudiedCourseName = courses.find(c => c.courseCode === mostStudiedCourse)?.courseName || '';
        
        return {
            totalHours,
            busiestDay,
            mostStudiedCourse: mostStudiedCourseName,
            mostStudiedHours: courseHours[mostStudiedCourse]
        };
    };

    useEffect(() => {
        if (courses.length === 0) {
            setError('No courses provided. Please add courses from the Course Input page.');
            return;
        }
        
        const generateTimetable = async () => {
            setLoading(true);
            setError('');
            
            const prompt = `
                Generate a weekly reading timetable for the following courses, prioritizing courses with higher units by allocating more study hours. Each course has a courseName, courseCode, and unit (a number indicating its weight). Return the timetable as a JSON array of objects, where each object represents a time slot with { "day": string, "time": string, "courseName": string, "courseCode": string }. 
                Use exactly these days: ${JSON.stringify(days)}.
                Use exactly these time slots: ${JSON.stringify(timeSlots)}.
                Ensure the timetable is balanced, covers all courses, and assigns more slots to courses with higher units. If a slot is empty, do not include it in the output. Return an empty array if no slots are assigned.
                Courses: ${JSON.stringify(courses)}
            `;
            
            try {
                const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }],
                generationConfig: { response_mime_type: 'application/json' }
                })
            }
            );

                
                const data = await response.json();
                const content = data.candidates?.[0]?.content?.parts?.[0]?.text;
                
                if (!content) {
                    throw new Error('No timetable data returned from API');
                }
                
                const parsedTimetable = JSON.parse(content);
                if (!Array.isArray(parsedTimetable)) {
                    throw new Error('Timetable is not an array');
                }
                
                setRawResponse(parsedTimetable);
                setTimetable(parsedTimetable);
            } catch (err) {
                setError('Failed to generate timetable: ' + err.message);
                console.error('Error details:', err);
            } finally {
                setLoading(false);
            }
        };
        
        generateTimetable();
    }, [courses]);

    const stats = calculateStats();
    const dailyTimetable = timetable.filter(entry => entry.day === selectedDay);

    return (
        <>
            <Nav />
            <div className="min-h-screen mt-15 bg-gradient-to-br from-blue-50 to-blue-100 flex flex-col items-center p-4">
                <div className="w-full max-w-6xl">
                    <h1 className="text-4xl font-bold text-blue-900 mb-2 text-center">
                        Reading Timetable
                    </h1>
                    <p className="text-blue-700 text-center mb-8">
                        Organized schedule for your academic success
                    </p>

                    {/* Controls */}
                    <div className="bg-white rounded-lg shadow-md p-4 mb-6">
                        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-2">
                                    <Calendar className="w-5 h-5 text-blue-600" />
                                    <label className="font-medium text-gray-700">View:</label>
                                    <select 
                                        value={view}
                                        onChange={(e) => setView(e.target.value)}
                                        className="border border-gray-300 rounded-md p-2 bg-white text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    >
                                        <option value="weekly">Weekly View</option>
                                        <option value="daily">Daily View</option>
                                    </select>
                                </div>
                                
                                {view === 'daily' && (
                                    <div className="flex items-center gap-2">
                                        <label className="font-medium text-gray-700">Day:</label>
                                        <select 
                                            value={selectedDay}
                                            onChange={(e) => setSelectedDay(e.target.value)}
                                            className="border border-gray-300 rounded-md p-2 bg-white text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        >
                                            {days.map(day => (
                                                <option key={day} value={day}>{day}</option>
                                            ))}
                                        </select>
                                    </div>
                                )}
                            </div>
                            
                            <button
                                onClick={downloadCSV}
                                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200"
                            >
                                <Download className="w-4 h-4" />
                                Export CSV
                            </button>
                        </div>
                    </div>

                    {/* Error State */}
                    {error && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
                            <p className="text-red-700 text-lg mb-4">{error}</p>
                            <button
                                onClick={() => window.history.back()}
                                className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200"
                            >
                                Back to Course Input
                            </button>
                        </div>
                    )}

                    {/* Loading State */}
                    {loading && (
                        <div className="bg-white rounded-lg shadow-md p-8 text-center">
                            <div className="flex flex-col items-center">
                                <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-4"></div>
                                <p className="text-lg text-gray-700 mb-2">Generating your timetable...</p>
                                <p className="text-sm text-gray-500">Please wait a moment</p>
                            </div>
                        </div>
                    )}

                    {/* Statistics */}
                    {!error && !loading && timetable.length > 0 && stats && (
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                            <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-blue-500">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h3 className="text-sm font-medium text-gray-600">Total Hours</h3>
                                        <p className="text-2xl font-bold text-blue-600">{stats.totalHours}</p>
                                    </div>
                                    <Clock className="w-8 h-8 text-blue-500" />
                                </div>
                            </div>
                            
                            <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-green-500">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h3 className="text-sm font-medium text-gray-600">Busiest Day</h3>
                                        <p className="text-lg font-bold text-green-600">{stats.busiestDay}</p>
                                    </div>
                                    <Calendar className="w-8 h-8 text-green-500" />
                                </div>
                            </div>
                            
                            <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-purple-500">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h3 className="text-sm font-medium text-gray-600">Top Course</h3>
                                        <p className="text-sm font-bold text-purple-600">{stats.mostStudiedCourse}</p>
                                    </div>
                                    <BookOpen className="w-8 h-8 text-purple-500" />
                                </div>
                            </div>
                            
                            <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-orange-500">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h3 className="text-sm font-medium text-gray-600">Focus Hours</h3>
                                        <p className="text-2xl font-bold text-orange-600">{stats.mostStudiedHours}</p>
                                    </div>
                                    <TrendingUp className="w-8 h-8 text-orange-500" />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Weekly View */}
                    {!error && !loading && timetable.length > 0 && view === 'weekly' && (
                        <div className="bg-white rounded-lg shadow-md overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="bg-blue-600 text-white">
                                            <th className="p-4 text-left font-medium">Time</th>
                                            {days.map((day) => (
                                                <th key={day} className="p-4 text-center font-medium">{day}</th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {timeSlots.map((time, index) => (
                                            <tr key={time} className={`border-b ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'} hover:bg-blue-50`}>
                                                <td className="p-4 font-medium text-gray-700 flex items-center">
                                                    <Clock className="w-4 h-4 mr-2 text-blue-500" />
                                                    {time}
                                                </td>
                                                {days.map((day) => {
                                                    const slot = timetable.find(
                                                        (entry) => entry.day === day && entry.time === time
                                                    );
                                                    return (
                                                        <td key={`${day}-${time}`} className="p-4 text-center">
                                                         {slot ? (
  <div className="p-2 bg-blue-100 rounded-md border border-blue-200">
    <div className="flex items-center justify-center mb-1">
      {React.createElement(getCourseIcon(slot.courseName) || BookOpen, { 
        className: "w-4 h-4 mr-1 text-blue-600" 
      })}
      <p className="font-medium text-blue-800 text-sm">{slot.courseName}</p>
    </div>
    <p className="text-xs text-blue-600 font-medium">{slot.courseCode}</p>
  </div>
) : (
  <span className="text-gray-400">-</span>
)}
                                                        </td>
                                                    );
                                                })}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* Daily View */}
                    {!error && !loading && timetable.length > 0 && view === 'daily' && (
                        <div className="bg-white rounded-lg shadow-md p-6">
                            <h2 className="text-2xl font-bold text-blue-900 mb-6 flex items-center">
                                <Calendar className="w-6 h-6 mr-2" />
                                {selectedDay}'s Schedule
                            </h2>
                            {dailyTimetable.length > 0 ? (
                                <div className="space-y-4">
                                    {dailyTimetable.map((slot, index) => (
                                        <div 
                                            key={index}
                                            className="p-4 border border-blue-200 bg-blue-50 rounded-lg"
                                        >
                                            <div className="flex justify-between items-start mb-2">
                                                <div className="flex items-center">
                                                    <Clock className="w-5 h-5 mr-2 text-blue-600" />
                                                    <span className="font-medium text-blue-800">{slot.time}</span>
                                                </div>
                                                <span className="px-3 py-1 bg-blue-600 text-white rounded-full text-sm font-medium">
                                                    {slot.courseCode}
                                                </span>
                                            </div>
                                        <div className="flex items-center">
  {React.createElement(getCourseIcon(slot.courseName) || BookOpen, { 
    className: "w-5 h-5 mr-2 text-blue-700" 
  })}
  <h3 className="text-lg font-semibold text-blue-900">{slot.courseName}</h3>
</div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8">
                                    <Calendar className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                                    <p className="text-gray-600">No study sessions scheduled for {selectedDay}</p>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Back Button */}
                    {!loading && (
                        <div className="mt-6 text-center">
                            <button
                                onClick={() => window.history.back()}
                                className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-md transition-colors duration-200"
                            >
                                Back to Course Input
                            </button>
                        </div>
                    )}

                    {/* Debug Information */}
                    {!error && !loading && timetable.length === 0 && rawResponse && (
                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                            <p className="text-yellow-800 text-lg mb-4">Timetable generated but no courses displayed. Raw data:</p>
                            <pre className="bg-gray-800 p-4 rounded-lg text-left text-sm overflow-x-auto text-white">
                                {JSON.stringify(rawResponse, null, 2)}
                            </pre>
                        </div>
                    )}

                    {/* No Courses Message */}
                    {!error && !loading && timetable.length === 0 && !rawResponse && courses.length === 0 && (
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-8 text-center">
                            <BookOpen className="w-12 h-12 mx-auto text-blue-400 mb-4" />
                            <p className="text-lg text-blue-700 mb-4">No courses added yet</p>
                            <p className="text-blue-600 mb-6">Please add courses from the Course Input page to generate your timetable</p>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}