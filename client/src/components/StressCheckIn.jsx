import { motion } from "framer-motion";
import { useState } from "react";
import axios from 'axios';

// 7 questions adapted from GAD-7 (General Anxiety Disorder-7)
// Each answer 0-3: Not at all, Several days, More than half the days, Nearly every day
const questions = [
  "Feeling nervous, anxious, or on edge?",
  "Not being able to stop or control worrying?",
  "Worrying too much about different things?",
  "Trouble relaxing?",
  "Being so restless that it is hard to sit still?",
  "Becoming easily annoyed or irritable?",
  "Feeling afraid as if something awful might happen?"
];

const options = [
  { label: "Not at all", value: 0 },
  { label: "Several days", value: 1 },
  { label: "More than half the days", value: 2 },
  { label: "Can't Stop", value: 3 }
];

export function StressCheckIn({ onComplete }) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState(new Array(questions.length).fill(-1));
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAnswer = (value) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = value;
    setAnswers(newAnswers);

    if (currentQuestion < questions.length - 1) {
      // Small delay for UX
      setTimeout(() => setCurrentQuestion(currentQuestion + 1), 250);
    }
  };

  const calculateResults = () => {
    const totalScore = answers.reduce((a, b) => a + b, 0);
    // GAD-7 Scoring: 0-4 Minimal, 5-9 Mild, 10-14 Moderate, 15-21 Severe
    // We simplify to: Low (0-9), Moderate (10-14), High (15+)
    let level = "Low";
    if (totalScore >= 10) level = "Moderate";
    if (totalScore >= 15) level = "High";
    return { totalScore, level };
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    const { totalScore, level } = calculateResults();

    try {
      await axios.post('/api/assessments', {
        score: totalScore,
        level: level,
        answers: answers
      });
      console.log('Assessment saved:', { totalScore, level });
      onComplete();
    } catch (error) {
      console.error('Failed to submit assessment:', error);
      alert('Failed to save results. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const isLastQuestion = currentQuestion === questions.length - 1;
  const allAnswered = answers.every(a => a !== -1);

  return (
    <div className="min-h-screen px-4 sm:px-8 lg:px-12 py-12 sm:py-16 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-3xl bg-white/10 backdrop-blur-lg rounded-3xl p-6 sm:p-10 lg:p-12 border border-white/20"
      >
        <h2 className="text-white text-2xl sm:text-3xl lg:text-4xl mb-2 text-center">
          Wellness Assessment
        </h2>
        <p className="text-white/60 text-center mb-8 text-sm">
          Over the last 2 weeks, how often have you been bothered by the following problems?
        </p>

        {/* Progress Bar */}
        <div className="w-full bg-white/10 h-2 rounded-full mb-8">
          <motion.div 
            className="bg-[#10b981] h-full rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
          />
        </div>

        {/* Question */}
        <div className="mb-8 min-h-[100px]">
           <h3 className="text-white text-xl sm:text-2xl font-medium text-center">
             {questions[currentQuestion]}
           </h3>
        </div>

        {/* Options */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          {options.map((option) => (
            <motion.button
              key={option.value}
              onClick={() => handleAnswer(option.value)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`p-4 rounded-xl border text-left transition-all ${
                answers[currentQuestion] === option.value
                  ? 'bg-white/30 border-white/60 text-white shadow-lg'
                  : 'bg-white/5 border-white/20 text-white/80 hover:bg-white/10'
              }`}
            >
              {option.label}
            </motion.button>
          ))}
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <button
            onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
            disabled={currentQuestion === 0}
            className="text-white/50 hover:text-white disabled:opacity-30 transition-colors"
          >
            Previous
          </button>

          {isLastQuestion ? (
             <button
             onClick={handleSubmit}
             disabled={!allAnswered || isSubmitting}
             className="px-8 py-3 bg-[#10b981] text-white rounded-full font-medium hover:bg-[#059669] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
           >
             {isSubmitting ? 'Saving...' : 'See Results'}
           </button>
          ) : (
            <span className="text-white/40 text-sm">
              {currentQuestion + 1} of {questions.length}
            </span>
          )}
        </div>
      </motion.div>
    </div>
  );
}
