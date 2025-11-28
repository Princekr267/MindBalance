import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Calendar, TrendingUp, Activity, Plus } from 'lucide-react';
import { motion } from 'framer-motion';
import MeditationList from '../components/MeditationList';

const Dashboard = () => {
  const { user } = useAuth();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await axios.get('http://127.0.0.1:5000/api/assessment/history');
        setHistory(res.data);
      } catch (err) {
        console.error("Failed to fetch history", err);
      } finally {
        setLoading(false);
      }
    };

    if (user) fetchHistory();
  }, [user]);

  // Prepare chart data
  const chartData = history.slice().reverse().map(entry => ({
    date: new Date(entry.timestamp).toLocaleDateString(),
    score: entry.stressScore
  }));

  const latestScore = history.length > 0 ? history[0].stressScore : '-';
  const averageScore = history.length > 0 
    ? (history.reduce((acc, curr) => acc + curr.stressScore, 0) / history.length).toFixed(1) 
    : '-';

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4">
      <div className="container mx-auto max-w-6xl">
        <header className="mb-12 flex justify-between items-end">
          <div>
            <Link to="/" className="text-2xl font-bold bg-gradient-to-r from-violet-600 to-cyan-500 bg-clip-text text-transparent mb-4 inline-block hover:opacity-80 transition-opacity">
              MindBalance
            </Link>
            <h1 className="text-3xl font-bold text-slate-800">Welcome back, {user?.name}</h1>
            <p className="text-slate-500">Here's your wellness overview.</p>
          </div>
          <Link to="/assess" className="flex items-center px-6 py-3 bg-violet-600 text-white rounded-xl font-semibold hover:bg-violet-700 transition-colors shadow-lg shadow-violet-500/30">
            <Plus className="mr-2" size={20} /> New Check-in
          </Link>
        </header>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <StatsCard 
            title="Current Stress Level" 
            value={latestScore} 
            icon={<Activity className="text-violet-500" />} 
            color="bg-violet-50"
          />
          <StatsCard 
            title="Average Score" 
            value={averageScore} 
            icon={<TrendingUp className="text-cyan-500" />} 
            color="bg-cyan-50"
          />
          <StatsCard 
            title="Total Assessments" 
            value={history.length} 
            icon={<Calendar className="text-pink-500" />} 
            color="bg-pink-50"
          />
        </div>

        {/* Chart Section */}
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 glass p-8 rounded-3xl">
            <h3 className="text-xl font-bold text-slate-800 mb-6">Stress Trends</h3>
            <div className="h-[300px] w-full">
              {history.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="date" stroke="#64748b" />
                    <YAxis stroke="#64748b" domain={[0, 10]} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.9)', borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="score" 
                      stroke="#8b5cf6" 
                      strokeWidth={3} 
                      dot={{ fill: '#8b5cf6', strokeWidth: 2 }} 
                      activeDot={{ r: 8 }} 
                    />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-slate-400">
                  No data available yet.
                </div>
              )}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="glass p-8 rounded-3xl">
            <h3 className="text-xl font-bold text-slate-800 mb-6">Recent History</h3>
            <div className="space-y-4">
              {history.slice(0, 5).map((entry, i) => (
                <motion.div 
                  key={entry._id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="flex items-center justify-between p-4 rounded-xl bg-white/50 hover:bg-white transition-colors"
                >
                  <div>
                    <div className="font-semibold text-slate-700">Assessment</div>
                    <div className="text-xs text-slate-500">{new Date(entry.timestamp).toLocaleDateString()}</div>
                  </div>
                  <div className={`font-bold ${entry.stressScore > 7 ? 'text-red-500' : entry.stressScore > 4 ? 'text-yellow-500' : 'text-green-500'}`}>
                    Score: {entry.stressScore}
                  </div>
                </motion.div>
              ))}
              {history.length === 0 && <p className="text-slate-500">No recent activity.</p>}
            </div>
          </div>
        </div>

        {/* Recommended Meditations */}
        <div className="mt-12">
          <h3 className="text-2xl font-bold text-slate-800 mb-6">Recommended for You</h3>
          <MeditationList score={latestScore !== '-' ? latestScore : null} />
        </div>
      </div>
    </div>
  );
};

const StatsCard = ({ title, value, icon, color }) => (
  <div className="glass p-6 rounded-2xl flex items-center space-x-4">
    <div className={`p-4 rounded-xl ${color}`}>
      {icon}
    </div>
    <div>
      <p className="text-slate-500 text-sm">{title}</p>
      <h4 className="text-2xl font-bold text-slate-800">{value}</h4>
    </div>
  </div>
);

export default Dashboard;
