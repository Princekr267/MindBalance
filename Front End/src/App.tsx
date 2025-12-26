import { motion, useScroll, useTransform } from "motion/react";
import { Menu, Github, Share2 } from "lucide-react";
import { LandingPage } from "./components/LandingPage";
import { StressCheckIn } from "./components/StressCheckIn";
import { ProgressView } from "./components/ProgressView";
import { SolutionsView } from "./components/SolutionsView";
import { HistoryView } from "./components/HistoryView";
import { SignUpModal } from "./components/SignUpModal";
import { Footer } from "./components/Footer";
import natureBg from "./assets/nature_bg.png";
import { useState, useEffect, useRef } from "react";

export default function App() {
  const [currentView, setCurrentView] = useState<'landing' | 'checkin' | 'progress' | 'solutions' | 'history'>('landing');
  const [menuOpen, setMenuOpen] = useState(false);
  const [showSocialIcons, setShowSocialIcons] = useState(true);
  const [showSignUpModal, setShowSignUpModal] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'signup' | 'login'>('signup');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Parallax Scroll Hooks
  const { scrollY } = useScroll();
  const backgroundY = useTransform(scrollY, [0, 1000], [0, 300]); // Moves slower than content
  const blobY1 = useTransform(scrollY, [0, 1000], [0, -150]); // Moves upward
  const blobY2 = useTransform(scrollY, [0, 1000], [0, -50]);  // Moves upward slowly
  const blobY3 = useTransform(scrollY, [0, 1000], [0, -250]); // Moves upward fast

  // Check for existing authentication on mount
  useEffect(() => {
    const authStatus = localStorage.getItem('mindbalance_auth');
    if (authStatus === 'true') {
      setIsAuthenticated(true);
    }
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
    <div className="relative min-h-screen overflow-x-hidden font-sans text-stone-800">

      {/* Background Decor */}
      {/* Organic Background Layer with Parallax */}
      <div className="fixed inset-0 z-0 overflow-hidden">
        {/* Main Background Image */}
        <motion.div
          style={{ y: backgroundY }}
          className="absolute inset-0 w-full h-full"
        >
          <img
            src={natureBg}
            alt="Nature Background"
            className="w-full h-full object-cover scale-110" // Scaled up to prevent gaps during parallax
          />
        </motion.div>

        {/* Overlay for Readability */}
        {/* Overlay for Readability */}
        <div className="absolute inset-0 bg-[#E8E6DE]/60 backdrop-blur-[2px]"></div>
        <div className="absolute inset-0 bg-white/30 mix-blend-soft-light"></div>

        {/* Ambient Sage Blobs - Blended with Background & Parallax */}
        <motion.div style={{ y: blobY1 }} className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-[#9CAF88]/30 rounded-full mix-blend-multiply filter blur-3xl opacity-60 animate-blob"></motion.div>
        <motion.div style={{ y: blobY2 }} className="absolute top-[-10%] right-[-10%] w-[50vw] h-[50vw] bg-[#AEC09A]/30 rounded-full mix-blend-multiply filter blur-3xl opacity-60 animate-blob animation-delay-2000"></motion.div>
        <motion.div style={{ y: blobY3 }} className="absolute bottom-[-20%] left-[20%] w-[60vw] h-[60vw] bg-[#9CAF88]/30 rounded-full mix-blend-multiply filter blur-3xl opacity-60 animate-blob animation-delay-4000"></motion.div>

        {/* Grain Texture (Static) */}
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-20 brightness-100 contrast-150 mix-blend-overlay pointer-events-none"></div>
      </div>

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
          <span className="text-stone-800 text-xl sm:text-2xl font-[Aldrich] font-bold">
            MindBalance
          </span>
        </motion.div>

        {/* Desktop Navigation Links */}
        <div className="hidden lg:flex items-center gap-8">
          <button
            onClick={() => handleNavigation('checkin')}
            className="text-stone-600 hover:text-stone-900 transition-colors font-medium"
          >
            Check-In
          </button>
          <button
            onClick={() => handleNavigation('progress')}
            className="text-stone-600 hover:text-stone-900 transition-colors font-medium"
          >
            Progress
          </button>
          <button
            onClick={() => handleNavigation('solutions')}
            className="text-stone-600 hover:text-stone-900 transition-colors font-medium"
          >
            Solutions
          </button>
          <button
            onClick={() => handleNavigation('history')}
            className="text-stone-600 hover:text-stone-900 transition-colors font-medium"
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
            className="hidden sm:block px-6 py-2.5 bg-[#9CAF88] text-[#1c1917] rounded-full hover:bg-[#8B9D7A] transition-all shadow-md"
          >
            Get Started
          </button>
          <button
            onClick={() => {
              setAuthModalMode('login');
              setShowSignUpModal(true);
            }}
            className="hidden sm:block px-6 py-2.5 bg-white/50 text-stone-800 rounded-full border border-stone-300 hover:bg-white transition-all"
          >
            Login
          </button>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="w-10 h-10 flex items-center justify-center text-stone-800 hover:bg-stone-200 rounded-full transition-all lg:hidden"
          >
            <Menu className="w-6 h-6" />
          </button>
        </motion.div>
      </nav>

      {/* Mobile Menu */}
      {menuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:hidden fixed top-20 right-4 z-50 bg-[#E8E6DE]/95 backdrop-blur-lg rounded-2xl border border-stone-300 p-6 min-w-[200px] shadow-xl"
        >
          <div className="flex flex-col gap-4">
            <button
              onClick={() => { handleNavigation('checkin'); setMenuOpen(false); }}
              className="text-stone-800 hover:text-stone-600 transition-colors text-left"
            >
              Check-In
            </button>
            <button
              onClick={() => { handleNavigation('progress'); setMenuOpen(false); }}
              className="text-stone-800 hover:text-stone-600 transition-colors text-left"
            >
              Progress
            </button>
            <button
              onClick={() => { handleNavigation('solutions'); setMenuOpen(false); }}
              className="text-stone-800 hover:text-stone-600 transition-colors text-left"
            >
              Solutions
            </button>
            <button
              onClick={() => { handleNavigation('history'); setMenuOpen(false); }}
              className="text-stone-800 hover:text-stone-600 transition-colors text-left"
            >
              History
            </button>
          </div>
        </motion.div>
      )}

      {/* Main Content Area */}
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