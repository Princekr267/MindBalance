import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Calendar, Trash2, Filter } from "lucide-react";
import axios from 'axios';

const levelColors = {
  Low: "#c4f061",       // Bright Lime Green
  Moderate: "#f59e0b",  // Orange
  High: "#ba1a1a",      // Red
};

export function HistoryView() {
  const [assessments, setAssessments] = useState([]);
  const [groupedAssessments, setGroupedAssessments] = useState({});
  const [filter, setFilter] = useState('All'); // 'All', 'High', 'Moderate', 'Low'

  useEffect(() => {
    loadAssessments();
  }, []);

  useEffect(() => {
    // Re-group when filter or assessments change
    const filtered = filter === 'All' 
      ? assessments 
      : assessments.filter(a => a.level === filter);

    const grouped = {};
    filtered.forEach((item) => {
      const dateKey = new Date(item.date).toLocaleDateString();
      if (!grouped[dateKey]) {
        grouped[dateKey] = [];
      }
      grouped[dateKey].push(item);
    });
    setGroupedAssessments(grouped);
  }, [assessments, filter]);

  const loadAssessments = async () => {
    try {
      const response = await axios.get('/api/assessments');
      const allAssessments = response.data;
      const sorted = allAssessments.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      setAssessments(sorted);
    } catch (error) {
      console.error('Failed to load assessment history:', error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this check-in?")) return;
    try {
      await axios.delete(`/api/assessments/${id}`);
      setAssessments(assessments.filter(a => a._id !== id));
    } catch (error) {
      console.error('Failed to delete assessment:', error);
      alert('Could not delete assessment');
    }
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
  };

  return (
    <div className="py-6">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-4xl mx-auto"
      >
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10 sm:mb-12">
          <div>
            <h2 className="text-white text-3xl sm:text-4xl lg:text-5xl mb-2 font-serif">
              Assessment History
            </h2>
            <p className="text-white/60">
              {assessments.length} total check-in{assessments.length !== 1 ? 's' : ''}
            </p>
          </div>
          
          <div className="flex items-center gap-2 bg-white/5 p-1 rounded-xl border border-white/10">
            {['All', 'Low', 'Moderate', 'High'].map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  filter === f 
                    ? 'bg-white/10 text-white shadow-sm' 
                    : 'text-white/40 hover:text-white/80'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {assessments.length === 0 ? (
          <div className="dark-glass rounded-3xl p-12 border border-white/10 text-center">
            <Calendar className="w-16 h-16 text-[#c4f061] mx-auto mb-4" />
            <h3 className="text-white text-2xl mb-2 font-serif">No History Yet</h3>
            <p className="text-white/60">
              Your assessment history will appear here once you complete your first check-in.
            </p>
          </div>
        ) : Object.keys(groupedAssessments).length === 0 ? (
          <div className="dark-glass rounded-3xl p-12 border border-white/10 text-center">
            <Filter className="w-16 h-16 text-white/20 mx-auto mb-4" />
            <h3 className="text-white text-2xl mb-2 font-serif">No Results</h3>
            <p className="text-white/60">
              No assessments match the selected severity category.
            </p>
          </div>
        ) : (
          <div className="space-y-8">
            {Object.entries(groupedAssessments).map(([date, items], index) => (
              <motion.div
                key={date}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
              >
                <h3 className="text-white/80 text-xl mb-4 flex items-center gap-3 font-medium">
                  <Calendar className="w-5 h-5 text-white/40" />
                  {date}
                </h3>
                
                <div className="space-y-3">
                  {items.map((item) => (
                    <motion.div
                      key={item._id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      whileHover={{ scale: 1.01 }}
                      className="dark-glass rounded-2xl p-4 sm:p-6 border border-white/10 hover:border-white/30 transition-all hover:shadow-[0_4px_20px_rgba(255,255,255,0.05)] flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    >
                      <div className="flex items-start sm:items-center gap-4 flex-1">
                        <div className="text-white/40 text-sm min-w-[80px] font-medium pt-1 sm:pt-0">
                          {formatTime(item.date)}
                        </div>
                        
                        <div className="flex flex-wrap items-center gap-4 flex-1">
                          <div className="flex items-center gap-2">
                            <span className="text-white/40 text-sm">Stress Level:</span>
                            <div 
                              className="px-3 py-1 rounded-full text-sm font-bold"
                              style={{
                                backgroundColor: `${levelColors[item.level] || '#ffffff'}20`,
                                color: levelColors[item.level] || '#ffffff',
                                border: `1px solid ${levelColors[item.level] || '#ffffff'}40`
                              }}
                            >
                              {item.level}
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <span className="text-white/40 text-sm">Intensity:</span>
                            <span className="text-white font-mono bg-white/5 border border-white/10 px-2 py-0.5 rounded font-medium">
                              {item.intensity || '-'}
                            </span>
                          </div>

                          {item.mood && (
                            <div className="flex items-center gap-2">
                              <span className="text-white/40 text-sm">Mood:</span>
                              <span className="text-white/80 font-medium">{item.mood}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      <button
                        onClick={() => handleDelete(item._id)}
                        className="p-2 text-white/30 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors ml-auto sm:ml-0"
                        title="Delete assessment"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}
