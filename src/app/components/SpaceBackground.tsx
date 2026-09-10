import { motion } from 'motion/react';

export function SpaceBackground() {
  const stars = Array.from({ length: 80 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 3 + 1,
    delay: Math.random() * 2,
    duration: Math.random() * 3 + 2,
  }));

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a0520] via-[#1a0b2e] to-[#2d1b4e]" />

      {/* Stars */}
      {stars.map((star) => (
        <motion.div
          key={star.id}
          className="absolute rounded-full bg-white"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
          }}
          animate={{
            opacity: [0.2, 1, 0.2],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: star.duration,
            repeat: Infinity,
            delay: star.delay,
          }}
        />
      ))}

      {/* Nebula effects */}
      <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-[#ff6ec7] opacity-10 blur-[120px] rounded-full" />
      <div className="absolute bottom-1/4 right-1/3 w-80 h-80 bg-[#00f6ff] opacity-10 blur-[100px] rounded-full" />
    </div>
  );
}
