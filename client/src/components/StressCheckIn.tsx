import { motion } from "framer-motion";
import { useState } from "react";
import { Smile, Frown, Zap, Battery, CloudRain, Sparkles } from "lucide-react";
import axios from 'axios';

interface StressCheckInProps {
  onComplete: () => void;
}

interface CheckInData {
  id: string;
  timestamp: number;
  date: string;
  stressLevel: number;
  emotion: string;
}

const emotions = [
  { name: "Anxious", icon: CloudRain, color: "#8b5cf6" },
  { name: "Tired", icon: Battery, color: "#6366f1" },
  { name: "Angry", icon: Zap, color: "#ef4444" },
  { name: "Calm", icon: Sparkles, color: "#10b981" },
  { name: "Happy", icon: Smile, color: "#f59e0b" },
  { name: "Overwhelmed", icon: Frown, color: "#ec4899" },
];

export function StressCheckIn({ onComplete }: StressCheckInProps) {
  const [stressLevel, setStressLevel] = useState(5);
  const [selectedEmotion, setSelectedEmotion] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!selectedEmotion) {
      alert("Please select an emotion");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await axios.post('/api/assessment', {
        stressScore: stressLevel,
        emotion: selectedEmotion,
        answers: { stress: stressLevel, mood: selectedEmotion }
      });

      console.log('Check-in submitted successfully:', response.data);
      onComplete();
    } catch (error) {
      console.error('Failed to submit check-in:', error);
      alert('Failed to submit check-in. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen px-4 sm:px-8 lg:px-12 py-12 sm:py-16 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-3xl bg-white/10 backdrop-blur-lg rounded-3xl p-6 sm:p-10 lg:p-12 border border-white/20"
      >
        <h2 className="text-white text-3xl sm:text-4xl lg:text-5xl mb-3 text-center">
          Daily Check-In
        </h2>
        <p className="text-white/70 text-center mb-10 sm:mb-12">
          How are you feeling today? Take a moment to reflect.
        </p>

        {/* Stress Level Slider */}
        <div className="mb-12 sm:mb-16">
          <label className="text-white text-xl sm:text-2xl mb-6 block">
            Stress Level: <span className="text-white/60">{stressLevel}/10</span>
          </label>
          
          <div className="relative">
            <input
              type="range"
              min="1"
              max="10"
              value={stressLevel}
              onChange={(e) => setStressLevel(parseInt(e.target.value))}
              className="w-full h-3 rounded-full appearance-none cursor-pointer"
              style={{
                background: `linear-gradient(to right, #10b981 0%, #f59e0b ${(stressLevel - 1) * 11.11}%, #ef4444 100%)`,
              }}
            />
            
            <div className="flex justify-between mt-4 text-white/60 text-sm">
              <span>Low</span>
              <span>Moderate</span>
              <span>High</span>
            </div>
          </div>
        </div>

        {/* Emotion Selection */}
        <div className="mb-10 sm:mb-12">
          <label className="text-white text-xl sm:text-2xl mb-6 block">
            What emotion best describes your state?
          </label>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
            {emotions.map((emotion) => {
              const Icon = emotion.icon;
              const isSelected = selectedEmotion === emotion.name;
              
              return (
                <motion.button
                  key={emotion.name}
                  onClick={() => setSelectedEmotion(emotion.name)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`p-4 sm:p-6 rounded-2xl border-2 transition-all ${
                    isSelected
                      ? 'bg-white/20 border-white/60'
                      : 'bg-white/5 border-white/20 hover:bg-white/10'
                  }`}
                  style={{
                    borderColor: isSelected ? emotion.color : undefined,
                  }}
                >
                  <Icon 
                    className="w-8 h-8 sm:w-10 sm:h-10 mx-auto mb-2" 
                    style={{ color: emotion.color }}
                  />
                  <div className="text-white text-sm sm:text-base">{emotion.name}</div>
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Submit Button */}
        <motion.button
          onClick={handleSubmit}
          disabled={isSubmitting}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={`w-full py-4 rounded-full text-white text-lg transition-all ${
            isSubmitting
              ? 'bg-white/20 cursor-not-allowed'
              : 'bg-white/30 hover:bg-white/40 border border-white/40'
          }`}
        >
          {isSubmitting ? 'Saving Check-In...' : 'Complete Check-In'}
        </motion.button>

        <p className="text-white/50 text-sm text-center mt-6">
          Your data is stored locally on your device and never shared.
        </p>
      </motion.div>
    </div>
  );
}
