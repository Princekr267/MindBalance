import { motion } from "framer-motion";
import { X, User, Briefcase, Calendar, Heart } from "lucide-react";
import { useState } from "react";
import axios from 'axios';

interface ProfileModalProps {
  user: {
    name: string;
    email: string;
    dob?: string;
    profession?: string;
    bio?: string;
  };
  onClose: () => void;
  onUpdate: (updatedUser: any) => void;
}

export function ProfileModal({ user, onClose, onUpdate }: ProfileModalProps) {
  const [name, setName] = useState(user.name || "");
  const [dob, setDob] = useState(user.dob ? new Date(user.dob).toISOString().split('T')[0] : "");
  const [profession, setProfession] = useState(user.profession || "");
  const [bio, setBio] = useState(user.bio || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
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
    } catch (error: any) {
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
      className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        transition={{ duration: 0.3 }}
        className="relative w-full max-w-md bg-gradient-to-b from-[#4a7a7d]/90 via-[#3a6569]/90 to-[#254250]/90 backdrop-blur-xl rounded-3xl border border-white/20 p-6 shadow-2xl overflow-y-auto max-h-[85vh] [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:bg-white/20 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-transparent"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-all text-white"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="mb-6">
          <h2 className="text-white text-2xl mb-1">Edit Profile</h2>
          <p className="text-white/70 text-sm">Update your personal details</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-500/20 border border-red-500/30 text-red-300 px-4 py-3 rounded-xl text-sm">
              {error}
            </div>
          )}

           {/* Read-only Email Field */}
           <div className="mb-4 p-3 bg-white/5 rounded-xl border border-white/10 flex items-center gap-3">
             <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
               <span className="text-white text-xs font-bold">@</span>
             </div>
             <div>
               <p className="text-white/50 text-xs uppercase tracking-wider">Email (Read Only)</p>
               <p className="text-white text-sm">{user.email}</p>
             </div>
           </div>


          <div>
            <label className="block text-white/80 mb-2 text-sm">Full Name</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-white/10 border border-white/20 rounded-xl px-12 py-3 text-white placeholder:text-white/40 focus:outline-none focus:border-white/40 transition-all"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-white/80 mb-2 text-sm">Date of Birth</label>
            <div className="relative">
              <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
              <input
                type="date"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                className="w-full bg-white/10 border border-white/20 rounded-xl px-12 py-3 text-white/90 placeholder:text-white/40 focus:outline-none focus:border-white/40 transition-all [color-scheme:dark]"
              />
            </div>
          </div>

          <div>
            <label className="block text-white/80 mb-2 text-sm">Profession</label>
            <div className="relative">
              <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
              <input
                type="text"
                value={profession}
                onChange={(e) => setProfession(e.target.value)}
                placeholder="e.g. Developer, Student, Teacher"
                className="w-full bg-white/10 border border-white/20 rounded-xl px-12 py-3 text-white placeholder:text-white/40 focus:outline-none focus:border-white/40 transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-white/80 mb-2 text-sm">My Wellness Goal (Bio)</label>
            <div className="relative">
              <Heart className="absolute left-4 top-4 w-5 h-5 text-white/50" />
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="What is your main motivation? e.g. 'I want to sleep better'"
                className="w-full bg-white/10 border border-white/20 rounded-xl pl-12 pr-4 py-3 text-white placeholder:text-white/40 focus:outline-none focus:border-white/40 transition-all min-h-[100px] resize-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-white/20 hover:bg-white/30 disabled:bg-white/10 border border-white/30 text-white py-3 rounded-xl transition-all mt-4"
          >
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </motion.div>
    </motion.div>
  );
}
