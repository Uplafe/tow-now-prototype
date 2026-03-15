'use client'
import { motion } from 'framer-motion'

export default function SearchingAnimation() {
  return (
    <div className="flex flex-col items-center py-6">
      {/* Radar rings */}
      <div className="relative w-32 h-32 flex items-center justify-center mb-5">
        {[0, 1, 2].map(i => (
          <motion.div
            key={i}
            className="absolute rounded-full border border-electric-500/40"
            initial={{ width: 32, height: 32, opacity: 0.8 }}
            animate={{ width: 128, height: 128, opacity: 0 }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: i * 0.65,
              ease: 'easeOut',
            }}
          />
        ))}
        <div className="w-14 h-14 bg-electric-600 rounded-full flex items-center justify-center shadow-float z-10">
          <span className="text-2xl">🚛</span>
        </div>
      </div>

      <motion.p
        className="text-white font-semibold text-base mb-1"
        animate={{ opacity: [1, 0.5, 1] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      >
        Finding nearby drivers…
      </motion.p>
      <p className="text-white/40 text-sm text-center">
        We're matching you with the closest available truck
      </p>

      {/* Loading dots */}
      <div className="flex gap-2 mt-4">
        {[0, 1, 2].map(i => (
          <motion.div
            key={i}
            className="w-2 h-2 bg-electric-500 rounded-full"
            animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
          />
        ))}
      </div>
    </div>
  )
}
