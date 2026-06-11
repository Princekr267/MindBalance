import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { X, Play, Square } from "lucide-react";

export function BoxBreathingTool({ onClose }) {
  const [isActive, setIsActive] = useState(false);
  const [phase, setPhase] = useState('Ready'); // 'Ready', 'Inhale', 'Hold', 'Exhale', 'Hold Out'
  const [timeLeft, setTimeLeft] = useState(4);

  useEffect(() => {
    let interval;
    if (isActive) {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            // Switch phase
            setPhase((currentPhase) => {
              if (currentPhase === 'Ready' || currentPhase === 'Hold Out') return 'Inhale';
              if (currentPhase === 'Inhale') return 'Hold';
              if (currentPhase === 'Hold') return 'Exhale';
              if (currentPhase === 'Exhale') return 'Hold Out';
              return 'Ready';
            });
            return 4; // Reset timer for new phase
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      clearInterval(interval);
      setPhase('Ready');
      setTimeLeft(4);
    }
    return () => clearInterval(interval);
  }, [isActive]);

  const toggleTimer = () => setIsActive(!isActive);

  // Determine circle animation based on phase
  let scale = 1;
  let duration = 4;
  if (phase === 'Inhale') {
    scale = 2; // Grow
  } else if (phase === 'Hold') {
    scale = 2; // Stay grown
    duration = 0;
  } else if (phase === 'Exhale') {
    scale = 1; // Shrink
  } else if (phase === 'Hold Out') {
    scale = 1; // Stay shrunk
    duration = 0;
  }

  const isCircleExpanded = phase === 'Inhale' || phase === 'Hold';
  const textColorClass = isCircleExpanded ? 'text-[#151b2b]' : 'text-white';

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-md dark-glass rounded-[2rem] border border-white/10 p-8 text-center">
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 text-white/50 hover:text-white"
        >
          <X className="w-4 h-4" />
        </button>
 
        <h2 className="text-white text-2xl mb-2 font-serif">Box Breathing</h2>
        <p className="text-white/50 text-sm mb-12">Follow the circle to regulate your breathing</p>
 
        <div className="relative w-48 h-48 mx-auto mb-12 flex items-center justify-center">
          {/* Animated Circle */}
          <motion.div
            className="absolute w-24 h-24 rounded-full bg-gradient-to-tr from-[#c4f061] to-[#b5b9ff] opacity-80 blur-[2px]"
            animate={{ scale }}
            transition={{ duration, ease: "linear" }}
          />
          {/* Inner Static Text Container */}
          <div className="absolute inset-0 flex flex-col items-center justify-center z-10 drop-shadow-md">
             <h3 className={`${textColorClass} font-bold text-2xl uppercase tracking-widest transition-colors duration-500`}>{phase}</h3>
             {isActive && <span className={`${textColorClass} text-xl font-mono mt-1 transition-colors duration-500`}>{timeLeft}s</span>}
          </div>
        </div>

        <button
          onClick={toggleTimer}
          className="mx-auto flex items-center gap-2 px-8 py-3 bg-white/10 text-white rounded-full font-medium hover:bg-white/20 transition-all"
        >
          {isActive ? <><Square className="w-4 h-4" /> Stop</> : <><Play className="w-4 h-4" /> Start</>}
        </button>
      </div>
    </div>
  );
}
