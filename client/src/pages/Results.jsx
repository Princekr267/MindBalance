import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, ArrowRight } from 'lucide-react';

const Results = () => {
  const location = useLocation();
  const { result } = location.state || {};
  
  if (!result) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-slate-800 mb-4">No results found</h2>
          <Link to="/assess" className="text-violet-600 hover:underline">Take Assessment</Link>
        </div>
      </div>
    );
  }

  const { stressScore, analysis } = result;
  const aiData = typeof analysis === 'string' ? JSON.parse(analysis) : analysis;

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4">
      <div className="container mx-auto max-w-4xl">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass p-8 rounded-3xl mb-8 text-center"
        >
          <h2 className="text-3xl font-bold text-slate-800 mb-2">Your Wellness Report</h2>
          <p className="text-slate-500 mb-8">Based on your recent assessment</p>
          
          <div className="flex justify-center mb-8">
            <div className="relative w-40 h-40 flex items-center justify-center rounded-full border-8 border-violet-100">
              <div className="text-5xl font-bold text-violet-600">{stressScore}</div>
              <div className="absolute -bottom-2 text-sm font-medium bg-white px-3 py-1 rounded-full shadow-sm text-slate-500">Stress Score</div>
            </div>
          </div>

          <div className="bg-violet-50 p-6 rounded-2xl text-left">
            <h3 className="text-lg font-semibold text-violet-800 mb-2">AI Analysis</h3>
            <p className="text-slate-700 leading-relaxed">{aiData.summary}</p>
          </div>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6">
          {aiData.recommendations.map((rec, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="glass p-6 rounded-2xl hover:border-violet-200 transition-colors"
            >
              <div className="flex items-start mb-4">
                <CheckCircle className="text-emerald-500 mt-1 mr-3" size={24} />
                <div>
                  <h4 className="text-xl font-bold text-slate-800 mb-2">{rec.title}</h4>
                  <p className="text-slate-600">{rec.content}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link to="/dashboard" className="inline-flex items-center px-8 py-3 bg-slate-900 text-white rounded-xl font-semibold hover:bg-slate-800 transition-colors">
            Go to Dashboard <ArrowRight className="ml-2" size={20} />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Results;
