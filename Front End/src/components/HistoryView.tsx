import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { Calendar, Trash2, Download } from "lucide-react";

interface CheckInData {
  id: string;
  timestamp: number;
  date: string;
  stressLevel: number;
  emotion: string;
}

const emotionColors: { [key: string]: string } = {
  Anxious: "#8b5cf6",
  Tired: "#6366f1",
  Angry: "#ef4444",
  Calm: "#10b981",
  Happy: "#f59e0b",
  Overwhelmed: "#ec4899",
};

export function HistoryView() {
  const [checkIns, setCheckIns] = useState<CheckInData[]>([]);
  const [groupedCheckIns, setGroupedCheckIns] = useState<{ [key: string]: CheckInData[] }>({});

  useEffect(() => {
    loadCheckIns();
  }, []);

  const loadCheckIns = () => {
    const data = localStorage.getItem('mindBalanceCheckIns');
    if (data) {
      const allCheckIns: CheckInData[] = JSON.parse(data);
      // Sort by most recent first
      const sorted = allCheckIns.sort((a, b) => b.timestamp - a.timestamp);
      setCheckIns(sorted);

      // Group by date
      const grouped: { [key: string]: CheckInData[] } = {};
      sorted.forEach(checkIn => {
        if (!grouped[checkIn.date]) {
          grouped[checkIn.date] = [];
        }
        grouped[checkIn.date].push(checkIn);
      });
      setGroupedCheckIns(grouped);
    }
  };

  const deleteCheckIn = (id: string) => {
    if (!confirm('Are you sure you want to delete this check-in?')) return;

    const data = localStorage.getItem('mindBalanceCheckIns');
    if (data) {
      const allCheckIns: CheckInData[] = JSON.parse(data);
      const filtered = allCheckIns.filter(c => c.id !== id);
      localStorage.setItem('mindBalanceCheckIns', JSON.stringify(filtered));
      loadCheckIns();
    }
  };

  const clearAllData = () => {
    if (!confirm('Are you sure you want to delete ALL check-ins? This cannot be undone.')) return;
    localStorage.removeItem('mindBalanceCheckIns');
    setCheckIns([]);
    setGroupedCheckIns({});
  };

  const exportData = () => {
    const data = localStorage.getItem('mindBalanceCheckIns');
    if (!data) return;

    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `mindbalance-data-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
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

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const getStressColor = (level: number) => {
    if (level <= 3) return '#10b981';
    if (level <= 6) return '#f59e0b';
    return '#ef4444';
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
              Check-In History
            </h2>
            <p className="text-white/70">
              {checkIns.length} total check-in{checkIns.length !== 1 ? 's' : ''}
            </p>
          </div>

          {checkIns.length > 0 && (
            <div className="flex gap-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={exportData}
                className="px-4 py-2 bg-white/10 text-white rounded-full border border-white/20 hover:bg-white/20 transition-all flex items-center gap-2 text-sm"
              >
                <Download className="w-4 h-4" />
                Export
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={clearAllData}
                className="px-4 py-2 bg-red-500/20 text-red-300 rounded-full border border-red-500/30 hover:bg-red-500/30 transition-all flex items-center gap-2 text-sm"
              >
                <Trash2 className="w-4 h-4" />
                Clear All
              </motion.button>
            </div>
          )}
        </div>

        {checkIns.length === 0 ? (
          <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-12 border border-white/20 text-center">
            <Calendar className="w-16 h-16 text-white/40 mx-auto mb-4" />
            <h3 className="text-white text-2xl mb-2">No Check-Ins Yet</h3>
            <p className="text-white/60">
              Your check-in history will appear here once you complete your first entry
            </p>
          </div>
        ) : (
          <div className="space-y-8">
            {Object.entries(groupedCheckIns).map(([date, dateCheckIns], index) => (
              <motion.div
                key={date}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
              >
                <h3 className="text-white text-xl mb-4 flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-white/60" />
                  {formatDate(date)}
                </h3>
                
                <div className="space-y-3">
                  {dateCheckIns.map((checkIn) => (
                    <motion.div
                      key={checkIn.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      whileHover={{ scale: 1.01 }}
                      className="bg-white/10 backdrop-blur-lg rounded-2xl p-4 sm:p-6 border border-white/20 hover:bg-white/15 transition-all"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex items-center gap-4 flex-1">
                          <div className="text-white/60 text-sm min-w-[60px]">
                            {formatTime(checkIn.timestamp)}
                          </div>
                          
                          <div className="flex items-center gap-4 flex-1">
                            <div className="flex items-center gap-2">
                              <div 
                                className="px-3 py-1 rounded-full text-sm"
                                style={{
                                  backgroundColor: `${emotionColors[checkIn.emotion]}20`,
                                  color: emotionColors[checkIn.emotion],
                                  border: `1px solid ${emotionColors[checkIn.emotion]}40`
                                }}
                              >
                                {checkIn.emotion}
                              </div>
                            </div>

                            <div className="flex items-center gap-2">
                              <span className="text-white/60 text-sm">Stress:</span>
                              <div 
                                className="px-3 py-1 rounded-full text-sm"
                                style={{
                                  backgroundColor: `${getStressColor(checkIn.stressLevel)}20`,
                                  color: getStressColor(checkIn.stressLevel),
                                  border: `1px solid ${getStressColor(checkIn.stressLevel)}40`
                                }}
                              >
                                {checkIn.stressLevel}/10
                              </div>
                            </div>
                          </div>
                        </div>

                        <button
                          onClick={() => deleteCheckIn(checkIn.id)}
                          className="text-red-400 hover:text-red-300 transition-colors p-2 hover:bg-red-500/10 rounded-lg self-start sm:self-center"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
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
