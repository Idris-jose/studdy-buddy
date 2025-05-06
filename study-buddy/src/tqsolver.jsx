import Nav from "./navbar.jsx";
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from "react";

export default function TqSolver() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [solutions, setSolutions] = useState(null);

  console.log("TqSolver component mounted");

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
      setSolutions(data.solutions);
    } catch (err) {
      setError(`Error: ${err.message}`);
      console.error("Error details:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Nav />
      <div className="min-h-screen mt-15 bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 flex flex-col items-center justify-center p-4">
        <motion.h1
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-purple-700 mb-6 text-center"
        >
          Master Your Tutorial Questions
        </motion.h1>
        <p className="text-base sm:text-lg text-gray-700 mb-8 text-center max-w-lg sm:max-w-2xl">
          Upload a PDF with your questions to receive detailed solutions and curated resources from trusted platforms like Khan Academy or MIT OpenCourseWare. Tip: Structure your PDF with clear, numbered questions for the best results!
        </p>

        <div className="w-full max-w-sm sm:max-w-md space-y-4">
          <div className="text-xs sm:text-sm text-gray-600 text-center">
            Upload a .pdf file with questions (e.g., "Q1: What is 2 + 2?").
          </div>
          <label className="cursor-pointer border-dotted border-2 border-black w-full bg-blue-200 text-black py-2 px-4 rounded-lg hover:bg-blue-300 transition text-center block">
            Upload TQ File (.pdf)
            <input
              type="file"
              accept="application/pdf"
              className="hidden"
              onChange={handleFileChange}
            />
          </label>

          {file && (
            <p className="text-xs sm:text-sm text-gray-700 text-center">
              Uploaded file: {file.name} ({(file.size / 1024).toFixed(2)} KB)
            </p>
          )}

          <AnimatePresence>
            {error && (
              <motion.p
                variants={errorVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
                className="text-red-500 text-xs sm:text-sm text-center bg-red-50 p-3 rounded-lg"
              >
                {error}
              </motion.p>
            )}
          </AnimatePresence>

          {loading && (
            <div className="flex items-center justify-center space-x-2">
              <svg
                className="animate-spin h-5 w-5 text-blue-500"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              <span className="text-gray-600 text-xs sm:text-sm">Processing...</span>
            </div>
          )}

          {file && !loading && (
            <button
              onClick={handleSolve}
              disabled={loading}
              className={`w-full py-3 rounded-lg font-bold text-white transition-all duration-300 ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 transform hover:scale-105"
              }`}
            >
              Solve Questions
            </button>
          )}

          {solutions && (
            <div className="mt-10 w-full max-w-full sm:max-w-lg md:max-w-2xl lg:max-w-4xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6 text-center">
                Your Solutions
              </h2>
              <div className="bg-white rounded-2xl shadow-xl  items-center jus p-4 sm:p-6 md:p-8">
                <AnimatePresence>
                  {Object.entries(solutions).map(([key, { question, solution, links }]) => (
                    <motion.div
                      key={key}
                      variants={cardVariants}
                      initial="hidden"
                      animate="visible"
                      className="mb-4 sm:mb-6 pb-4 sm:pb-6 border-b last:border-b-0 border-gray-200"
                    >
                      <h3 className="text-lg sm:text-xl font-semibold text-blue-700 mb-2">
                        {key}: {question}
                      </h3>
                      <p className="text-sm sm:text-base text-gray-600 mt-2 whitespace-pre-wrap leading-relaxed">
                        {solution}
                      </p>
                      {links && links.length > 0 ? (
                        <div className="mt-4">
                          <p className="text-xs sm:text-sm font-semibold text-gray-800">
                            Explore More:
                          </p>
                          <ul className="list-disc pl-4 sm:pl-6 text-xs sm:text-sm text-gray-700">
                            {links.map((link, linkIndex) => (
                              <li key={linkIndex} className="flex items-center gap-2 sm:gap-3 mt-2">
                                <a
                                  href={link}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-blue-600 hover:underline hover:text-blue-800 transition"
                                >
                                  {link}
                                </a>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ) : (
                        <p className="text-xs sm:text-sm text-gray-500 mt-4 italic">
                          No additional resources provided for this question.
                        </p>
                      )}
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}