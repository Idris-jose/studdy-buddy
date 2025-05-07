import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const SignUp = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    const { username, email, password } = formData;

    // Client-side validation
    if (!username || username.length < 3) {
      setError('Username must be at least 3 characters long.');
      setLoading(false);
      return;
    }
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      setError('Please enter a valid email address.');
      setLoading(false);
      return;
    }
    if (!password || password.length < 6) {
      setError('Password must be at least 6 characters long.');
      setLoading(false);
      return;
    }

    try {
      setSuccess('Sign-up successful! Redirecting to the app...');
      setTimeout(() => {
        navigate('/mainapp');
      }, 2000);
    } catch (err) {
      setError('An error occurred during sign-up.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignUp = () => {
    setError(null);
    setLoading(true);
    try {
      setSuccess('Redirecting to the app...');
      setTimeout(() => {
        navigate('/mainapp');
      }, 1000);
    } catch (err) {
      setError('Google sign-up failed.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen  bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col relative overflow-hidden rounded-3xl">
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{ opacity: 0.1 }}
      >
        <filter id="grainy">
          <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#grainy)" />
      </svg>

      <main className="flex-1 flex flex-col items-center justify-center text-center px-4 py-8">
        <h1 className="text-3xl md:text-4xl  font-bold text-indigo-600 mb-2">
          Join Study Buddy Today!
        </h1>
        <p className="text-gray-700 mb-8 max-w-md">
          Your ultimate companion for organizing school schedules, tracking assignments, and boosting your grades.
        </p>

        {error && (
          <div className="mb-6 p-3 bg-red-100 text-red-700 rounded-md w-full max-w-md">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-6 p-3 bg-green-100 text-green-700 rounded-md w-full max-w-md">
            {success}
          </div>
        )}

        <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
          <div aria-label="Sign up form">
            <div className="mb-4">
              <label htmlFor="username" className="sr-only">
                Username
              </label>
              <input
                type="text"
                id="username"
                name="username"
                placeholder="Choose a username"
                value={formData.username}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
                disabled={loading}
                aria-required="true"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="email" className="sr-only">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="Enter your school email"
                value={formData.email}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
                disabled={loading}
                aria-required="true"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                placeholder="Create a password"
                value={formData.password}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
                disabled={loading}
                aria-required="true"
              />
            </div>
            <div className="mb-6 text-sm text-left">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="mr-2 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  required
                  disabled={loading}
                  aria-required="true"
                />
                I agree to the{' '}
                <Link to="/terms" className="text-indigo-600 hover:underline">
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link to="/privacy" className="text-indigo-600 hover:underline">
                  Privacy Policy
                </Link>
              </label>
            </div>
            <button
              onClick={handleSubmit}
              className="w-full bg-indigo-600 text-white font-bold py-3 rounded-md hover:bg-indigo-700 transition disabled:opacity-50 flex items-center justify-center"
              disabled={loading}
              aria-busy={loading}
            >
              {loading ? (
                <>
                  <svg
                    className="animate-spin h-5 w-5 mr-2 text-white"
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
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v8H4z"
                    />
                  </svg>
                  Signing Up...
                </>
              ) : (
                'Sign Up'
              )}
            </button>
          </div>

          <div className="mt-6">
            <div className="relative mb-4">
              <span className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-gray-300"></span>
              </span>
              <span className="relative bg-white px-2 text-gray-500">
                Or sign up with
              </span>
            </div>
            <div className="flex gap-4">
              <button
                onClick={handleGoogleSignUp}
                className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-md hover:bg-gray-100 disabled:opacity-50 flex items-center justify-center"
                disabled={loading}
                aria-label="Sign up with Google"
              >
                {loading ? (
                  <svg
                    className="animate-spin h-5 w-5 mr-2 text-gray-700"
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
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v8H4z"
                    />
                  </svg>
                ) : (
                  <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-1.04.69-2.37 1.1-3.71 1.1-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C4.01 20.52 7.65 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.65 1 4.01 3.48 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                )}
                Google
              </button>
              <Link to="/login" className="flex-1">
                <button
                  className="w-full border border-gray-300 text-gray-700 py-2 rounded-md hover:bg-gray-100"
                  aria-label="Go to login page"
                >
                  Log In
                </button>
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SignUp;