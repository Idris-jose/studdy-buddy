import json
from flask import Flask, request, jsonify
from pdfminer.high_level import extract_text
import requests
import os
from werkzeug.utils import secure_filename
from flask_cors import CORS
from dotenv import load_dotenv

load_dotenv()

base_dir = os.path.abspath(os.path.dirname(__file__))
dist_folder = os.path.join(base_dir, '..', 'study-buddy', 'dist')

app = Flask(__name__, static_folder=dist_folder, static_url_path='/')
CORS(app)  # Enable CORS to allow React frontend to communicate
UPLOAD_FOLDER = 'Uploads'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# Gemini API configuration
GEMINI_API_KEY = os.getenv('VITE_GEMINI_API_KEY')  # Use environment variable
GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent'

def process_pdf(file):
    """Helper function to handle PDF upload and text extraction."""
    if not file or file.filename == '':
        return None, jsonify({'error': 'No file selected'}), 400
    
    if not file.filename.endswith('.pdf'):
        return None, jsonify({'error': 'Invalid file format, only PDFs allowed'}), 400
    
    filename = secure_filename(file.filename)
    file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
    file.save(file_path)
    
    try:
        # Extract text from PDF
        text = extract_text(file_path)
        if not text.strip():
            return None, jsonify({'error': 'No text could be extracted from the PDF'}), 400
        return text, None, None  # Return 3 values
    except Exception as e:
        return None, jsonify({'error': str(e)}), 500
    finally:
        if os.path.exists(file_path):
            os.remove(file_path)

def call_gemini_api(prompt):
    """Helper function to call Gemini API."""
    headers = {'Content-Type': 'application/json'}
    payload = {
        'contents': [{'parts': [{'text': prompt}]}],
        'generationConfig': {'response_mime_type': 'application/json'}
    }
    
    try:
        response = requests.post(
            f'{GEMINI_API_URL}?key={GEMINI_API_KEY}',
            json=payload,
            headers=headers,
            timeout=60
        )
        
        print(f"Gemini API response status: {response.status_code}")  # Debug log
        
        if response.status_code != 200:
            error_data = response.json().get('error', {})
            error_msg = error_data.get('message', 'Gemini API request failed')
            print(f"Gemini API error: {error_msg}")  # Debug log
            return None, jsonify({'error': error_msg}), 500
        
        data = response.json()
        print(f"Gemini API raw response: {data}")  # Debug log
        
        content = data.get('candidates', [{}])[0].get('content', {}).get('parts', [{}])[0].get('text')
        
        if not content:
            print("No content in Gemini API response")  # Debug log
            return None, jsonify({'error': 'No content returned from Gemini API'}), 500
        
        print(f"Gemini API content: {content}")  # Debug log
        
        try:
            result = json.loads(content)
            print(f"Parsed result: {result}")  # Debug log
            
            if not result or not isinstance(result, dict):
                print("Invalid result format - not a dictionary")  # Debug log
                return None, jsonify({'error': 'Invalid response format from Gemini API'}), 500
            
            # Validate that it has the expected structure
            if not any(key.startswith(('Q', 'q')) for key in result.keys()):
                print("No question keys found in result")  # Debug log
                return None, jsonify({'error': 'No questions found in API response'}), 500
                
            return result, None, None
        except json.JSONDecodeError as e:
            print(f"JSON decode error: {e}")  # Debug log
            print(f"Raw content that failed to parse: {content}")  # Debug log
            return None, jsonify({'error': f'Invalid JSON format from Gemini API: {str(e)}'}), 500
            
    except requests.exceptions.Timeout:
        print("Gemini API timeout")  # Debug log
        return None, jsonify({'error': 'Gemini API request timed out'}), 500
    except requests.exceptions.RequestException as e:
        print(f"Gemini API request exception: {e}")  # Debug log
        return None, jsonify({'error': f'Network error: {str(e)}'}), 500
    
@app.route('/upload', methods=['POST'])
def upload_pdf():
    """Endpoint to solve questions from uploaded PDF."""
    if 'file' not in request.files:
        return jsonify({'error': 'No file uploaded'}), 400
    
    file = request.files['file']
    text, error_response, status_code = process_pdf(file)  # Now expecting 3 values
    if error_response:
        return error_response

    # Prepare prompt for solving questions
    prompt = f"""
        You are an expert tutor with a strong background in mathematics and problem-solving. The following text contains questions from a test or questionnaire (TQ). Analyze the text, identify the questions, and provide clear, concise, and accurate solutions for each question. Pay special attention to mathematical problems, ensuring that all calculations are correct and explanations are thorough. Format the response as a JSON object where each key is a question number or identifier (e.g., "Q1", "Q2") and the value is an object with "question" (the question text) and "solution" (the answer or explanation). If the questions are not clearly numbered, infer the structure and assign identifiers. If the text is unclear, provide your best interpretation.

        For mathematical problems, include step-by-step solutions where applicable, and ensure that the final answer is clearly stated.

        For best results, expect the text to be structured like:
        Q1: What is 2 + 2?
        Q2: Solve for x: 2x + 3 = 7.
        Or similar clear formats.

        Text from file:
        {text}

        Return the response in the following format:
        {{
          "Q1": {{ "question": "Question text", "solution": "Solution text" }},
          "Q2": {{ "question": "Question text", "solution": "Solution text" }},
          ...
        }}
    """

    result, error_response, status_code = call_gemini_api(prompt)  # Now expecting 3 values
    if error_response:
        return error_response
    
    return jsonify({'solutions': result})

@app.route('/generate-notes', methods=['POST'])
def generate_notes():
    """Endpoint to generate extensive notes from uploaded PDF."""
    if 'file' not in request.files:
        return jsonify({'error': 'No file uploaded'}), 400
    
    file = request.files['file']
    text, error_response, status_code = process_pdf(file)  # Now expecting 3 values
    if error_response:
        return error_response

    # Prepare prompt for generating notes
    prompt = f"""
        You are an expert educator skilled in creating comprehensive study materials. The following text is extracted from a PDF document. Analyze the text and generate extensive, well-structured notes that summarize and explain the key concepts, ideas, and details in the document. If the text includes questions, identify the topics from the questions and generate notes about those topics instead of answering the questions directly. The notes should be clear, concise, and suitable for university-level study, organized with headings, bullet points, or numbered lists as appropriate. Focus on clarity, educational value, and retaining all critical information. If the text is unclear or ambiguous, make reasonable interpretations and note any assumptions made.

        Text from file:
        {text}

        Return the response as a JSON object with a single field "notes" containing the generated notes as a string.
        Example format:
        {{
          "notes": "Generated notes text with headings, bullet points, etc."
        }}
    """

    result, error_response, status_code = call_gemini_api(prompt)  # Now expecting 3 values
    if error_response:
        return error_response
    
    return jsonify(result)

@app.route('/')
def serve_frontend():
    """Serve the React frontend."""
    return app.send_static_file('index.html')

@app.route('/<path:path>')
def serve_static(path):
    """Serve static files for the React app."""
    return app.send_static_file(path)

if __name__ == '__main__':
    app.run(debug=True, port=5000)