import { motion } from "framer-motion";
import { Menu, LogOut, User as UserIcon, Home, HeartPulse, Target, Lightbulb, MessageSquare, Search, Bell } from "lucide-react";
import { LandingPage } from "./components/LandingPage";
import { StressCheckIn } from "./components/StressCheckIn";
import { ProgressView } from "./components/ProgressView";
import { DashboardView } from "./components/DashboardView";
import { SolutionsView } from "./components/SolutionsView";
import { HistoryView } from "./components/HistoryView";
import { SignUpModal } from "./components/SignUpModal";
import { ProfileModal } from "./components/ProfileModal";
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
  const [showSignUpModal, setShowSignUpModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [authModalMode, setAuthModalMode] = useState('signup');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        axios.defaults.headers.common['x-auth-token'] = token;
        try {
          const res = await axios.get('/api/auth');
          setIsAuthenticated(true);
          setUser(res.data);
          setCurrentView('dashboard'); // Default authenticated view
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

  const handleNavigation = (view) => {
    if (!isAuthenticated && view !== 'landing') {
      setAuthModalMode('login');
      setShowSignUpModal(true);
    } else {
      setCurrentView(view);
      setMenuOpen(false);
    }
  };

  const handleAuthComplete = async () => {
    try {
      const res = await axios.get('/api/auth');
      setIsAuthenticated(true);
      setUser(res.data);
      setShowSignUpModal(false);
      setCurrentView('dashboard');
    } catch (error) {
      console.error("Failed to load user after auth:", error);
      setIsAuthenticated(true);
      setShowSignUpModal(false);
      setCurrentView('dashboard');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['x-auth-token'];
    setIsAuthenticated(false);
    setUser(null);
    setCurrentView('landing');
    setMenuOpen(false);
  };

  const NavItem = ({ id, icon: Icon, label }) => (
    <button
      onClick={() => handleNavigation(id)}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-sans font-medium text-sm ${
        currentView === id 
          ? 'bg-[#c4f061] text-[#151b2b] shadow-md' 
          : 'text-white/60 hover:text-white hover:bg-white/5'
      }`}
    >
      <Icon className="w-5 h-5" />
      {label}
    </button>
  );

  return (
    <>
      {/* Ambient Background Animations */}
      <div className="fixed inset-0 pointer-events-none -z-20 overflow-hidden">
        <div className="absolute w-[600px] h-[600px] bg-[#b5b9ff] rounded-full blur-[100px] opacity-15 -top-[100px] -left-[100px] animate-pulse duration-10000" />
        <div className="absolute w-[500px] h-[500px] bg-[#c4f061] rounded-full blur-[100px] opacity-10 -bottom-[50px] -right-[50px] animate-pulse duration-7000" />
      </div>

      {!isAuthenticated ? (
        // Unauthenticated Landing Layout
        <div className="relative z-10 w-full min-h-screen flex flex-col">
          <nav className="fixed top-0 left-0 right-0 z-50 flex justify-between items-center px-6 sm:px-12 py-4 bg-[#151b2b]/50 backdrop-blur-md border-b border-white/5">
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => setCurrentView('landing')}>
               <div className="w-8 h-8 rounded-lg bg-[#45645e] flex items-center justify-center shadow-lg shadow-[#45645e]/20">
                 <HeartPulse className="w-5 h-5 text-white" />
               </div>
               <span className="font-serif text-xl font-bold text-white tracking-wide">MindBalance</span>
            </div>
            <div className="flex gap-4 sm:gap-6 items-center">
              <button 
                onClick={() => { setAuthModalMode('login'); setShowSignUpModal(true); }}
                className="text-white/80 hover:text-[#c4f061] font-medium transition-colors text-sm"
              >
                Log in
              </button>
              <button 
                onClick={() => { setAuthModalMode('signup'); setShowSignUpModal(true); }}
                className="px-5 py-2.5 bg-[#c4f061] text-[#151b2b] rounded-full font-bold text-sm pulse-hover"
              >
                Sign Up
              </button>
            </div>
          </nav>
          <div className="flex-1 pt-24 pb-12">
            <LandingPage user={user} onGetStarted={() => { setAuthModalMode('signup'); setShowSignUpModal(true); }} onStartJourney={() => { setAuthModalMode('signup'); setShowSignUpModal(true); }} />
          </div>
        </div>
      ) : (
        // Authenticated Dashboard Layout
        <div className="flex min-h-screen w-full relative z-10">
          {/* Mobile TopNav */}
          <nav className="md:hidden fixed top-0 left-0 right-0 z-50 flex justify-between items-center px-4 py-4 bg-[#151b2b]/80 backdrop-blur-md border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#45645e] flex items-center justify-center">
                <HeartPulse className="w-5 h-5 text-white" />
              </div>
              <span className="font-serif text-xl font-bold text-white">MindBalance</span>
            </div>
            <button 
              onClick={() => setMenuOpen(!menuOpen)}
              className="text-white/70 hover:text-white"
            >
              <Menu className="w-6 h-6" />
            </button>
          </nav>

          {/* Mobile Menu Dropdown */}
          {menuOpen && (
            <div className="md:hidden fixed top-[73px] left-0 right-0 bg-[#151b2b]/95 backdrop-blur-xl border-b border-white/10 z-40 p-4 flex flex-col gap-2 shadow-2xl">
              <NavItem id="dashboard" icon={Home} label="Dashboard" />
              <NavItem id="checkin" icon={HeartPulse} label="Stress Check-In" />
              <NavItem id="progress" icon={Target} label="Wellness Goals" />
              <NavItem id="solutions" icon={Lightbulb} label="Stress Tools" />
              <NavItem id="history" icon={MessageSquare} label="Community" />
              <div className="h-px bg-white/10 my-2" />
              <button 
                onClick={() => { setShowProfileModal(true); setMenuOpen(false); }}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-white/60 hover:text-white hover:bg-white/5 transition-all"
              >
                <UserIcon className="w-5 h-5" />
                Profile Settings
              </button>
              <button 
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all"
              >
                <LogOut className="w-5 h-5" />
                Logout
              </button>
            </div>
          )}

          {/* Desktop Sidebar */}
          <aside className="hidden md:flex flex-col h-screen w-64 fixed left-0 top-0 py-8 bg-[#151b2b]/80 backdrop-blur-md border-r border-white/5 z-40">
            <div className="px-6 mb-10 flex flex-col gap-2">
              <div className="flex items-center gap-3 cursor-pointer" onClick={() => setCurrentView('dashboard')}>
                <div className="w-8 h-8 rounded-lg bg-[#45645e] flex items-center justify-center shadow-lg shadow-[#45645e]/20">
                  <HeartPulse className="w-5 h-5 text-white" />
                </div>
                <div className="font-serif text-xl font-bold text-white tracking-wide">MindBalance</div>
              </div>
            </div>
            
            <nav className="flex-1 flex flex-col gap-2 px-4">
              <NavItem id="dashboard" icon={Home} label="Dashboard" />
              <NavItem id="checkin" icon={HeartPulse} label="Stress Check-In" />
              <NavItem id="progress" icon={Target} label="Wellness Goals" />
              <NavItem id="solutions" icon={Lightbulb} label="Stress Tools" />
              <NavItem id="history" icon={MessageSquare} label="Community" />
            </nav>

            <div className="px-6 mb-6">
              <button 
                onClick={() => setCurrentView('checkin')}
                className="w-full bg-[#c4f061] text-[#151b2b] py-3 rounded-full font-bold text-sm pulse-hover shadow-lg shadow-[#c4f061]/10 flex items-center justify-center gap-2"
              >
                <HeartPulse className="w-4 h-4" />
                Quick Check-In
              </button>
            </div>

            <div className="px-4 border-t border-white/10 pt-4 mt-auto">
               <button 
                onClick={() => setShowProfileModal(true)}
                className="w-full flex items-center gap-3 px-4 py-2 rounded-xl text-white/60 hover:text-white hover:bg-white/5 transition-all mb-1 text-sm font-medium"
              >
                <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center">
                  <UserIcon className="w-3 h-3 text-white" />
                </div>
                <span className="truncate">{user?.name || 'Profile'}</span>
              </button>
              <button 
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-2 rounded-xl text-white/40 hover:text-red-400 hover:bg-red-500/10 transition-all text-sm font-medium"
              >
                <div className="w-6 h-6 rounded-full bg-transparent flex items-center justify-center">
                  <LogOut className="w-3 h-3" />
                </div>
                Logout
              </button>
            </div>
          </aside>

          {/* Main Content Area */}
          <main className="flex-1 transition-all duration-300 md:ml-64 pt-20 md:pt-8 px-4 sm:px-8 pb-12 overflow-x-hidden min-h-screen">
            {/* Header for Desktop */}
            <div className="hidden md:flex justify-between items-center mb-8">
               <div className="text-white/60 font-sans text-sm">
                 {/* Breadcrumbs could go here based on currentView */}
                 Welcome back, <span className="text-white font-medium">{user?.name?.split(' ')[0] || 'User'}</span>
               </div>
               <div className="flex items-center gap-4">
                 <div className="relative">
                   <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
                   <input 
                     type="text" 
                     placeholder="Search resources..." 
                     className="w-64 pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-full text-sm text-white focus:outline-none focus:border-white/30 focus:bg-white/10 transition-colors placeholder:text-white/30"
                   />
                 </div>
                 <button className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/70 hover:bg-white/10 transition-colors relative">
                   <Bell className="w-4 h-4" />
                   <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-[#c4f061] rounded-full border border-[#151b2b]"></span>
                 </button>
               </div>
            </div>

            <motion.div
              key={currentView}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              {currentView === 'landing' && <LandingPage user={user} onGetStarted={() => setCurrentView('checkin')} onStartJourney={() => {}} />}
              {currentView === 'dashboard' && <DashboardView />} 
              {currentView === 'checkin' && <StressCheckIn onComplete={() => setCurrentView('dashboard')} />}
              {currentView === 'progress' && <ProgressView />}
              {currentView === 'solutions' && <SolutionsView />}
              {currentView === 'history' && <HistoryView />}
            </motion.div>
          </main>
        </div>
      )}

      {/* Modals */}
      {showSignUpModal && (
        <SignUpModal 
          initialMode={authModalMode}
          onClose={() => setShowSignUpModal(false)} 
          onSignUpComplete={handleAuthComplete} 
        />
      )}

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
    </>
  );
}
