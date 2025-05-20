<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Study Buddy - README</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 800px; margin: 20px auto; padding: 0 20px;">
  <h1 style="color: #2c3e50; font-size: 2.5em; border-bottom: 2px solid #3498db; padding-bottom: 10px;">Study Buddy</h1>
  
  <h2 style="color: #34495e; font-size: 1.8em; margin-top: 20px;">Overview</h2>
  <p style="margin: 10px 0;">Study Buddy is a web application designed to help music students prepare for exams by generating personalized study timetables and syllabi. Users can input their courses, units, and academic level to create optimized schedules that prioritize courses with higher units. The app also allows users to generate syllabi by specifying a course and topics, leveraging AI to provide structured study plans. Additional features include study streaks, note generation, and a user-friendly interface for managing academic tasks.</p>

  <h2 style="color: #34495e; font-size: 1.8em; margin-top: 20px;">Tech Stack</h2>
  <ul style="list-style-type: disc; margin: 10px 0 10px 20px;">
    <li style="margin: 5px 0;"><strong>Frontend</strong>: React, JavaScript, HTML, Tailwind CSS</li>
    <li style="margin: 5px 0;"><strong>Backend</strong>: Supabase (for authentication and database)</li>
    <li style="margin: 5px 0;"><strong>AI Integration</strong>: Gemini API (for timetable and syllabus generation)</li>
    <li style="margin: 5px 0;"><strong>Routing</strong>: React Router</li>
    <li style="margin: 5px 0;"><strong>Tools</strong>: Vite (build tool), ESLint (linting), Git (version control)</li>
  </ul>

  <h2 style="color: #34495e; font-size: 1.8em; margin-top: 20px;">Code Overview</h2>
  <p style="margin: 10px 0;">The codebase is structured as a single-page React application with the following key components:</p>
  <ul style="list-style-type: disc; margin: 10px 0 10px 20px;">
    <li style="margin: 5px 0;"><strong>src/</strong>: Core source code.</li>
    <li style="margin: 5px 0;"><code style="background: #f4f4f4; padding: 2px 4px; border-radius: 3px;">App.jsx</code>: Main application component handling routing and layout.</li>
    <li style="margin: 5px 0;"><code style="background: #f4f4f4; padding: 2px 4px; border-radius: 3px;">CourseInput.jsx</code>: Form for users to input course details (e.g., units, level) to generate timetables.</li>
    <li style="margin: 5px 0;"><code style="background: #f4f4f4; padding: 2px 4px; border-radius: 3px;">SyllabusInput.jsx</code>: Form for generating syllabi based on course and topic inputs.</li>
    <li style="margin: 5px 0;"><code style="background: #f4f4f4; padding: 2px 4px; border-radius: 3px;">Login.jsx & Signup.jsx</code>: Authentication components integrated with Supabase.</li>
    <li style="margin: 5px 0;"><code style="background: #f4f4f4; padding: 2px 4px; border-radius: 3px;">Timetable.jsx</code>: Displays generated timetables.</li>
    <li style="margin: 5px 0;"><code style="background: #f4f4f4; padding: 2px 4px; border-radius: 3px;">Header.jsx & Footer.jsx</code>: UI components for navigation and layout.</li>
    <li style="margin: 5px 0;"><code style="background: #f4f4f4; padding: 2px 4px; border-radius: 3px;">main.jsx</code>: Entry point for rendering the React app.</li>
    <li style="margin: 5px 0;"><strong>public/</strong>: Static assets like images or icons.</li>
    <li style="margin: 5px 0;"><strong>Configuration</strong>:
      <ul style="list-style-type: circle; margin: 5px 0 5px 20px;">
        <li style="margin: 5px 0;"><code style="background: #f4f4f4; padding: 2px 4px; border-radius: 3px;">.env</code>: Environment variables for Supabase and Gemini API keys.</li>
        <li style="margin: 5px 0;"><code style="background: #f4f4f4; padding: 2px 4px; border-radius: 3px;">client.js</code>: Supabase client configuration for authentication and database queries.</li>
      </ul>
    </li>
  </ul>
  <p style="margin: 10px 0;">The app uses Tailwind CSS for responsive styling and React Router for navigation between pages.</p>

  <h2 style="color: #34495e; font-size: 1.8em; margin-top: 20px;">Installation</h2>
  <p style="margin: 10px 0;">To set up Study Buddy locally, follow these steps:</p>
  <pre style="background: #f4f4f4; padding: 10px; border-radius: 5px; overflow-x: auto;">
    <code>
# Clone the repository
git clone https://github.com/Idris-jose/studdy-buddy.git

# Navigate to the project directory
cd studdy-buddy

# Install dependencies
npm install
    </code>
  </pre>

  <h2 style="color: #34495e; font-size: 1.8em; margin-top: 20px;">Configuration</h2>
  <ol style="list-style-type: decimal; margin: 10px 0 10px 20px;">
    <li style="margin: 5px 0;">Create a <code style="background: #f4f4f4; padding: 2px 4px; border-radius: 3px;">.env</code> file in the root directory.</li>
    <li style="margin: 5px 0;">Add your Supabase and Gemini API keys:</li>
  </ol>
  <pre style="background: #f4f4f4; padding: 10px; border-radius: 5px; overflow-x: auto;">
    <code>
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
VITE_GEMINI_API_KEY=your-gemini-api-key
    </code>
  </pre>
  <p style="margin: 10px 0;">Ensure you have a Supabase project set up with authentication and database tables configured.</p>

  <h2 style="color: #34495e; font-size: 1.8em; margin-top: 20px;">Usage</h2>
  <p style="margin: 10px 0;">Run the development server:</p>
  <pre style="background: #f4f4f4; padding: 10px; border-radius: 5px; overflow-x: auto;">
    <code>
npm run dev
    </code>
  </pre>
  <p style="margin: 10px 0;">Open <code style="background: #f4f4f4; padding: 2px 4px; border-radius: 3px;">http://localhost:5173</code> in your browser to access the app.</p>

  <h2 style="color: #34495e; font-size: 1.8em; margin-top: 20px;">Features</h2>
  <ul style="list-style-type: disc; margin: 10px 0 10px 20px;">
    <li style="margin: 5px 0;"><strong>Timetable Generation</strong>: Input course units and academic level to create a personalized study schedule.</li>
    <li style="margin: 5px 0;"><strong>Syllabus Creation</strong>: Enter a course and three topics to generate a structured syllabus using the Gemini API.</li>
    <li style="margin: 5px 0;"><strong>Authentication</strong>: Sign up or log in via Supabase to save and manage your study plans.</li>
    <li style="margin: 5px 0;"><strong>Responsive Design</strong>: Access the app on desktop or mobile with Tailwind CSS styling.</li>
  </ul>

  <h2 style="color: #34495e; font-size: 1.8em; margin-top: 20px;">Contributing</h2>
  <p style="margin: 10px 0;">Contributions are welcome! To contribute:</p>
  <ol style="list-style-type: decimal; margin: 10px 0 10px 20px;">
    <li style="margin: 5px 0;">Fork the repository.</li>
    <li style="margin: 5px 0;">Create a new branch (<code style="background: #f4f4f4; padding: 2px 4px; border-radius: 3px;">git checkout -b feature/your-feature</code>).</li>
    <li style="margin: 5px 0;">Commit your changes (<code style="background: #f4f4f4; padding: 2px 4px; border-radius: 3px;">git commit -m 'Add your feature'</code>).</li>
    <li style="margin: 5px 0;">Push to the branch (<code style="background: #f4f4f4; padding: 2px 4px; border-radius: 3px;">git push origin feature/your-feature</code>).</li>
    <li style="margin: 5px 0;">Open a Pull Request with a description of your changes.</li>
  </ol>
  <p style="margin: 10px 0;">Please ensure your code follows the project's ESLint rules and includes tests where applicable.</p>

  <h2 style="color: #34495e; font-size: 1.8em; margin-top: 20px;">License</h2>
  <p style="margin: 10px 0;">This project is licensed under the MIT License - see the LICENSE file for details.</p>
</body>
</html>
Acknowledgments

Built by Idris Jose.
Powered by the Gemini API for AI-driven timetable and syllabus generation.
Thanks to the open-source community for tools like React, Tailwind CSS, and Supabase.

