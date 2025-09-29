import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  signInWithPopup, 
  createUserWithEmailAndPassword,
  sendPasswordResetEmail, 
  signInWithEmailAndPassword, 
  onAuthStateChanged, 
  signOut 
} from 'firebase/auth';
import { auth, googleProvider } from './firebase/Firebase-config.js'; 
import toast, { Toaster } from 'react-hot-toast';
import { useNavigate} from 'react-router-dom';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within a AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const Navigate = useNavigate();

  // Listen for auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
        setIsAuthenticated(true);
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signUp = async (email, password) => {
    try {
      setLoading(true);
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      toast.success('Account created successfully!');
      return userCredential;
    } catch (error) {
      console.error('Sign up error:', error.message);
      toast.error(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email, password) => {
    try {
      setLoading(true);
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      toast.success('Signed in successfully!');
      return userCredential;
    } catch (error) {
      console.error('Sign in error:', error.message);
      toast.error(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    try {
      // Use a fixed demo account
      await signInWithEmailAndPassword(auth, "demo@yourapp.com", "demopassword")
      alert("Logged in as demo user ✅")
    } catch (error) {
      console.error(error)
      alert("Demo login failed ❌")
    }
  }

  const signInWithGoogle = async () => {
    try {
      setLoading(true);
      const result = await signInWithPopup(auth, googleProvider);
      toast.success('Google sign in successful!');
      return result;
    } catch (error) {
      console.error('Google sign in error:', error.message);
      toast.error(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const sendPasswordReset = async (email) => {
    try {
      await sendPasswordResetEmail(auth, email);
      return { success: true, message: 'Password reset email sent!' };
    } catch (error) {
      let errorMessage = 'Failed to send reset email';
      
      switch (error.code) {
        case 'auth/user-not-found':
          errorMessage = 'No account found with this email address';
          break;
        case 'auth/invalid-email':
          errorMessage = 'Invalid email address';
          break;
        case 'auth/too-many-requests':
          errorMessage = 'Too many attempts. Please try again later';
          break;
        default:
          errorMessage = error.message;
      }
      
      return { success: false, message: errorMessage };
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      toast.success('Logged out successfully!');
      setUser(null);
      Navigate('/')
    } catch (error) {
      console.error('Logout error:', error.message);
      toast.error(error.message);
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      isAuthenticated,
      signUp,
      signIn,
      signInWithGoogle,
      sendPasswordReset,
      logout
    }}>
      {children}
      <Toaster />
    </AuthContext.Provider>
  );
};