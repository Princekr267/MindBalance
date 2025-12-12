import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { useMemo } from "react";

interface PersonalizedTipsProps {
  profession?: string;
}

export function PersonalizedTips({ profession }: PersonalizedTipsProps) {
  const tip = useMemo(() => {
    if (!profession) return null;

    const p = profession.toLowerCase();
    
    if (p.includes("developer") || p.includes("programmer") || p.includes("coder") || p.includes("software") || p.includes("desk") || p.includes("it")) {
      const tips = [
        { text: "Use the 20-20-20 rule: Every 20 mins, look 20 ft away for 20 secs.", icon: "👁️" },
        { text: "Check your posture: Are your shoulders relaxed? specific spine.", icon: "🪑" },
        { text: "Mental block? Step away from the screen for a 2-minute walk.", icon: "🚶" }
      ];
      return tips[Math.floor(Math.random() * tips.length)];
    }
    
    if (p.includes("student") || p.includes("university") || p.includes("college") || p.includes("school")) {
      const tips = [
        { text: "Try the Pomodoro technique: 25m focus, 5m break.", icon: "🍅" },
        { text: "Exam stress? Focus on what you can control right now.", icon: "📚" },
        { text: "Stay hydrated! Your brain needs water to retain info.", icon: "💧" }
      ];
      return tips[Math.floor(Math.random() * tips.length)];
    }

    if (p.includes("teacher") || p.includes("educator")) {
      const tips = [
        { text: "Between classes, take 3 deep breaths to reset.", icon: "🌬️" },
        { text: "Remember to drink water while speaking all day.", icon: "🥤" },
        { text: "Your energy sets the tone. Take a moment for yourself.", icon: "✨" }
      ];
      return tips[Math.floor(Math.random() * tips.length)];
    }

    if (p.includes("nurse") || p.includes("doctor") || p.includes("medical") || p.includes("health")) {
      const tips = [
        { text: "Hydration is key. Drink a glass of water now.", icon: "💧" },
        { text: "Take a micro-break: Close your eyes for 10 seconds.", icon: "😌" },
        { text: "Compassion fatigue is real. Check in with your own needs.", icon: "❤️" }
      ];
      return tips[Math.floor(Math.random() * tips.length)];
    }
    
    if (p.includes("manager") || p.includes("lead") || p.includes("executive")) {
      const tips = [
        { text: "Delegate one small task to lighten your load.", icon: "📉" },
        { text: "Model work-life balance for your team today.", icon: "⚖️" },
        { text: "Celebrate small wins before moving to the next problem.", icon: "🎉" }
      ];
      return tips[Math.floor(Math.random() * tips.length)];
    }

    const defaultTips = [
      { text: "Taking 5 mins for mindfulness improves focus by 30%.", icon: "✨" },
      { text: "Unclench your jaw and drop your shoulders.", icon: "😌" },
      { text: "Name one thing you are grateful for today.", icon: "🙏" }
    ];
    return defaultTips[Math.floor(Math.random() * defaultTips.length)];
  }, [profession]);

  if (!profession || !tip) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 w-full flex items-start gap-4"
    >
      <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0 text-xl">
        {tip.icon}
      </div>
      <div>
        <h3 className="text-white text-lg font-semibold mb-1">
          Daily Tip for {profession}s
        </h3>
        <p className="text-white/80 leading-relaxed">
          {tip.text}
        </p>
      </div>
      <Sparkles className="w-5 h-5 text-yellow-300 absolute top-4 right-4 opacity-50" />
    </motion.div>
  );
}
