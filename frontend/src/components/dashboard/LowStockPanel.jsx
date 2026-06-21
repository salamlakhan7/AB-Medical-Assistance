import React from "react";
import { motion } from "framer-motion";
import { AlertTriangle } from "lucide-react";

function LowStockPanel({ items }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.55, delay: 0.08 }}
      className="dashboard-glass p-6"
    >
      <div className="flex items-center gap-3">
        <span className="grid h-11 w-11 place-items-center border border-koi/35 bg-koi/10 text-koi shadow-[0_0_26px_rgba(255,54,95,.12)]">
          <AlertTriangle className="h-5 w-5" aria-hidden="true" />
        </span>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-koi">Low Stock</p>
          <h2 className="mt-1 text-xl font-semibold">Restock Alert Panel</h2>
        </div>
      </div>

      <div className="mt-6 space-y-4">
        {items.length ? items.map((item) => {
          const percent = item.threshold > 0
            ? Math.min(100, Math.round((item.stock / item.threshold) * 100))
            : 0;

          return (
            <div key={item.name} className="border border-sakura/10 bg-[#102033]/55 p-4 shadow-[inset_0_1px_0_rgba(244,239,228,.05)]">
              <div className="flex items-center justify-between gap-3">
                <p className="font-semibold">{item.name}</p>
                <p className="text-sm text-koi">{item.stock} left</p>
              </div>
              <div className="mt-3 h-2 overflow-hidden bg-[#07111c]/80">
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: `${percent}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.7, ease: "easeOut" }}
                  className="h-full bg-gradient-to-r from-koi via-sakura to-clinic"
                />
              </div>
              <p className="mt-2 text-xs text-washi/45">Threshold: {item.threshold}</p>
            </div>
          );
        }) : (
          <div className="border border-clinic/10 bg-[#102033]/55 p-4 text-sm leading-6 text-washi/55">
            No products are below their stock threshold.
          </div>
        )}
      </div>
    </motion.article>
  );
}

export default LowStockPanel;
