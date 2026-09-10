import React from 'react';
import { Volume2 } from 'lucide-react';
import { motion } from 'motion/react';
import { speak } from '../lib/speech';

export function SpeakButton({ text, label = 'Ouvir', size = 24, className = '' }: { text: string; label?: string; size?: number; className?: string }) {
  return (
    <motion.button
      type="button"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={(e) => { e.stopPropagation(); speak(text); }}
      aria-label={label}
      className={`inline-flex items-center justify-center gap-2 text-slate-400 hover:text-slate-600 bg-white/50 hover:bg-white/80 rounded-full p-2 transition-colors ${className}`}
    >
      <Volume2 size={size * 0.8} />
    </motion.button>
  );
}
