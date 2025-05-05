import Nav from "./navbar.jsx";
import { useState } from "react";

export default function TqSolver() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [solutions, setSolutions] = useState(null);

  console.log("TqSolver component mounted");

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
      <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 flex flex-col items-center justify-center p-4">
        <h1 className="text-3xl sm:text-4xl mt-10 font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 mb-8 animate-pulse text-center">
          Solve your TQ
        </h1>

        <div className="w-full max-w-md space-y-4">
          <div className="text-sm text-gray-600 text-center">
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
            <p className="text-sm text-gray-700 text-center">
              Uploaded file: {file.name} ({(file.size / 1024).toFixed(2)} KB)
            </p>
          )}

          {error && (
            <p className="text-red-500 text-sm text-center">{error}</p>
          )}

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
              <span className="text-gray-600">Processing...</span>
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
            <div className="mt-6 w-full">
              <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">
                Solutions
              </h2>
              <div className="bg-white rounded-lg shadow-md p-6 max-h-96 max-w-250 overflow-y-auto">
                {Object.entries(solutions).map(([key, { question, solution }]) => (
                  <div
                    key={key}
                    className="mb-4 pb-4 border-b last:border-b-0 border-dotted border-gray-300"
                  >
                    <h3 className="text-lg font-semibold text-blue-600">
                      {key}: {question}
                    </h3>
                    <p className="text-gray-600 mt-2 whitespace-pre-wrap">
                      {solution}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}