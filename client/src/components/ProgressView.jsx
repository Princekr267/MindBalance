import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { TrendingDown, TrendingUp, Calendar } from "lucide-react";
import axios from 'axios';

export function ProgressView() {
  const [assessments, setAssessments] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [averageScore, setAverageScore] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('/api/assessments');
        const allAssessments = response.data;
        setAssessments(allAssessments);

        // Prepare chart data (chronological)
        const sorted = [...allAssessments].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        
        const data = sorted.map((item) => ({
          date: new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          score: item.score
        }));
        
        // Take last 10 for readability
        setChartData(data.slice(-10));

        // Calculate average
        if (allAssessments.length > 0) {
          const avg = allAssessments.reduce((sum, c) => sum + c.score, 0) / allAssessments.length;
          setAverageScore(Math.round(avg * 10) / 10);
        }
      } catch (error) {
        console.error('Failed to fetch progress data:', error);
      }
    };

    fetchData();
  }, []);

  const getTrend = () => {
    if (chartData.length < 2) return null;
    const first = chartData[0].score;
    const last = chartData[chartData.length - 1].score;
    // Lower score is better for Stress/Anxiety
    return last < first ? 'improving' : 'rising';
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
        <p className="text-stone-600 mb-10 sm:mb-12">
          Track your wellness score over time (Lower is better)
        </p>

        {assessments.length === 0 ? (
          <div className="bg-white/40 backdrop-blur-xl rounded-3xl p-12 border border-white/60 shadow-xl shadow-[#9CAF88]/5 text-center">
            <Calendar className="w-16 h-16 text-[#9CAF88] mx-auto mb-4" />
            <h3 className="text-[#1c1917] text-2xl mb-2 font-serif">No Data Yet</h3>
            <p className="text-stone-600">
              Complete your first assessment to start tracking.
            </p>
          </div>
        ) : (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-12">
              <motion.div
                className="bg-white/40 backdrop-blur-xl rounded-2xl p-6 border border-white/60 shadow-lg shadow-[#9CAF88]/5"
              >
                <div className="text-stone-500 mb-2 font-medium">Total Assessments</div>
                <div className="text-[#1c1917] text-4xl font-serif">{assessments.length}</div>
              </motion.div>

              <motion.div
                className="bg-white/40 backdrop-blur-xl rounded-2xl p-6 border border-white/60 shadow-lg shadow-[#9CAF88]/5"
              >
                <div className="text-stone-500 mb-2 font-medium">Avg Score</div>
                <div className="text-[#1c1917] text-4xl flex items-center gap-2 font-serif">
                  {averageScore}
                  <span className="text-xl text-stone-400 font-sans">(Max 21)</span>
                </div>
              </motion.div>

              <motion.div
                className="bg-white/40 backdrop-blur-xl rounded-2xl p-6 border border-white/60 shadow-lg shadow-[#9CAF88]/5"
              >
                <div className="text-stone-500 mb-2 font-medium">Trend</div>
                <div className="text-[#1c1917] text-4xl flex items-center gap-2 font-serif">
                  {trend === 'improving' ? (
                    <>
                      <TrendingDown className="w-10 h-10 text-green-500" />
                      <span className="text-2xl text-green-600 font-sans">Better</span>
                    </>
                  ) : trend === 'rising' ? (
                    <>
                      <TrendingUp className="w-10 h-10 text-orange-500" />
                      <span className="text-2xl text-orange-600 font-sans">Rising</span>
                    </>
                  ) : (
                    <span className="text-2xl text-stone-400 font-sans">Stable</span>
                  )}
                </div>
              </motion.div>
            </div>

            {/* Chart */}
            <motion.div
              className="bg-white/40 backdrop-blur-xl rounded-3xl p-6 sm:p-8 border border-white/60 shadow-xl shadow-[#9CAF88]/5 mb-8 sm:mb-12"
            >
              <h3 className="text-[#1c1917] text-2xl mb-6 font-serif">Score History</h3>
              <div className="h-64 sm:h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.1)" />
                    <XAxis 
                      dataKey="date" 
                      stroke="#78716c"
                      tick={{ fill: '#44403c' }}
                    />
                    <YAxis 
                      domain={[0, 21]}
                      stroke="#78716c"
                      tick={{ fill: '#44403c' }}
                    />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: 'rgba(255,255,255,0.9)',
                        border: '1px solid rgba(0,0,0,0.1)',
                        borderRadius: '12px',
                        color: '#1c1917',
                        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                      }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="score" 
                      stroke="#60a5fa" 
                      strokeWidth={3}
                      dot={{ fill: '#60a5fa', r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </motion.div>
          </>
        )}
      </motion.div>
    </div>
  );
}
