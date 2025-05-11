// App.jsx - Updated with PDF worker import
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './Header.jsx';
import Section1 from './Section1.jsx';
import Section2 from './Section2.jsx';
import Section3 from './Section3.jsx';
import Footer from './Footer.jsx';
import Signup from './Signup.jsx';
import Login from './Login.jsx';
import Demo from './Demo.jsx';
import MainApp from './mainapp.jsx';
import CourseInput from './CourseInput.jsx';
import Timetable from './Timetable.jsx';
import Syllabus from './syllabus.jsx';
import TqSolver from './tqsolver.jsx'; 
import ErrorBoundary from './Errorboundary.jsx';
import NoteGenerator from './NoteGenerator.jsx';
import About from './about.jsx';
import BugBox from './bugbox.jsx';
import { ThemeProvider } from './themecontext.jsx';
// Load the PDF worker configuration early in the application lifecycle
import './pdfWorker.js';

// Home component to group sections for the homepage
const Home = () => (
  <>
    <Header />
    <div id='section1'>
    <Section1 />
    </div>
    <div id='section2'>
    <Section2 />
    </div>
    <div id='section3'>
    <Section3 />
    </div>
    
  </>
);

// Not Found component for 404 errors
const NotFound = () => (
  <div className="flex-1 flex items-center justify-center">
    <div className="text-center">
      <h2 className="text-3xl font-bold text-gray-800 mb-4">404 - Page Not Found</h2>
      <p className="text-gray-600">The page you're looking for doesn't exist.</p>
    </div>
  </div>
);

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
      <ErrorBoundary>
      <div className="flex flex-col min-h-screen">
        <main className="flex-1">
          <Routes>
            {/* Homepage route with sections */}
            <Route path="/" element={<Home />} />
            {/* Authentication routes */}
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
            {/* Demo route */}
            <Route path="/demo" element={<Demo />} />
            {/* Main application route */}
            <Route path="/mainapp" element={<MainApp />} />
            {/* Course Input route */}
            <Route path="/course-input" element={<CourseInput />} />
            {/* Timetable route */}
            <Route path="/timetable" element={<Timetable />} />
            {/* Syllabus route */}
           
            {/* TQ Solver route */}
            <Route path="/tqsolver" element={<TqSolver />} />
            {/* Catch-all route for 404 Not Found */}
            <Route path="*" element={<NotFound />} />
            {/* Note Generator route */}
            <Route path="/notegenerator" element={<NoteGenerator />} />
            <Route path='/about' element={<About/>} />
            <Route path='/bugbox' element={<BugBox/>} />
          </Routes>
        </main>
        {/* Footer is always present */}
        <Footer />
      </div>
      </ErrorBoundary>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;