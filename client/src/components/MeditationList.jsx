import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Play, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

const MeditationList = ({ score }) => {
  const [meditations, setMeditations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMeditations = async () => {
      try {
        const url = score 
          ? `http://127.0.0.1:5000/api/meditations?score=${score}`
          : 'http://127.0.0.1:5000/api/meditations';
        
        const res = await axios.get(url);
        setMeditations(res.data);
      } catch (err) {
        console.error("Failed to fetch meditations", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMeditations();
  }, [score]);

  if (loading) return <div className="text-slate-400">Loading recommendations...</div>;
  if (meditations.length === 0) return <div className="text-red-400">No meditations found. (Debug: Score={score})</div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {meditations.map((meditation, index) => (
        <motion.div
          key={meditation.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="glass rounded-2xl overflow-hidden group hover:shadow-xl transition-all duration-300"
        >
          <div className="relative h-40 overflow-hidden">
            <img 
              src={meditation.image} 
              alt={meditation.title} 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors flex items-center justify-center">
              <a 
                href={meditation.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center text-violet-600 hover:scale-110 transition-transform"
              >
                <Play fill="currentColor" size={20} className="ml-1" />
              </a>
            </div>
            <div className="absolute top-3 right-3 bg-black/50 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full flex items-center">
              <Clock size={12} className="mr-1" /> {meditation.duration}
            </div>
          </div>
          <div className="p-5">
            <div className="text-xs font-semibold text-violet-600 mb-1 uppercase tracking-wider">
              {meditation.category}
            </div>
            <h3 className="font-bold text-slate-800 text-lg mb-2">{meditation.title}</h3>
            <p className="text-sm text-slate-500">
              Recommended for your current stress level.
            </p>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default MeditationList;
