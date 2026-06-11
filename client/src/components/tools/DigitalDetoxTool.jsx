import { useState, useEffect } from "react";
import { X, Play, Square, TimerReset } from "lucide-react";

export function DigitalDetoxTool({ onClose }) {
  const [isActive, setIsActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(3600); // Default 1 hour in seconds
  const [inputMinutes, setInputMinutes] = useState(60);

  useEffect(() => {
    let interval;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
      clearInterval(interval);
      // Could play a sound here or show a notification
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  const toggleTimer = () => setIsActive(!isActive);

  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(inputMinutes * 60);
  };

  const handleSetTime = (mins) => {
    setInputMinutes(mins);
    setTimeLeft(mins * 60);
    setIsActive(false);
  };

  const formatTime = (seconds) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    if (h > 0) return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Calculate progress for the circular ring
  const totalSeconds = inputMinutes * 60;
  const progressPercent = (timeLeft / totalSeconds) * 100;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-md dark-glass rounded-[2rem] border border-white/10 p-8 text-center">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 text-white/50 hover:text-white"
        >
          <X className="w-4 h-4" />
        </button>

        <h2 className="text-white text-2xl mb-2 font-serif">Digital Detox Timer</h2>
        <p className="text-white/50 text-sm mb-8">Step away from your screens and recharge.</p>

        {!isActive && timeLeft === totalSeconds && (
          <div className="flex justify-center gap-2 mb-8">
            {[15, 30, 60, 120].map((mins) => (
              <button
                key={mins}
                onClick={() => handleSetTime(mins)}
                className={`px-3 py-1 rounded-full text-xs font-medium border ${
                  inputMinutes === mins
                    ? 'bg-[#c4f061] text-[#151b2b] border-[#c4f061]'
                    : 'bg-white/5 text-white/60 border-white/10 hover:text-white hover:bg-white/10'
                }`}
              >
                {mins}m
              </button>
            ))}
          </div>
        )}

        <div className="relative w-56 h-56 mx-auto mb-10 flex items-center justify-center">
          {/* Background Ring */}
          <svg className="absolute w-full h-full -rotate-90" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="4" />
            <circle 
              cx="50" 
              cy="50" 
              r="45" 
              fill="none" 
              stroke="#c4f061" 
              strokeWidth="4"
              strokeDasharray="283"
              strokeDashoffset={283 - (283 * progressPercent) / 100}
              className="transition-all duration-1000 ease-linear"
              strokeLinecap="round"
            />
          </svg>
          
          <div className="z-10 flex flex-col items-center">
             <span className="text-[#c4f061] font-mono font-light text-5xl tracking-tight">{formatTime(timeLeft)}</span>
             {timeLeft === 0 && <span className="text-white/60 text-sm mt-2">Time's Up!</span>}
          </div>
        </div>

        <div className="flex justify-center gap-4">
          <button
            onClick={toggleTimer}
            disabled={timeLeft === 0}
            className="flex items-center gap-2 px-8 py-3 bg-[#c4f061] text-[#151b2b] rounded-full font-bold hover:bg-[#b0d957] transition-all disabled:opacity-50 pulse-hover"
          >
            {isActive ? <><Square className="w-4 h-4" /> Pause</> : <><Play className="w-4 h-4" /> Start</>}
          </button>
          
          <button
            onClick={resetTimer}
            className="flex items-center justify-center w-12 h-12 bg-white/10 text-white rounded-full hover:bg-white/20 transition-all"
            title="Reset Timer"
          >
            <TimerReset className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
