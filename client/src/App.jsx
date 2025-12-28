import { motion } from "framer-motion";
import { Menu, Github, Share2, User as UserIcon } from "lucide-react";
import { FloatingBubbles } from "./components/FloatingBubbles";
import { LandingPage } from "./components/LandingPage";
import { StressCheckIn } from "./components/StressCheckIn";
import { ProgressView } from "./components/ProgressView";
import { SolutionsView } from "./components/SolutionsView";
import { HistoryView } from "./components/HistoryView";
import { SignUpModal } from "./components/SignUpModal";

import { ProfileModal } from "./components/ProfileModal";
import { PersonalizedTips } from "./components/PersonalizedTips";
import { Footer } from "./components/Footer";
import natureBg from "./assets/nature_bg.png";
import { useState, useEffect } from "react";
import axios from 'axios';

// Set up axios defaults
axios.defaults.baseURL = 'http://localhost:5000';
const token = localStorage.getItem('token');
if (token) {
  axios.defaults.headers.common['x-auth-token'] = token;
}

export default function App() {
  const [currentView, setCurrentView] = useState('landing');
  const [menuOpen, setMenuOpen] = useState(false);
  const [showSocialIcons, setShowSocialIcons] = useState(true);
  const [showSignUpModal, setShowSignUpModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);

  const [authModalMode, setAuthModalMode] = useState('signup');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check for existing authentication on mount
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        axios.defaults.headers.common['x-auth-token'] = token;
        try {
          const res = await axios.get('/api/auth');
          setIsAuthenticated(true);
          setUser(res.data);
        } catch (error) {
          console.error("Token invalid:", error);
          localStorage.removeItem('token');
          delete axios.defaults.headers.common['x-auth-token'];
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  // Listen for password reset modal trigger


  const handleGetStarted = () => {
    if (currentView === 'landing') {
      // Scroll to the "How MindBalance Helps" section
      setTimeout(() => {
        const featuresSection = document.getElementById('how-mindbalance-helps');
        if (featuresSection) {
          const yOffset = -100; // Offset for fixed header
          const y = featuresSection.getBoundingClientRect().top + window.pageYOffset + yOffset;
          window.scrollTo({ top: y, behavior: 'smooth' });
        }
      }, 100);
    } else {
      setCurrentView('checkin');
    }
  };

  const handleNavigation = (view) => {
    if (!isAuthenticated) {
      setAuthModalMode('login');
      setShowSignUpModal(true);
    } else {
      setCurrentView(view);
      setMenuOpen(false);
    }
  };

  const handleAuthComplete = async () => {
    try {
      // Reload user data to ensure we have the name
      const res = await axios.get('/api/auth');
      setIsAuthenticated(true);
      setUser(res.data);
      setShowSignUpModal(false);
      setCurrentView('checkin');
    } catch (error) {
      console.error("Failed to load user after auth:", error);
      // Fallback if backend fetch fails
      setIsAuthenticated(true);
      setShowSignUpModal(false);
      setCurrentView('checkin');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['x-auth-token'];
    setIsAuthenticated(false);
    setUser(null);
    setCurrentView('landing');
    setMenuOpen(false); // Close mobile menu if open
  };

  // Scroll state for navbar
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
      if (window.scrollY > 100) {
        setShowSocialIcons(false);
      } else {
        setShowSocialIcons(true);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-[#4a7a7d] via-[#3a6569] to-[#254250] overflow-x-hidden">
      {/* Background Ink Image */}
      <div 
        className="absolute inset-0 bg-center bg-no-repeat"
        style={{
          backgroundImage: `url(${natureBg})`,
          backgroundSize: 'cover',
          backgroundAttachment: 'fixed',
          opacity: 1.0,
          mixBlendMode: 'normal',
        }}
      />
      
      {/* Dark Overlay */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundColor: 'rgba(255, 255, 255, 0.4)',
        }}
      />
      
      {/* Subtle Vignette Effect */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 0%, rgba(0,0,0,0.1) 50%, rgba(0,0,0,0.3) 80%, rgba(0,0,0,0.5) 100%)',
        }}
      />
      
      {/* Bubbles Layer */}
      <FloatingBubbles />

      {/* Top Navigation */}
      <nav 
        className={`fixed top-0 left-0 right-0 z-50 px-4 sm:px-8 lg:px-12 py-4 sm:py-6 transition-all duration-300 ${
          scrolled ? 'bg-white/40 backdrop-blur-md border-b border-stone-200/30 shadow-sm py-3' : 'bg-transparent py-4 sm:py-6'
        }`}
      >
        <div className="max-w-[1920px] mx-auto flex items-center justify-between">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="cursor-pointer"
            onClick={() => setCurrentView('landing')}
          >
            <span className="text-[#1c1917] text-xl sm:text-2xl font-[Aldrich]">
              MindBalance
            </span>
          </motion.div>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center gap-8">
            <button 
              onClick={() => handleNavigation('checkin')} 
              className="text-stone-600 hover:text-[#1c1917] transition-colors font-medium"
            >
              Check-In
            </button>
            <button 
              onClick={() => handleNavigation('progress')} 
              className="text-stone-600 hover:text-[#1c1917] transition-colors font-medium"
            >
              Progress
            </button>
            <button 
              onClick={() => handleNavigation('solutions')} 
              className="text-stone-600 hover:text-[#1c1917] transition-colors font-medium"
            >
              Solutions
            </button>
            <button 
              onClick={() => handleNavigation('history')} 
              className="text-stone-600 hover:text-[#1c1917] transition-colors font-medium"
            >
              History
            </button>
          </div>

          {/* Right side - Get Started + Menu */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="flex items-center gap-3 sm:gap-6"
          >
            <button 
              onClick={handleGetStarted}
              className="hidden sm:block px-4 sm:px-6 py-2 sm:py-2.5 bg-[#1c1917] text-white font-semibold rounded-full hover:bg-[#1c1917]/80 transition-all text-sm shadow-lg shadow-black/5"
            >
              Get Started
            </button>
            
            {isAuthenticated ? (
              <div className="flex items-center gap-3 sm:gap-4">
                {user?.name && (
                  <button 
                    onClick={() => setShowProfileModal(true)}
                    className="hidden sm:flex items-center gap-2 bg-stone-100/50 hover:bg-stone-200/50 text-[#1c1917] px-4 sm:px-6 py-2 sm:py-2.5 rounded-full border border-stone-200 transition-all text-sm font-medium"
                  >
                    <UserIcon className="w-4 h-4" />
                    <span>{user.name}</span>
                  </button>
                )}
                <button 
                  onClick={handleLogout}
                  className="hidden sm:block px-4 sm:px-6 py-2 sm:py-2.5 bg-red-500/20 text-white rounded-full border border-red-500/30 hover:bg-red-500/30 transition-all text-sm font-medium"
                >
                  Logout
                </button>
              </div>
            ) : (
              <button 
                onClick={() => {
                  setAuthModalMode('login');
                  setShowSignUpModal(true);
                  setMenuOpen(false);
                }}
                className="hidden sm:block px-4 sm:px-6 lg:px-8 py-2 sm:py-2.5 bg-white/50 text-[#1c1917] rounded-full border border-stone-200 hover:bg-white/80 transition-all text-sm sm:text-base font-medium"
              >
                Login
              </button>
            )}

            <button 
              onClick={() => setMenuOpen(!menuOpen)}
              className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center text-[#1c1917] hover:bg-black/5 rounded-full transition-all lg:hidden"
            >
              <Menu className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          </motion.div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {menuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:hidden fixed top-20 right-4 z-50 bg-white/90 backdrop-blur-lg rounded-2xl border border-stone-200 shadow-xl p-6 min-w-[200px]"
        >
          <div className="flex flex-col gap-4">
            {/* Mobile Profile Option */}
            {isAuthenticated && user && (
               <button 
                 onClick={() => { setShowProfileModal(true); setMenuOpen(false); }}
                 className="text-[#1c1917] hover:text-[#1c1917]/70 transition-colors text-left font-semibold pb-2 border-b border-stone-200 mb-2 flex items-center gap-2"
               >
                 <UserIcon className="w-4 h-4" />
                 {user.name}
               </button>
            )}

            <button 
              onClick={() => { handleNavigation('checkin'); setMenuOpen(false); }}
              className="text-[#1c1917] hover:text-[#1c1917]/70 transition-colors text-left"
            >
              Check-In
            </button>
            <button 
              onClick={() => { handleNavigation('progress'); setMenuOpen(false); }}
              className="text-[#1c1917] hover:text-[#1c1917]/70 transition-colors text-left"
            >
              Progress
            </button>
            <button 
              onClick={() => { handleNavigation('solutions'); setMenuOpen(false); }}
              className="text-[#1c1917] hover:text-[#1c1917]/70 transition-colors text-left"
            >
              Solutions
            </button>
            <button 
              onClick={() => { handleNavigation('history'); setMenuOpen(false); }}
              className="text-[#1c1917] hover:text-[#1c1917]/70 transition-colors text-left"
            >
              History
            </button>
            {isAuthenticated ? (
              <button 
                onClick={handleLogout}
                className="text-red-500 hover:text-red-600 transition-colors text-left pt-2 border-t border-stone-200"
              >
                Logout
              </button>
            ) : (
              <button 
                onClick={() => {
                  setAuthModalMode('login');
                  setShowSignUpModal(true);
                  setMenuOpen(false);
                }}
                className="text-[#1c1917] hover:text-[#1c1917]/70 transition-colors text-left pt-2 border-t border-stone-200"
              >
                Login
              </button>
            )}
          </div>
        </motion.div>
      )}

      {/* Social Icons - Right Side (Hidden on mobile, only on landing) */}
      {currentView === 'landing' && showSocialIcons && (
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="hidden md:flex fixed right-4 lg:right-6 top-1/2 -translate-y-1/2 z-[100] flex-col gap-4"
        >
          <a
            href="#"
            className="w-9 h-9 bg-white/50 backdrop-blur-sm rounded-full flex items-center justify-center border border-stone-200 hover:bg-white/80 transition-all shadow-sm"
          >
            <Github className="w-4 h-4 text-[#1c1917]" />
          </a>
          <a
            href="#"
            className="w-9 h-9 bg-white/50 backdrop-blur-sm rounded-full flex items-center justify-center border border-stone-200 hover:bg-white/80 transition-all shadow-sm"
          >
            <Share2 className="w-4 h-4 text-[#1c1917]" />
          </a>
        </motion.div>
      )}

      {/* Global User Header (Tips & Motivation) - Visible on ALL pages if logged in */}
      {/* Added pt-28 to allow for fixed navbar */}
      {isAuthenticated && user && (
        <div key={currentView} className="relative z-40 max-w-7xl mx-auto px-4 sm:px-8 mt-24 sm:mt-28 mb-8 translate-y-0 opacity-100 transition-all duration-500 ease-out animate-in fade-in slide-in-from-top-4">
           {/* Grid Layout for PC */}
           <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
             {/* Tip Widget - Spans 8 cols on PC */}
             {user.profession && (
               <div className="md:col-span-8 flex">
                 <PersonalizedTips profession={user.profession} />
               </div>
             )}
             
             {/* Motivation Pill - Spans 4 cols on PC */}
             {user.bio && (
               <motion.div 
                 initial={{ opacity: 0, x: 20 }}
                 animate={{ opacity: 1, x: 0 }}
                 className="md:col-span-4 bg-white/40 backdrop-blur-xl border border-white/60 shadow-lg shadow-[#9CAF88]/5 rounded-2xl p-6 flex flex-col justify-center h-full w-full"
               >
                 <div className="flex items-center gap-2 mb-2">
                   <span className="text-xl">🎯</span>
                   <span className="text-stone-500 text-xs uppercase tracking-wider font-semibold">My Wellness Goal</span>
                 </div>
                 <div className="text-[#1c1917] text-lg font-medium leading-relaxed">
                   "{user.bio}"
                 </div>
               </motion.div>
             )}
           </div>
        </div>
      )}

      {/* Main Content Area - Dynamic based on current view */}
      <div className="relative z-10">
        {currentView === 'landing' && <LandingPage user={user} onGetStarted={() => handleNavigation('checkin')} onStartJourney={() => { setAuthModalMode('signup'); setShowSignUpModal(true); }} />}
        {currentView === 'checkin' && <StressCheckIn onComplete={() => setCurrentView('progress')} />}
        {currentView === 'progress' && <ProgressView />}
        {currentView === 'solutions' && <SolutionsView />}
        {currentView === 'history' && <HistoryView />}
      </div>

      {/* Sign Up Modal */}
      {showSignUpModal && (
        <SignUpModal 
          initialMode={authModalMode}
          onClose={() => setShowSignUpModal(false)} 
          onSignUpComplete={handleAuthComplete} 
        />
      )}

      {/* Profile Modal */}
      {showProfileModal && user && (
        <ProfileModal 
          user={user} 
          onClose={() => setShowProfileModal(false)} 
          onUpdate={(updatedUser) => {
            setUser(updatedUser);
            setShowProfileModal(false);
          }} 
        />
      )}

      {/* Footer */}
      <Footer />
    </div>
  );
}
