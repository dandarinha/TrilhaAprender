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
    primary: 'border-4 border-[#FFF4E8] bg-gradient-to-b from-[#6A9876] to-[#0B4D2B] text-white shadow-[0_6px_0_#063A20]',
    secondary: 'border-4 border-[#FFF4E8] bg-[#A7C9B0] text-[#173C2A] shadow-[0_6px_0_#0B4D2B]',
    accent: 'border-4 border-[#FFF4E8] bg-[#FF9A5C] text-[#7A200F] shadow-[0_6px_0_#B84A16]',
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
