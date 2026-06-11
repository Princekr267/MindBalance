import { motion } from "framer-motion";
import { HeartPulse, TrendingUp, Lightbulb, Clock } from "lucide-react";

export function LandingPage({ user, onGetStarted, onStartJourney }) {
  const scrollToFeatures = () => {
    const featuresSection = document.getElementById('how-mindbalance-helps');
    if (featuresSection) {
      featuresSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const features = [
    {
      icon: HeartPulse,
      title: "Quick Check-Ins",
      description: "Log your stress level and emotions in seconds with our intuitive interface"
    },
    {
      icon: TrendingUp,
      title: "Track Your Progress",
      description: "Visualize your mental wellness journey with beautiful charts and insights"
    },
    {
      icon: Lightbulb,
      title: "Personalized Solutions",
      description: "Get contextual breathing exercises and coping strategies based on your emotions"
    },
    {
      icon: Clock,
      title: "History & Patterns",
      description: "Review your check-in history and discover patterns in your emotional state"
    }
  ];

  return (
    <>
      {/* Hero Section */}
      <div
        className="flex items-center relative"
        style={{ minHeight: "calc(100vh - 120px)" }}
      >
        <div className="max-w-4xl w-full relative z-10 mx-auto text-center px-4">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-[#c4f061] text-sm sm:text-base mb-6 font-medium tracking-[0.3em] uppercase"
          >
            Welcome to your digital sanctuary
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="text-white mb-8 leading-[1.1] font-serif"
            style={{
              fontSize: "clamp(3.5rem, 8vw, 5.5rem)",
              fontWeight: 500,
            }}
          >
            MindBalance
            <span className="block text-2xl sm:text-4xl mt-4 font-sans font-light text-white/60 tracking-wide">
              Find your center.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="text-white/70 text-lg sm:text-xl mb-12 max-w-2xl mx-auto leading-relaxed"
          >
            Your personal mental wellness companion. Track your stress, understand your emotions, and discover personalized coping strategies in a peaceful environment.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.9 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            {user ? (
              <button
                onClick={onGetStarted}
                className="px-8 py-4 bg-[#c4f061] text-[#151b2b] font-bold rounded-full pulse-hover text-lg shadow-lg shadow-[#c4f061]/20 w-full sm:w-auto"
              >
                Go to Dashboard
              </button>
            ) : (
              <button
                onClick={onStartJourney || onGetStarted}
                className="px-8 py-4 bg-[#c4f061] text-[#151b2b] font-bold rounded-full pulse-hover text-lg shadow-lg shadow-[#c4f061]/20 w-full sm:w-auto"
              >
                Start Your Journey
              </button>
            )}
            <button
              onClick={scrollToFeatures}
              className="px-8 py-4 bg-white/10 backdrop-blur-md border border-white/20 text-white font-medium rounded-full hover:bg-white/20 transition-all text-lg w-full sm:w-auto"
            >
              Learn More
            </button>
          </motion.div>
        </div>
      </div>

      {/* Features Section */}
      <div id="how-mindbalance-helps" className="py-16 sm:py-24 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-6xl mx-auto px-4"
        >
          <h2 className="text-white text-3xl sm:text-4xl lg:text-5xl mb-6 text-center font-serif">
            How MindBalance Helps
          </h2>
          <p className="text-white/60 text-center mb-16 max-w-2xl mx-auto text-lg leading-relaxed">
            Simple tools designed to help you understand and manage your mental wellness, naturally.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="dark-glass rounded-3xl p-8 sm:p-10 pulse-hover"
              >
                <div className="w-14 h-14 bg-[#45645e]/30 rounded-2xl flex items-center justify-center mb-6 border border-[#45645e]/50">
                  <feature.icon className="w-7 h-7 text-[#c4f061]" />
                </div>
                <h3 className="text-white text-2xl mb-4 font-serif">{feature.title}</h3>
                <p className="text-white/70 text-lg leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </>
  );
}
