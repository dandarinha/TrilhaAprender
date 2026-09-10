import { motion } from 'motion/react';
import { ReactNode } from 'react';

interface ButtonProps {
  onClick?: () => void;
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'accent';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
}

export function Button({
  onClick,
  children,
  variant = 'primary',
  size = 'md',
  disabled = false
}: ButtonProps) {
  const variants = {
    primary: 'bg-[#ff6ec7] text-white shadow-[0_0_20px_rgba(255,110,199,0.5)]',
    secondary: 'bg-[#00f6ff] text-[#1a0b2e] shadow-[0_0_20px_rgba(0,246,255,0.5)]',
    accent: 'bg-[#ffd93d] text-[#1a0b2e] shadow-[0_0_20px_rgba(255,217,61,0.5)]',
  };

  const sizes = {
    sm: 'px-6 py-2 text-sm',
    md: 'px-8 py-3 text-base',
    lg: 'px-12 py-4 text-lg',
  };

  return (
    <motion.button
      onClick={onClick}
      disabled={disabled}
      className={`
        font-display rounded-full transition-all
        ${variants[variant]} ${sizes[size]}
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105 active:scale-95'}
      `}
      whileHover={disabled ? {} : { scale: 1.05 }}
      whileTap={disabled ? {} : { scale: 0.95 }}
    >
      {children}
    </motion.button>
  );
}
