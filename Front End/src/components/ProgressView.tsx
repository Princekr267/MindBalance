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
        <h2 className="text-[#1c1917] text-3xl sm:text-4xl lg:text-5xl mb-3 font-serif">
          Your Progress
        </h2>
        <p className="text-stone-600 mb-10 sm:mb-12 text-lg">
          Track your mental wellness journey over the past 7 days
        </p>

        {checkIns.length === 0 ? (
          <div className="bg-white/60 backdrop-blur-xl rounded-3xl p-12 border border-white/60 text-center shadow-lg">
            <Calendar className="w-16 h-16 text-stone-300 mx-auto mb-4" />
            <h3 className="text-[#1c1917] text-2xl mb-2 font-serif">No Check-Ins Yet</h3>
            <p className="text-stone-600">
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
                className="bg-white/80 backdrop-blur-2xl rounded-2xl p-6 border border-white/60 shadow-sm hover:shadow-md transition-all"
              >
                <div className="text-stone-500 mb-2 font-medium">Total Check-Ins</div>
                <div className="text-[#1c1917] text-4xl font-serif">{checkIns.length}</div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white/60 backdrop-blur-xl rounded-2xl p-6 border border-white/60 shadow-sm"
              >
                <div className="text-stone-500 mb-2 font-medium">Average Stress</div>
                <div className="text-[#1c1917] text-4xl flex items-center gap-2 font-serif">
                  {averageStress}
                  <span className="text-2xl text-stone-400 font-sans">/10</span>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white/60 backdrop-blur-xl rounded-2xl p-6 border border-white/60 shadow-sm"
              >
                <div className="text-stone-500 mb-2 font-medium">Trend</div>
                <div className="text-[#1c1917] text-4xl flex items-center gap-2 font-serif">
                  {trend === 'down' ? (
                    <>
                      <TrendingDown className="w-10 h-10 text-emerald-500" />
                      <span className="text-2xl text-emerald-600 font-sans">Better</span>
                    </>
                  ) : trend === 'up' ? (
                    <>
                      <TrendingUp className="w-10 h-10 text-amber-500" />
                      <span className="text-2xl text-amber-600 font-sans">Rising</span>
                    </>
                  ) : (
                    <span className="text-2xl text-stone-400 font-sans">N/A</span>
                  )}
                </div>
              </motion.div>
            </div>

            {/* Stress Trend Chart */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white/80 backdrop-blur-2xl rounded-3xl p-6 sm:p-8 border border-white/60 mb-8 sm:mb-12 shadow-xl"
            >
              <h3 className="text-[#1c1917] text-2xl mb-6 font-serif">Stress Level Over Time</h3>
              <div className="h-64 sm:h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(28, 25, 23, 0.1)" />
                    <XAxis
                      dataKey="date"
                      stroke="rgba(28, 25, 23, 0.4)"
                      tick={{ fill: 'rgba(28, 25, 23, 0.6)' }}
                    />
                    <YAxis
                      domain={[0, 10]}
                      stroke="rgba(28, 25, 23, 0.4)"
                      tick={{ fill: 'rgba(28, 25, 23, 0.6)' }}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'rgba(255, 255, 255, 0.8)',
                        border: '1px solid rgba(255, 255, 255, 0.6)',
                        borderRadius: '12px',
                        backdropFilter: 'blur(10px)',
                        color: '#1c1917',
                        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="stress"
                      stroke="#9CAF88"
                      strokeWidth={3}
                      dot={{ fill: '#9CAF88', r: 6 }}
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
              className="bg-white/80 backdrop-blur-2xl rounded-3xl p-6 sm:p-8 border border-white/60 shadow-xl"
            >
              <h3 className="text-[#1c1917] text-2xl mb-6 font-serif">Emotion Distribution</h3>
              <div className="h-64 sm:h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={emotionStats}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(28, 25, 23, 0.1)" />
                    <XAxis
                      dataKey="emotion"
                      stroke="rgba(28, 25, 23, 0.4)"
                      tick={{ fill: 'rgba(28, 25, 23, 0.6)' }}
                    />
                    <YAxis
                      stroke="rgba(28, 25, 23, 0.4)"
                      tick={{ fill: 'rgba(28, 25, 23, 0.6)' }}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'rgba(255, 255, 255, 0.8)',
                        border: '1px solid rgba(255, 255, 255, 0.6)',
                        borderRadius: '12px',
                        backdropFilter: 'blur(10px)',
                        color: '#1c1917',
                        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                      }}
                    />
                    <Bar dataKey="count" fill="#AEC09A" radius={[8, 8, 0, 0]} />
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
