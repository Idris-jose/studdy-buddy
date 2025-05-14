import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Nav from './navbar.jsx';
import confetti from 'canvas-confetti';
import { useTheme } from './themecontext.jsx';
import { Download,clipboard } from 'lucide-react';
export default function NoteGenerator() {
  const [file, setFile] = useState(null);
const [loading, setLoading] = useState(false);
const [error, setError] = useState('');
const [notes, setNotes] = useState('');
const [dragActive, setDragActive] = useState(false);
const [showTips, setShowTips] = useState(false);


  const { theme, themeColors, changeTheme } = useTheme();
  const [loadingProgress, setLoadingProgress] = useState(0);

  // Animation variants
  const buttonVariants = {
    hover: { scale: 1.05, transition: { duration: 0.3 } },
    tap: { scale: 0.95, transition: { duration: 0.2 } },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
  };

  const errorVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  };

  const floatingVariants = {
    animate: {
      y: [0, -10, 0],
      transition: {
        duration: 4,
        repeat: Infinity,
        repeatType: "reverse",
        ease: "easeInOut"
      }
    }
  };

  // Random study tips
  const studyTips = [
    "Break complex topics into smaller, manageable chunks for better understanding.",
    "Use the Pomodoro technique: 25 min of focused study followed by a 5 min break.",
    "Teaching concepts to others helps solidify your understanding.",
    "Create mind maps to visualize connections between different concepts.",
    "Review your notes within 24 hours of creating them to improve retention.",
    "Study in different locations to improve memory recall.",
    "Take regular breaks - your brain needs time to process information.",
    "Use practice tests to identify knowledge gaps and improve recall.",
  ];

  // Display random study tip every 30 seconds if tips are enabled
  useEffect(() => {
    if (!showTips) return;
    
    const intervalId = setInterval(() => {
      const tipElement = document.getElementById('study-tip');
      if (tipElement) {
        tipElement.classList.add('animate-pulse');
        setTimeout(() => tipElement.classList.remove('animate-pulse'), 1000);
      }
    }, 30000);
    
    return () => clearInterval(intervalId);
  }, [showTips]);

  const handleFileChange = (event) => {
    const uploadedFile = event.target?.files?.[0] || null;
    processFile(uploadedFile);
  };

  const processFile = (uploadedFile) => {
    if (uploadedFile) {
      if (uploadedFile.type !== 'application/pdf') {
        setError('Please upload a .pdf file.');
        setFile(null);
        return;
      }
      if (uploadedFile.size > 5 * 1024 * 1024) {
        setError('File size too large (max 5MB).');
        setFile(null);
        return;
      }
      setFile(uploadedFile);
      setError('');
      setNotes('');
    }
  };

  useEffect(() => {
  let interval;
  if (loading) {
    interval = setInterval(() => {
      setLoadingProgress(prev => {
        const newProgress = prev + Math.random() * 15;
        return newProgress >= 90 ? 90 : newProgress;
      });
    }, 500);
  } else {
    setLoadingProgress(0);
  }

  return () => clearInterval(interval);
}, [loading]);


  // Handle drag and drop
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:5000';


const handleGenerateNotes = async () => {
  console.log("Generate Notes button clicked");
  if (!file) {
    setError("Please upload a .pdf file first.");
    return;
  }
  
  setLoading(true);
  setError("");
  setNotes("");
  
  try {
    console.log("Uploading PDF file to:", `${API_URL}/generate-notes`);
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await fetch(`${API_URL}/generate-notes`, {
      method: 'POST',
      body: formData,
    });
    
    console.log("Backend response status:", response.status);
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP error ${response.status}`);
    }
    
    const data = await response.json();
    console.log("Raw backend response:", data); // Log the raw response
    
    if (!data.notes || typeof data.notes !== "string") {
      throw new Error("Invalid notes format returned from backend.");
    }
    
    console.log("Parsed notes:", data.notes.substring(0, 100) + "...");
    
    setTimeout(() => {
      setNotes(data.notes);
      celebrateSuccess();
    }, 500);
    
  } catch (err) {
    setError(`Error: ${err.message || 'Failed to connect to the server.'}`);
    console.error("Error details:", err);
  } finally {
    setTimeout(() => {
      setLoading(false);
    }, 600);
  }
};

// Helper function for success celebration
const celebrateSuccess = () => {
  confetti({
    particleCount: 100,
    spread: 70,
    origin: { y: 0.6 }
  });
};

// Function to get random tip (assuming studyTips is defined elsewhere)
const getRandomTip = () => {
  return studyTips[Math.floor(Math.random() * studyTips.length)];
};

 

  return (
    <>
      <Nav />
      <div className={`min-h-screen bg-gradient-to-br mt-15 ${themeColors[theme].bg} flex flex-col items-center justify-center p-6 transition-colors duration-700`}>
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="absolute top-20 right-6 z-10"
        >
         
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="absolute top-20 left-6 z-10"
        >
          <label className="inline-flex items-center cursor-pointer">
            <input 
              type="checkbox" 
              checked={showTips} 
              onChange={() => setShowTips(!showTips)} 
              className="sr-only peer"
            />
            <div className="relative w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-white/30 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gray-600"></div>
            <span className={`ms-3 text-sm font-medium ${themeColors[theme].text}`}>Study Tips</span>
          </label>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className={`text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r ${themeColors[theme].gradient} mb-6 text-center`}
        >
          Smart Study Notes
        </motion.h1>
        
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className={`text-lg ${themeColors[theme].text} mb-8 text-center max-w-2xl`}
        >
          Transform your PDFs into comprehensive study notes with our AI-powered tool. Perfect for exam preparation!
        </motion.p>

        {showTips && (
          <motion.div
            variants={floatingVariants}
            animate="animate"
            className={`bg-white/10 backdrop-blur-md border ${themeColors[theme].border} rounded-xl p-4 mb-8 max-w-lg shadow-lg`}
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">💡</span>
              <p id="study-tip" className={`${themeColors[theme].text} font-medium`}>
                {getRandomTip()}
              </p>
            </div>
          </motion.div>
        )}

        <div className={`w-full max-w-lg bg-white/10 backdrop-blur-md border ${themeColors[theme].border} rounded-2xl shadow-xl p-8`}>
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className={`text-sm ${themeColors[theme].text} text-center`}
            >
              Upload a .pdf file to generate notes (max 5MB).
            </motion.div>
            
            <motion.div
              onDragEnter={handleDrag}
              className={`${dragActive ? `border-dashed border-4 ${themeColors[theme].text} bg-opacity-20` : `border-dotted border-2 ${themeColors[theme].text} bg-opacity-10`} 
                w-full rounded-xl transition-all duration-300 text-center flex flex-col items-center justify-center py-10 px-6 cursor-pointer relative overflow-hidden`}
            >
              {dragActive && (
                <div 
                  className="absolute inset-0 z-10"
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                ></div>
              )}
              
              <motion.div
                animate={{ 
                  rotate: dragActive ? [0, -5, 5, -5, 5, 0] : 0,
                  scale: dragActive ? 1.1 : 1
                }}
                transition={{ duration: 0.5 }}
                className="text-4xl mb-4"
              >
                {file ? "📄" : "📁"}
              </motion.div>
              
              <motion.label
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
                className={`cursor-pointer ${themeColors[theme].text} font-semibold`}
              >
                {dragActive ? "Drop your PDF file here" : (file ? "Change file" : "Browse or drag & drop your PDF")}
                <input
                  type="file"
                  accept="application/pdf"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </motion.label>
            </motion.div>

            {file && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className={`text-sm ${themeColors[theme].text} p-3 rounded-lg flex items-center justify-between bg-white/10 backdrop-blur-md border ${themeColors[theme].border}`}
              >
                <div className="flex items-center">
                  <span className="text-xl mr-2">📄</span>
                  <div>
                    <p className={`font-semibold ${themeColors[theme].text}`}>{file.name}</p>
                    <p className="text-xs opacity-80">{(file.size / 1024).toFixed(2)} KB</p>
                  </div>
                </div>
                <button 
                  onClick={() => setFile(null)}
                  className="text-xs opacity-70 hover:opacity-100"
                >
                  Remove
                </button>
              </motion.div>
            )}

            <AnimatePresence>
              {error && (
                <motion.p
                  variants={errorVariants}
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  className="text-red-500 text-sm text-center bg-red-50 p-3 rounded-lg"
                >
                  {error}
                </motion.p>
              )}
            </AnimatePresence>

             {loading && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-2"
            >
              <div className="flex items-center justify-between">
                <span className={`text-xs ${themeColors[theme].text}`}>Analyzing questions...</span>
                <span className={`text-xs ${themeColors[theme].text}`}>{Math.round(loadingProgress)}%</span>
              </div>
              <div className="h-2 bg-white bg-opacity-20 rounded-full overflow-hidden">
                <motion.div 
                  className={`h-full bg-gradient-to-r ${themeColors[theme].gradient}`}
                  initial={{ width: "0%" }}
                  animate={{ width: `${loadingProgress}%` }}
                  transition={{ ease: "easeInOut" }}
                />
              </div>
              <div className="flex justify-center space-x-2 mt-2">
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    className={`w-2 h-2 rounded-full bg-gradient-to-r ${themeColors[theme].gradient}`}
                    animate={{
                      scale: [1, 1.5, 1],
                      opacity: [0.7, 1, 0.7],
                    }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      delay: i * 0.2,
                    }}
                  />
                ))}
              </div>
            </motion.div>
          )}

            {file && !loading && (
              <motion.button
                onClick={handleGenerateNotes}
                disabled={loading}
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
                className={`w-full py-3 rounded-xl font-bold text-white shadow-lg transition-all duration-300 ${
                  loading
                    ? 'bg-gray-500 cursor-not-allowed'
                    : `bg-gradient-to-r ${themeColors[theme].gradient} ${themeColors[theme].hover}`
                }`}
              >
                Generate Smart Notes
              </motion.button>
            )}
          </div>
        </div>

        {notes && (
          <motion.div 
            className="mt-10 w-full max-w-3xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            <motion.h2 
              className={`text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r ${themeColors[theme].gradient} mb-6 text-center`}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              Your Smart Study Notes
            </motion.h2>
            <div className={`bg-white/10 backdrop-blur-md border ${themeColors[theme].border} rounded-2xl shadow-xl p-6 sm:p-8`}>
              <div className="flex justify-between items-center mb-4 pb-4 border-b border-white/10">
                <p className={`${themeColors[theme].text} font-semibold`}>Generated from: {file?.name}</p>
                <div className="flex gap-2">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-black"
                    title="Copy to clipboard"
                    onClick={() => {
                      navigator.clipboard.writeText(notes);
                      const notification = document.getElementById('copy-notification');
                      if (notification) {
                        notification.classList.remove('opacity-0');
                        setTimeout(() => notification.classList.add('opacity-0'), 2000);
                      }
                    }}
                  >
                    <clipboard />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className=" rounded-full bg-white/10 hover:bg-white/20 text-black"
                    title="Download as text file"
                    onClick={() => {
                   const blob = new Blob([notes], { type: 'text/plain' });
                   const link = document.createElement('a');
                   link.href = window.URL.createObjectURL(blob);
                   link.download = 'study_notes.txt';
                   document.body.appendChild(link);
                   link.click();
                   document.body.removeChild(link);
                   window.URL.revokeObjectURL(link.href); // clean up

                    }}
                  >
                    <Download  />
                  </motion.button>
                </div>
                <div id="copy-notification" className="fixed top-4 right-4 bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg transition-opacity duration-300 opacity-0">
                  Copied to clipboard!
                </div>
              </div>
              <motion.div
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                className={`${themeColors[theme].text} whitespace-pre-wrap leading-relaxed py-2 px-4 max-h-[50vh] overflow-y-auto`}
              >
                {notes}
              </motion.div>
            </div>
          </motion.div>
        )}
      </div>
    </>
  );
}