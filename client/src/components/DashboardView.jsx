import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import axios from "axios";
import { MoreVertical, ChevronDown, Activity, HeartPulse, Sparkles, Moon } from "lucide-react";

export function DashboardView() {
  const [assessments, setAssessments] = useState([]);
  const [latestAssessment, setLatestAssessment] = useState(null);
  
  // Calendar tracking state
  const [currentDate, setCurrentDate] = useState(new Date());
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('/api/assessments');
        setAssessments(response.data);
        if (response.data.length > 0) {
          setLatestAssessment(response.data[0]); // sorted descending
        }
      } catch (error) {
        console.error("Failed to fetch assessments", error);
      }
    };
    fetchData();
  }, []);

  // Compute metrics based on latest assessment and history
  const stressScore = latestAssessment ? (21 - latestAssessment.score) * 4.76 : 82; // map 0-21 to 100-0, defaulting to 82 for UI demo if no data
  const roundedStressScore = Math.round(stressScore);
  
  // Calendar Generation
  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
  
  const getDayStatus = (day) => {
    const dateStr = new Date(currentDate.getFullYear(), currentDate.getMonth(), day).toDateString();
    const dayAssessments = assessments.filter(a => new Date(a.date).toDateString() === dateStr);
    
    if (dayAssessments.length === 0) return null;
    
    // Get highest intensity/level for the day
    const hasHigh = dayAssessments.some(a => a.level === 'High');
    const hasMod = dayAssessments.some(a => a.level === 'Moderate');
    
    if (hasHigh) return 'high';
    if (hasMod) return 'moderate';
    return 'low';
  };

  return (
    <div className="py-2">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-[1400px] mx-auto"
      >
        {/* Header */}
        <div className="flex justify-between items-end mb-8">
          <div>
            <h1 className="text-white text-4xl sm:text-5xl font-serif font-medium mb-2">MindBalance Overview</h1>
            <p className="text-white/50 text-lg">Take control of your mental wellness today!</p>
          </div>
          <div className="hidden sm:flex items-center gap-4">
            <span className="text-white/60 text-sm">
              {currentDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
            </span>
            <button className="flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-2 rounded-full text-white text-sm hover:bg-white/10 transition-colors">
              Today <ChevronDown className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Top Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-6">
          
          {/* Emotional Balance Card (Large Vertical) */}
          <div className="lg:col-span-5 dark-glass rounded-[2rem] border border-white/5 p-8 relative overflow-hidden flex flex-col">
            <div className="flex justify-between items-start mb-8 z-10">
              <div className="flex items-center gap-3">
                <Activity className="w-5 h-5 text-[#b5b9ff]" />
                <h3 className="text-white font-medium text-lg">Emotional Balance</h3>
              </div>
              <button className="text-white/40 hover:text-white"><MoreVertical className="w-5 h-5" /></button>
            </div>
            
            <div className="mb-8 z-10">
              <div className="flex items-baseline gap-3">
                <span className="text-white text-5xl font-serif font-medium">Daily</span>
                <span className="bg-[#c4f061] text-[#151b2b] text-xs font-bold px-2 py-1 rounded">Check-ins</span>
              </div>
              <p className="text-white/40 text-sm mt-2">Based on your recent tracking</p>
            </div>

            {/* Intersecting Circles Vis */}
            <div className="relative w-full h-[220px] mx-auto my-6 z-10">
              <div className="absolute top-0 left-[10%] w-40 h-40 rounded-full bg-[#b5b9ff] mix-blend-lighten opacity-90 flex items-center justify-center flex-col shadow-[0_0_50px_rgba(181,185,255,0.2)]">
                <span className="text-[#151b2b] font-bold text-xl">Calm</span>
              </div>
              <div className="absolute top-6 right-[5%] w-32 h-32 rounded-full bg-white/5 border border-white/10 flex items-center justify-center flex-col backdrop-blur-md">
                <span className="text-white font-bold text-lg">Neutral</span>
              </div>
              <div className="absolute bottom-0 left-[35%] w-28 h-28 rounded-full bg-[#c4f061] flex items-center justify-center flex-col text-[#151b2b] shadow-[0_0_30px_rgba(196,240,97,0.4)] z-20">
                <span className="font-bold text-base">Stress</span>
              </div>
            </div>

            {/* Progress Bars */}
            <div className="space-y-4 mt-auto z-10">
              <div className="flex items-center gap-4">
                <span className="text-white font-medium w-8">45%</span>
                <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-[#b5b9ff] rounded-full" style={{ width: '45%' }}></div>
                </div>
                <span className="text-white/40 text-xs w-12 text-right">Focus</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-white font-medium w-8">30%</span>
                <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-white/30 rounded-full" style={{ width: '30%' }}></div>
                </div>
                <span className="text-white/40 text-xs w-12 text-right">Activity</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-white font-medium w-8">25%</span>
                <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-[#c4f061] rounded-full" style={{ width: '25%' }}></div>
                </div>
                <span className="text-white/40 text-xs w-12 text-right">Rest</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Calmness Score */}
            <div className="dark-glass rounded-[2rem] border border-white/5 p-6 flex flex-col justify-between">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <HeartPulse className="w-5 h-5 text-[#45645e]" />
                  <h3 className="text-white font-medium">Calmness Score</h3>
                </div>
                <button className="text-white/40 hover:text-white"><MoreVertical className="w-5 h-5" /></button>
              </div>
              <div className="flex items-end justify-between mt-8">
                <div className="flex items-baseline gap-1">
                  <span className="text-white text-6xl font-serif">{roundedStressScore}</span>
                  <span className="text-white/40">/100</span>
                </div>
                <div className="text-right">
                  <div className="text-white/40 text-xs mb-1">Avg</div>
                  <div className="text-white font-medium">78</div>
                </div>
              </div>
            </div>

            {/* Wellness Index */}
            <div className="dark-glass rounded-[2rem] border border-white/5 p-6 flex flex-col justify-between">
               <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <Sparkles className="w-5 h-5 text-[#c4f061]" />
                  <h3 className="text-white font-medium">Wellness Index</h3>
                </div>
                <button className="text-white/40 hover:text-white"><MoreVertical className="w-5 h-5" /></button>
              </div>
              <div className="flex justify-between items-end mt-8">
                <div>
                   <div className="flex items-baseline gap-2 mb-4">
                     <span className="text-white text-5xl font-serif">78</span>
                     <span className="text-white/50 text-xl">%</span>
                     <span className="bg-[#c4f061] text-[#151b2b] text-[10px] font-bold px-2 py-0.5 rounded ml-2">+10%</span>
                   </div>
                </div>
                {/* Dot Matrix Vis */}
                <div className="flex gap-2 items-end h-16">
                  {[3, 4, 3, 2, 5, 3, 4].map((dots, colIdx) => (
                    <div key={colIdx} className="flex flex-col gap-1 justify-end">
                      {[...Array(5)].map((_, dotIdx) => (
                         <div 
                           key={dotIdx} 
                           className={`w-1.5 h-1.5 rounded-full ${dotIdx >= (5 - dots) ? 'bg-[#b5b9ff]' : 'bg-white/10'}`} 
                         />
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Activity tracking */}
            <div className="md:col-span-2 dark-glass rounded-[2rem] border border-white/5 p-6 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <Activity className="w-5 h-5 text-[#45645e]" />
                <h3 className="text-white font-medium">Mindful Minutes</h3>
              </div>
              <div className="flex items-end gap-8">
                <div className="flex items-baseline gap-1">
                  <span className="text-white text-4xl font-serif">120</span>
                  <span className="text-white/40 text-sm">min</span>
                </div>
                <div className="text-right">
                  <div className="text-white/40 text-xs mb-1">Goal</div>
                  <div className="text-white text-sm">150 Min</div>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Bottom Calendar & Analysis Section */}
        <div className="dark-glass rounded-[2rem] border border-white/5 p-8 relative">
           <div className="flex justify-between items-center mb-8">
              <div className="flex items-center gap-3">
                <Moon className="w-5 h-5 text-white" />
                <h3 className="text-white text-xl font-medium">Mood & Stress Calendar</h3>
              </div>
              <button className="flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-2 rounded-full text-white text-sm hover:bg-white/10 transition-colors">
                {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })} <ChevronDown className="w-4 h-4" />
              </button>
           </div>

           <div className="flex flex-col md:flex-row gap-8">
             {/* Stats summary */}
             <div className="flex gap-8 md:w-1/3">
               <div>
                 <div className="flex items-baseline gap-1">
                   <span className="text-[#c4f061] text-5xl font-serif">
                     {assessments.filter(a => a.level === 'Low').length}
                   </span>
                 </div>
                 <div className="text-white/40 text-sm mt-1">Calm Days</div>
               </div>
               <div>
                 <div className="flex items-baseline gap-1">
                   <span className="text-[#b5b9ff] text-5xl font-serif">
                     {assessments.filter(a => a.level === 'Moderate' || a.level === 'High').length}
                   </span>
                 </div>
                 <div className="text-white/40 text-sm mt-1">Stressed Days</div>
               </div>
             </div>

             {/* The Calendar Grid */}
             <div className="flex-1">
               <div className="grid grid-cols-7 gap-2 mb-2">
                 {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                   <div key={day} className="text-center text-white/40 text-xs font-medium pb-2">{day}</div>
                 ))}
               </div>
               <div className="grid grid-cols-7 gap-2">
                 {/* Empty days padding */}
                 {[...Array(firstDayOfMonth)].map((_, i) => (
                   <div key={`empty-${i}`} className="aspect-square rounded-xl bg-transparent" />
                 ))}
                 
                 {/* Days of month */}
                 {[...Array(daysInMonth)].map((_, i) => {
                   const day = i + 1;
                   const status = getDayStatus(day);
                   const isToday = day === new Date().getDate() && currentDate.getMonth() === new Date().getMonth();
                   
                   let bgColor = 'bg-white/5'; // default
                   let dotColor = 'bg-transparent';
                   
                   if (status === 'low') { bgColor = 'bg-white/10'; dotColor = 'bg-[#c4f061]'; }
                   if (status === 'moderate') { bgColor = 'bg-white/10'; dotColor = 'bg-[#f59e0b]'; }
                   if (status === 'high') { bgColor = 'bg-white/10'; dotColor = 'bg-[#ef4444]'; }

                   return (
                     <div 
                       key={day} 
                       className={`aspect-square rounded-xl flex flex-col items-center justify-center relative cursor-pointer hover:bg-white/20 transition-colors border ${isToday ? 'border-[#c4f061]/50' : 'border-white/5'} ${bgColor}`}
                     >
                       <span className={`text-sm ${isToday ? 'text-white font-bold' : 'text-white/70'}`}>{day}</span>
                       <div className={`absolute bottom-2 w-1.5 h-1.5 rounded-full ${dotColor}`} />
                     </div>
                   );
                 })}
               </div>
             </div>
           </div>
        </div>

      </motion.div>
    </div>
  );
}
