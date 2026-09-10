import { motion } from 'motion/react';

export function TravelScreen() {
  return (
    <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4">
      <motion.div
        className="text-9xl"
        animate={{
          y: [0, -100, 0],
          rotate: [0, 360],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      >
        🚀
      </motion.div>

      <motion.h2
        className="font-display text-4xl md:text-5xl mt-8 text-[#00f6ff]"
        animate={{
          opacity: [0.5, 1, 0.5],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
        }}
      >
        Viajando pelo espaço...
      </motion.h2>

      <div className="flex gap-2 mt-6">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="w-3 h-3 bg-[#ffd93d] rounded-full"
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.3, 1, 0.3],
            }}
            transition={{
              duration: 1,
              repeat: Infinity,
              delay: i * 0.2,
            }}
          />
        ))}
      </div>
    </div>
  );
}
