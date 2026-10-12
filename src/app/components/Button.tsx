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
    primary: 'border-4 border-[#fff7dc] bg-gradient-to-b from-[#77cf6b] to-[#41a95e] text-white shadow-[0_6px_0_#27734c]',
    secondary: 'border-4 border-[#fff7dc] bg-[#65b8df] text-[#254b3b] shadow-[0_6px_0_#367b9c]',
    accent: 'border-4 border-[#fff7dc] bg-[#ffe48b] text-[#733b35] shadow-[0_6px_0_#c68142]',
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
        font-display rounded-2xl font-black transition-all
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
