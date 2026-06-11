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
      className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 20 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="relative w-full max-w-lg dark-glass rounded-[2.5rem] border border-white/10 p-8 sm:p-10 shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-y-auto max-h-[90vh] [&::-webkit-scrollbar]:w-0"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-6 right-6 w-10 h-10 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 transition-all text-white/50 hover:text-white hover:scale-105"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="mb-10 text-center">
          <div className="w-20 h-20 mx-auto bg-[#45645e] rounded-full flex items-center justify-center shadow-lg mb-6 shadow-[#45645e]/20">
            <User className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-white text-3xl mb-2 font-serif font-medium tracking-tight">Your Profile</h2>
          <p className="text-white/60 text-base">Manage your personal wellness journey</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-2xl text-sm flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
              {error}
            </div>
          )}

           {/* Read-only Email Field */}
           <div className="bg-white/5 rounded-2xl p-2 flex items-center gap-3 border border-white/10">
             <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shadow-sm">
               <span className="text-[#c4f061] font-bold text-lg">@</span>
             </div>
             <div className="flex-1 px-1">
               <p className="text-white/40 text-[10px] uppercase tracking-widest font-bold">Account Email</p>
               <p className="text-white font-medium text-sm">{user.email}</p>
             </div>
           </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-white/70 text-sm font-medium ml-1">Full Name</label>
              <div className="relative group">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3.5 text-white placeholder:text-white/30 focus:outline-none focus:bg-white/10 focus:border-[#c4f061] focus:ring-1 focus:ring-[#c4f061] transition-all font-medium"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-white/70 text-sm font-medium ml-1">Birth Date</label>
              <div className="relative group">
                <input
                  type="date"
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3.5 text-white placeholder:text-white/30 focus:outline-none focus:bg-white/10 focus:border-[#c4f061] focus:ring-1 focus:ring-[#c4f061] transition-all font-medium min-h-[50px] [color-scheme:dark]"
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-white/70 text-sm font-medium ml-1">Profession</label>
            <div className="relative group">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 group-focus-within:text-[#c4f061] transition-colors">
                <Briefcase className="w-5 h-5" />
              </div>
              <input
                type="text"
                value={profession}
                onChange={(e) => setProfession(e.target.value)}
                placeholder="e.g. Developer, Student, Teacher"
                className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 py-4 text-white placeholder:text-white/30 focus:outline-none focus:bg-white/10 focus:border-[#c4f061] focus:ring-1 focus:ring-[#c4f061] transition-all"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-white/70 text-sm font-medium ml-1 flex items-center gap-2">
              Wellness Goal 
              <span className="text-xs text-white/40 font-normal">(Your daily motivation)</span>
            </label>
            <div className="relative group">
              <div className="absolute left-4 top-5 text-white/40 group-focus-within:text-[#c4f061] transition-colors">
                <Heart className="w-5 h-5" />
              </div>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="What drives you? e.g. 'Finding peace in chaos'"
                className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 py-4 text-white placeholder:text-white/30 focus:outline-none focus:bg-white/10 focus:border-[#c4f061] focus:ring-1 focus:ring-[#c4f061] transition-all min-h-[120px] resize-none leading-relaxed"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#c4f061] hover:bg-[#b0d957] disabled:bg-[#c4f061]/50 text-[#151b2b] py-4 rounded-2xl transition-all mt-4 shadow-xl shadow-[#c4f061]/20 active:scale-95 duration-300 font-bold text-lg flex items-center justify-center gap-2 pulse-hover"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-[#151b2b]/30 border-t-[#151b2b] rounded-full animate-spin" />
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
