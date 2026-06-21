import React from "react";
import { motion } from "framer-motion";

function Capsule({ className, delay = 0 }) {
  return (
    <motion.div
      animate={{ y: [-8, 12, -8], rotate: [-8, 6, -8] }}
      transition={{ duration: 7.2, delay, repeat: Infinity, ease: "easeInOut" }}
      className={`pointer-events-none absolute h-8 w-20 rounded-full border border-[#a7e4e8]/20 bg-gradient-to-r from-[#a7e4e8]/20 via-washi/10 to-[#ffaaa5]/20 shadow-[0_0_28px_rgba(147,214,220,.08)] ${className}`}
    >
      <span className="absolute inset-y-1/2 left-1/2 h-7 w-px -translate-y-1/2 bg-washi/25" />
    </motion.div>
  );
}

function DnaRail({ className }) {
  return (
    <motion.svg
      viewBox="0 0 120 260"
      animate={{ y: [0, -18, 0] }}
      transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
      className={`pointer-events-none absolute ${className}`}
      aria-hidden="true"
    >
      <path
        d="M32 12 C96 54 96 86 32 128 C-16 160 -12 206 88 248"
        fill="none"
        stroke="rgba(167,228,232,.3)"
        strokeWidth="3"
      />
      <path
        d="M88 12 C-12 54 -16 86 88 128 C136 160 132 206 32 248"
        fill="none"
        stroke="rgba(255,176,168,.26)"
        strokeWidth="3"
      />
      {[28, 62, 96, 132, 168, 204, 236].map((y, index) => (
        <line
          key={y}
          x1={index % 2 ? 37 : 28}
          x2={index % 2 ? 83 : 92}
          y1={y}
          y2={y}
          stroke="rgba(244,239,228,.2)"
          strokeWidth="2"
        />
      ))}
    </motion.svg>
  );
}

function FloatingPharmaVisuals() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <Capsule className="right-[9%] top-[18%]" />
      <Capsule className="left-[7%] top-[58%] scale-75" delay={0.8} />
      <Capsule className="bottom-[12%] right-[28%] hidden rotate-12 sm:block" delay={1.4} />
      <DnaRail className="-right-6 top-20 h-56 w-28 opacity-35 sm:right-8 sm:h-64" />
    </div>
  );
}

export default FloatingPharmaVisuals;
