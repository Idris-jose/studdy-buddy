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

    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const timeSlots = [
        '8:00 AM - 9:00 AM', '9:00 AM - 10:00 AM', '10:00 AM - 11:00 AM', '11:00 AM - 12:00 PM',
        '12:00 PM - 1:00 PM', '1:00 PM - 2:00 PM', '2:00 PM - 3:00 PM', '3:00 PM - 4:00 PM',
        '4:00 PM - 5:00 PM', '5:00 PM - 6:00 PM', '6:00 PM - 7:00 PM', '7:00 PM - 8:00 PM'
    ];

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

    return (
        <>
            <Nav />
            <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 flex flex-col items-center justify-center p-4">
                <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 mb-8 animate-pulse">
                    Your Reading Timetable
                </h1>

                {error && (
                    <div className="w-full max-w-2xl text-center">
                        <p className="text-red-500 text-lg mb-4">{error}</p>
                        <button
                            onClick={() => window.history.back()}
                            className="bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold py-3 px-6 rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all duration-300 transform hover:scale-105"
                        >
                            Back to Course Input
                        </button>
                    </div>
                )}

                {loading && (
                    <div className="w-full max-w-2xl text-center">
                        <p className="text-gray-600 text-lg">Generating your timetable...</p>
                        <div className="mt-4 h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                            <div className="h-full bg-gradient-to-r from-blue-500 to-purple-500 animate-pulse"></div>
                        </div>
                    </div>
                )}

                {!error && !loading && timetable.length > 0 && (
                    <div className="w-full max-w-4xl">
                        <div className="flex justify-end gap-2 mb-4">
                            <button
                                onClick={downloadCSV}
                                className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded transition-all duration-300"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                                Download CSV
                            </button>
                        </div>
                        
                        <div className="overflow-x-auto bg-white rounded-lg shadow-md">
                            <table className="w-full">
                                <thead>
                                    <tr className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                                        <th className="p-4 text-left">Time</th>
                                        {days.map((day) => (
                                            <th key={day} className="p-4 text-center">{day}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {timeSlots.map((time) => (
                                        <tr key={time} className="border-b hover:bg-gray-50">
                                            <td className="p-4 text-gray-800 font-semibold">{time}</td>
                                            {days.map((day) => {
                                                const slot = timetable.find(
                                                    (entry) => entry.day === day && entry.time === time
                                                );
                                                return (
                                                    <td key={`${day}-${time}`} className="p-4 text-center">
                                                        {slot ? (
                                                            <div>
                                                                <p className="text-blue-600 font-semibold">{slot.courseName}</p>
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
                        
                        <div className="flex justify-between mt-6">
                            <button
                                onClick={() => window.history.back()}
                                className="bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold py-3 px-6 rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all duration-300 transform hover:scale-105"
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
                            className="mt-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold py-3 px-6 rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all duration-300 transform hover:scale-105"
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
                            className="mt-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold py-3 px-6 rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all duration-300 transform hover:scale-105"
                        >
                            Back to Course Input
                        </button>
                    </div>
                )}
            </div>
        </>
    );
}
