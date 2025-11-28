import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Activity, Heart, Shield } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const LandingPage = () => {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-violet-50">
      <div className="container mx-auto px-6">
        <header className="py-6 flex justify-between items-center">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-violet-600 to-cyan-500 bg-clip-text text-transparent">
            MindBalance
          </h1>
          <nav className="flex items-center gap-6">
            {user ? (
              <>
                <Link to="/dashboard" className="text-slate-600 hover:text-violet-600 font-medium transition-colors">Dashboard</Link>
                <button onClick={logout} className="text-slate-600 hover:text-red-500 font-medium transition-colors">Logout</button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-slate-600 hover:text-violet-600 font-medium transition-colors">Login</Link>
                <Link to="/signup" className="px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors shadow-lg shadow-violet-500/20">
                  Get Started
                </Link>
              </>
            )}
          </nav>
        </header>

        <main className="py-20 text-center">
          <h2 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight text-slate-900">
            Find Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-cyan-500">Inner Peace</span>
          </h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto mb-12 leading-relaxed">
            Track your mental well-being, understand your stress levels, and discover personalized solutions for a healthier mind.
          </p>
          
          <div className="flex justify-center gap-4">
            <Link to={user ? "/assess" : "/signup"} className="group inline-flex items-center px-8 py-4 bg-violet-600 text-white rounded-xl font-semibold text-lg hover:bg-violet-700 transition-all shadow-xl shadow-violet-500/30 hover:-translate-y-1">
              Start Assessment <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={20} />
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mt-24">
            <FeatureCard 
              icon={<Activity className="text-violet-500" size={32} />}
              title="Track Stress"
              description="Monitor your stress levels over time with our scientifically backed questionnaire."
            />
            <FeatureCard 
              icon={<Heart className="text-pink-500" size={32} />}
              title="Personalized Care"
              description="Get tailored recommendations based on your unique stress profile."
            />
            <FeatureCard 
              icon={<Shield className="text-emerald-500" size={32} />}
              title="Private & Secure"
              description="Your mental health data is encrypted and private to you."
            />
          </div>
        </main>
      </div>
    </div>
  );
};

const FeatureCard = ({ icon, title, description }) => (
  <div className="glass p-8 rounded-2xl text-left hover:border-violet-200 transition-colors">
    <div className="mb-4 bg-white w-12 h-12 rounded-xl flex items-center justify-center shadow-sm">{icon}</div>
    <h3 className="text-xl font-bold mb-2 text-slate-800">{title}</h3>
    <p className="text-slate-600 leading-relaxed">{description}</p>
  </div>
);

export default LandingPage;
