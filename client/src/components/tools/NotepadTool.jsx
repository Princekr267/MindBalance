import { useState, useEffect } from "react";
import { X, Save, Check } from "lucide-react";

export function NotepadTool({ title, subtitle, onClose }) {
  const storageKey = `mindbalance_note_${title.replace(/\s+/g, '_').toLowerCase()}`;
  const [content, setContent] = useState("");
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    const savedNote = localStorage.getItem(storageKey);
    if (savedNote) setContent(savedNote);
  }, [storageKey]);

  const handleSave = () => {
    localStorage.setItem(storageKey, content);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-2xl dark-glass rounded-[2rem] border border-white/10 p-6 sm:p-8 flex flex-col h-[80vh] max-h-[600px]">
        <button
          onClick={onClose}
          className="absolute top-6 right-6 w-8 h-8 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 text-white/50 hover:text-white"
        >
          <X className="w-4 h-4" />
        </button>

        <h2 className="text-white text-2xl mb-1 font-serif">{title}</h2>
        <p className="text-white/50 text-sm mb-6 pr-12">{subtitle}</p>

        <div className="flex-1 relative">
          <textarea
            value={content}
            onChange={(e) => {
              setContent(e.target.value);
              setIsSaved(false);
            }}
            placeholder="Start typing your thoughts here..."
            className="w-full h-full bg-white/5 border border-white/10 rounded-2xl p-6 text-white placeholder:text-white/30 focus:outline-none focus:border-[#b5b9ff] focus:bg-white/10 transition-all resize-none leading-relaxed text-lg"
          />
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={handleSave}
            className={`flex items-center gap-2 px-6 py-3 rounded-full font-medium transition-all ${
              isSaved 
                ? 'bg-[#c4f061] text-[#151b2b]' 
                : 'bg-[#b5b9ff] text-[#151b2b] hover:bg-[#a1a6f8] pulse-hover'
            }`}
          >
            {isSaved ? <><Check className="w-4 h-4" /> Saved</> : <><Save className="w-4 h-4" /> Save Notes</>}
          </button>
        </div>
      </div>
    </div>
  );
}
