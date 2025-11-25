import Nav from "./navbar.jsx";
import { useState, useEffect } from "react";
import { useTheme } from '../themecontext.jsx';

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

const API_URL = import.meta.env.VITE_API_URL;

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
    
    // Increase timeout to 120 seconds (2 minutes)
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 120000); // 120 seconds timeout
    
    const response = await fetch(`${API_URL}/upload`, {
      method: 'POST',
      body: formData,
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    
    console.log("Backend response status:", response.status);
    
    if (!response.ok) {
      let errorMessage = `Server error: ${response.status}`;
      try {
        const errorData = await response.json();
        errorMessage = errorData.error || errorMessage;
      } catch (e) {
        const errorText = await response.text();
        errorMessage = errorText || errorMessage;
      }
      throw new Error(errorMessage);
    }
    console.log("Using backend API URL:", API_URL);
    const data = await response.json();
    console.log("Raw backend response:", data);
    
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
    }, 500);
    
  } catch (err) {
    if (err.name === 'AbortError') {
      setError('Request timeout: The server took too long to respond. Please try again.');
    } else if (err.message.includes('Failed to fetch')) {
      setError('Cannot connect to the server. Please make sure the backend is running on http://127.0.0.1:5000');
    } else {
      setError(`Error: ${err.message}`);
    }
    console.error("Error details:", err);
  } finally {
    setTimeout(() => {
      setLoading(false);
    }, 600);
  }
};

 const handleCopySolutions = () => {
  if (!solutions) {
    alert("No solutions available to copy.");
    return;
  }

  const solutionsText = Object.entries(solutions)
    .map(([key, { question, solution, links }]) => {
      let text = `${key}: ${question}\nSolution: ${solution}`;
      if (links && links.length > 0) {
        text += `\nExplore More:\n${links.join('\n')}`;
      }
      return text;
    })
    .join('\n\n');

  navigator.clipboard.writeText(solutionsText).then(() => {
    const notification = document.getElementById('copy-notification');
    if (notification) {
      notification.classList.remove('opacity-0');
      setTimeout(() => notification.classList.add('opacity-0'), 2000);
    }
  }).catch(err => {
    console.error("Clipboard write failed:", err);
    alert("Failed to copy to clipboard.");
  });
};

const handleDownloadSolutions = () => {
  if (!solutions) {
    alert("No solutions available to download.");
    return;
  }

  const solutionsText = Object.entries(solutions)
    .map(([key, { question, solution, links }]) => {
      let text = `${key}: ${question}\nSolution: ${solution}`;
      if (links && links.length > 0) {
        text += `\nExplore More:\n${links.join('\n')}`;
      }
      return text;
    })
    .join('\n\n');

  const blob = new Blob([solutionsText], { type: 'text/plain' });
  const link = document.createElement('a');
  link.href = window.URL.createObjectURL(blob);
  link.download = 'solutions.txt';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(link.href);
};

  return (
    <>
      <Nav />
      <div className="min-h-screen mt-15 bg-white text-blue-700 flex flex-col items-center justify-center p-4">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-blue-700 mb-6 text-center">
          Master Your Tutorial Questions
        </h1>
        <p className="text-base sm:text-lg text-blue-700 mb-8 text-center max-w-lg sm:max-w-2xl">
          Upload a PDF with your questions to receive detailed solutions and curated resources from trusted platforms like Khan Academy or MIT OpenCourseWare. Tip: Structure your PDF with clear, numbered questions for the best results!
        </p>

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
                ? 'border-purple-400 bg-purple-50'
                : 'border-gray-300 bg-gray-50'
            }`}
          >
            <div className="flex flex-col items-center justify-center">
              <svg
                className="w-12 h-12 mb-3 text-blue-700"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
              </svg>
              <p className="text-blue-700 font-medium mb-2">
                {dragActive ? "Drop your PDF here" : "Drag & drop your PDF here"}
              </p>
              <p className="text-gray-500 text-sm mb-4">or</p>
              <label className="cursor-pointer py-2 px-6 rounded-full bg-purple-600 hover:bg-purple-700 text-white font-semibold">
                Browse Files
                <input
                  type="file"
                  accept="application/pdf"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </label>
            </div>
          </div>

          {file && (
            <div className="flex items-center bg-gray-100 border border-gray-300 rounded-lg p-3 text-xs sm:text-sm text-blue-700">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
              </svg>
              <span className="truncate flex-1">
                {file.name} ({(file.size / 1024).toFixed(2)} KB)
              </span>
              <button
                onClick={() => setFile(null)}
                className="ml-2 text-gray-500 hover:text-gray-700"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-500 text-red-500 text-xs sm:text-sm p-3 rounded-lg flex items-center">
              <svg className="w-5 h-5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <span>{error}</span>
            </div>
          )}

          {loading && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-blue-700">Analyzing questions...</span>
                <span className="text-xs text-blue-700">{Math.round(loadingProgress)}%</span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-purple-600 transition-all duration-300"
                  style={{ width: `${loadingProgress}%` }}
                />
              </div>
              <div className="flex justify-center space-x-2 mt-2">
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    className="w-2 h-2 rounded-full bg-purple-600 animate-pulse"
                    style={{ animationDelay: `${i * 0.2}s` }}
                  />
                ))}
              </div>
            </div>
          )}

          {file && !loading && (
            <button
              onClick={handleSolve}
              disabled={loading}
              className="w-full py-3.5 rounded-lg font-bold text-white transition-all duration-300 shadow-lg bg-purple-600 hover:bg-purple-700"
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
            </button>
          )}

          {solutions && (
            <div className="mt-10 w-full max-w-3xl">
              <h2 className="text-3xl font-bold text-blue-700 mb-6 text-center flex justify-center items-center">
                <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                Your Solutions
              </h2>
              <div className="bg-white border border-gray-300 rounded-2xl shadow-xl p-6 sm:p-8">
                <div className="flex justify-between items-center mb-4 pb-4 border-b border-gray-200">
                  <p className="text-blue-700 font-semibold">Generated from: {file?.name}</p>
                  <div className="flex gap-2">
                    <button
                      className="p-2 rounded-full bg-gray-100 hover:bg-gray-200"
                      title="Copy to clipboard"
                      onClick={handleCopySolutions}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                        <path d="M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1h1a1 1 0 0 1 1 1V14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1h1v-1z"/>
                        <path d="M9.5 1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5h3zm-3-1A1.5 1.5 0 0 0 5 1.5v1A1.5 1.5 0 0 0 6.5 4h3A1.5 1.5 0 0 0 11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3z"/>
                      </svg>
                    </button>
                    <button
                      className="p-2 rounded-full bg-gray-100 hover:bg-gray-200"
                      title="Download as text file"
                      onClick={handleDownloadSolutions}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                        <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z"/>
                        <path d="M7.646 11.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V1.5a.5.5 0 0 0-1 0v8.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3z"/>
                      </svg>
                    </button>
                  </div>
                  <div id="copy-notification" className="fixed top-4 right-4 bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg transition-opacity duration-300 opacity-0">
                    Copied to clipboard!
                  </div>
                </div>
                <div className="text-blue-700 whitespace-pre-wrap leading-relaxed py-2 px-4 max-h-[50vh] overflow-y-auto">
                  {Object.entries(solutions).map(([key, { question, solution, links }], i) => (
                    <div
                      key={key}
                      className="mb-4 sm:mb-6 pb-4 sm:pb-6 border-b last:border-b-0 border-gray-200"
                    >
                      <div className="flex items-start">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center bg-purple-600 mr-3 flex-shrink-0 mt-1 text-white">
                          {key.replace("Q", "")}
                        </div>
                        <div>
                          <h3 className="text-lg sm:text-xl font-semibold text-blue-700 mb-2">
                            {question}
                          </h3>
                          <p className="text-sm sm:text-base text-blue-700 whitespace-pre-wrap leading-relaxed">
                            {solution}
                          </p>
                          {links && links.length > 0 ? (
                            <div className="mt-4">
                              <p className="text-xs sm:text-sm font-semibold text-blue-700">
                                Explore More:
                              </p>
                              <div className="mt-2 space-y-2">
                                {links.map((link, linkIndex) => (
                                  <a
                                    key={linkIndex}
                                    href={link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center text-xs sm:text-sm text-blue-700 hover:text-blue-500 transition"
                                  >
                                    <svg className="w-4 h-4 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
                                    </svg>
                                    {link}
                                  </a>
                                ))}
                              </div>
                            </div>
                          ) : (
                            <p className="text-xs sm:text-sm text-blue-500 mt-4 italic">
                              No additional resources provided for this question.
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}