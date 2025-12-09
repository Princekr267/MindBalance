import { motion } from "framer-motion";
import { Menu, Github, Share2 } from "lucide-react";
import { FloatingBubbles } from "./components/FloatingBubbles";
import { LandingPage } from "./components/LandingPage";
import { StressCheckIn } from "./components/StressCheckIn";
import { ProgressView } from "./components/ProgressView";
import { SolutionsView } from "./components/SolutionsView";
import { HistoryView } from "./components/HistoryView";
import { SignUpModal } from "./components/SignUpModal";
import { Footer } from "./components/Footer";
import backgroundInk from "./assets/bcade4ed6aaaac33659059582196cc1b14abc8bd.png";
import { useState, useEffect } from "react";
import axios from 'axios';

// Set up axios defaults
axios.defaults.baseURL = 'http://localhost:5000';
const token = localStorage.getItem('token');
if (token) {
  axios.defaults.headers.common['x-auth-token'] = token;
}

export default function App() {
  const [currentView, setCurrentView] = useState<'landing' | 'checkin' | 'progress' | 'solutions' | 'history'>('landing');
  const [menuOpen, setMenuOpen] = useState(false);
  const [showSocialIcons, setShowSocialIcons] = useState(true);
  const [showSignUpModal, setShowSignUpModal] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'signup' | 'login'>('signup');
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
          // For now, assume valid token means authenticated
          setIsAuthenticated(true);
          setUser({ token });
        } catch (error) {
          localStorage.removeItem('token');
          delete axios.defaults.headers.common['x-auth-token'];
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

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

  const handleNavigation = (view: 'checkin' | 'progress' | 'solutions' | 'history') => {
    if (!isAuthenticated) {
      setAuthModalMode('login');
      setShowSignUpModal(true);
    } else {
      setCurrentView(view);
      setMenuOpen(false);
    }
  };

  const handleAuthComplete = () => {
    setIsAuthenticated(true);
    setShowSignUpModal(false);
    setCurrentView('checkin');
  };

  useEffect(() => {
    const handleScroll = () => {
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
          backgroundImage: `url(${backgroundInk})`,
          backgroundSize: 'cover',
          opacity: 0.8,
          mixBlendMode: 'normal',
        }}
      />
      
      {/* Dark Overlay */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundColor: 'rgba(0, 0, 0, 0.2)',
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
      <nav className="relative z-50 px-4 sm:px-8 lg:px-12 py-4 sm:py-6 lg:py-8 flex items-center justify-between">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="cursor-pointer"
          onClick={() => setCurrentView('landing')}
        >
          <span className="text-white text-xl sm:text-2xl font-[Aldrich]">
            MindBalance
          </span>
        </motion.div>

        {/* Desktop Navigation Links */}
        <div className="hidden lg:flex items-center gap-8">
          <button 
            onClick={() => handleNavigation('checkin')} 
            className="text-white/80 hover:text-white transition-colors"
          >
            Check-In
          </button>
          <button 
            onClick={() => handleNavigation('progress')} 
            className="text-white/80 hover:text-white transition-colors"
          >
            Progress
          </button>
          <button 
            onClick={() => handleNavigation('solutions')} 
            className="text-white/80 hover:text-white transition-colors"
          >
            Solutions
          </button>
          <button 
            onClick={() => handleNavigation('history')} 
            className="text-white/80 hover:text-white transition-colors"
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
            className="hidden sm:block px-4 sm:px-6 lg:px-8 py-2 sm:py-2.5 bg-transparent text-white rounded-full border border-white/60 hover:bg-white/10 transition-all text-sm sm:text-base"
          >
            Get Started
          </button>
          <button 
            onClick={() => {
              setAuthModalMode('login');
              setShowSignUpModal(true);
            }}
            className="hidden sm:block px-4 sm:px-6 lg:px-8 py-2 sm:py-2.5 bg-white/20 text-white rounded-full border border-white/40 hover:bg-white/30 transition-all text-sm sm:text-base"
          >
            Login
          </button>
          <button 
            onClick={() => setMenuOpen(!menuOpen)}
            className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center text-white hover:bg-white/10 rounded-full transition-all lg:hidden"
          >
            <Menu className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </motion.div>
      </nav>

      {/* Mobile Menu */}
      {menuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:hidden fixed top-20 right-4 z-50 bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 p-6 min-w-[200px]"
        >
          <div className="flex flex-col gap-4">
            <button 
              onClick={() => { handleNavigation('checkin'); setMenuOpen(false); }}
              className="text-white hover:text-white/70 transition-colors text-left"
            >
              Check-In
            </button>
            <button 
              onClick={() => { handleNavigation('progress'); setMenuOpen(false); }}
              className="text-white hover:text-white/70 transition-colors text-left"
            >
              Progress
            </button>
            <button 
              onClick={() => { handleNavigation('solutions'); setMenuOpen(false); }}
              className="text-white hover:text-white/70 transition-colors text-left"
            >
              Solutions
            </button>
            <button 
              onClick={() => { handleNavigation('history'); setMenuOpen(false); }}
              className="text-white hover:text-white/70 transition-colors text-left"
            >
              History
            </button>
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
            className="w-9 h-9 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/20 hover:bg-white/20 transition-all"
          >
            <Github className="w-4 h-4 text-white" />
          </a>
          <a
            href="#"
            className="w-9 h-9 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/20 hover:bg-white/20 transition-all"
          >
            <Share2 className="w-4 h-4 text-white" />
          </a>
        </motion.div>
      )}

      {/* Main Content Area - Dynamic based on current view */}
      <div className="relative z-10">
        {currentView === 'landing' && <LandingPage onGetStarted={() => handleNavigation('checkin')} onStartJourney={() => { setAuthModalMode('signup'); setShowSignUpModal(true); }} />}
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

      {/* Footer */}
      <Footer />
    </div>
  );
}