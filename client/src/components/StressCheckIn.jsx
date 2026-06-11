import { motion } from "framer-motion";
import { useState } from "react";
import axios from 'axios';
import { 
  Smile, 
  Frown, 
  Meh, 
  Wind, 
  CloudRain, 
  Activity, 
  BrainCircuit, 
  HeartPulse,
  Coffee,
  Briefcase,
  Users,
  Banknote,
  ChevronRight,
  ChevronLeft
} from "lucide-react";

const gadQuestions = [
  "Feeling nervous, anxious, or on edge?",
  "Not being able to stop or control worrying?",
  "Worrying too much about different things?",
  "Trouble relaxing?",
  "Being so restless that it is hard to sit still?",
  "Becoming easily annoyed or irritable?",
  "Feeling afraid as if something awful might happen?"
];

const gadOptions = [
  { label: "Not at all", value: 0 },
  { label: "Several days", value: 1 },
  { label: "More than half the days", value: 2 },
  { label: "Can't Stop", value: 3 }
];

const moods = [
  { label: "Great", icon: Smile, color: "#c4f061" },
  { label: "Okay", icon: Meh, color: "#b5b9ff" },
  { label: "Stressed", icon: Activity, color: "#f59e0b" },
  { label: "Anxious", icon: Wind, color: "#ef4444" },
  { label: "Low", icon: CloudRain, color: "#3b82f6" },
];

const commonSymptoms = [
  "Headache", "Muscle Tension", "Fatigue", 
  "Rapid Heartbeat", "Stomach Issues", 
  "Poor Concentration", "Racing Thoughts", "Trouble Sleeping"
];

const commonTriggers = [
  "Work/Career", "Relationships", "Finances", 
  "Health", "Family", "News/World Events", 
  "Personal Expectations", "Social Situations"
];

export function StressCheckIn({ onComplete }) {
  const [step, setStep] = useState(0); // 0: Mood, 1: Symptoms/Triggers, 2-8: GAD-7
  const [isSubmitting, setIsSubmitting] = useState(false);

  // New Data Fields
  const [mood, setMood] = useState("");
  const [intensity, setIntensity] = useState(5);
  const [symptoms, setSymptoms] = useState([]);
  const [triggers, setTriggers] = useState([]);
  const [answers, setAnswers] = useState(new Array(gadQuestions.length).fill(-1));

  const totalSteps = 2 + gadQuestions.length;

  const toggleArrayItem = (array, setArray, item) => {
    if (array.includes(item)) {
      setArray(array.filter(i => i !== item));
    } else {
      setArray([...array, item]);
    }
  };

  const handleAnswer = (value) => {
    const questionIndex = step - 2;
    const newAnswers = [...answers];
    newAnswers[questionIndex] = value;
    setAnswers(newAnswers);

    if (step < totalSteps - 1) {
      setTimeout(() => setStep(step + 1), 300);
    }
  };

  const calculateResults = () => {
    const totalScore = answers.reduce((a, b) => a + (b === -1 ? 0 : b), 0);
    // Factor in intensity for the final level
    let level = "Low";
    if (totalScore >= 10 || intensity >= 7) level = "Moderate";
    if (totalScore >= 15 || intensity >= 9) level = "High";
    return { totalScore, level };
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    const { totalScore, level } = calculateResults();

    try {
      await axios.post('/api/assessments', {
        score: totalScore,
        level: level,
        answers: answers.map(a => a === -1 ? 0 : a), // default unanswered to 0
        mood,
        symptoms,
        triggers,
        intensity
      });
      onComplete();
    } catch (error) {
      console.error('Failed to submit assessment:', error);
      alert('Failed to save results. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderProgress = () => (
    <div className="w-full bg-white/10 h-2 rounded-full mb-8 overflow-hidden">
      <motion.div 
        className="bg-[#c4f061] h-full rounded-full"
        initial={{ width: 0 }}
        animate={{ width: `${((step + 1) / totalSteps) * 100}%` }}
      />
    </div>
  );

  const renderStepContent = () => {
    if (step === 0) {
      return (
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
          <h3 className="text-white text-2xl font-medium text-center mb-8">How are you feeling right now?</h3>
          
          <div className="flex flex-wrap justify-center gap-4 mb-10">
            {moods.map((m) => {
              const Icon = m.icon;
              const isSelected = mood === m.label;
              return (
                <button
                  key={m.label}
                  onClick={() => setMood(m.label)}
                  className={`flex flex-col items-center gap-2 p-4 rounded-2xl border transition-all ${
                    isSelected 
                      ? 'bg-white/10 border-[#c4f061] shadow-[0_0_15px_rgba(196,240,97,0.2)]' 
                      : 'bg-transparent border-white/10 hover:bg-white/5 hover:border-white/30'
                  }`}
                  style={{ width: '100px' }}
                >
                  <Icon className="w-8 h-8" style={{ color: isSelected ? '#c4f061' : m.color }} />
                  <span className={`text-sm ${isSelected ? 'text-white font-bold' : 'text-white/60'}`}>{m.label}</span>
                </button>
              );
            })}
          </div>

          <div className="mb-6">
            <label className="block text-center text-white/80 mb-4 font-medium">
              Overall Stress Intensity: <span className="text-[#c4f061] font-bold text-xl ml-2">{intensity}/10</span>
            </label>
            <input 
              type="range" 
              min="1" 
              max="10" 
              value={intensity}
              onChange={(e) => setIntensity(parseInt(e.target.value))}
              className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#c4f061]"
            />
            <div className="flex justify-between text-white/40 text-xs mt-2">
              <span>Very Calm</span>
              <span>Overwhelmed</span>
            </div>
          </div>
        </motion.div>
      );
    }

    if (step === 1) {
      return (
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
          <h3 className="text-white text-xl font-medium mb-6 flex items-center gap-2">
            <HeartPulse className="w-5 h-5 text-[#b5b9ff]" /> Any physical symptoms? <span className="text-white/30 text-sm font-normal">(Select all that apply)</span>
          </h3>
          <div className="flex flex-wrap gap-3 mb-10">
            {commonSymptoms.map(sym => (
              <button
                key={sym}
                onClick={() => toggleArrayItem(symptoms, setSymptoms, sym)}
                className={`px-4 py-2 rounded-full border text-sm transition-all ${
                  symptoms.includes(sym)
                    ? 'bg-[#b5b9ff]/20 border-[#b5b9ff] text-[#b5b9ff]'
                    : 'bg-white/5 border-white/10 text-white/60 hover:bg-white/10 hover:text-white'
                }`}
              >
                {sym}
              </button>
            ))}
          </div>

          <h3 className="text-white text-xl font-medium mb-6 flex items-center gap-2">
            <BrainCircuit className="w-5 h-5 text-[#f59e0b]" /> What's on your mind? <span className="text-white/30 text-sm font-normal">(Select triggers)</span>
          </h3>
          <div className="flex flex-wrap gap-3 mb-6">
            {commonTriggers.map(trig => (
              <button
                key={trig}
                onClick={() => toggleArrayItem(triggers, setTriggers, trig)}
                className={`px-4 py-2 rounded-full border text-sm transition-all ${
                  triggers.includes(trig)
                    ? 'bg-[#f59e0b]/20 border-[#f59e0b] text-[#f59e0b]'
                    : 'bg-white/5 border-white/10 text-white/60 hover:bg-white/10 hover:text-white'
                }`}
              >
                {trig}
              </button>
            ))}
          </div>
        </motion.div>
      );
    }

    // GAD-7 Questions
    const questionIndex = step - 2;
    return (
      <motion.div key={questionIndex} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
        <div className="mb-8 min-h-[100px] flex items-center justify-center">
           <h3 className="text-white text-xl sm:text-2xl font-medium text-center leading-relaxed">
             {gadQuestions[questionIndex]}
           </h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          {gadOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => handleAnswer(option.value)}
              className={`p-4 rounded-xl border text-left transition-all pulse-hover ${
                answers[questionIndex] === option.value
                  ? 'bg-[#c4f061] border-[#c4f061] text-[#151b2b] shadow-[0_0_15px_rgba(196,240,97,0.3)] font-bold'
                  : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10 hover:border-white/30 hover:text-white'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </motion.div>
    );
  };

  const isLastQuestion = step === totalSteps - 1;
  const gadQuestionIndex = step - 2;
  const canProceed =
    step === 0 ? mood !== "" :
    step === 1 ? true :
    answers[gadQuestionIndex] !== -1;
  return (
    <div className="flex items-center justify-center py-12">
      <div className="w-full max-w-3xl dark-glass rounded-3xl p-6 sm:p-10 lg:p-12">
        <h2 className="text-white text-2xl sm:text-3xl mb-2 text-center font-serif">
          Thorough Wellness Check-In
        </h2>
        <p className="text-white/60 text-center mb-8 text-sm">
          Track your mood, symptoms, and anxiety levels.
        </p>

        {renderProgress()}

        {renderStepContent()}

        <div className="flex justify-between items-center mt-10 border-t border-white/10 pt-6">
          <button
            onClick={() => setStep(Math.max(0, step - 1))}
            disabled={step === 0}
            className="flex items-center gap-2 text-white/40 hover:text-white disabled:opacity-0 transition-colors font-medium px-4 py-2"
          >
            <ChevronLeft className="w-4 h-4" /> Back
          </button>

          {isLastQuestion ? (
             <button
             onClick={handleSubmit}
             disabled={isSubmitting}
             className="px-8 py-3 bg-[#c4f061] text-[#151b2b] rounded-full font-bold hover:bg-[#b0d957] disabled:opacity-50 transition-all pulse-hover"
           >
             {isSubmitting ? 'Saving...' : 'Finish Check-In'}
           </button>
          ) : (
            <button
              onClick={() => setStep(step + 1)}
              disabled={!canProceed}
              className="flex items-center gap-2 px-6 py-2.5 bg-white/10 text-white rounded-full font-medium hover:bg-white/20 disabled:opacity-30 transition-all"
            >
              Next <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
