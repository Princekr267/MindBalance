import { motion } from "framer-motion";
import {
  Wind,
  Moon,
  Flame,
  Sparkles,
  Heart,
  Brain,
  Loader2,
} from "lucide-react";
import { useState, useEffect } from "react";
import axios from "axios";

const solutions = {
  Low: {
    icon: Sparkles,
    color: "#10b981",
    title: "Maintenance & Growth",
    description:
      "You're doing well! Keep up these habits to maintain your mental wellness.",
    techniques: [
      {
        name: "Gratitude Practice",
        description: "Write down 3 things you're grateful for today.",
        duration: "5 minutes",
      },
      {
        name: "Mindful Walking",
        description:
          "Take a walk and focus entirely on the sensations of moving.",
        duration: "15 minutes",
      },
      {
        name: "New Skill Learning",
        description:
          "Challenge your brain by learning something new and exciting.",
        duration: "Ongoing",
      },
    ],
  },
  Moderate: {
    icon: Wind,
    color: "#f59e0b",
    title: "Stress Reduction",
    description:
      "You're feeling some strain. These techniques can help you reset.",
    techniques: [
      {
        name: "Box Breathing",
        description: "Inhale 4s, hold 4s, exhale 4s, hold 4s. Repeat.",
        duration: "5 minutes",
      },
      {
        name: "Progressive Muscle Relaxation",
        description: "Tense and relax each muscle group from toes to head.",
        duration: "10 minutes",
      },
      {
        name: "Digital Detox",
        description: "Take a break from all screens for at least one hour.",
        duration: "1 hour",
      },
    ],
  },
  High: {
    icon: Flame,
    color: "#ef4444",
    title: "Crisis Management & Support",
    description:
      "Your stress levels are high. Prioritize self-care and professional support.",
    techniques: [
      {
        name: "5-4-3-2-1 Grounding",
        description: "5 things you see, 4 you hear, 3 feel, 2 smell, 1 taste.",
        duration: "3 minutes",
      },
      {
        name: "Cold Water Splash",
        description:
          "Splash cold water on your face to trigger the dive reflex and calm down.",
        duration: "1 minute",
      },
      {
        name: "Reach Out",
        description:
          "Call a trusted friend or a mental health professional immediately.",
        duration: "Immediate",
      },
    ],
  },
};

export function SolutionsView() {
  const [currentLevel, setCurrentLevel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLatestAssessment = async () => {
      try {
        const response = await axios.get("/api/assessments");
        if (response.data && response.data.length > 0) {
          // Get the most recent assessment
          const latestAssessment = response.data[0];
          setCurrentLevel(latestAssessment.level);
        }
      } catch (err) {
        console.error("Error fetching latest assessment:", err);
        setError("Unable to load personalized recommendations");
      } finally {
        setLoading(false);
      }
    };

    fetchLatestAssessment();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen px-4 sm:px-8 lg:px-12 py-12 sm:py-16 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <Loader2 className="w-8 h-8 animate-spin text-[#9CAF88] mx-auto mb-4" />
          <p className="text-stone-600">
            Loading your personalized recommendations...
          </p>
        </motion.div>
      </div>
    );
  }

  // Determine what to show
  // If we have a level, show that level's content prominently + others
  // If no level/error, show all

  const levelKeys =
    currentLevel && solutions[currentLevel]
      ? [
          currentLevel,
          ...Object.keys(solutions).filter((k) => k !== currentLevel),
        ]
      : Object.keys(solutions);

  return (
    <div className="min-h-screen px-4 sm:px-8 lg:px-12 py-12 sm:py-16">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-6xl mx-auto"
      >
        <h2 className="text-[#1c1917] text-3xl sm:text-4xl lg:text-5xl mb-3 font-serif">
          Wellness Solutions
        </h2>
        <p className="text-stone-600 mb-10 sm:mb-12 text-lg">
          {currentLevel
            ? `Based on your assessment, your stress level appears ${currentLevel.toLowerCase()}. Here are some tailored techniques.`
            : "Evidence-based techniques to help you navigate different emotional states"}
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
          {levelKeys.map((level, index) => {
            const data = solutions[level];
            const Icon = data.icon;
            const isPersonalized = level === currentLevel;

            return (
              <motion.div
                key={level}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className={`bg-white/80 backdrop-blur-2xl rounded-[2rem] p-8 border shadow-xl hover:shadow-2xl hover:shadow-[#9CAF88]/10 transition-all hover:-translate-y-1 duration-300 ${
                  isPersonalized
                    ? "border-[#10b981] ring-2 ring-[#10b981]/20"
                    : "border-white/60 hover:bg-white/90"
                }`}
              >
                <div className="flex items-center gap-4 mb-6">
                  <div
                    className="w-14 h-14 rounded-full flex items-center justify-center shadow-sm"
                    style={{ backgroundColor: `${data.color}20` }}
                  >
                    <Icon className="w-7 h-7" style={{ color: data.color }} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-[#1c1917] text-2xl font-serif">
                        {level} Stress
                      </h3>
                      {isPersonalized && (
                        <span
                          className="text-xs px-2 py-1 text-white rounded-full"
                          style={{ backgroundColor: data.color }}
                        >
                          Your Level
                        </span>
                      )}
                    </div>
                    <p className="text-stone-600 font-medium">{data.title}</p>
                  </div>
                </div>

                <p className="text-stone-600 mb-6 italic text-sm">
                  {data.description}
                </p>

                <div className="space-y-4">
                  {data.techniques.map((technique, idx) => (
                    <motion.div
                      key={idx}
                      whileHover={{ scale: 1.01 }}
                      className="bg-white/50 rounded-xl p-4 border border-white/60 hover:border-[#9CAF88]/50 transition-all cursor-pointer shadow-sm"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="text-[#1c1917] font-semibold">
                          {technique.name}
                        </h4>
                        <span
                          className="text-xs px-2 py-1 rounded-full font-medium"
                          style={{
                            backgroundColor: `${data.color}15`,
                            color: data.color,
                            border: `1px solid ${data.color}30`,
                          }}
                        >
                          {technique.duration}
                        </span>
                      </div>
                      <p className="text-stone-600 text-sm">
                        {technique.description}
                      </p>
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
          className="mt-12 bg-white/60 backdrop-blur-xl rounded-3xl p-8 border border-white/60 shadow-lg"
        >
          <h3 className="text-[#1c1917] text-2xl mb-4 font-serif">Remember</h3>
          <ul className="space-y-3 text-stone-600">
            <li className="flex items-start gap-3">
              <span className="text-[#9CAF88] mt-1 font-bold">•</span>
              <span>
                These techniques work best with regular practice, not just
                during crisis moments
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-[#9CAF88] mt-1 font-bold">•</span>
              <span>
                What works varies by person—experiment to find your favorites
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-[#9CAF88] mt-1 font-bold">•</span>
              <span>
                If you're experiencing persistent distress, consider reaching
                out to a mental health professional
              </span>
            </li>
          </ul>
        </motion.div>
      </motion.div>
    </div>
  );
}
