import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { TrendingDown, TrendingUp, Calendar } from "lucide-react";

interface CheckInData {
  id: string;
  timestamp: number;
  date: string;
  stressLevel: number;
  emotion: string;
}

export function ProgressView() {
  const [checkIns, setCheckIns] = useState<CheckInData[]>([]);
  const [chartData, setChartData] = useState<any[]>([]);
  const [emotionStats, setEmotionStats] = useState<any[]>([]);
  const [averageStress, setAverageStress] = useState(0);

  useEffect(() => {
    // Load check-ins from localStorage
    const data = localStorage.getItem('mindBalanceCheckIns');
    if (data) {
      const allCheckIns: CheckInData[] = JSON.parse(data);
      
      // Get last 7 days
      const sevenDaysAgo = Date.now() - (7 * 24 * 60 * 60 * 1000);
      const recentCheckIns = allCheckIns.filter(c => c.timestamp >= sevenDaysAgo);
      
      setCheckIns(recentCheckIns);

      // Prepare chart data (group by date)
      const dateMap = new Map<string, { total: number; count: number }>();
      recentCheckIns.forEach(checkIn => {
        const existing = dateMap.get(checkIn.date) || { total: 0, count: 0 };
        dateMap.set(checkIn.date, {
          total: existing.total + checkIn.stressLevel,
          count: existing.count + 1,
        });
      });

      const chartDataArray = Array.from(dateMap.entries()).map(([date, data]) => ({
        date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        stress: Math.round(data.total / data.count),
      })).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

      setChartData(chartDataArray);

      // Calculate emotion stats
      const emotionMap = new Map<string, number>();
      recentCheckIns.forEach(checkIn => {
        emotionMap.set(checkIn.emotion, (emotionMap.get(checkIn.emotion) || 0) + 1);
      });

      const emotionStatsArray = Array.from(emotionMap.entries()).map(([emotion, count]) => ({
        emotion,
        count,
      })).sort((a, b) => b.count - a.count);

      setEmotionStats(emotionStatsArray);

      // Calculate average stress
      if (recentCheckIns.length > 0) {
        const avg = recentCheckIns.reduce((sum, c) => sum + c.stressLevel, 0) / recentCheckIns.length;
        setAverageStress(Math.round(avg * 10) / 10);
      }
    }
  }, []);

  const getTrend = () => {
    if (chartData.length < 2) return null;
    const first = chartData[0].stress;
    const last = chartData[chartData.length - 1].stress;
    return last < first ? 'down' : 'up';
  };

  const trend = getTrend();

  return (
    <div className="min-h-screen px-4 sm:px-8 lg:px-12 py-12 sm:py-16">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-6xl mx-auto"
      >
        <h2 className="text-white text-3xl sm:text-4xl lg:text-5xl mb-3">
          Your Progress
        </h2>
        <p className="text-white/70 mb-10 sm:mb-12">
          Track your mental wellness journey over the past 7 days
        </p>

        {checkIns.length === 0 ? (
          <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-12 border border-white/20 text-center">
            <Calendar className="w-16 h-16 text-white/40 mx-auto mb-4" />
            <h3 className="text-white text-2xl mb-2">No Check-Ins Yet</h3>
            <p className="text-white/60">
              Complete your first check-in to start tracking your progress
            </p>
          </div>
        ) : (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-12">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20"
              >
                <div className="text-white/60 mb-2">Total Check-Ins</div>
                <div className="text-white text-4xl">{checkIns.length}</div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20"
              >
                <div className="text-white/60 mb-2">Average Stress</div>
                <div className="text-white text-4xl flex items-center gap-2">
                  {averageStress}
                  <span className="text-2xl text-white/40">/10</span>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20"
              >
                <div className="text-white/60 mb-2">Trend</div>
                <div className="text-white text-4xl flex items-center gap-2">
                  {trend === 'down' ? (
                    <>
                      <TrendingDown className="w-10 h-10 text-green-400" />
                      <span className="text-2xl text-green-400">Better</span>
                    </>
                  ) : trend === 'up' ? (
                    <>
                      <TrendingUp className="w-10 h-10 text-orange-400" />
                      <span className="text-2xl text-orange-400">Rising</span>
                    </>
                  ) : (
                    <span className="text-2xl text-white/60">N/A</span>
                  )}
                </div>
              </motion.div>
            </div>

            {/* Stress Trend Chart */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white/10 backdrop-blur-lg rounded-3xl p-6 sm:p-8 border border-white/20 mb-8 sm:mb-12"
            >
              <h3 className="text-white text-2xl mb-6">Stress Level Over Time</h3>
              <div className="h-64 sm:h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                    <XAxis 
                      dataKey="date" 
                      stroke="rgba(255,255,255,0.5)"
                      tick={{ fill: 'rgba(255,255,255,0.7)' }}
                    />
                    <YAxis 
                      domain={[0, 10]}
                      stroke="rgba(255,255,255,0.5)"
                      tick={{ fill: 'rgba(255,255,255,0.7)' }}
                    />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: 'rgba(255,255,255,0.1)',
                        border: '1px solid rgba(255,255,255,0.2)',
                        borderRadius: '12px',
                        backdropFilter: 'blur(10px)',
                        color: '#fff'
                      }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="stress" 
                      stroke="#60a5fa" 
                      strokeWidth={3}
                      dot={{ fill: '#60a5fa', r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </motion.div>

            {/* Emotion Distribution Chart */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-white/10 backdrop-blur-lg rounded-3xl p-6 sm:p-8 border border-white/20"
            >
              <h3 className="text-white text-2xl mb-6">Emotion Distribution</h3>
              <div className="h-64 sm:h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={emotionStats}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                    <XAxis 
                      dataKey="emotion" 
                      stroke="rgba(255,255,255,0.5)"
                      tick={{ fill: 'rgba(255,255,255,0.7)' }}
                    />
                    <YAxis 
                      stroke="rgba(255,255,255,0.5)"
                      tick={{ fill: 'rgba(255,255,255,0.7)' }}
                    />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: 'rgba(255,255,255,0.1)',
                        border: '1px solid rgba(255,255,255,0.2)',
                        borderRadius: '12px',
                        backdropFilter: 'blur(10px)',
                        color: '#fff'
                      }}
                    />
                    <Bar dataKey="count" fill="#8b5cf6" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </motion.div>
          </>
        )}
      </motion.div>
    </div>
  );
}
