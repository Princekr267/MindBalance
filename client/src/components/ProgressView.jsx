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

        const sorted = [...allAssessments].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        
        const data = sorted.map((item) => ({
          date: new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          score: item.score
        }));
        
        setChartData(data.slice(-10));

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
    return last < first ? 'improving' : 'rising';
  };

  const trend = getTrend();

  return (
    <div className="py-6">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-6xl mx-auto"
      >
        <h2 className="text-white text-3xl sm:text-4xl lg:text-5xl mb-3 font-serif">
          Your Wellness Progress
        </h2>
        <p className="text-white/60 mb-10 sm:mb-12">
          Track your wellness score over time (Lower is better)
        </p>

        {assessments.length === 0 ? (
          <div className="dark-glass rounded-3xl p-12 text-center border border-white/10">
            <Calendar className="w-16 h-16 text-[#c4f061] mx-auto mb-4" />
            <h3 className="text-white text-2xl mb-2 font-serif">No Data Yet</h3>
            <p className="text-white/60">
              Complete your first assessment to start tracking.
            </p>
          </div>
        ) : (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-12">
              <motion.div
                className="dark-glass rounded-2xl p-6 border border-white/10"
              >
                <div className="text-white/50 mb-2 font-medium">Total Assessments</div>
                <div className="text-white text-4xl font-serif">{assessments.length}</div>
              </motion.div>

              <motion.div
                className="dark-glass rounded-2xl p-6 border border-white/10"
              >
                <div className="text-white/50 mb-2 font-medium">Avg Score</div>
                <div className="text-white text-4xl flex items-center gap-2 font-serif">
                  {averageScore}
                  <span className="text-xl text-white/30 font-sans">(Max 21)</span>
                </div>
              </motion.div>

              <motion.div
                className="dark-glass rounded-2xl p-6 border border-white/10"
              >
                <div className="text-white/50 mb-2 font-medium">Trend</div>
                <div className="text-white text-4xl flex items-center gap-2 font-serif">
                  {trend === 'improving' ? (
                    <>
                      <TrendingDown className="w-10 h-10 text-[#c4f061]" />
                      <span className="text-2xl text-[#c4f061] font-sans">Better</span>
                    </>
                  ) : trend === 'rising' ? (
                    <>
                      <TrendingUp className="w-10 h-10 text-orange-400" />
                      <span className="text-2xl text-orange-400 font-sans">Rising</span>
                    </>
                  ) : (
                    <span className="text-2xl text-white/40 font-sans">Stable</span>
                  )}
                </div>
              </motion.div>
            </div>

            {/* Chart */}
            <motion.div
              className="dark-glass rounded-3xl p-6 sm:p-8 border border-white/10 mb-8 sm:mb-12"
            >
              <h3 className="text-white text-2xl mb-6 font-serif">Score History</h3>
              <div className="h-64 sm:h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                    <XAxis 
                      dataKey="date" 
                      stroke="#ffffff40"
                      tick={{ fill: '#ffffff80' }}
                    />
                    <YAxis 
                      domain={[0, 21]}
                      stroke="#ffffff40"
                      tick={{ fill: '#ffffff80' }}
                    />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: 'rgba(21, 27, 43, 0.9)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: '12px',
                        color: '#ffffff',
                        boxShadow: '0 4px 15px rgba(0, 0, 0, 0.3)'
                      }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="score" 
                      stroke="#c4f061" 
                      strokeWidth={3}
                      dot={{ fill: '#45645e', stroke: '#c4f061', strokeWidth: 2, r: 4 }}
                      activeDot={{ r: 6, fill: '#c4f061' }}
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
