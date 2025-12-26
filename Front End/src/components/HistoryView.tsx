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
            <h2 className="text-[#1c1917] text-3xl sm:text-4xl lg:text-5xl mb-2 font-serif">
              Check-In History
            </h2>
            <p className="text-stone-600">
              {checkIns.length} total check-in{checkIns.length !== 1 ? 's' : ''}
            </p>
          </div>

          {checkIns.length > 0 && (
            <div className="flex gap-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={exportData}
                className="px-4 py-2 bg-white/60 text-stone-800 rounded-full border border-stone-200 hover:bg-white/80 transition-all flex items-center gap-2 text-sm shadow-sm"
              >
                <Download className="w-4 h-4" />
                Export
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={clearAllData}
                className="px-4 py-2 bg-red-100 text-red-600 rounded-full border border-red-200 hover:bg-red-200 transition-all flex items-center gap-2 text-sm"
              >
                <Trash2 className="w-4 h-4" />
                Clear All
              </motion.button>
            </div>
          )}
        </div>

        {checkIns.length === 0 ? (
          <div className="bg-white/60 backdrop-blur-xl rounded-3xl p-12 border border-white/60 text-center shadow-lg">
            <Calendar className="w-16 h-16 text-stone-300 mx-auto mb-4" />
            <h3 className="text-[#1c1917] text-2xl mb-2 font-serif">No Check-Ins Yet</h3>
            <p className="text-stone-600">
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
                <h3 className="text-stone-800 text-xl mb-4 flex items-center gap-3 font-semibold">
                  <Calendar className="w-5 h-5 text-stone-400" />
                  {formatDate(date)}
                </h3>

                <div className="space-y-3">
                  {dateCheckIns.map((checkIn) => (
                    <motion.div
                      key={checkIn.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      whileHover={{ scale: 1.01 }}
                      className="bg-white/80 backdrop-blur-2xl rounded-2xl p-4 sm:p-6 border border-white/60 hover:bg-white/90 transition-all shadow-sm hover:shadow-md"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex items-center gap-4 flex-1">
                          <div className="text-stone-500 text-sm min-w-[60px] font-medium">
                            {formatTime(checkIn.timestamp)}
                          </div>

                          <div className="flex items-center gap-4 flex-1">
                            <div className="flex items-center gap-2">
                              <div
                                className="px-3 py-1 rounded-full text-sm font-medium"
                                style={{
                                  backgroundColor: `${emotionColors[checkIn.emotion]}15`,
                                  color: emotionColors[checkIn.emotion],
                                  border: `1px solid ${emotionColors[checkIn.emotion]}30`
                                }}
                              >
                                {checkIn.emotion}
                              </div>
                            </div>

                            <div className="flex items-center gap-2">
                              <span className="text-stone-500 text-sm">Stress:</span>
                              <div
                                className="px-3 py-1 rounded-full text-sm font-medium"
                                style={{
                                  backgroundColor: `${getStressColor(checkIn.stressLevel)}15`,
                                  color: getStressColor(checkIn.stressLevel),
                                  border: `1px solid ${getStressColor(checkIn.stressLevel)}30`
                                }}
                              >
                                {checkIn.stressLevel}/10
                              </div>
                            </div>
                          </div>
                        </div>

                        <button
                          onClick={() => deleteCheckIn(checkIn.id)}
                          className="text-red-400 hover:text-red-600 transition-colors p-2 hover:bg-red-50 rounded-lg self-start sm:self-center"
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
