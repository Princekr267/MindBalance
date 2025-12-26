import { motion } from "motion/react";
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
        className="px-4 sm:px-8 lg:px-12 flex items-center relative"
        style={{ minHeight: "calc(100vh - 120px)" }}
      >
        <div className="max-w-3xl w-full relative z-10 mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="absolute -top-20 left-1/2 -translate-x-1/2 w-64 h-64 bg-[#9CAF88]/20 rounded-full blur-3xl -z-10"
          />

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-[#9CAF88] text-sm sm:text-base mb-6 font-medium tracking-[0.3em] uppercase"
          >
            Welcome to
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="text-[#1c1917] mb-8 leading-[1.1] font-serif"
            style={{
              fontSize: "clamp(3.5rem, 10vw, 6rem)",
              fontWeight: 500,
            }}
          >
            MindBalance
            <span className="block text-xl sm:text-3xl mt-4 font-sans font-light text-stone-500 tracking-wide">
              Find your center.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="text-stone-600 text-lg sm:text-xl mb-12 max-w-2xl mx-auto leading-relaxed"
          >
            Your personal mental wellness companion. Track your stress, understand your emotions, and discover personalized coping strategies.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.9 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onStartJourney || onGetStarted}
              className="px-8 py-4 bg-white/30 backdrop-blur-md border border-white/40 text-[#1c1917] font-medium rounded-full hover:bg-white/50 transition-all text-lg shadow-lg hover:shadow-xl w-full sm:w-auto"
            >
              Start Your Journey
            </motion.button>
            <button
              onClick={() => document.getElementById('how-mindbalance-helps')?.scrollIntoView({ behavior: 'smooth' })}
              className="px-8 py-4 bg-white/10 backdrop-blur-sm border border-white/20 text-[#1c1917] font-medium rounded-full hover:bg-white/20 transition-all text-lg w-full sm:w-auto"
            >
              Learn More
            </button>
          </motion.div>
        </div>
      </div>

      {/* Features Section */}
      <div id="how-mindbalance-helps" className="px-4 sm:px-8 lg:px-12 py-16 sm:py-24 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-6xl mx-auto"
        >
          <h2 className="text-[#1c1917] text-3xl sm:text-4xl lg:text-5xl mb-6 text-center font-serif">
            How MindBalance Helps
          </h2>
          <p className="text-stone-600 text-center mb-16 max-w-2xl mx-auto text-lg leading-relaxed">
            Simple tools designed to help you understand and manage your mental wellness, naturally.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white/70 backdrop-blur-xl rounded-2xl p-8 border border-white/60 hover:bg-white/90 transition-all hover:shadow-2xl hover:shadow-[#9CAF88]/10 group hover:-translate-y-1 duration-300"
              >
                <div className="w-14 h-14 bg-[#9CAF88]/20 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <feature.icon className="w-7 h-7 text-[#7A8C6B]" />
                </div>
                <h3 className="text-[#1c1917] text-xl sm:text-2xl mb-3 font-serif">
                  {feature.title}
                </h3>
                <p className="text-stone-600 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* How It Works Section */}
      <div className="px-4 sm:px-8 lg:px-12 py-16 sm:py-24 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto"
        >
          <h2 className="text-[#1c1917] text-3xl sm:text-4xl lg:text-5xl mb-16 text-center font-serif">
            Your Wellness Journey
          </h2>

          <div className="space-y-16">
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
                className="flex gap-8 sm:gap-12 items-start group"
              >
                <div className="text-[#9CAF88]/40 text-6xl sm:text-7xl flex-shrink-0 font-serif italic group-hover:text-[#9CAF88]/60 transition-colors duration-500">
                  {item.step}
                </div>
                <div className="flex-1 pt-4">
                  <h3 className="text-[#1c1917] text-2xl sm:text-3xl mb-4 font-serif">
                    {item.title}
                  </h3>
                  <p className="text-stone-600 text-lg leading-relaxed">
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
            className="mt-20 text-center"
          >
            <button
              onClick={onGetStarted}
              className="px-10 py-4 bg-[#9CAF88] text-[#1c1917] font-medium rounded-full hover:bg-[#8B9D7A] transition-all text-lg shadow-lg shadow-[#9CAF88]/20"
            >
              Begin Your First Check-In
            </button>
          </motion.div>
        </motion.div>
      </div>

      {/* Stats Section */}
      <div className="px-4 sm:px-8 lg:px-12 py-16 sm:py-24 mb-16 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-5xl mx-auto bg-white/80 backdrop-blur-2xl rounded-[2rem] p-12 border border-white/60 shadow-2xl shadow-[#9CAF88]/5"
        >
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-12 divide-y sm:divide-y-0 sm:divide-x divide-stone-200/50">
            <div className="text-center pt-8 sm:pt-0">
              <div className="text-[#1c1917] text-5xl sm:text-6xl mb-3 font-serif">1-10</div>
              <div className="text-[#9CAF88] font-medium tracking-wider uppercase text-sm">Stress Scale</div>
            </div>
            <div className="text-center pt-8 sm:pt-0">
              <div className="text-[#1c1917] text-5xl sm:text-6xl mb-3 font-serif">6</div>
              <div className="text-[#9CAF88] font-medium tracking-wider uppercase text-sm">Emotion Tags</div>
            </div>
            <div className="text-center pt-8 sm:pt-0">
              <div className="text-[#1c1917] text-5xl sm:text-6xl mb-3 font-serif">7-Day</div>
              <div className="text-[#9CAF88] font-medium tracking-wider uppercase text-sm">Trend Analysis</div>
            </div>
          </div>
        </motion.div>
      </div>
    </>
  );
}