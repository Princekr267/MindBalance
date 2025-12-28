import { motion } from "framer-motion";
import { X, User, Briefcase, Calendar, Heart } from "lucide-react";
import { useState } from "react";
import axios from 'axios';

export function ProfileModal({ user, onClose, onUpdate }) {
  const [name, setName] = useState(user.name || "");
  const [dob, setDob] = useState(user.dob ? new Date(user.dob).toISOString().split('T')[0] : "");
  const [profession, setProfession] = useState(user.profession || "");
  const [bio, setBio] = useState(user.bio || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // DOB Validation: User must be at least 5 years old
    if (dob) {
      const birthDate = new Date(dob);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const m = today.getMonth() - birthDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      if (age < 5) {
        setError("You must be at least 5 years old to use this app.");
        setLoading(false);
        return;
      }
    }

    try {
      const response = await axios.put('/api/auth/profile', {
        name,
        dob,
        profession,
        bio
      });

      onUpdate(response.data);
      onClose();
    } catch (error) {
      console.error("Profile update error:", error);
      setError("Failed to update profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-stone-900/40 backdrop-blur-md"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 20 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="relative w-full max-w-lg bg-gradient-to-br from-white/90 via-white/80 to-white/60 backdrop-blur-2xl rounded-[2.5rem] border border-white/60 p-8 sm:p-10 shadow-2xl shadow-[#9CAF88]/20 overflow-y-auto max-h-[90vh] [&::-webkit-scrollbar]:w-0"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-6 right-6 w-10 h-10 flex items-center justify-center rounded-full bg-white/40 hover:bg-white/80 transition-all text-stone-500 hover:text-stone-800 hover:shadow-lg hover:scale-105"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="mb-10 text-center">
          <div className="w-20 h-20 mx-auto bg-gradient-to-br from-[#9CAF88] to-[#7A8C6B] rounded-full flex items-center justify-center shadow-lg mb-6 shadow-[#9CAF88]/20">
            <User className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-[#1c1917] text-3xl mb-2 font-serif font-medium tracking-tight">Your Profile</h2>
          <p className="text-stone-500 text-base">Manage your personal wellness journey</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-2xl text-sm flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
              {error}
            </div>
          )}

           {/* Read-only Email Field - Styled as a badge */}
           <div className="bg-stone-50/50 rounded-2xl p-2 flex items-center gap-3 border border-stone-100">
             <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm">
               <span className="text-[#9CAF88] font-bold text-lg">@</span>
             </div>
             <div className="flex-1 px-1">
               <p className="text-stone-400 text-[10px] uppercase tracking-widest font-bold">Account Email</p>
               <p className="text-[#1c1917] font-medium text-sm">{user.email}</p>
             </div>
           </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-stone-600 text-sm font-medium ml-1">Full Name</label>
              <div className="relative group">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-white/40 border border-white/60 rounded-2xl px-4 py-3.5 text-[#1c1917] placeholder:text-stone-400 focus:outline-none focus:bg-white/80 focus:border-[#9CAF88] focus:ring-4 focus:ring-[#9CAF88]/10 transition-all font-medium"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-stone-600 text-sm font-medium ml-1">Birth Date</label>
              <div className="relative group">
                <input
                  type="date"
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                  className="w-full bg-white/40 border border-white/60 rounded-2xl px-4 py-3.5 text-[#1c1917] placeholder:text-stone-400 focus:outline-none focus:bg-white/80 focus:border-[#9CAF88] focus:ring-4 focus:ring-[#9CAF88]/10 transition-all font-medium min-h-[50px]"
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-stone-600 text-sm font-medium ml-1">Profession</label>
            <div className="relative group">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400 group-focus-within:text-[#9CAF88] transition-colors">
                <Briefcase className="w-5 h-5" />
              </div>
              <input
                type="text"
                value={profession}
                onChange={(e) => setProfession(e.target.value)}
                placeholder="e.g. Developer, Student, Teacher"
                className="w-full bg-white/40 border border-white/60 rounded-2xl pl-12 pr-4 py-4 text-[#1c1917] placeholder:text-stone-400 focus:outline-none focus:bg-white/80 focus:border-[#9CAF88] focus:ring-4 focus:ring-[#9CAF88]/10 transition-all"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-stone-600 text-sm font-medium ml-1 flex items-center gap-2">
              Wellness Goal 
              <span className="text-xs text-stone-400 font-normal">(Your daily motivation)</span>
            </label>
            <div className="relative group">
              <div className="absolute left-4 top-5 text-stone-400 group-focus-within:text-[#9CAF88] transition-colors">
                <Heart className="w-5 h-5" />
              </div>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="What drives you? e.g. 'Finding peace in chaos'"
                className="w-full bg-white/40 border border-white/60 rounded-2xl pl-12 pr-4 py-4 text-[#1c1917] placeholder:text-stone-400 focus:outline-none focus:bg-white/80 focus:border-[#9CAF88] focus:ring-4 focus:ring-[#9CAF88]/10 transition-all min-h-[120px] resize-none leading-relaxed"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#1c1917] hover:bg-[#2c2927] disabled:bg-stone-300 text-white py-4 rounded-2xl transition-all mt-4 shadow-xl hover:shadow-2xl hover:-translate-y-1 active:scale-95 duration-300 font-medium text-lg flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Saving...
              </>
            ) : (
              'Save Changes'
            )}
          </button>
        </form>
      </motion.div>
    </motion.div>
  );
}
