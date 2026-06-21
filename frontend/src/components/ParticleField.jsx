import React from "react";
import { motion } from "framer-motion";

const particles = Array.from({ length: 22 }, (_, index) => ({
  id: index,
  left: `${(index * 37) % 100}%`,
  top: `${(index * 19) % 100}%`,
  delay: (index % 7) * 0.35,
  size: index % 3 === 0 ? "h-1.5 w-1.5" : "h-1 w-1"
}));

function ParticleField() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      {particles.map((particle) => (
        <motion.span
          key={particle.id}
          animate={{ y: [-12, 18, -12], opacity: [0.15, 0.78, 0.15] }}
          transition={{
            duration: 4.5 + (particle.id % 5),
            delay: particle.delay,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className={`absolute rounded-full bg-clinic shadow-[0_0_18px_rgba(141,248,255,.75)] ${particle.size}`}
          style={{ left: particle.left, top: particle.top }}
        />
      ))}
    </div>
  );
}

export default ParticleField;
