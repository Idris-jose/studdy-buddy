// Updated pdfWorker.js
import * as pdfjs from 'pdfjs-dist';

// Set the version explicitly to ensure matching
const PDFJS_VERSION = '3.4.120'; // Using a stable, known version

try {
  // First try CDN with our selected version
  pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${PDFJS_VERSION}/pdf.worker.min.js`;
  console.log(`Using PDF.js ${PDFJS_VERSION} worker from CDN`);
} catch (error) {
  console.error('Error setting worker:', error);
  
  // Fallback to unpkg if CDN fails
  try {
    pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${PDFJS_VERSION}/build/pdf.worker.min.js`;
    console.log(`Using PDF.js ${PDFJS_VERSION} worker from unpkg`);
  } catch (fallbackError) {
    console.error('Fallback worker setup failed:', fallbackError);
    throw new Error('PDF.js worker initialization failed');
  }
}

export default pdfjs;