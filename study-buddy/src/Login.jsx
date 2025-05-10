import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { supabase } from './client.js';
import { Eye, EyeOff, AlertCircle, CheckCircle } from 'lucide-react';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({
    email: null,
    password: null,
  });
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Check for redirected success message
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const successMsg = params.get('success');
    if (successMsg) {
      setSuccess(decodeURIComponent(successMsg));
    }
  
    // Parse access token from hash (e.g., after signup or OAuth)
    const hashParams = new URLSearchParams(window.location.hash.substring(1)); // remove the `#`
    const access_token = hashParams.get('access_token');
    const refresh_token = hashParams.get('refresh_token');
  
    if (access_token && refresh_token) {
      supabase.auth.setSession({
        access_token,
        refresh_token,
      }).then(({ error }) => {
        if (error) {
          setError('Session restoration failed.');
        } else {
          navigate('/mainapp');
        }
      });
    }
  
    // Restore remembered email
    const savedEmail = localStorage.getItem('rememberedEmail');
    if (savedEmail) {
      setFormData(prev => ({ ...prev, email: savedEmail }));
      setRememberMe(true);
    }
  }, [location]);
  
  const validateField = (name, value) => {
    switch (name) {
      case 'email':
        if (!value) return 'Email is required';
        if (!/\S+@\S+\.\S+/.test(value)) return 'Please enter a valid email address';
        return null;
      case 'password':
        if (!value) return 'Password is required';
        if (value.length < 6) return 'Password must be at least 6 characters';
        return null;
      default:
        return null;
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // Validate field on change
    const error = validateField(name, value);
    setFieldErrors(prev => ({ ...prev, [name]: error }));
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleRememberMe = () => {
    setRememberMe(!rememberMe);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    
    // Validate all fields before submission
    const newFieldErrors = {
      email: validateField('email', formData.email),
      password: validateField('password', formData.password),
    };
    
    setFieldErrors(newFieldErrors);
    
    // Check if there are any errors
    if (Object.values(newFieldErrors).some(error => error !== null)) {
      return; // Stop submission if there are errors
    }
    
    setLoading(true);
    const { email, password } = formData;

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      if (data.user) {
        // Handle "remember me" functionality
        if (rememberMe) {
          localStorage.setItem('rememberedEmail', email);
        } else {
          localStorage.removeItem('rememberedEmail');
        }
        
        setSuccess('Login successful! Redirecting...');
        setTimeout(() => {
          navigate('/mainapp');
        }, 1500);
      }
    } catch (err) {
      // Handle specific error cases
      if (err.message.includes('Invalid login credentials')) {
        setError('Invalid email or password. Please try again.');
      } else if (err.message.includes('Email not confirmed')) {
        setError('Please verify your email address before logging in.');
      } else {
        setError(err.message || 'An error occurred during login.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError(null);
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { 
          redirectTo: window.location.origin + '/mainapp',
          queryParams: {
            prompt: 'select_account', // Always show Google account selector
          }
        },
      });
      if (error) throw error;
    } catch (err) {
      setError(err.message || 'Google login failed.');
      setLoading(false);
    }
  };

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session) {
        navigate('/mainapp');
      }
    });

    return () => {
      authListener.subscription?.unsubscribe();
    };
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col relative overflow-hidden rounded-3xl">
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
        <h1 className="text-3xl md:text-4xl font-bold text-indigo-600 mb-2">
          Welcome Back to School Buddy!
        </h1>
        <p className="text-gray-700 mb-6 max-w-md">
          Log in to manage your school schedules, track assignments, and boost your grades.
        </p>

        {error && (
          <div className="mb-6 p-3 bg-red-100 text-red-700 rounded-md w-full max-w-md flex items-center">
            <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}
        
        {success && (
          <div className="mb-6 p-3 bg-green-100 text-green-700 rounded-md w-full max-w-md flex items-center">
            <CheckCircle className="h-5 w-5 mr-2 flex-shrink-0" />
            <span>{success}</span>
          </div>
        )}

        <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
          <form onSubmit={handleSubmit} aria-label="Login form">
            <div className="mb-4">
              <label htmlFor="email" className="block text-left text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="Enter your school email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full p-3 border ${
                  fieldErrors.email ? 'border-red-500' : 'border-gray-300'
                } rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                required
                disabled={loading}
                aria-required="true"
                aria-invalid={!!fieldErrors.email}
                aria-describedby={fieldErrors.email ? "email-error" : undefined}
              />
              {fieldErrors.email && (
                <p id="email-error" className="mt-1 text-sm text-red-600 text-left">
                  {fieldErrors.email}
                </p>
              )}
            </div>
            
            <div className="mb-4">
              <label htmlFor="password" className="block text-left text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`w-full p-3 border ${
                    fieldErrors.password ? 'border-red-500' : 'border-gray-300'
                  } rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 pr-10`}
                  required
                  disabled={loading}
                  aria-required="true"
                  aria-invalid={!!fieldErrors.password}
                  aria-describedby={fieldErrors.password ? "password-error" : undefined}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700"
                  onClick={togglePasswordVisibility}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
              {fieldErrors.password && (
                <p id="password-error" className="mt-1 text-sm text-red-600 text-left">
                  {fieldErrors.password}
                </p>
              )}
            </div>
            
            <div className="flex items-center justify-between mb-6">
              <label className="flex items-center text-sm" htmlFor="remember-me">
                <input
                  type="checkbox"
                  id="remember-me"
                  checked={rememberMe}
                  onChange={toggleRememberMe}
                  className="mr-2 h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                Remember me
              </label>
              <Link to="/forgot-password" className="text-sm text-indigo-600 hover:underline">
                Forgot your password?
              </Link>
            </div>
            
            <button
              type="submit"
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
                  Logging In...
                </>
              ) : (
                'Log In'
              )}
            </button>
          </form>

          <div className="mt-6">
            <div className="relative mb-4">
              <span className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-gray-300"></span>
              </span>
              <span className="relative bg-white px-2 text-gray-500">
                Or log in with
              </span>
            </div>
            <div className="flex gap-4">
              <button
                onClick={handleGoogleLogin}
                className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-md hover:bg-gray-100 disabled:opacity-50 flex items-center justify-center"
                disabled={loading}
                aria-label="Log in with Google"
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
              <Link to="/signup" className="flex-1">
                <button
                  className="w-full border border-gray-300 text-gray-700 py-2 rounded-md hover:bg-gray-100"
                  aria-label="Go to signup page"
                >
                  Sign Up
                </button>
              </Link>
            </div>
          </div>
          
          <div className="mt-6 text-sm text-gray-600">
            <p>Need help? <a href="#" className="text-indigo-600 hover:underline">Contact support</a></p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Login;