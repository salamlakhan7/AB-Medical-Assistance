import React from "react";
import { motion } from "framer-motion";

function MetricCard({ label, value }) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="landing-glass p-4"
    >
      <p className="text-2xl font-semibold text-[#a7e4e8] sm:text-3xl">{value}</p>
      <p className="mt-2 text-xs uppercase tracking-[0.14em] text-washi/50">{label}</p>
    </motion.div>
  );
}

export default MetricCard;
