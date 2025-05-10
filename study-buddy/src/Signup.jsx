import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from './client.js';
import { Eye, EyeOff, AlertCircle, CheckCircle, Check, X } from 'lucide-react';

const SignUp = () => {
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });
  const [fieldErrors, setFieldErrors] = useState({
    username: null,
    email: null,
    password: null,
  });
  const navigate = useNavigate();

  // Password strength requirements state
  const [passwordRequirements, setPasswordRequirements] = useState({
    length: false,
    hasUppercase: false,
    hasLowercase: false, 
    hasNumber: false,
    hasSpecial: false
  });

  // Update password requirements check on password change
  useEffect(() => {
    const { password } = formData;
    setPasswordRequirements({
      length: password.length >= 8,
      hasUppercase: /[A-Z]/.test(password),
      hasLowercase: /[a-z]/.test(password),
      hasNumber: /[0-9]/.test(password),
      hasSpecial: /[!@#$%^&*(),.?":{}|<>]/.test(password)
    });
  }, [formData.password]);

  const validateField = (name, value) => {
    switch (name) {
      case 'username':
        if (!value.trim()) return 'Username is required';
        if (value.length < 3) return 'Username must be at least 3 characters';
        if (!/^[a-zA-Z0-9_]+$/.test(value)) return 'Username can only contain letters, numbers, and underscores';
        return null;
      case 'email':
        if (!value) return 'Email is required';
        if (!/\S+@\S+\.\S+/.test(value)) return 'Please enter a valid email address';
        return null;
      case 'password':
        if (!value) return 'Password is required';
        if (value.length < 8) return 'Password must be at least 8 characters long';
        if (!/[A-Z]/.test(value)) return 'Password must contain at least one uppercase letter';
        if (!/[a-z]/.test(value)) return 'Password must contain at least one lowercase letter';
        if (!/[0-9]/.test(value)) return 'Password must contain at least one number';
        if (!/[!@#$%^&*(),.?":{}|<>]/.test(value)) return 'Password must contain at least one special character';
        return null;
      default:
        return null;
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    
    // Validate field on change
    const error = validateField(name, value);
    setFieldErrors(prev => ({ ...prev, [name]: error }));
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  
  const toggleAgreeToTerms = () => {
    setAgreeToTerms(!agreeToTerms);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    
    // Validate all fields before submission
    const newFieldErrors = {
      username: validateField('username', formData.username),
      email: validateField('email', formData.email),
      password: validateField('password', formData.password),
    };
    
    setFieldErrors(newFieldErrors);
    
    // Check if there are any errors
    if (Object.values(newFieldErrors).some(error => error !== null)) {
      setError('Please fix the errors in the form.');
      return;
    }
    
    // Check if terms are agreed to
    if (!agreeToTerms) {
      setError('You must agree to the Terms of Service and Privacy Policy.');
      return;
    }
    
    setLoading(true);
    const { username, email, password } = formData;

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { username },
          emailRedirectTo: 'http://localhost:5174/login?success=Account%20created!%20Please%20check%20your%20email%20for%20verification.',
        },
      });

      if (error) throw error;

      if (data.user) {
        if (data.session) {
          // User is immediately signed in (auto-confirm enabled)
          setSuccess('Account created successfully! Redirecting...');
          setTimeout(() => {
            navigate('/mainapp');
          }, 1500);
        } else {
          // Email confirmation required
          setSuccess('Sign-up successful! Please check your email for verification.');
          setTimeout(() => {
            navigate('/login');
          }, 3000);
        }
      }
    } 
    catch (err) {
      // Handle specific error types
      if (err.message.includes('already registered')) {
        setError('This email is already registered. Please log in instead.');
      } else {
        setError(err.message || 'An error occurred during sign-up.');
      }
    } 
    finally {
      setLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    setError(null);
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { 
          redirectTo: `${window.location.origin}/mainapp`,
          queryParams: {
            prompt: 'select_account', // Always show account selector
          }
        },
      });
      if (error) throw error;
    } catch (err) {
      setError(err.message || 'Google sign-up failed.');
      setLoading(false);
    }
  };

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
          Join Study Buddy Today!
        </h1>
        <p className="text-gray-700 mb-6 max-w-md">
          Your ultimate companion for organizing school schedules, tracking assignments, and boosting your grades.
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
          <form onSubmit={handleSubmit} aria-label="Sign up form">
            <div className="mb-4">
              <label htmlFor="username" className="block text-left text-sm font-medium text-gray-700 mb-1">
                Username
              </label>
              <input
                type="text"
                id="username"
                name="username"
                placeholder="Choose a username"
                value={formData.username}
                onChange={handleChange}
                className={`w-full p-3 border ${
                  fieldErrors.username ? 'border-red-500' : 'border-gray-300'
                } rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                required
                disabled={loading}
                aria-required="true"
                aria-invalid={!!fieldErrors.username}
                aria-describedby={fieldErrors.username ? "username-error" : undefined}
              />
              {fieldErrors.username && (
                <p id="username-error" className="mt-1 text-sm text-red-600 text-left">
                  {fieldErrors.username}
                </p>
              )}
            </div>
            
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
                  placeholder="Create a password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`w-full p-3 border ${
                    fieldErrors.password ? 'border-red-500' : 'border-gray-300'
                  } rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 pr-10`}
                  required
                  disabled={loading}
                  aria-required="true"
                  aria-invalid={!!fieldErrors.password}
                  aria-describedby="password-requirements"
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
              
              {/* Password requirements checklist */}
              <div id="password-requirements" className="mt-2 grid grid-cols-2 gap-1 text-xs text-left">
                <div className={`flex items-center ${passwordRequirements.length ? 'text-green-600' : 'text-gray-600'}`}>
                  {passwordRequirements.length ? (
                    <Check className="h-4 w-4 mr-1" />
                  ) : (
                    <X className="h-4 w-4 mr-1" />
                  )}
                  At least 8 characters
                </div>
                <div className={`flex items-center ${passwordRequirements.hasUppercase ? 'text-green-600' : 'text-gray-600'}`}>
                  {passwordRequirements.hasUppercase ? (
                    <Check className="h-4 w-4 mr-1" />
                  ) : (
                    <X className="h-4 w-4 mr-1" />
                  )}
                  Uppercase letter
                </div>
                <div className={`flex items-center ${passwordRequirements.hasLowercase ? 'text-green-600' : 'text-gray-600'}`}>
                  {passwordRequirements.hasLowercase ? (
                    <Check className="h-4 w-4 mr-1" />
                  ) : (
                    <X className="h-4 w-4 mr-1" />
                  )}
                  Lowercase letter
                </div>
                <div className={`flex items-center ${passwordRequirements.hasNumber ? 'text-green-600' : 'text-gray-600'}`}>
                  {passwordRequirements.hasNumber ? (
                    <Check className="h-4 w-4 mr-1" />
                  ) : (
                    <X className="h-4 w-4 mr-1" />
                  )}
                  Number
                </div>
                <div className={`flex items-center ${passwordRequirements.hasSpecial ? 'text-green-600' : 'text-gray-600'}`}>
                  {passwordRequirements.hasSpecial ? (
                    <Check className="h-4 w-4 mr-1" />
                  ) : (
                    <X className="h-4 w-4 mr-1" />
                  )}
                  Special character
                </div>
              </div>
              
              {fieldErrors.password && (
                <p id="password-error" className="mt-1 text-sm text-red-600 text-left">
                  {fieldErrors.password}
                </p>
              )}
            </div>
            
            {/* Terms and Conditions Checkbox */}
            <div className="mb-6">
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="terms"
                    name="terms"
                    type="checkbox"
                    checked={agreeToTerms}
                    onChange={toggleAgreeToTerms}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    aria-required="true"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="terms" className="text-gray-600">
                    I agree to the{' '}
                    <Link to="/terms" className="text-indigo-600 hover:text-indigo-800">
                      Terms of Service
                    </Link>{' '}
                    and{' '}
                    <Link to="/privacy" className="text-indigo-600 hover:text-indigo-800">
                      Privacy Policy
                    </Link>
                  </label>
                </div>
              </div>
            </div>
            
            {/* Sign Up Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-300 text-white font-medium rounded-md px-5 py-3 mb-4 transition duration-300 ease-in-out flex justify-center items-center"
            >
              {loading ? (
                <span className="inline-block h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
              ) : null}
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
            
            {/* Divider */}
            <div className="relative flex items-center justify-center my-6">
              <div className="border-t border-gray-300 absolute w-full"></div>
              <div className="bg-white px-4 relative text-sm text-gray-500">or continue with</div>
            </div>
            
            {/* Google Sign Up */}
            <button
              type="button"
              onClick={handleGoogleSignUp}
              disabled={loading}
              className="w-full bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium rounded-md px-5 py-3 mb-4 transition duration-300 ease-in-out flex justify-center items-center"
            >
              <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              Sign up with Google
            </button>
          </form>
          
          {/* Login Link */}
          <div className="text-center mt-4">
            <p className="text-gray-600">
              Already have an account?{' '}
              <Link to="/login" className="text-indigo-600 hover:text-indigo-800 font-medium">
                Log in
              </Link>
            </p>
          </div>
        </div>
      </main>
      
      <footer className="py-4 text-center">
        <p className="text-sm text-gray-600">
          &copy; {new Date().getFullYear()} Study Buddy. All rights reserved.
        </p>
      </footer>
    </div>
  );
};

export default SignUp;