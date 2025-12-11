import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Calendar, Trash2, Download } from "lucide-react";
import axios from 'axios';

interface AssessmentData {
  _id: string; // MongoDB ID
  date: string; // ISO Date string
  score: number;
  level: string; // Low, Moderate, High
  answers: number[];
}

const levelColors: { [key: string]: string } = {
  Low: "#10b981",       // Green
  Moderate: "#f59e0b",  // Orange
  High: "#ef4444",      // Red
};

export function HistoryView() {
  const [assessments, setAssessments] = useState<AssessmentData[]>([]);
  const [groupedAssessments, setGroupedAssessments] = useState<{ [key: string]: AssessmentData[] }>({});

  useEffect(() => {
    loadAssessments();
  }, []);

  const loadAssessments = async () => {
    try {
      const response = await axios.get('/api/assessments');
      const allAssessments = response.data;

      // Sort by most recent first
      const sorted = allAssessments.sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime());
      setAssessments(sorted);

      // Group by date
      const grouped: { [key: string]: any[] } = {};
      sorted.forEach((item: any) => {
        const dateKey = new Date(item.date).toLocaleDateString();
        if (!grouped[dateKey]) {
          grouped[dateKey] = [];
        }
        grouped[dateKey].push(item);
      });
      setGroupedAssessments(grouped);
    } catch (error) {
      console.error('Failed to load assessment history:', error);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
  };

  return (
    <div className="min-h-screen px-4 sm:px-8 lg:px-12 py-12 sm:py-16">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-4xl mx-auto"
      >
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10 sm:mb-12">
          <div>
            <h2 className="text-white text-3xl sm:text-4xl lg:text-5xl mb-2">
              Assessment History
            </h2>
            <p className="text-white/70">
              {assessments.length} total check-in{assessments.length !== 1 ? 's' : ''}
            </p>
          </div>
        </div>

        {assessments.length === 0 ? (
          <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-12 border border-white/20 text-center">
            <Calendar className="w-16 h-16 text-white/40 mx-auto mb-4" />
            <h3 className="text-white text-2xl mb-2">No History Yet</h3>
            <p className="text-white/60">
              Your assessment history will appear here once you complete your first check-in.
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
                <h3 className="text-white text-xl mb-4 flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-white/60" />
                  {date}
                </h3>
                
                <div className="space-y-3">
                  {items.map((item) => (
                    <motion.div
                      key={item._id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      whileHover={{ scale: 1.01 }}
                      className="bg-white/10 backdrop-blur-lg rounded-2xl p-4 sm:p-6 border border-white/20 hover:bg-white/15 transition-all"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex items-center gap-4 flex-1">
                          <div className="text-white/60 text-sm min-w-[80px]">
                            {formatTime(item.date)}
                          </div>
                          
                          <div className="flex items-center gap-4 flex-1">
                            <div className="flex items-center gap-2">
                              <span className="text-white/60 text-sm">Stress Level:</span>
                              <div 
                                className="px-3 py-1 rounded-full text-sm font-medium"
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
                              <span className="text-white/60 text-sm">Score:</span>
                              <span className="text-white font-mono bg-white/10 px-2 py-0.5 rounded">
                                {item.score}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
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
