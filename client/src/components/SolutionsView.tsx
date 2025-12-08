import { motion } from "framer-motion";
import { Wind, Moon, Flame, Sparkles, Heart, Brain, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import axios from "axios";

const solutions = {
  Anxious: {
    icon: Wind,
    color: "#8b5cf6",
    title: "Breathing & Grounding",
    techniques: [
      {
        name: "4-7-8 Breathing",
        description: "Inhale for 4 seconds, hold for 7, exhale for 8. Repeat 4 times.",
        duration: "2 minutes"
      },
      {
        name: "5-4-3-2-1 Grounding",
        description: "Name 5 things you see, 4 you hear, 3 you feel, 2 you smell, 1 you taste.",
        duration: "3 minutes"
      },
      {
        name: "Box Breathing",
        description: "Inhale 4 seconds, hold 4, exhale 4, hold 4. Visualize a square.",
        duration: "5 minutes"
      }
    ]
  },
  Tired: {
    icon: Moon,
    color: "#6366f1",
    title: "Energy & Rest",
    techniques: [
      {
        name: "Power Nap Technique",
        description: "15-20 minute nap in a quiet, dark room. Set an alarm to avoid deep sleep.",
        duration: "20 minutes"
      },
      {
        name: "Progressive Muscle Relaxation",
        description: "Tense and relax each muscle group from toes to head.",
        duration: "10 minutes"
      },
      {
        name: "Sleep Hygiene Tips",
        description: "Dim lights 1 hour before bed, avoid screens, keep room cool (65-68°F).",
        duration: "Ongoing"
      }
    ]
  },
  Angry: {
    icon: Flame,
    color: "#ef4444",
    title: "Calm & Release",
    techniques: [
      {
        name: "Progressive Counting",
        description: "Count backwards from 100 by 7s while taking deep breaths.",
        duration: "3 minutes"
      },
      {
        name: "Physical Release",
        description: "Do 20 jumping jacks or take a brisk 5-minute walk to release tension.",
        duration: "5 minutes"
      },
      {
        name: "Anger Journal",
        description: "Write down what triggered you without filtering. Then tear it up.",
        duration: "10 minutes"
      }
    ]
  },
  Calm: {
    icon: Sparkles,
    color: "#10b981",
    title: "Maintain Balance",
    techniques: [
      {
        name: "Gratitude Practice",
        description: "Write down 3 things you're grateful for today, no matter how small.",
        duration: "5 minutes"
      },
      {
        name: "Mindful Observation",
        description: "Focus on an object for 2 minutes. Notice every detail without judgment.",
        duration: "2 minutes"
      },
      {
        name: "Loving-Kindness Meditation",
        description: "Repeat: 'May I be happy, may I be healthy, may I be safe, may I live with ease.'",
        duration: "5 minutes"
      }
    ]
  },
  Happy: {
    icon: Heart,
    color: "#f59e0b",
    title: "Amplify Joy",
    techniques: [
      {
        name: "Joy Journaling",
        description: "Capture this moment in detail. What made you happy? Who was there? How did it feel?",
        duration: "10 minutes"
      },
      {
        name: "Share Your Joy",
        description: "Call or message someone to share your positive experience.",
        duration: "5 minutes"
      },
      {
        name: "Future Visualization",
        description: "Imagine yourself feeling this way again. What conditions can you recreate?",
        duration: "5 minutes"
      }
    ]
  },
  Overwhelmed: {
    icon: Brain,
    color: "#ec4899",
    title: "Simplify & Focus",
    techniques: [
      {
        name: "Brain Dump",
        description: "Write every thought and task on paper for 5 minutes without organizing.",
        duration: "5 minutes"
      },
      {
        name: "One Thing Focus",
        description: "Choose the ONE most important task. Ignore everything else for 25 minutes.",
        duration: "25 minutes"
      },
      {
        name: "Permission to Pause",
        description: "Take 10 deep breaths and remind yourself: 'I don't have to do everything now.'",
        duration: "2 minutes"
      }
    ]
  }
};

export function SolutionsView() {
  const [currentEmotion, setCurrentEmotion] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLatestEmotion = async () => {
      try {
        const response = await axios.get('/api/assessment/history');
        if (response.data && response.data.length > 0) {
          // Get the most recent assessment
          const latestAssessment = response.data[0];
          setCurrentEmotion(latestAssessment.emotion);
        }
      } catch (err) {
        console.error('Error fetching latest emotion:', err);
        setError('Unable to load personalized recommendations');
      } finally {
        setLoading(false);
      }
    };

    fetchLatestEmotion();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen px-4 sm:px-8 lg:px-12 py-12 sm:py-16 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <Loader2 className="w-8 h-8 animate-spin text-white mx-auto mb-4" />
          <p className="text-white/70">Loading your personalized recommendations...</p>
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen px-4 sm:px-8 lg:px-12 py-12 sm:py-16 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center max-w-md"
        >
          <p className="text-white/70 mb-4">{error}</p>
          <p className="text-white/50 text-sm">Showing general wellness solutions instead.</p>
        </motion.div>
      </div>
    );
  }

  // If we have a current emotion, show personalized recommendations first
  const emotionKeys = currentEmotion && solutions[currentEmotion as keyof typeof solutions] 
    ? [currentEmotion, ...Object.keys(solutions).filter(k => k !== currentEmotion)]
    : Object.keys(solutions);

  return (
    <div className="min-h-screen px-4 sm:px-8 lg:px-12 py-12 sm:py-16">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-6xl mx-auto"
      >
        <h2 className="text-white text-3xl sm:text-4xl lg:text-5xl mb-3">
          Wellness Solutions
        </h2>
        <p className="text-white/70 mb-10 sm:mb-12">
          {currentEmotion 
            ? `Personalized techniques for when you're feeling ${currentEmotion.toLowerCase()}`
            : "Evidence-based techniques to help you navigate different emotional states"
          }
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
          {emotionKeys.map((emotion, index) => {
            const data = solutions[emotion as keyof typeof solutions];
            const Icon = data.icon;
            const isPersonalized = emotion === currentEmotion;
            
            return (
              <motion.div
                key={emotion}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className={`bg-white/10 backdrop-blur-lg rounded-3xl p-6 sm:p-8 border transition-all ${
                  isPersonalized 
                    ? 'border-white/30 bg-white/15 shadow-lg' 
                    : 'border-white/20 hover:bg-white/15'
                }`}
              >
                <div className="flex items-center gap-4 mb-6">
                  <div 
                    className="w-14 h-14 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: `${data.color}20` }}
                  >
                    <Icon className="w-7 h-7" style={{ color: data.color }} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-white text-2xl">{emotion}</h3>
                      {isPersonalized && (
                        <span className="text-xs px-2 py-1 bg-white/20 text-white rounded-full">
                          Current Mood
                        </span>
                      )}
                    </div>
                    <p className="text-white/60">{data.title}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  {data.techniques.map((technique, idx) => (
                    <motion.div
                      key={idx}
                      whileHover={{ scale: 1.02 }}
                      className="bg-white/5 rounded-xl p-4 border border-white/10 hover:border-white/20 transition-all cursor-pointer"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="text-white">{technique.name}</h4>
                        <span 
                          className="text-xs px-2 py-1 rounded-full"
                          style={{ 
                            backgroundColor: `${data.color}20`,
                            color: data.color 
                          }}
                        >
                          {technique.duration}
                        </span>
                      </div>
                      <p className="text-white/70 text-sm">{technique.description}</p>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Additional Resources */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-12 bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20"
        >
          <h3 className="text-white text-2xl mb-4">Remember</h3>
          <ul className="space-y-3 text-white/70">
            <li className="flex items-start gap-3">
              <span className="text-white/40 mt-1">•</span>
              <span>These techniques work best with regular practice, not just during crisis moments</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-white/40 mt-1">•</span>
              <span>What works varies by person—experiment to find your favorites</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-white/40 mt-1">•</span>
              <span>If you're experiencing persistent distress, consider reaching out to a mental health professional</span>
            </li>
          </ul>
        </motion.div>
      </motion.div>
    </div>
  );
}
