import { motion } from "framer-motion";
import { Github, Twitter, Linkedin, Mail, Heart } from "lucide-react";

export function Footer() {
  return (
    <footer className="relative z-10 mt-20 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 py-6">
        <div className="flex justify-center items-center">
          <p className="text-white/60 text-sm text-center">
            &copy; 2024 MindBalance. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}