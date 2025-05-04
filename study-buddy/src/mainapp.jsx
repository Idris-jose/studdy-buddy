import { useNavigate } from 'react-router-dom';
import Nav from './navbar.jsx';


export default function MainApp() {
  const navigate = useNavigate();

  return (
<>

<Nav />

    <div className="flex mt-10 flex-col min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100">
     
      <div className="flex-1 flex flex-col items-center justify-center p-8">
        <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 mb-8 animate-pulse">
          Welcome to Study Buddy
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl">
          <div 
            onClick={() => navigate('/course-input')}
            className="bg-white rounded-2xl shadow-xl p-8 transform hover:scale-105 transition-transform duration-300 cursor-pointer"
          >
            <h2 className="text-2xl font-bold text-blue-600 mb-4">Course Input</h2>
            <p className="text-gray-600">
              Add your courses with details like course name, code, and units to get started.
            </p>
          </div>
          
          <div 
            onClick={() => navigate('/timetable')}
            className="bg-white rounded-2xl shadow-xl p-8 transform hover:scale-105 transition-transform duration-300 cursor-pointer"
          >
            <h2 className="text-2xl font-bold text-purple-600 mb-4">Timetable</h2>
            <p className="text-gray-600">
              View your personalized reading timetable based on your courses.
            </p>
          </div>
          
          <div 
            onClick={() => navigate('/syllabus')}
            className="bg-white rounded-2xl shadow-xl p-8 transform hover:scale-105 transition-transform duration-300 cursor-pointer"
          >
            <h2 className="text-2xl font-bold text-pink-600 mb-4">Syllabus</h2>
            <p className="text-gray-600">
              Generate a detailed reading syllabus for your selected courses.
            </p>
          </div>

          <div
            onClick={() => navigate('/tqsolver')}
            className="bg-white rounded-2xl shadow-xl p-8 transform hover:scale-105 transition-transform duration-300 cursor-pointer"
          >
            <h2 className="text-2xl font-bold text-green-600 mb-4">TQ Solver</h2>
            <p className="text-gray-600">
              Solve your TQ problems with our easy-to-use solver.
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-2xl font-bold text-indigo-600 mb-4">Quick Start</h2>
            <ol className="list-decimal pl-5 text-gray-600 space-y-2">
              <li>Add your courses in Course Input</li>
              <li>Generate your reading timetable</li>
              <li>Create syllabi for each course</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
</>
    
  );
}