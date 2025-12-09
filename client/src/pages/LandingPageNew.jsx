import React from 'react';
import { motion } from 'framer-motion';
import { Menu, Github, Share2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { FloatingBubbles } from '../components/FloatingBubbles';
import backgroundInk from '../assets/bcade4ed6aaaac33659059582196cc1b14abc8bd.png';

const LandingPageNew = () => {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-[200vh] bg-gradient-to-b from-[#5a9d9f] via-[#4a8589] to-[#2d4f5e] overflow-x-hidden">
      {/* Background Ink Image */}
      <div
        className="absolute inset-0 bg-center bg-no-repeat"
        style={{
          backgroundImage: `url(${backgroundInk})`,
          backgroundSize: 'cover',
          opacity: 0.95,
          mixBlendMode: 'normal',
        }}
      />

      {/* Subtle Vignette Effect */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 0%, transparent 50%, rgba(0,0,0,0.2) 80%, rgba(0,0,0,0.4) 100%)',
        }}
      />
      
      {/* Bubbles Layer */}
      <FloatingBubbles />
      {/* Top Navigation */}
      <nav className="relative z-50 px-12 py-8 flex items-center justify-between">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <span className="text-white text-2xl">
            MindBalance
          </span>
        </motion.div>

        {/* Right side - Sign Up + Menu */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="flex items-center gap-6"
        >
          <Link to="/signup">
            <button className="px-8 py-2.5 bg-transparent text-white rounded-full border border-white/60 hover:bg-white/10 transition-all">
              Sign Up
            </button>
          </Link>
          <button className="w-10 h-10 flex items-center justify-center text-white">
            <Menu className="w-6 h-6" />
          </button>
        </motion.div>
      </nav>

      {/* Social Icons - Right Side */}
      <motion.div
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 0.3 }}
        className="fixed right-6 top-1/2 -translate-y-1/2 z-40 flex flex-col gap-4"
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

      {/* Main Content - Left Aligned */}
      <div
        className="relative z-10 px-12 flex items-center"
        style={{ minHeight: "calc(100vh - 120px)" }}
      >
        <div className="max-w-2xl">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-white/90 text-lg mb-4 select-none"
          >
            Welcome to
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-white mb-10 leading-none"
            style={{
              fontSize: "clamp(3rem, 7vw, 5.5rem)",
              fontWeight: 700,
            }}
          >
            MindBalance
          </motion.h1>

          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            whileHover={{
              scale: 1.05,
              backgroundColor: "rgba(255, 255, 255, 0.08)",
            }}
            whileTap={{ scale: 0.95 }}
            className="px-9 py-3 bg-transparent text-white rounded-full border border-white/60 hover:border-white transition-all"
            onClick={() => navigate('/signup')}
          >
            Start Your Journey
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default LandingPageNew;
