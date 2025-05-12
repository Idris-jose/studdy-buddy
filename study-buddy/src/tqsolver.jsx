import Nav from "./navbar.jsx";
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from "react";
import confetti from 'canvas-confetti';
import { useTheme } from './themecontext.jsx';

export default function TqSolver() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [solutions, setSolutions] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);

  const { theme, themeColors } = useTheme();

  console.log("TqSolver component mounted");

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

// Use environment variable for API URL
const API_URL = process.env.REACT_APP_API_URL || 'http://127.0.0.1:5000';

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
    console.log("Uploading PDF file to:", `${API_URL}/upload`);
    const formData = new FormData();
    formData.append('file', file);
    const response = await fetch(`${API_URL}/upload`, {
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
  const handleCopySolutions = () => {
    const solutionsText = Object.entries(solutions)
      .map(([key, { question, solution, links }]) => {
        let text = `${key}: ${question}\nSolution: ${solution}`;
        if (links && links.length > 0) {
          text += `\nExplore More:\n${links.join('\n')}`;
        }
        return text;
      })
      .join('\n\n');
    navigator.clipboard.writeText(solutionsText);
    const notification = document.getElementById('copy-notification');
    if (notification) {
      notification.classList.remove('opacity-0');
      setTimeout(() => notification.classList.add('opacity-0'), 2000);
    }
  };

  const handleDownloadSolutions = () => {
    const solutionsText = Object.entries(solutions)
      .map(([key, { question, solution, links }]) => {
        let text = `${key}: ${question}\nSolution: ${solution}`;
        if (links && links.length > 0) {
          text += `\nExplore More:\n${links.join('\n')}`;
        }
        return text;
      })
      .join('\n\n');
    const element = document.createElement("a");
    const file = new Blob([solutionsText], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = "solutions.txt";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <>
      <Nav />
      <div className={`min-h-screen mt-15 bg-gradient-to-br ${themeColors[theme].bg} text-white flex flex-col items-center justify-center p-4 transition-colors duration-700`}>
        <motion.h1
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className={`text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r ${themeColors[theme].gradient} mb-6 text-center`}
        >
          Master Your Tutorial Questions
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className={`text-base sm:text-lg ${themeColors[theme].text} mb-8 text-center max-w-lg sm:max-w-2xl`}
        >
          Upload a PDF with your questions to receive detailed solutions and curated resources from trusted platforms like Khan Academy or MIT OpenCourseWare. Tip: Structure your PDF with clear, numbered questions for the best results!
        </motion.p>

        <div className="w-full max-w-sm sm:max-w-md space-y-4">
          <div className={`text-xs sm:text-sm ${themeColors[theme].text} text-center`}>
            Upload a .pdf file with questions (e.g., "Q1: What is 2 + 2?").
          </div>
          
          <div 
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            className={`relative border-dashed border-2 rounded-lg p-6 text-center transition-all duration-300 ${
              dragActive 
                ? 'border-white bg-opacity-20 bg-white' 
                : `border-${themeColors[theme].border.split('-')[1]}-400 bg-opacity-10 bg-white`
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
                className={`w-12 h-12 mb-3 ${themeColors[theme].text}`} 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24" 
                xmlns="http://www.w3.org/2000/svg"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
              </motion.svg>
              <p className={`${themeColors[theme].text} font-medium mb-2`}>
                {dragActive ? "Drop your PDF here" : "Drag & drop your PDF here"}
              </p>
              <p className="text-white text-opacity-70 text-sm mb-4">or</p>
              <label className={`cursor-pointer py-2 px-6 rounded-full bg-gradient-to-r ${themeColors[theme].gradient} ${themeColors[theme].hover} text-white font-semibold`}>
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
              className={`flex items-center bg-white/10 backdrop-blur-md border ${themeColors[theme].border} rounded-lg p-3 text-xs sm:text-sm ${themeColors[theme].text}`}
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
                className="bg-red-50 border border-red-500 text-red-500 text-xs sm:text-sm p-3 rounded-lg flex items-center"
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
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
              onClick={handleSolve}
              disabled={loading}
              className={`w-full py-3.5 rounded-lg font-bold text-white transition-all duration-300 shadow-lg ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : `bg-gradient-to-r ${themeColors[theme].gradient} ${themeColors[theme].hover} shadow-${themeColors[theme].border.split('-')[1]}-500/30`
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
              className="mt-10 w-full max-w-3xl"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
            >
              <motion.h2 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className={`text-3xl font-bold ${themeColors[theme].text} mb-6 text-center flex justify-center items-center`}
              >
                <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                Your Solutions
              </motion.h2>
              <div className={`bg-white/10 backdrop-blur-md border ${themeColors[theme].border} rounded-2xl shadow-xl p-6 sm:p-8`}>
                <div className="flex justify-between items-center mb-4 pb-4 border-b border-white/10">
                  <p className={`${themeColors[theme].text} font-semibold`}>Generated from: {file?.name}</p>
                  <div className="flex gap-2">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="p-2 rounded-full bg-white/10 hover:bg-white/20"
                      title="Copy to clipboard"
                      onClick={handleCopySolutions}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                        <path d="M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1h1a1 1 0 0 1 1 1V14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1h1v-1z"/>
                        <path d="M9.5 1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5h3zm-3-1A1.5 1.5 0 0 0 5 1.5v1A1.5 1.5 0 0 0 6.5 4h3A1.5 1.5 0 0 0 11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3z"/>
                      </svg>
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="p-2 rounded-full bg-white/10 hover:bg-white/20"
                      title="Download as text file"
                      onClick={handleDownloadSolutions}
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
                  className={`${themeColors[theme].text} whitespace-pre-wrap leading-relaxed py-2 px-4 max-h-[50vh] overflow-y-auto`}
                >
                  <AnimatePresence>
                    {Object.entries(solutions).map(([key, { question, solution, links }], i) => (
                      <motion.div
                        key={key}
                        custom={i}
                        variants={cardVariants}
                        initial="hidden"
                        animate="visible"
                        className="mb-4 sm:mb-6 pb-4 sm:pb-6 border-b last:border-b-0 border-white/10"
                      >
                        <div className="flex items-start">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center bg-gradient-to-r ${themeColors[theme].gradient} mr-3 flex-shrink-0 mt-1 text-white`}>
                            {key.replace("Q", "")}
                          </div>
                          <div>
                            <h3 className={`text-lg sm:text-xl font-semibold ${themeColors[theme].text} mb-2`}>
                              {question}
                            </h3>
                            <p className={`text-sm sm:text-base ${themeColors[theme].text} whitespace-pre-wrap leading-relaxed`}>
                              {solution}
                            </p>
                            {links && links.length > 0 ? (
                              <motion.div 
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                transition={{ delay: 0.7 + (i * 0.1), duration: 0.3 }}
                                className="mt-4"
                              >
                                <p className={`text-xs sm:text-sm font-semibold ${themeColors[theme].text}`}>
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
                                      className={`flex items-center text-xs sm:text-sm ${themeColors[theme].text} hover:text-blue-300 transition`}
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
                              <p className={`text-xs sm:text-sm ${themeColors[theme].text} text-opacity-60 mt-4 italic`}>
                                No additional resources provided for this question.
                              </p>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </motion.div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </>
  );
}