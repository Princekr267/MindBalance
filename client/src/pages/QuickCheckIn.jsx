import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { Check } from 'lucide-react';

const emotions = ['Anxious', 'Tired', 'Angry', 'Calm', 'Happy'];

const QuickCheckIn = () => {
  const [stressScore, setStressScore] = useState(5);
  const [emotion, setEmotion] = useState('');
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!emotion) return;
    setLoading(true);
    try {
      const response = await axios.post('http://127.0.0.1:5000/api/assessment', {
        stressScore,
        emotion,
        answers: { stress: stressScore, mood: emotion } // For compatibility
      });

      navigate('/results', { state: { result: response.data } });
    } catch (error) {
      console.error("Submission failed", error);
      navigate('/results', { state: { score: stressScore, solutions: [] } });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass p-8 rounded-3xl"
        >
          <h2 className="text-2xl font-bold text-slate-800 mb-8 text-center">Quick Check-in</h2>

          <div className="mb-8">
            <label className="block text-lg font-semibold text-slate-700 mb-4">
              Stress Level (1-10)
            </label>
            <input
              type="range"
              min="1"
              max="10"
              value={stressScore}
              onChange={(e) => setStressScore(parseInt(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-sm text-slate-500 mt-2">
              <span>1</span>
              <span className="font-bold text-violet-600">{stressScore}</span>
              <span>10</span>
            </div>
          </div>

          <div className="mb-8">
            <label className="block text-lg font-semibold text-slate-700 mb-4">
              How are you feeling?
            </label>
            <div className="grid grid-cols-2 gap-3">
              {emotions.map((emo) => (
                <button
                  key={emo}
                  onClick={() => setEmotion(emo)}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    emotion === emo
                      ? 'border-violet-600 bg-violet-50 text-violet-700 font-semibold'
                      : 'border-slate-100 hover:border-violet-200 bg-white text-slate-600'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    {emo}
                    {emotion === emo && <Check size={20} className="text-violet-600" />}
                  </div>
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleSubmit}
            disabled={!emotion || loading}
            className={`w-full py-3 rounded-xl font-semibold text-white transition-all ${
              !emotion || loading
                ? 'bg-slate-300 cursor-not-allowed'
                : 'bg-violet-600 hover:bg-violet-700 shadow-lg'
            }`}
          >
            {loading ? 'Submitting...' : 'Submit Check-in'}
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default QuickCheckIn;