import { motion } from "framer-motion";
import {
  Wind,
  Flame,
  Sparkles,
  Loader2,
} from "lucide-react";
import { useState, useEffect } from "react";
import axios from "axios";
import { BoxBreathingTool } from "./tools/BoxBreathingTool";
import { DigitalDetoxTool } from "./tools/DigitalDetoxTool";
import { NotepadTool } from "./tools/NotepadTool";

const solutions = {
  Low: {
    icon: Sparkles,
    color: "#c4f061",
    title: "Maintenance & Growth",
    description:
      "You're doing well! Keep up these habits to maintain your mental wellness.",
    techniques: [
      {
        name: "Gratitude Practice",
        description: "Write down 3 things you're grateful for today. Click to open your notepad.",
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
        description: "Inhale 4s, hold 4s, exhale 4s, hold 4s. Repeat. Click to start.",
        duration: "5 minutes",
      },
      {
        name: "Progressive Muscle Relaxation",
        description: "Tense and relax each muscle group from toes to head.",
        duration: "10 minutes",
      },
      {
        name: "Digital Detox",
        description: "Take a break from all screens for at least one hour. Click to set timer.",
        duration: "1 hour",
      },
    ],
  },
  High: {
    icon: Flame,
    color: "#ba1a1a",
    title: "Crisis Management & Support",
    description:
      "Your stress levels are high. Prioritize self-care and professional support.",
    techniques: [
      {
        name: "5-4-3-2-1 Grounding",
        description: "5 things you see, 4 you hear, 3 feel, 2 smell, 1 taste. Click to note them down.",
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
  const [activeTool, setActiveTool] = useState(null); // { type, title, subtitle }

  useEffect(() => {
    const fetchLatestAssessment = async () => {
      try {
        const response = await axios.get("/api/assessments");
        if (response.data && response.data.length > 0) {
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

  const openTool = (tech) => {
    if (tech.name === "Box Breathing") {
      setActiveTool({ type: 'box_breathing' });
    } else if (tech.name === "Digital Detox") {
      setActiveTool({ type: 'digital_detox' });
    } else if (tech.name === "Gratitude Practice" || tech.name === "5-4-3-2-1 Grounding") {
      setActiveTool({ type: 'notepad', title: tech.name, subtitle: tech.description });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <Loader2 className="w-8 h-8 animate-spin text-[#c4f061] mx-auto mb-4" />
          <p className="text-white/60">
            Loading your personalized recommendations...
          </p>
        </motion.div>
      </div>
    );
  }

  const levelKeys =
    currentLevel && solutions[currentLevel]
      ? [
          currentLevel,
          ...Object.keys(solutions).filter((k) => k !== currentLevel),
        ]
      : Object.keys(solutions);

  return (
    <div className="py-6">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-6xl mx-auto"
      >
        <h2 className="text-white text-3xl sm:text-4xl lg:text-5xl mb-3 font-serif">
          Stress Relief Tools
        </h2>
        <p className="text-white/60 mb-10 sm:mb-12">
          {currentLevel 
            ? `Based on your recent check-in, here are your personalized recommendations.`
            : `Explore coping strategies and techniques for all stress levels.`}
        </p>

        <div className="space-y-12">
          {levelKeys.map((level, index) => {
            const isPrimary = index === 0 && currentLevel;
            const data = solutions[level];
            const Icon = data.icon;

            return (
              <motion.div
                key={level}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`dark-glass rounded-3xl p-6 sm:p-8 lg:p-10 border ${
                  isPrimary ? 'border-[#c4f061]/50 shadow-[0_0_30px_rgba(196,240,97,0.1)]' : 'border-white/10'
                }`}
              >
                <div className="flex items-center gap-4 mb-6">
                  <div 
                    className="w-12 h-12 rounded-2xl flex items-center justify-center"
                    style={{ backgroundColor: `${data.color}20` }}
                  >
                    <Icon className="w-6 h-6" style={{ color: data.color }} />
                  </div>
                  <div>
                    <h3 className="text-white text-2xl font-serif">
                      {data.title}
                    </h3>
                    {isPrimary && (
                      <span className="text-xs uppercase tracking-wider font-bold text-[#c4f061]">Recommended for you</span>
                    )}
                  </div>
                </div>
                
                <p className="text-white/70 mb-8 max-w-3xl leading-relaxed">
                  {data.description}
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {data.techniques.map((tech) => {
                    const isInteractive = ["Box Breathing", "Digital Detox", "Gratitude Practice", "5-4-3-2-1 Grounding"].includes(tech.name);
                    return (
                      <motion.div
                        whileHover={isInteractive ? { scale: 1.02 } : {}}
                        key={tech.name}
                        onClick={() => openTool(tech)}
                        className={`bg-white/5 rounded-2xl p-6 border transition-all ${
                          isInteractive 
                            ? 'border-[#c4f061]/30 hover:border-[#c4f061] hover:bg-white/10 cursor-pointer shadow-[inset_0_0_20px_rgba(196,240,97,0.05)]' 
                            : 'border-white/5 hover:border-white/20 hover:bg-white/10 cursor-default'
                        } group`}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <h4 className={`font-medium transition-colors ${isInteractive ? 'text-[#c4f061]' : 'text-white group-hover:text-white/90'}`}>
                            {tech.name}
                          </h4>
                          {isInteractive && (
                            <span className="text-[10px] uppercase font-bold text-[#151b2b] bg-[#c4f061] px-2 py-0.5 rounded-full">Interactive</span>
                          )}
                        </div>
                        <p className="text-white/60 text-sm mb-4 line-clamp-3">
                          {tech.description}
                        </p>
                        <div className="text-xs font-semibold text-white/40 uppercase tracking-wide">
                          {tech.duration}
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* Interactive Tool Modals */}
      {activeTool?.type === 'box_breathing' && <BoxBreathingTool onClose={() => setActiveTool(null)} />}
      {activeTool?.type === 'digital_detox' && <DigitalDetoxTool onClose={() => setActiveTool(null)} />}
      {activeTool?.type === 'notepad' && <NotepadTool title={activeTool.title} subtitle={activeTool.subtitle} onClose={() => setActiveTool(null)} />}
    </div>
  );
}
