import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Nav from './navbar.jsx';

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

export default function Timetable() {
    const location = useLocation();
    const { courses = [] } = location.state || {};
    const [timetable, setTimetable] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [rawResponse, setRawResponse] = useState(null);
    const [theme, setTheme] = useState('gradient'); // default theme
    const [animation, setAnimation] = useState(true);
    const [view, setView] = useState('weekly'); // 'weekly' or 'daily'
    const [selectedDay, setSelectedDay] = useState('Monday');

    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const timeSlots = [
        '8:00 AM - 9:00 AM', '9:00 AM - 10:00 AM', '10:00 AM - 11:00 AM', '11:00 AM - 12:00 PM',
        '12:00 PM - 1:00 PM', '1:00 PM - 2:00 PM', '2:00 PM - 3:00 PM', '3:00 PM - 4:00 PM',
        '4:00 PM - 5:00 PM', '5:00 PM - 6:00 PM', '6:00 PM - 7:00 PM', '7:00 PM - 8:00 PM'
    ];

    // Theme options
    const themes = {
        gradient: {
            background: "bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100",
            header: "bg-gradient-to-r from-blue-500 to-purple-500",
            title: "text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600",
            button: "bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600",
            courseCard: "bg-white"
        },
        dark: {
            background: "bg-gray-900",
            header: "bg-gray-800",
            title: "text-purple-400",
            button: "bg-purple-600 hover:bg-purple-700",
            courseCard: "bg-gray-800 text-white"
        },
        nature: {
            background: "bg-gradient-to-br from-green-100 via-teal-100 to-blue-100",
            header: "bg-gradient-to-r from-green-500 to-teal-500",
            title: "text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-teal-600",
            button: "bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600",
            courseCard: "bg-white"
        },
        sunset: {
            background: "bg-gradient-to-br from-orange-100 via-red-100 to-pink-100",
            header: "bg-gradient-to-r from-orange-500 to-red-500",
            title: "text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-red-600",
            button: "bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600",
            courseCard: "bg-white"
        }
    };

    const activeTheme = themes[theme];

    // Time emoji mapping
    const getTimeEmoji = (time) => {
        if (time.includes('AM')) {
            if (time.includes('8:00')) return '🌅';
            if (time.includes('9:00')) return '☕';
            if (time.includes('10:00')) return '📚';
            if (time.includes('11:00')) return '💻';
        } else {
            if (time.includes('12:00')) return '🍽️';
            if (time.includes('1:00')) return '📝';
            if (time.includes('2:00')) return '🔍';
            if (time.includes('3:00')) return '🧠';
            if (time.includes('4:00')) return '📊';
            if (time.includes('5:00')) return '📈';
            if (time.includes('6:00')) return '🌆';
            if (time.includes('7:00')) return '🌙';
        }
        return '⏰';
    };

    // Day emoji mapping
    const getDayEmoji = (day) => {
        switch (day) {
            case 'Monday': return '🚀';
            case 'Tuesday': return '🔥';
            case 'Wednesday': return '🌟';
            case 'Thursday': return '⚡';
            case 'Friday': return '🎉';
            case 'Saturday': return '🏖️';
            case 'Sunday': return '🧘';
            default: return '📅';
        }
    };

    // Course emoji mapping (based on course name keywords)
    const getCourseEmoji = (courseName) => {
        const name = courseName.toLowerCase();
        if (name.includes('math') || name.includes('calculus')) return '🧮';
        if (name.includes('science') || name.includes('physics')) return '🔬';
        if (name.includes('computer') || name.includes('programming')) return '💻';
        if (name.includes('art') || name.includes('design')) return '🎨';
        if (name.includes('music')) return '🎵';
        if (name.includes('language') || name.includes('english')) return '📝';
        if (name.includes('history')) return '📜';
        if (name.includes('biology')) return '🧬';
        if (name.includes('chemistry')) return '⚗️';
        if (name.includes('economics') || name.includes('business')) return '📊';
        return '📚';
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

    // Function to get a motivational quote
    const getMotivationalQuote = () => {
        const quotes = [
            "The expert in anything was once a beginner. — Helen Hayes",
            "The future depends on what you do today. — Mahatma Gandhi",
            "Success is the sum of small efforts, repeated day in and day out. — Robert Collier",
            "Your time is limited, don't waste it living someone else's life. — Steve Jobs",
            "The best way to predict your future is to create it. — Abraham Lincoln",
        ];
        return quotes[Math.floor(Math.random() * quotes.length)];
    };

    // Calculate study statistics
    const calculateStats = () => {
        if (timetable.length === 0) return null;
        
        const courseHours = {};
        const dayHours = {};
        
        // Initialize
        courses.forEach(course => {
            courseHours[course.courseCode] = 0;
        });
        
        days.forEach(day => {
            dayHours[day] = 0;
        });
        
        // Count hours
        timetable.forEach(slot => {
            courseHours[slot.courseCode] = (courseHours[slot.courseCode] || 0) + 1;
            dayHours[slot.day] = (dayHours[slot.day] || 0) + 1;
        });
        
        // Find busiest day and most studied course
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
                    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
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
    
    // Filter timetable for daily view
    const dailyTimetable = timetable.filter(entry => entry.day === selectedDay);

    return (
        <>
            <Nav />
            <div className={`min-h-screen ${activeTheme.background} mt-15 flex flex-col items-center p-4`}>
                <h1 className={`text-4xl font-extrabold ${activeTheme.title} mb-4 ${animation ? 'animate-pulse' : ''}`}>
                    Your Reading Timetable
                </h1>
                
                <p className="text-gray-600 italic mb-6">{getMotivationalQuote()}</p>

                {/* Settings Panel */}
                <div className="w-full max-w-4xl mb-6 p-4 bg-white bg-opacity-80 rounded-lg shadow-md">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        <div>
                            <label className="font-medium text-gray-700 mr-2">Theme:</label>
                            <select 
                                value={theme}
                                onChange={(e) => setTheme(e.target.value)}
                                className="border rounded p-2"
                            >
                                <option value="gradient">Gradient</option>
                                <option value="dark">Dark</option>
                                <option value="nature">Nature</option>
                                <option value="sunset">Sunset</option>
                            </select>
                        </div>
                        
                        <div>
                            <label className="font-medium text-gray-700 mr-2">View:</label>
                            <select 
                                value={view}
                                onChange={(e) => setView(e.target.value)}
                                className="border rounded p-2"
                            >
                                <option value="weekly">Weekly</option>
                                <option value="daily">Daily</option>
                            </select>
                            
                            {view === 'daily' && (
                                <select 
                                    value={selectedDay}
                                    onChange={(e) => setSelectedDay(e.target.value)}
                                    className="border rounded p-2 ml-2"
                                >
                                    {days.map(day => (
                                        <option key={day} value={day}>{getDayEmoji(day)} {day}</option>
                                    ))}
                                </select>
                            )}
                        </div>
                        
                        <div className="flex items-center">
                            <label className="font-medium text-gray-700 mr-2">Animations:</label>
                            <div className="relative inline-block w-12 align-middle select-none">
                                <input 
                                    type="checkbox" 
                                    checked={animation}
                                    onChange={() => setAnimation(!animation)}
                                    className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
                                />
                                <label 
                                    className={`toggle-label block overflow-hidden h-6 rounded-full ${animation ? 'bg-green-400' : 'bg-gray-300'} cursor-pointer`}
                                ></label>
                            </div>
                        </div>
                        
                        <button
                            onClick={downloadCSV}
                            className={`flex items-center gap-2 ${activeTheme.button} text-white font-bold py-2 px-4 rounded transition-all duration-300`}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                            Download CSV
                        </button>
                    </div>
                </div>

                {error && (
                    <div className="w-full max-w-2xl text-center">
                        <p className="text-red-500 text-lg mb-4">{error}</p>
                        <button
                            onClick={() => window.history.back()}
                            className={`${activeTheme.button} text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105`}
                        >
                            Back to Course Input
                        </button>
                    </div>
                )}

                {loading && (
                    <div className="w-full max-w-2xl text-center">
                        <div className="flex flex-col items-center justify-center p-8 bg-white bg-opacity-80 rounded-lg shadow-md">
                            <div className="relative">
                                <div className="w-20 h-20 border-4 border-gray-200 rounded-full"></div>
                                <div className={`w-20 h-20 border-4 ${animation ? 'border-t-blue-500 animate-spin' : 'border-t-blue-500'} rounded-full absolute top-0`}></div>
                            </div>
                            <p className="text-gray-600 text-lg mt-4">Crafting your personalized timetable...</p>
                            <p className="text-gray-500 text-sm mt-2">This might take a few moments</p>
                        </div>
                    </div>
                )}

                {!error && !loading && timetable.length > 0 && stats && (
                    <div className="w-full max-w-4xl">
                        {/* Stats Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                            <div className={`p-4 ${activeTheme.courseCard} rounded-lg shadow-md ${animation ? 'hover:shadow-lg transform hover:scale-105 transition-all' : ''}`}>
                                <h3 className="text-lg font-semibold">Total Study Hours</h3>
                                <p className="text-2xl font-bold">{stats.totalHours} hours</p>
                            </div>
                            <div className={`p-4 ${activeTheme.courseCard} rounded-lg shadow-md ${animation ? 'hover:shadow-lg transform hover:scale-105 transition-all' : ''}`}>
                                <h3 className="text-lg font-semibold">Busiest Day</h3>
                                <p className="text-2xl font-bold">{getDayEmoji(stats.busiestDay)} {stats.busiestDay}</p>
                            </div>
                            <div className={`p-4 ${activeTheme.courseCard} rounded-lg shadow-md ${animation ? 'hover:shadow-lg transform hover:scale-105 transition-all' : ''}`}>
                                <h3 className="text-lg font-semibold">Most Studied</h3>
                                <p className="text-2xl font-bold">{getCourseEmoji(stats.mostStudiedCourse)} {stats.mostStudiedCourse}</p>
                            </div>
                            <div className={`p-4 ${activeTheme.courseCard} rounded-lg shadow-md ${animation ? 'hover:shadow-lg transform hover:scale-105 transition-all' : ''}`}>
                                <h3 className="text-lg font-semibold">Focus Hours</h3>
                                <p className="text-2xl font-bold">{stats.mostStudiedHours} hours</p>
                            </div>
                        </div>
                        
                        {/* Weekly View */}
                        {view === 'weekly' && (
                            <div className="overflow-x-auto bg-white rounded-lg shadow-md">
                                <table className="w-full">
                                    <thead>
                                        <tr className={`${activeTheme.header} text-white`}>
                                            <th className="p-4 text-left">Time</th>
                                            {days.map((day) => (
                                                <th key={day} className="p-4 text-center">{getDayEmoji(day)} {day}</th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {timeSlots.map((time) => (
                                            <tr key={time} className="border-b hover:bg-gray-50">
                                                <td className="p-4 text-gray-800 font-semibold flex items-center">
                                                    <span className="mr-2">{getTimeEmoji(time)}</span> {time}
                                                </td>
                                                {days.map((day) => {
                                                    const slot = timetable.find(
                                                        (entry) => entry.day === day && entry.time === time
                                                    );
                                                    return (
                                                        <td key={`${day}-${time}`} className="p-4 text-center">
                                                            {slot ? (
                                                                <div className={`p-2 rounded-lg ${animation ? 'transform hover:scale-105 transition-all' : ''}`}>
                                                                    <p className="text-blue-600 font-semibold flex items-center justify-center">
                                                                        <span className="mr-1">{getCourseEmoji(slot.courseName)}</span>
                                                                        {slot.courseName}
                                                                    </p>
                                                                    <p className="text-gray-600 text-sm">{slot.courseCode}</p>
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
                        )}
                        
                        {/* Daily View */}
                        {view === 'daily' && (
                            <div className="bg-white rounded-lg shadow-md p-6">
                                <h2 className="text-2xl font-bold mb-4 flex items-center">
                                    <span className="mr-2">{getDayEmoji(selectedDay)}</span>
                                    {selectedDay}'s Schedule
                                </h2>
                                
                                {dailyTimetable.length > 0 ? (
                                    <div className="space-y-4">
                                        {dailyTimetable.map((slot, index) => (
                                            <div 
                                                key={index}
                                                className={`p-4 border-l-4 border-blue-500 ${activeTheme.courseCard} rounded-r-lg shadow ${animation ? 'transform hover:translate-x-2 transition-all' : ''}`}
                                            >
                                                <div className="flex justify-between items-center">
                                                    <div className="flex items-center">
                                                        <span className="text-xl mr-2">{getTimeEmoji(slot.time)}</span>
                                                        <span className="font-medium">{slot.time}</span>
                                                    </div>
                                                    <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                                                        {slot.courseCode}
                                                    </span>
                                                </div>
                                                <div className="mt-2 flex items-center">
                                                    <span className="text-xl mr-2">{getCourseEmoji(slot.courseName)}</span>
                                                    <h3 className="text-lg font-semibold">{slot.courseName}</h3>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-center text-gray-500 py-8">No study sessions scheduled for {selectedDay}.</p>
                                )}
                            </div>
                        )}
                        
                        <div className="flex justify-between mt-6">
                            <button
                                onClick={() => window.history.back()}
                                className={`${activeTheme.button} text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105`}
                            >
                                Back to Course Input
                            </button>
                        </div>
                    </div>
                )}

                {!error && !loading && timetable.length === 0 && rawResponse && (
                    <div className="w-full max-w-2xl text-center">
                        <p className="text-red-500 text-lg mb-4">Timetable generated but no courses displayed. Check raw data below:</p>
                        <pre className="bg-gray-100 p-4 rounded-lg text-left text-sm overflow-x-auto">
                            {JSON.stringify(rawResponse, null, 2)}
                        </pre>
                        <button
                            onClick={() => window.history.back()}
                            className={`mt-4 ${activeTheme.button} text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105`}
                        >
                            Back to Course Input
                        </button>
                    </div>
                )}

                {!error && !loading && timetable.length === 0 && !rawResponse && courses.length === 0 && (
                    <div className="w-full max-w-2xl text-center">
                        <p className="text-gray-600 text-lg">No courses added yet. Please add courses from the Course Input page.</p>
                        <button
                            onClick={() => window.history.back()}
                            className={`mt-4 ${activeTheme.button} text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105`}
                        >
                            Back to Course Input
                        </button>
                    </div>
                )}
                
                {/* Custom CSS for toggle switch */}
                <style jsx>{`
                    .toggle-checkbox:checked {
                        right: 0;
                        border-color: #68D391;
                    }
                    .toggle-checkbox:checked + .toggle-label {
                        background-color: #68D391;
                    }
                    .toggle-checkbox {
                        right: 0;
                        z-index: 1;
                        border-color: #D1D5DB;
                        transition: all 0.3s;
                    }
                    .toggle-label {
                        transition: all 0.3s;
                    }
                `}</style>
            </div>
        </>
    );
}