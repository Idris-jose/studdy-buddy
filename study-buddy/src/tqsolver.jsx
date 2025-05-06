import Nav from "./navbar.jsx";
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from "react";
import confetti from 'canvas-confetti';

export default function TqSolver() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [solutions, setSolutions] = useState(null);
  const [theme, setTheme] = useState("galaxy"); // galaxy, ocean, forest, sunset
  const [dragActive, setDragActive] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);

  console.log("TqSolver component mounted");

  // Progress bar simulation during loading
  useEffect(() => {
    let interval;
    if (loading) {
      interval = setInterval(() => {
        setLoadingProgress(prev => {
          const newProgress = prev + Math.random() * 15;
          return newProgress > 90 ? 90 : newProgress;
        });
      }, 500);
    } else {
      setLoadingProgress(0);
    }
    
    return () => clearInterval(interval);
  }, [loading]);

  // Theme background gradients
  const themeStyles = {
    galaxy: "bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800",
    ocean: "bg-gradient-to-br from-blue-900 via-teal-800 to-blue-700",
    forest: "bg-gradient-to-br from-green-900 via-emerald-800 to-teal-700",
    sunset: "bg-gradient-to-br from-orange-700 via-red-600 to-pink-700"
  };

  // Theme text colors
  const themeTextColors = {
    galaxy: "text-purple-300",
    ocean: "text-teal-300",
    forest: "text-emerald-300",
    sunset: "text-orange-300"
  };

  // Theme accent colors
  const themeAccentColors = {
    galaxy: "from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600",
    ocean: "from-blue-500 to-teal-500 hover:from-blue-600 hover:to-teal-600",
    forest: "from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600",
    sunset: "from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600"
  };

  // Animation variants
  const buttonVariants = {
    hover: { scale: 1.05, transition: { duration: 0.3 } },
    tap: { scale: 0.95, transition: { duration: 0.2 } },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i) => ({ 
      opacity: 1, 
      y: 0, 
      transition: { 
        duration: 0.5, 
        ease: 'easeOut',
        delay: i * 0.1
      } 
    }),
  };

  const errorVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
    exit: { opacity: 0, scale: 0.8, transition: { duration: 0.2 } }
  };

  const fileIconVariants = {
    idle: { rotate: 0 },
    hover: { rotate: [0, -10, 10, -5, 5, 0], transition: { duration: 0.5 } }
  };

  const themeButtonVariants = {
    hover: { y: -3, boxShadow: "0px 10px 15px rgba(0, 0, 0, 0.1)" },
    tap: { y: 0, boxShadow: "0px 0px 0px rgba(0, 0, 0, 0.0)" }
  };

  // Function to trigger confetti when solutions are loaded
  const celebrateSuccess = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  const handleFileChange = (event) => {
    const uploadedFile = event.target.files[0];
    console.log("File input changed:", uploadedFile);
    if (uploadedFile) {
      if (uploadedFile.type !== "application/pdf") {
        setError("Please upload a .pdf file.");
        setFile(null);
        return;
      }
      if (uploadedFile.size > 5 * 1024 * 1024) {
        setError("File size too large (max 5MB)");
        setFile(null);
        return;
      }
      setFile(uploadedFile);
      setError("");
      setSolutions(null);
      console.log("File uploaded:", uploadedFile.name);
    }
  };

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
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile.type !== "application/pdf") {
        setError("Please drop a .pdf file.");
        return;
      }
      if (droppedFile.size > 5 * 1024 * 1024) {
        setError("File size too large (max 5MB)");
        return;
      }
      setFile(droppedFile);
      setError("");
      setSolutions(null);
    }
  };

  const handleSolve = async () => {
    console.log("Solve button clicked");
    if (!file) {
      setError("Please upload a .pdf file first.");
      return;
    }

    setLoading(true);
    setError("");
    setSolutions(null);

    try {
      console.log("Uploading PDF file...");
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('http://localhost:5000/upload', {
        method: 'POST',
        body: formData,
      });

      console.log("Backend response status:", response.status);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to process PDF');
      }

      const data = await response.json();
      console.log("Backend data:", data);

      if (!data.solutions || typeof data.solutions !== "object") {
        throw new Error("Invalid solutions format returned from backend.");
      }

      const isValidSolution = Object.values(data.solutions).every(
        (item) => item && typeof item === "object" && "question" in item && "solution" in item
      );

      if (!isValidSolution) {
        throw new Error("Backend returned solutions in unexpected format.");
      }

      console.log("Parsed solutions:", data.solutions);
      
      // Short delay to complete progress animation
      setTimeout(() => {
        setSolutions(data.solutions);
        setLoadingProgress(100);
        celebrateSuccess();
      }, 500);
      
    } catch (err) {
      setError(`Error: ${err.message}`);
      console.error("Error details:", err);
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, 600);
    }
  };

  return (
    <>
      <Nav />
      <div className={`min-h-screen mt-15 ${themeStyles[theme]} text-white flex flex-col items-center justify-center p-4 transition-colors duration-700`}>
        {/* Theme switcher */}
        <div className="absolute top-20 right-4 flex space-x-2">
          <motion.button 
            variants={themeButtonVariants}
            whileHover="hover"
            whileTap="tap"
            onClick={() => setTheme("galaxy")}
            className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-900 to-purple-800 border-2 border-indigo-300"
            aria-label="Galaxy theme"
          />
          <motion.button 
            variants={themeButtonVariants}
            whileHover="hover"
            whileTap="tap"
            onClick={() => setTheme("ocean")}
            className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-800 to-teal-700 border-2 border-blue-300"
            aria-label="Ocean theme"
          />
          <motion.button 
            variants={themeButtonVariants}
            whileHover="hover"
            whileTap="tap"
            onClick={() => setTheme("forest")}
            className="w-8 h-8 rounded-full bg-gradient-to-br from-green-800 to-emerald-700 border-2 border-green-300"
            aria-label="Forest theme"
          />
          <motion.button 
            variants={themeButtonVariants}
            whileHover="hover"
            whileTap="tap"
            onClick={() => setTheme("sunset")}
            className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-700 to-pink-600 border-2 border-orange-300"
            aria-label="Sunset theme"
          />
        </div>
        
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <motion.h1
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className={`text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r ${themeAccentColors[theme]} mb-6 text-center`}
          >
            Master Your Tutorial Questions
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className={`text-base sm:text-lg ${themeTextColors[theme]} mb-8 text-center max-w-lg sm:max-w-2xl`}
          >
            Upload a PDF with your questions to receive detailed solutions and curated resources from trusted platforms like Khan Academy or MIT OpenCourseWare. Tip: Structure your PDF with clear, numbered questions for the best results!
          </motion.p>
        </motion.div>

        <div className="w-full max-w-sm sm:max-w-md space-y-4">
          <div className={`text-xs sm:text-sm ${themeTextColors[theme]} text-center`}>
            Upload a .pdf file with questions (e.g., "Q1: What is 2 + 2?").
          </div>
          
          {/* Drag and drop area */}
          <div 
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            className={`relative border-dashed border-2 rounded-lg p-6 text-center transition-all duration-300 ${
              dragActive 
                ? 'border-white bg-opacity-20 bg-white' 
                : `border-${themeTextColors[theme].split('-')[1]}-400 bg-opacity-10 bg-white`
            }`}
          >
            <motion.div 
              className="flex flex-col items-center justify-center"
              initial="idle"
              whileHover="hover"
              animate={dragActive ? "hover" : "idle"}
            >
              <motion.svg 
                variants={fileIconVariants}
                className={`w-12 h-12 mb-3 ${themeTextColors[theme]}`} 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24" 
                xmlns="http://www.w3.org/2000/svg"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
              </motion.svg>
              
              <p className={`${themeTextColors[theme]} font-medium mb-2`}>
                {dragActive ? "Drop your PDF here" : "Drag & drop your PDF here"}
              </p>
              
              <p className="text-white text-opacity-70 text-sm mb-4">or</p>
              
              <label className={`cursor-pointer py-2 px-6 rounded-full bg-gradient-to-r ${themeAccentColors[theme]} hover:shadow-lg transition duration-300 text-white font-semibold`}>
                Browse Files
                <input
                  type="file"
                  accept="application/pdf"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </label>
            </motion.div>
          </div>

          {file && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex items-center bg-white bg-opacity-10 rounded-lg p-3 text-xs sm:text-sm ${themeTextColors[theme]}`}
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
              </svg>
              <span className="truncate flex-1">
                {file.name} ({(file.size / 1024).toFixed(2)} KB)
              </span>
              <button 
                onClick={() => setFile(null)} 
                className="ml-2 text-white text-opacity-70 hover:text-opacity-100"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </motion.div>
          )}

          <AnimatePresence>
            {error && (
              <motion.div
                variants={errorVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="bg-red-900 bg-opacity-60 border border-red-500 text-red-200 text-xs sm:text-sm p-3 rounded-lg flex items-center"
              >
                <svg className="w-5 h-5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <span>{error}</span>
              </motion.div>
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
                <span className={`text-xs ${themeTextColors[theme]}`}>Analyzing questions...</span>
                <span className={`text-xs ${themeTextColors[theme]}`}>{Math.round(loadingProgress)}%</span>
              </div>
              <div className="h-2 bg-white bg-opacity-20 rounded-full overflow-hidden">
                <motion.div 
                  className={`h-full bg-gradient-to-r ${themeAccentColors[theme]}`}
                  initial={{ width: "0%" }}
                  animate={{ width: `${loadingProgress}%` }}
                  transition={{ ease: "easeInOut" }}
                />
              </div>
              <div className="flex justify-center space-x-2 mt-2">
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    className={`w-2 h-2 rounded-full bg-gradient-to-r ${themeAccentColors[theme]}`}
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
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
              onClick={handleSolve}
              disabled={loading}
              className={`w-full py-3.5 rounded-lg font-bold text-white transition-all duration-300 shadow-lg ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : `bg-gradient-to-r ${themeAccentColors[theme]} shadow-${themeTextColors[theme].split('-')[1]}-500/30`
              }`}
            >
              <span className="flex items-center justify-center">
                <svg 
                  className="mr-2 w-5 h-5" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24" 
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
                </svg>
                Solve Questions
              </span>
            </motion.button>
          )}

          {solutions && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="mt-10 w-full max-w-full sm:max-w-lg md:max-w-2xl lg:max-w-4xl"
            >
              <motion.h2 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className={`text-2xl sm:text-3xl font-bold ${themeTextColors[theme]} mb-6 text-center flex justify-center items-center`}
              >
                <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                Your Solutions
              </motion.h2>
              <motion.div 
                className="bg-white bg-opacity-10 backdrop-blur-md rounded-2xl shadow-xl p-4 sm:p-6 md:p-8 border border-white border-opacity-20"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <AnimatePresence>
                  {Object.entries(solutions).map(([key, { question, solution, links }], i) => (
                    <motion.div
                      key={key}
                      custom={i}
                      variants={cardVariants}
                      initial="hidden"
                      animate="visible"
                      className="mb-4 sm:mb-6 pb-4 text-black sm:pb-6 border-b last:border-b-0 border-white border-opacity-10"
                    >
                      <div className="flex items-start">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center bg-gradient-to-r ${themeAccentColors[theme]} mr-3 flex-shrink-0 mt-1`}>
                          {key.replace("Q", "")}
                        </div>
                        <div>
                          <h3 className="text-lg sm:text-xl font-semibold text-blue-600 mb-2">
                            {question}
                          </h3>
                          <div className="bg-white bg-opacity-5 rounded-lg p-4 mt-3">
                            <p className="text-sm sm:text-base text-black text-opacity-90 whitespace-pre-wrap leading-relaxed">
                              {solution}
                            </p>
                          </div>
                          
                          {links && links.length > 0 ? (
                            <motion.div 
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              transition={{ delay: 0.7 + (i * 0.1), duration: 0.3 }}
                              className="mt-4"
                            >
                              <p className={`text-xs sm:text-sm font-semibold ${themeTextColors[theme]}`}>
                                Explore More:
                              </p>
                              <div className="mt-2 space-y-2">
                                {links.map((link, linkIndex) => (
                                  <motion.a
                                    key={linkIndex}
                                    whileHover={{ x: 5 }}
                                    href={link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center text-xs sm:text-sm text-white hover:text-blue-300 transition"
                                  >
                                    <svg className="w-4 h-4 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
                                    </svg>
                                    {link}
                                  </motion.a>
                                ))}
                              </div>
                            </motion.div>
                          ) : (
                            <p className="text-xs sm:text-sm text-white text-opacity-60 mt-4 italic">
                              No additional resources provided for this question.
                            </p>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
            </motion.div>
          )}
        </div>
      </div>
    </>
  );
}