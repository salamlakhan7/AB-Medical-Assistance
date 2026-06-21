import React from "react";
import { motion } from "framer-motion";

const toneClasses = {
  clinic: "text-clinic border-clinic/35 bg-clinic/10 shadow-[0_0_26px_rgba(141,248,255,.12)]",
  koi: "text-koi border-koi/35 bg-koi/10 shadow-[0_0_26px_rgba(255,54,95,.12)]",
  matcha: "text-matcha border-matcha/30 bg-matcha/10 shadow-[0_0_24px_rgba(183,255,118,.1)]",
  sakura: "text-sakura border-sakura/35 bg-sakura/10 shadow-[0_0_26px_rgba(255,122,162,.12)]"
};

function DashboardSummaryCard({ label, value, trend, icon: Icon, tone, index }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: index * 0.06 }}
      whileHover={{ y: -5 }}
      className="dashboard-glass p-5"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-clinic/60">{label}</p>
          <p className="mt-4 text-3xl font-bold text-washi drop-shadow-[0_0_18px_rgba(244,239,228,.1)]">{value}</p>
        </div>
        <span className={`grid h-11 w-11 place-items-center border ${toneClasses[tone]}`}>
          <Icon className="h-5 w-5" aria-hidden="true" />
        </span>
      </div>
      <p className="mt-5 border-t border-washi/10 pt-4 text-sm text-washi/60">{trend}</p>
    </motion.article>
  );
}

export default DashboardSummaryCard;
