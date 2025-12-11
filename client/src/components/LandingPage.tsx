import { motion } from "framer-motion";
import { Heart, TrendingUp, Lightbulb, Clock } from "lucide-react";

interface LandingPageProps {
  onGetStarted: () => void;
  onStartJourney?: () => void;
}

export function LandingPage({ onGetStarted, onStartJourney }: LandingPageProps) {
  const scrollToFeatures = () => {
    const featuresSection = document.getElementById('how-mindbalance-helps');
    if (featuresSection) {
      featuresSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const features = [
    {
      icon: Heart,
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
        className="px-4 sm:px-8 lg:px-12 flex items-center"
        style={{ minHeight: "calc(100vh - 120px)" }}
      >
        <div className="max-w-2xl w-full">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-white/90 text-base sm:text-lg mb-3 sm:mb-4 select-none"
          >
            Welcome to
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-white mb-6 sm:mb-8 lg:mb-10 leading-none"
            style={{
              fontSize: "clamp(2.5rem, 10vw, 5.5rem)",
              fontWeight: 700,
            }}
          >
            MindBalance
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="text-white/80 text-base sm:text-lg mb-8 sm:mb-10 max-w-xl"
          >
            Your personal mental wellness companion. Track your stress, understand your emotions, and discover personalized coping strategies all in one place.
          </motion.p>

          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            whileHover={{
              scale: 1.05,
              backgroundColor: "rgba(255, 255, 255, 0.08)",
            }}
            whileTap={{ scale: 0.95 }}
            onClick={onStartJourney || onGetStarted}
            className="px-6 sm:px-8 lg:px-9 py-2.5 sm:py-3 bg-transparent text-white rounded-full border border-white/60 hover:border-white transition-all text-sm sm:text-base w-full sm:w-auto"
          >
            Start Your Journey
          </motion.button>
        </div>
      </div>

      {/* Features Section */}
      <div id="how-mindbalance-helps" className="px-4 sm:px-8 lg:px-12 py-16 sm:py-24">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-6xl mx-auto"
        >
          <h2 className="text-white text-3xl sm:text-4xl lg:text-5xl mb-4 text-center">
            How MindBalance Helps
          </h2>
          <p className="text-white/70 text-center mb-12 sm:mb-16 max-w-2xl mx-auto">
            Simple tools designed to help you understand and manage your mental wellness
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white/10 backdrop-blur-md rounded-2xl p-6 sm:p-8 border border-white/20 transition-all"
              >
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-white text-xl sm:text-2xl mb-3">
                  {feature.title}
                </h3>
                <p className="text-white/70">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* How It Works Section */}
      <div className="px-4 sm:px-8 lg:px-12 py-16 sm:py-24">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto"
        >
          <h2 className="text-white text-3xl sm:text-4xl lg:text-5xl mb-12 sm:mb-16 text-center">
            Your Wellness Journey in 3 Steps
          </h2>

          <div className="space-y-8 sm:space-y-12">
            {[
              {
                step: "01",
                title: "Check-In Daily",
                description: "Take 30 seconds to log your stress level (1-10) and select your current emotion. Building this habit is the foundation of self-awareness."
              },
              {
                step: "02",
                title: "Visualize Your Patterns",
                description: "See your stress trends over the past 7 days with intuitive charts. Understand what triggers stress and when you feel most balanced."
              },
              {
                step: "03",
                title: "Get Personalized Solutions",
                description: "Receive targeted breathing exercises, mindfulness tips, and coping strategies based on your emotional state—right when you need them."
              }
            ].map((item, index) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.15 }}
                className="flex gap-6 sm:gap-8 items-start"
              >
                <div className="text-white/30 text-5xl sm:text-6xl flex-shrink-0">
                  {item.step}
                </div>
                <div className="flex-1">
                  <h3 className="text-white text-2xl sm:text-3xl mb-3">
                    {item.title}
                  </h3>
                  <p className="text-white/70 text-base sm:text-lg">
                    {item.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mt-12 sm:mt-16 text-center"
          >
            <button
              onClick={onGetStarted}
              className="px-8 sm:px-10 py-3 sm:py-4 bg-white/20 text-white rounded-full border border-white/40 hover:bg-white/30 transition-all text-base sm:text-lg backdrop-blur-sm"
            >
              Begin Your First Check-In
            </button>
          </motion.div>
        </motion.div>
      </div>

      {/* Stats Section */}
      <div className="px-4 sm:px-8 lg:px-12 py-16 sm:py-24 mb-16">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-5xl mx-auto bg-white/10 backdrop-blur-lg rounded-3xl p-8 sm:p-12 border border-white/20"
        >
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-12">
            <div className="text-center">
              <div className="text-white text-4xl sm:text-5xl mb-2">1-10</div>
              <div className="text-white/70">Stress Scale</div>
            </div>
            <div className="text-center">
              <div className="text-white text-4xl sm:text-5xl mb-2">6</div>
              <div className="text-white/70">Emotion Tags</div>
            </div>
            <div className="text-center">
              <div className="text-white text-4xl sm:text-5xl mb-2">7-Day</div>
              <div className="text-white/70">Trend Analysis</div>
            </div>
          </div>
        </motion.div>
      </div>
    </>
  );
}