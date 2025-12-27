import { motion } from "framer-motion";
import { X, Mail, Lock, User, Github, Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import axios from 'axios';

export function SignUpModal({ onClose, onSignUpComplete, initialMode = 'signup' }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [mode, setMode] = useState(initialMode);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (mode === 'signup') {
        const response = await axios.post('/api/auth/signup', { name, email, password });
        localStorage.setItem('token', response.data.token);
        axios.defaults.headers.common['x-auth-token'] = response.data.token;
      } else {
        const response = await axios.post('/api/auth/login', { email, password });
        localStorage.setItem('token', response.data.token);
        axios.defaults.headers.common['x-auth-token'] = response.data.token;
      }

      console.log(mode === 'signup' ? "Sign up successful:" : "Login successful:", { email });
      onSignUpComplete();
    } catch (error) {
      console.error("Auth error:", error);
      
      let errorMessage = "Authentication failed";
      
      // Handle array of errors (from express-validator)
      if (error.response?.data?.errors && Array.isArray(error.response.data.errors)) {
        errorMessage = error.response.data.errors.map((err) => err.msg).join(", ");
      } 
      // Handle single message error (manual returns)
      else if (error.response?.data?.msg) {
        errorMessage = error.response.data.msg;
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = (e) => {
    e.preventDefault();
    e.stopPropagation();
    alert("Google login not implemented yet. Please use email signup.");
  };

  const handleGithubLogin = (e) => {
    e.preventDefault();
    e.stopPropagation();
    console.log("GitHub button clicked!");
    alert("GitHub login clicked - authenticating...");
    // Simulate GitHub OAuth flow
    // In production, this would redirect to GitHub OAuth
    const githubUser = {
      name: 'GitHub User',
      email: 'user@github.com',
      authMethod: 'github',
      createdAt: new Date().toISOString()
    };
    localStorage.setItem('mindbalance_user', JSON.stringify(githubUser));
    localStorage.setItem('mindbalance_auth', 'true');
    console.log("GitHub OAuth login successful");
    onSignUpComplete();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        transition={{ duration: 0.3 }}
        className="relative w-full max-w-md mx-4 sm:mx-0 rounded-[2rem] border border-stone-200 p-8 shadow-2xl shadow-stone-900/20 overflow-y-auto max-h-[85vh] [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:bg-stone-300 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-transparent"
        style={{ backgroundColor: '#ffffff' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-stone-100 hover:bg-stone-200 transition-all text-stone-500"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="mb-8">
          <h2 className="text-[#1c1917] text-2xl mb-2 font-serif">
            {mode === 'signup' ? 'Create Account' : 'Welcome Back'}
          </h2>
          <p className="text-stone-600 text-sm">
            {mode === 'signup'
              ? 'Start your journey to better mental wellness'
              : 'Continue your journey to mental wellness'
            }
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm">
              {error}
            </div>
          )}
          {/* Name Input - Only show in signup mode */}
          {mode === 'signup' && (
            <div>
              <label className="block text-stone-700 mb-2 text-sm font-medium">Full Name</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your name"
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-12 py-3 text-[#1c1917] placeholder:text-stone-500 focus:outline-none focus:border-[#9CAF88] focus:ring-1 focus:ring-[#9CAF88] transition-all"
                  required
                />
              </div>
            </div>
          )}

          {/* Email Input */}
          <div>
            <label className="block text-stone-700 mb-2 text-sm font-medium">Email</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full bg-stone-50 border border-stone-300 rounded-xl px-12 py-3 text-[#1c1917] placeholder:text-stone-500 focus:outline-none focus:border-[#9CAF88] focus:ring-1 focus:ring-[#9CAF88] transition-all"
                required
              />
            </div>
          </div>

          {/* Password Input */}
          <div>
            <label className="block text-stone-700 mb-2 text-sm font-medium">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={mode === 'signup' ? 'Create a password' : 'Enter your password'}
                className="w-full bg-stone-50 border border-stone-300 rounded-xl px-12 py-3 text-[#1c1917] placeholder:text-stone-500 focus:outline-none focus:border-[#9CAF88] focus:ring-1 focus:ring-[#9CAF88] transition-all pr-12"
                required
              />
               <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 transition-colors focus:outline-none"
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>

          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#9CAF88] hover:bg-[#8B9D7A] disabled:bg-[#9CAF88]/50 text-white py-3 rounded-xl transition-all mt-6 shadow-lg shadow-[#9CAF88]/20 font-medium disabled:cursor-not-allowed"
          >
            {loading ? 'Please wait...' : (mode === 'signup' ? 'Sign Up' : 'Login')}
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center gap-3 my-6">
          <div className="flex-1 h-px bg-stone-200"></div>
          <span className="text-stone-400 text-sm">or continue with</span>
          <div className="flex-1 h-px bg-stone-200"></div>
        </div>

        {/* Social Login Buttons */}
        <div className="space-y-3">
          <button
            type="button"
            onClick={handleGoogleLogin}
            className="w-full bg-white border border-stone-200 hover:bg-stone-50 text-stone-600 py-3 rounded-xl transition-all flex items-center justify-center gap-3 font-medium"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="currentColor"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="currentColor"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="currentColor"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            <span>Google</span>
          </button>

          <button
            type="button"
            onClick={handleGithubLogin}
            className="w-full bg-white border border-stone-200 hover:bg-stone-50 text-stone-600 py-3 rounded-xl transition-all flex items-center justify-center gap-3 font-medium"
          >
            <Github className="w-5 h-5" />
            <span>GitHub</span>
          </button>
        </div>

        {/* Footer */}
        <div className="mt-6 text-center">
          <p className="text-stone-500 text-sm">
            {mode === 'signup' ? (
              <>
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={() => setMode('login')}
                  className="text-[#9CAF88] hover:text-[#8B9D7A] font-semibold transition-colors"
                >
                  Login
                </button>
              </>
            ) : (
              <>
                Don&apos;t have an account?{" "}
                <button
                  type="button"
                  onClick={() => setMode('signup')}
                  className="text-[#9CAF88] hover:text-[#8B9D7A] font-semibold transition-colors"
                >
                  Sign Up
                </button>
              </>
            )}
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}
