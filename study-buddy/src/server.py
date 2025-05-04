
from flask import Flask, request, jsonify
from pdfminer.high_level import extract_text
import requests
import os
from werkzeug.utils import secure_filename
from flask_cors import CORS


app = Flask(__name__)
CORS(app)  # Enable CORS to allow React frontend to communicate
UPLOAD_FOLDER = 'uploads'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# Gemini API configuration
GEMINI_API_KEY = os.getenv('GEMINI_API_KEY', 'YOUR_GEMINI_API_KEY')  # Use environment variable or fallback
GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent'

@app.route('/upload', methods=['POST'])
def upload_pdf():
    if 'file' not in request.files:
        return jsonify({'error': 'No file uploaded'}), 400
    
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No file selected'}), 400
    
    if file and file.filename.endswith('.pdf'):
        filename = secure_filename(file.filename)
        file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(file_path)
        
        try:
            # Extract text from PDF
            text = extract_text(file_path)
            if not text.strip():
                return jsonify({'error': 'No text could be extracted from the PDF'}), 400

            # Prepare prompt for Gemini API (same as in your frontend)
            prompt = f"""
                You are an expert tutor. The following text contains questions from a test or questionnaire (TQ). Analyze the text, identify the questions, and provide clear, concise, and accurate solutions for each question. Format the response as a JSON object where each key is a question number or identifier (e.g., "Q1", "Q2") and the value is an object with "question" (the question text) and "solution" (the answer or explanation). If the questions are not clearly numbered, infer the structure and assign identifiers. If the text is unclear, provide your best interpretation.

                For best results, expect the text to be structured like:
                Q1: What is 2 + 2?
                Q2: Define gravity.
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

            # Send request to Gemini API
            headers = {'Content-Type': 'application/json'}
            payload = {
                'contents': [{'parts': [{'text': prompt}]}],
                'generationConfig': {'response_mime_type': 'application/json'}
            }
            response = requests.post(
                f'{GEMINI_API_URL}?key={GEMINI_API_KEY}',
                json=payload,
                headers=headers
            )

            if response.status_code != 200:
                error_data = response.json().get('error', {})
                return jsonify({'error': error_data.get('message', 'Gemini API request failed')}), 500

            data = response.json()
            content = data.get('candidates', [{}])[0].get('content', {}).get('parts', [{}])[0].get('text')
            if not content:
                return jsonify({'error': 'No content returned from Gemini API'}), 500

            try:
                solutions = json.loads(content)
                if not solutions or not isinstance(solutions, dict):
                    return jsonify({'error': 'Invalid solutions format from Gemini API'}), 500
                return jsonify({'solutions': solutions})
            except json.JSONDecodeError as e:
                return jsonify({'error': f'Invalid JSON format from Gemini API: {str(e)}'}), 500

        except Exception as e:
            return jsonify({'error': str(e)}), 500
        finally:
            if os.path.exists(file_path):
                os.remove(file_path)
    
    return jsonify({'error': 'Invalid file format, only PDFs allowed'}), 400

if __name__ == '__main__':
    app.run(debug=True, port=5000)