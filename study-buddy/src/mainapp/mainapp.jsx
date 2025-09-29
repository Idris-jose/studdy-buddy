import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Nav from './navbar.jsx';
import { 
  Book, 
  Calendar, 
  FileText, 
  Puzzle, 
  StickyNote, 
  GraduationCap, 
  Clock, 
  Target,
  ArrowRight,
  CheckCircle
} from 'lucide-react';

export default function MainApp() {
  const navigate = useNavigate();
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);

  // Professional quotes for students
  const quotes = [
    "The expert in anything was once a beginner. — Helen Hayes",
    "Education is not the filling of a pot but the lighting of a fire. — W.B. Yeats",
    "The beautiful thing about learning is that no one can take it away from you. — B.B. King",
    "Success is the sum of small efforts, repeated day in and day out. — Robert Collier"
  ];

  useEffect(() => {
    // Change quote every 5 seconds
    const quoteInterval = setInterval(() => {
      setCurrentQuoteIndex((prev) => (prev + 1) % quotes.length);
    }, 5000);

    return () => clearInterval(quoteInterval);
  }, []);

  const features = [
    {
      title: "Course Input",
      description: "Add your courses with details like name, code, and credits to build your academic foundation.",
      tagline: "Organize your semester efficiently",
      path: "/course-input",
      icon: <FileText size={24} />,
      primary: true
    },
    {
      title: "Timetable Generator",
      description: "Create personalized study schedules tailored to your courses and learning preferences.",
      tagline: "Master time management",
      path: "/timetable",
      icon: <Calendar size={24} />
    },
    {
      title: "Syllabus Builder",
      description: "Generate detailed syllabi to break down courses into manageable study units.",
      tagline: "Stay ahead of coursework",
      path: "/syllabus",
      icon: <Book size={24} />
    },
    {
      title: "Tutorial Solver",
      description: "Get step-by-step guidance for tutorial questions and problem-solving.",
      tagline: "Boost problem-solving skills",
      path: "/tqsolver",
      icon: <Puzzle size={24} />
    },
    {
      title: "Note Generator",
      description: "Create organized, concise notes from your study materials to enhance retention.",
      tagline: "Simplify your learning process",
      path: "/notegenerator",
      icon: <StickyNote size={24} />
    }
  ];

  const steps = [
    "Add your courses to create a structured foundation",
    "Generate a personalized timetable for organized study sessions",
    "Build comprehensive syllabi for clear course roadmaps",
    "Use Tutorial Solver to master challenging concepts",
    "Create effective notes to support your learning"
  ];

  const stats = [
    { icon: <GraduationCap size={24} />, value: "5", label: "Study Tools" },
    { icon: <Clock size={24} />, value: "24/7", label: "Available" },
    { icon: <Target size={24} />, value: "100%", label: "Personalized" }
  ];

  return (
    <>
      <Nav />
      <div className="flex flex-col min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
        <div className="flex-1 flex flex-col items-center justify-center p-8 pt-24">
          {/* Hero Section */}
          <div className="text-center mb-12 max-w-4xl">
            <h1 className="text-4xl md:text-6xl font-bold text-blue-900 mb-6">
              Study Buddy
            </h1>

            <h2 className="text-xl md:text-2xl font-semibold text-blue-800 mb-6">
              Your Complete Academic Management Platform
            </h2>

            <p className="text-lg text-blue-700 max-w-3xl mx-auto leading-relaxed">
              Streamline your academic journey with comprehensive tools for course organization, 
              schedule management, and effective study planning.
            </p>
          </div>

          

          {/* Feature Grid */}
          <div className="w-full max-w-6xl mb-12">
            <h3 className="text-2xl font-bold text-blue-900 text-center mb-8">
              Comprehensive Study Tools
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((feature, index) => (
                <div
                  key={index}
                  onClick={() => navigate(feature.path)}
                  className={`bg-white rounded-lg shadow-md p-6 cursor-pointer border hover:shadow-lg transition-all duration-200 hover:border-blue-300 ${
                    feature.primary ? 'border-blue-500 ring-2 ring-blue-100' : 'border-gray-200'
                  }`}
                >
                  <div className="flex items-center mb-4">
                    <div className={`p-2 rounded-lg mr-3 ${
                      feature.primary ? 'bg-blue-600 text-white' : 'bg-blue-100 text-blue-600'
                    }`}>
                      {feature.icon}
                    </div>
                    <h3 className="text-lg font-semibold text-blue-900">{feature.title}</h3>
                  </div>

                  <p className="text-gray-700 mb-4 text-sm leading-relaxed">
                    {feature.description}
                  </p>

                  <div className="flex items-center justify-between">
                    <span className="text-xs text-blue-600 font-medium">{feature.tagline}</span>
                    <ArrowRight size={16} className="text-blue-500" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Learning Path Section */}
          <div className="bg-white rounded-lg shadow-md p-8 max-w-4xl w-full mb-8">
            <div className="flex items-center mb-8">
              <div className="p-2 bg-blue-100 rounded-lg mr-3">
                <Book size={28} className="text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold text-blue-900">Your Learning Journey</h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Steps */}
              <div>
                <h3 className="text-lg font-semibold text-blue-800 mb-4">Step-by-Step Process</h3>
                <div className="space-y-4">
                  {steps.map((step, index) => (
                    <div key={index} className="flex items-start">
                      <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-semibold mr-3">
                        {index + 1}
                      </div>
                      <p className="text-gray-700 text-sm leading-relaxed pt-1">{step}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tips */}
              <div>
                <h3 className="text-lg font-semibold text-blue-800 mb-4">Success Tips</h3>
                <div className="space-y-4">
                  <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                    <div className="flex items-center mb-2">
                      <CheckCircle size={20} className="text-blue-600 mr-2" />
                      <span className="font-medium text-blue-900">Consistency</span>
                    </div>
                    <p className="text-sm text-blue-700">
                      Dedicate 25-30 minutes daily to each subject for optimal retention.
                    </p>
                  </div>
                  
                  <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                    <div className="flex items-center mb-2">
                      <Target size={20} className="text-green-600 mr-2" />
                      <span className="font-medium text-green-900">Organization</span>
                    </div>
                    <p className="text-sm text-green-700">
                      Keep your courses and schedules organized for maximum productivity.
                    </p>
                  </div>

                  <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                    <div className="flex items-center mb-2">
                      <Clock size={20} className="text-purple-600 mr-2" />
                      <span className="font-medium text-purple-900">Time Management</span>
                    </div>
                    <p className="text-sm text-purple-700">
                      Use the timetable feature to balance study time across all subjects.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Call to Action */}
          <div className="text-center">
            <button
              onClick={() => navigate('/course-input')}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-4 rounded-lg shadow-md transition-colors duration-200 flex items-center mx-auto"
            >
              <GraduationCap size={20} className="mr-2" />
              Start Your Academic Journey
            </button>
            <p className="text-sm text-blue-600 mt-3">
              Begin by adding your courses to unlock all features
            </p>
          </div>
        </div>

        {/* Footer */}
        <footer className="bg-white border-t border-blue-200 py-6 mt-12">
          <div className="max-w-6xl mx-auto px-8 text-center">
            <p className="text-blue-600 text-sm">
              Study Buddy - Empowering students with intelligent academic management tools
            </p>
          </div>
        </footer>
      </div>
    </>
  );
}