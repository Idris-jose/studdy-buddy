import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Nav from './navbar.jsx';
import { useTheme } from './themecontext.jsx';

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
    const [animation, setAnimation] = useState(true);
    const [view, setView] = useState('weekly');
    const [selectedDay, setSelectedDay] = useState('Monday');

    const { theme, themeColors, changeTheme } = useTheme();

    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const timeSlots = [
        '8:00 AM - 9:00 AM', '9:00 AM - 10:00 AM', '10:00 AM - 11:00 AM', '11:00 AM - 12:00 PM',
        '12:00 PM - 1:00 PM', '1:00 PM - 2:00 PM', '2:00 PM - 3:00 PM', '3:00 PM - 4:00 PM',
        '4:00 PM - 5:00 PM', '5:00 PM - 6:00 PM', '6:00 PM - 7:00 PM', '7:00 PM - 8:00 PM'
    ];

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

    const dailyTimetable = timetable.filter(entry => entry.day === selectedDay);

    return (
        <>
            <Nav />
            <div className={`min-h-screen mt-15 bg-gradient-to-br ${themeColors[theme].bg} flex flex-col items-center p-4 transition-colors duration-700`}>
                <h1 className={`text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r ${themeColors[theme].gradient} mb-4 ${animation ? 'animate-pulse' : ''}`}>
                    Your Reading Timetable
                </h1>
                
                <p className="text-gray-300 italic mb-6">{getMotivationalQuote()}</p>

                <div className="w-full max-w-4xl mb-6 p-4 bg-white/10 backdrop-blur-md border rounded-lg shadow-md">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        
                        <div>
                            <label className={`font-medium ${themeColors[theme].text} mr-2`}>View:</label>
                            <select 
                                value={view}
                                onChange={(e) => setView(e.target.value)}
                                className="border rounded p-2 bg-gray-800 text-white"
                            >
                                <option value="weekly">Weekly</option>
                                <option value="daily">Daily</option>
                            </select>
                            {view === 'daily' && (
                                <select 
                                    value={selectedDay}
                                    onChange={(e) => setSelectedDay(e.target.value)}
                                    className="border rounded p-2 ml-2 bg-gray-800 text-white"
                                >
                                    {days.map(day => (
                                        <option key={day} value={day}>{getDayEmoji(day)} {day}</option>
                                    ))}
                                </select>
                            )}
                        </div>
                        <div className="flex items-center">
                            <label className={`font-medium ${themeColors[theme].text} mr-2`}>Animations:</label>
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
                            className={`flex items-center gap-2 bg-gradient-to-r ${themeColors[theme].gradient} ${themeColors[theme].hover} text-white font-bold py-2 px-4 rounded transition-all duration-300`}
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
                            className={`bg-gradient-to-r ${themeColors[theme].gradient} ${themeColors[theme].hover} text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105`}
                        >
                            Back to Course Input
                        </button>
                    </div>
                )}

                {loading && (
                    <div className="w-full max-w-2xl text-center">
                        <div className="flex flex-col items-center justify-center p-8 bg-white/10 backdrop-blur-md rounded-lg shadow-md">
                            <div className="relative">
                                <div className="w-20 h-20 border-4 border-gray-200 rounded-full"></div>
                                <div className={`w-20 h-20 border-4 ${animation ? `border-t-${themeColors[theme].border.split('-')[1]}-500 animate-spin` : `border-t-${themeColors[theme].border.split('-')[1]}-500`} rounded-full absolute top-0`}></div>
                            </div>
                            <p className={`text-lg ${themeColors[theme].text} mt-4`}>Crafting your personalized timetable...</p>
                            <p className={`text-sm ${themeColors[theme].text} mt-2`}>This might take a few moments</p>
                        </div>
                    </div>
                )}

                {!error && !loading && timetable.length > 0 && stats && (
                    <div className="w-full max-w-4xl">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                            <div className={`p-4 bg-white/10 backdrop-blur-md border ${themeColors[theme].border} rounded-lg shadow-md ${animation ? 'hover:shadow-lg transform hover:scale-105 transition-all' : ''}`}>
                                <h3 className={`text-lg font-semibold ${themeColors[theme].text}`}>Total Study Hours</h3>
                                <p className="text-2xl font-bold">{stats.totalHours} hours</p>
                            </div>
                            <div className={`p-4 bg-white/10 backdrop-blur-md border ${themeColors[theme].border} rounded-lg shadow-md ${animation ? 'hover:shadow-lg transform hover:scale-105 transition-all' : ''}`}>
                                <h3 className={`text-lg font-semibold ${themeColors[theme].text}`}>Busiest Day</h3>
                                <p className="text-2xl font-bold">{getDayEmoji(stats.busiestDay)} {stats.busiestDay}</p>
                            </div>
                            <div className={`p-4 bg-white/10 backdrop-blur-md border ${themeColors[theme].border} rounded-lg shadow-md ${animation ? 'hover:shadow-lg transform hover:scale-105 transition-all' : ''}`}>
                                <h3 className={`text-lg font-semibold ${themeColors[theme].text}`}>Most Studied</h3>
                                <p className="text-2xl font-bold">{getCourseEmoji(stats.mostStudiedCourse)} {stats.mostStudiedCourse}</p>
                            </div>
                            <div className={`p-4 bg-white/10 backdrop-blur-md border ${themeColors[theme].border} rounded-lg shadow-md ${animation ? 'hover:shadow-lg transform hover:scale-105 transition-all' : ''}`}>
                                <h3 className={`text-lg font-semibold ${themeColors[theme].text}`}>Focus Hours</h3>
                                <p className="text-2xl font-bold">{stats.mostStudiedHours} hours</p>
                            </div>
                        </div>
                        {view === 'weekly' && (
                            <div className="overflow-x-auto bg-white/10 backdrop-blur-md rounded-lg shadow-md">
                                <table className="w-full">
                                    <thead>
                                        <tr className={`bg-gradient-to-r ${themeColors[theme].gradient} text-white`}>
                                            <th className="p-4 text-left">Time</th>
                                            {days.map((day) => (
                                                <th key={day} className="p-4 text-center">{getDayEmoji(day)} {day}</th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {timeSlots.map((time) => (
                                            <tr key={time} className="border-b hover:bg-gray-800/20">
                                                <td className={`p-4 ${themeColors[theme].text} font-semibold flex items-center`}>
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
                                                                    <p className={`font-semibold ${themeColors[theme].text} flex items-center justify-center`}>
                                                                        <span className="mr-1">{getCourseEmoji(slot.courseName)}</span>
                                                                        {slot.courseName}
                                                                    </p>
                                                                    <p className={`text-sm ${themeColors[theme].text}`}>{slot.courseCode}</p>
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
                        {view === 'daily' && (
                            <div className="bg-white/10 backdrop-blur-md rounded-lg shadow-md p-6">
                                <h2 className={`text-2xl font-bold ${themeColors[theme].text} mb-4 flex items-center`}>
                                    <span className="mr-2">{getDayEmoji(selectedDay)}</span>
                                    {selectedDay}'s Schedule
                                </h2>
                                {dailyTimetable.length > 0 ? (
                                    <div className="space-y-4">
                                        {dailyTimetable.map((slot, index) => (
                                            <div 
                                                key={index}
                                                className={`p-4 border-l-4 ${themeColors[theme].border} bg-white/10 backdrop-blur-md rounded-r-lg shadow ${animation ? 'transform hover:translate-x-2 transition-all' : ''}`}
                                            >
                                                <div className="flex justify-between items-center">
                                                    <div className="flex items-center">
                                                        <span className="text-xl mr-2">{getTimeEmoji(slot.time)}</span>
                                                        <span className={`font-medium ${themeColors[theme].text}`}>{slot.time}</span>
                                                    </div>
                                                    <span className={`px-3 py-1 bg-gradient-to-r ${themeColors[theme].gradient} text-white rounded-full text-sm`}>
                                                        {slot.courseCode}
                                                    </span>
                                                </div>
                                                <div className="mt-2 flex items-center">
                                                    <span className="text-xl mr-2">{getCourseEmoji(slot.courseName)}</span>
                                                    <h3 className={`text-lg font-semibold ${themeColors[theme].text}`}>{slot.courseName}</h3>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className={`text-center ${themeColors[theme].text} py-8`}>No study sessions scheduled for {selectedDay}.</p>
                                )}
                            </div>
                        )}
                        <div className="flex justify-between mt-6">
                            <button
                                onClick={() => window.history.back()}
                                className={`bg-gradient-to-r ${themeColors[theme].gradient} ${themeColors[theme].hover} text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105`}
                            >
                                Back to Course Input
                            </button>
                        </div>
                    </div>
                )}

                {!error && !loading && timetable.length === 0 && rawResponse && (
                    <div className="w-full max-w-2xl text-center">
                        <p className="text-red-500 text-lg mb-4">Timetable generated but no courses displayed. Check raw data below:</p>
                        <pre className="bg-gray-800 p-4 rounded-lg text-left text-sm overflow-x-auto text-white">
                            {JSON.stringify(rawResponse, null, 2)}
                        </pre>
                        <button
                            onClick={() => window.history.back()}
                            className={`mt-4 bg-gradient-to-r ${themeColors[theme].gradient} ${themeColors[theme].hover} text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105`}
                        >
                            Back to Course Input
                        </button>
                    </div>
                )}

                {!error && !loading && timetable.length === 0 && !rawResponse && courses.length === 0 && (
                    <div className="w-full max-w-2xl text-center">
                        <p className={`text-lg ${themeColors[theme].text}`}>No courses added yet. Please add courses from the Course Input page.</p>
                        <button
                            onClick={() => window.history.back()}
                            className={`mt-4 bg-gradient-to-r ${themeColors[theme].gradient} ${themeColors[theme].hover} text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105`}
                        >
                            Back to Course Input
                        </button>
                    </div>
                )}
                
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