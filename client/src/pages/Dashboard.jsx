import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { Calendar, TrendingUp, Activity, Plus } from 'lucide-react';
import { motion } from 'framer-motion';
import MeditationList from '../components/MeditationList';

const Dashboard = () => {
  const { user } = useAuth();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  const emotions = ['Anxious', 'Tired', 'Angry', 'Calm', 'Happy'];

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

  // Prepare emotion data
  const emotionCounts = emotions.reduce((acc, emo) => {
    acc[emo] = history.filter(entry => entry.emotion === emo).length;
    return acc;
  }, {});
  const emotionData = Object.keys(emotionCounts).map(emo => ({ emotion: emo, count: emotionCounts[emo] }));

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
          <Link to="/checkin" className="flex items-center px-6 py-3 bg-violet-600 text-white rounded-xl font-semibold hover:bg-violet-700 transition-colors shadow-lg shadow-violet-500/30">
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
        <div className="grid lg:grid-cols-3 gap-8 mb-12">
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

          {/* Emotion Count Chart */}
          <div className="glass p-8 rounded-3xl">
            <h3 className="text-xl font-bold text-slate-800 mb-6">Emotion Summary</h3>
            <div className="h-[300px] w-full">
              {history.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={emotionData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="emotion" stroke="#64748b" />
                    <YAxis stroke="#64748b" />
                    <Tooltip 
                      contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.9)', borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                    />
                    <Bar dataKey="count" fill="#10b981" />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-slate-400">
                  No data available yet.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Recommended Meditations */}
        {/* Recommended Meditations */}
        <div className="mt-12 bg-gradient-to-br from-violet-100 to-purple-50 p-8 rounded-3xl border border-violet-200">
          <div className="flex items-center mb-6">
            <div className="p-3 bg-violet-600 rounded-xl text-white mr-4 shadow-lg shadow-violet-500/30">
              <Activity size={24} />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-slate-800">Recommended for You</h3>
              <p className="text-slate-600">Curated sessions based on your stress level.</p>
            </div>
          </div>
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
