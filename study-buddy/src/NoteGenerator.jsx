import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Nav from './navbar.jsx';
import confetti from 'canvas-confetti';

export default function NoteGenerator() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [notes, setNotes] = useState('');
  const [theme, setTheme] = useState('galaxy'); // Theme options: galaxy, forest, ocean, sunset
  const [dragActive, setDragActive] = useState(false);
  const [showTips, setShowTips] = useState(false);

  // Theme configurations
  const themes = {
    galaxy: {
      bg: "bg-gradient-to-br from-purple-900 via-indigo-800 to-blue-900",
      card: "bg-indigo-900/40 backdrop-blur-md border border-indigo-500/30",
      heading: "bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400",
      button: "bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700",
      text: "text-indigo-100",
      highlight: "text-pink-300",
      icon: "🌌"
    },
    forest: {
      bg: "bg-gradient-to-br from-green-900 via-emerald-800 to-teal-900",
      card: "bg-emerald-900/40 backdrop-blur-md border border-emerald-500/30",
      heading: "bg-gradient-to-r from-green-400 via-emerald-400 to-teal-400",
      button: "bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700",
      text: "text-emerald-100",
      highlight: "text-teal-300",
      icon: "🌳"
    },
    ocean: {
      bg: "bg-gradient-to-br from-blue-900 via-cyan-800 to-teal-900",
      card: "bg-blue-900/40 backdrop-blur-md border border-blue-500/30",
      heading: "bg-gradient-to-r from-blue-400 via-cyan-400 to-teal-400",
      button: "bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700",
      text: "text-blue-100",
      highlight: "text-cyan-300",
      icon: "🌊"
    },
    sunset: {
      bg: "bg-gradient-to-br from-red-900 via-orange-800 to-amber-900",
      card: "bg-orange-900/40 backdrop-blur-md border border-orange-500/30",
      heading: "bg-gradient-to-r from-red-400 via-orange-400 to-amber-400",
      button: "bg-gradient-to-r from-red-500 to-orange-600 hover:from-red-600 hover:to-orange-700",
      text: "text-orange-100",
      highlight: "text-amber-300",
      icon: "🌅"
    }
  };

  const currentTheme = themes[theme];

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

  const handleGenerateNotes = async () => {
    if (!file) {
      setError('Please upload a .pdf file first.');
      return;
    }

    setLoading(true);
    setError('');
    setNotes('');

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('http://localhost:5000/generate-notes', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to process PDF');
      }

      const data = await response.json();
      if (!data.notes || typeof data.notes !== 'string') {
        throw new Error('Invalid notes format returned from backend.');
      }

      setNotes(data.notes);
      
      // Celebrate success with confetti
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (err) {
      setError(`Error: ${err.message}`);
      console.error('Error details:', err);
    } finally {
      setLoading(false);
    }
  };

  const getRandomTip = () => {
    return studyTips[Math.floor(Math.random() * studyTips.length)];
  };

  return (
    <>
      <Nav />
      <div className={`min-h-screen ${currentTheme.bg} flex flex-col items-center justify-center p-6`}>
        <div className="absolute top-20 right-6 flex gap-2 z-10">
          {Object.keys(themes).map((themeName) => (
            <motion.button
              key={themeName}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setTheme(themeName)}
              className={`w-10 h-10 rounded-full flex items-center justify-center text-xl
                ${theme === themeName ? 'ring-4 ring-white' : ''}`}
              style={{
                background: themes[themeName].bg.replace('bg-', ''),
                opacity: theme === themeName ? 1 : 0.6
              }}
            >
              {themes[themeName].icon}
            </motion.button>
          ))}
        </div>

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
            <div className="relative w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-white/30 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
            <span className={`ms-3 text-sm font-medium ${currentTheme.text}`}>Study Tips</span>
          </label>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className={`text-5xl font-extrabold text-transparent bg-clip-text ${currentTheme.heading} mb-6 text-center`}
        >
          Smart Study Notes
        </motion.h1>
        
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className={`text-lg ${currentTheme.text} mb-8 text-center max-w-2xl`}
        >
          Transform your PDFs into comprehensive study notes with our AI-powered tool. Perfect for exam preparation!
        </motion.p>

        {showTips && (
          <motion.div
            variants={floatingVariants}
            animate="animate"
            className={`${currentTheme.card} rounded-xl p-4 mb-8 max-w-lg shadow-lg`}
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">💡</span>
              <p id="study-tip" className={`${currentTheme.highlight} font-medium`}>
                {getRandomTip()}
              </p>
            </div>
          </motion.div>
        )}

        <div className={`w-full max-w-lg ${currentTheme.card} rounded-2xl shadow-xl p-8`}>
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className={`text-sm ${currentTheme.text} text-center`}
            >
              Upload a .pdf file to generate notes (max 5MB).
            </motion.div>
            
            <motion.div
              onDragEnter={handleDrag}
              className={`${dragActive ? `border-dashed border-4 ${currentTheme.highlight} bg-opacity-20` : `border-dotted border-2 ${currentTheme.text} bg-opacity-10`} 
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
                className={`cursor-pointer ${currentTheme.text} font-semibold`}
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
                className={`text-sm ${currentTheme.text} p-3 rounded-lg flex items-center justify-between ${currentTheme.card}`}
              >
                <div className="flex items-center">
                  <span className="text-xl mr-2">📄</span>
                  <div>
                    <p className={`font-semibold ${currentTheme.highlight}`}>{file.name}</p>
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
                  className="text-red-400 text-sm text-center bg-red-900/30 p-3 rounded-lg border border-red-500/20"
                >
                  {error}
                </motion.p>
              )}
            </AnimatePresence>

            {loading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center space-y-3 py-4"
              >
                <div className="relative w-16 h-16">
                  <motion.div
                    animate={{
                      rotate: 360,
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      ease: "linear"
                    }}
                    className="absolute inset-0 rounded-full border-t-2 border-b-2 border-purple-400"
                  ></motion.div>
                  <motion.div
                    animate={{
                      rotate: -360,
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "linear"
                    }}
                    className="absolute inset-2 rounded-full border-r-2 border-l-2 border-pink-400"
                  ></motion.div>
                </div>
                <span className={`${currentTheme.highlight} font-medium`}>Creating your smart notes...</span>
                <p className={`text-xs ${currentTheme.text} max-w-xs text-center`}>
                  Our AI is analyzing your document, extracting key concepts, and organizing the information.
                </p>
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
                    : `${currentTheme.button}`
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
              className={`text-3xl font-bold text-transparent bg-clip-text ${currentTheme.heading} mb-6 text-center`}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              Your Smart Study Notes
            </motion.h2>
            <div className={`${currentTheme.card} rounded-2xl shadow-xl p-6 sm:p-8`}>
              <div className="flex justify-between items-center mb-4 pb-4 border-b border-white/10">
                <p className={`${currentTheme.highlight} font-semibold`}>Generated from: {file?.name}</p>
                <div className="flex gap-2">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white"
                    title="Copy to clipboard"
                    onClick={() => {
                      navigator.clipboard.writeText(notes);
                      // Show copy notification
                      const notification = document.getElementById('copy-notification');
                      if (notification) {
                        notification.classList.remove('opacity-0');
                        setTimeout(() => notification.classList.add('opacity-0'), 2000);
                      }
                    }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                      <path d="M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1h1a1 1 0 0 1 1 1V14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1h1v-1z"/>
                      <path d="M9.5 1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5h3zm-3-1A1.5 1.5 0 0 0 5 1.5v1A1.5 1.5 0 0 0 6.5 4h3A1.5 1.5 0 0 0 11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3z"/>
                    </svg>
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white"
                    title="Download as text file"
                    onClick={() => {
                      const element = document.createElement("a");
                      const file = new Blob([notes], {type: 'text/plain'});
                      element.href = URL.createObjectURL(file);
                      element.download = "study_notes.txt";
                      document.body.appendChild(element);
                      element.click();
                      document.body.removeChild(element);
                    }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                      <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z"/>
                      <path d="M7.646 11.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V1.5a.5.5 0 0 0-1 0v8.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3z"/>
                    </svg>
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
                className={`${currentTheme.text} whitespace-pre-wrap leading-relaxed py-2 px-4 max-h-[50vh] overflow-y-auto`}
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