import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { ChevronRight, ChevronLeft, Check } from 'lucide-react';

const questions = [
  { id: 'stress', text: "On a scale of 1-10, how stressed do you feel right now?", type: 'scale', min: 1, max: 10 },
  { id: 'sleep', text: "How would you rate your sleep quality lately?", type: 'options', options: ['Very Poor', 'Poor', 'Average', 'Good', 'Excellent'] },
  { id: 'anxiety', text: "How often do you feel anxious or on edge?", type: 'options', options: ['Not at all', 'Several days', 'More than half the days', 'Nearly every day'] },
  { id: 'mood', text: "Which word best describes your current mood?", type: 'options', options: ['Happy', 'Calm', 'Sad', 'Irritable', 'Anxious', 'Numb'] },
  { id: 'physical', text: "Are you experiencing any physical symptoms (headaches, tension)?", type: 'options', options: ['None', 'Mild', 'Moderate', 'Severe'] }
];

const Questionnaire = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleAnswer = (value) => {
    setAnswers({ ...answers, [questions[currentStep].id]: value });
  };

  const nextStep = () => {
    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      submitAssessment();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const submitAssessment = async () => {
    setLoading(true);
    try {
      // Calculate a simple score for now (mock logic)
      let score = 0;
      if (answers.stress) score += parseInt(answers.stress);
      // ... more logic
      
      // Mock API call
      const response = await axios.post('http://127.0.0.1:5000/api/assessment', {
        answers,
        userId: user.id // In real app, backend gets ID from token
      });

      navigate('/results', { state: { result: response.data } });
    } catch (error) {
      console.error("Submission failed", error);
      // Fallback for demo if backend not ready
      navigate('/results', { state: { score: 7, solutions: [] } }); 
    } finally {
      setLoading(false);
    }
  };

  const currentQ = questions[currentStep];
  const progress = ((currentStep + 1) / questions.length) * 100;

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-violet-600"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
          <p className="text-right text-sm text-slate-500 mt-2">Question {currentStep + 1} of {questions.length}</p>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="glass p-8 rounded-3xl min-h-[400px] flex flex-col justify-between"
          >
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-slate-800 mb-8 leading-tight">{currentQ.text}</h2>
              
              <div className="space-y-3">
                {currentQ.type === 'options' && currentQ.options.map((opt) => (
                  <button
                    key={opt}
                    onClick={() => handleAnswer(opt)}
                    className={`w-full p-4 text-left rounded-xl border-2 transition-all ${
                      answers[currentQ.id] === opt 
                        ? 'border-violet-600 bg-violet-50 text-violet-700 font-semibold shadow-md' 
                        : 'border-slate-100 hover:border-violet-200 hover:bg-white bg-white/50 text-slate-600'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      {opt}
                      {answers[currentQ.id] === opt && <Check size={20} className="text-violet-600" />}
                    </div>
                  </button>
                ))}

                {currentQ.type === 'scale' && (
                  <div className="grid grid-cols-5 gap-2 md:gap-4">
                    {[...Array(10)].map((_, i) => {
                      const val = i + 1;
                      return (
                        <button
                          key={val}
                          onClick={() => handleAnswer(val)}
                          className={`aspect-square rounded-xl border-2 flex items-center justify-center text-lg font-bold transition-all ${
                            answers[currentQ.id] === val
                              ? 'border-violet-600 bg-violet-600 text-white shadow-lg scale-105'
                              : 'border-slate-100 hover:border-violet-300 bg-white text-slate-600'
                          }`}
                        >
                          {val}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-between mt-8 pt-8 border-t border-slate-100">
              <button 
                onClick={prevStep}
                disabled={currentStep === 0}
                className={`flex items-center px-6 py-3 rounded-xl font-medium transition-colors ${
                  currentStep === 0 ? 'text-slate-300 cursor-not-allowed' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <ChevronLeft size={20} className="mr-2" /> Back
              </button>
              
              <button 
                onClick={nextStep}
                disabled={!answers[currentQ.id]}
                className={`flex items-center px-8 py-3 rounded-xl font-semibold text-white transition-all ${
                  !answers[currentQ.id]
                    ? 'bg-slate-300 cursor-not-allowed'
                    : 'bg-violet-600 hover:bg-violet-700 shadow-lg shadow-violet-500/30'
                }`}
              >
                {currentStep === questions.length - 1 ? (loading ? 'Analyzing...' : 'Finish') : 'Next'} 
                {!loading && <ChevronRight size={20} className="ml-2" />}
              </button>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Questionnaire;
