import React from "react";
import { motion } from "framer-motion";
import { Clock3, History } from "lucide-react";

function RecommendationHistory({ searches, medicines, isLoading }) {
  return (
    <motion.section
      initial={{ opacity: 0, x: 24 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.65, delay: 0.12, ease: "easeOut" }}
      className="landing-glass p-5 sm:p-6"
    >
      <div className="mb-6 flex items-center gap-3">
        <span className="grid h-11 w-11 place-items-center rounded-[14px] border border-[#a7e4e8]/25 bg-[#a7e4e8]/10 text-[#a7e4e8]">
          <History className="h-5 w-5" aria-hidden="true" />
        </span>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#a7e4e8]">
            History
          </p>
          <h2 className="mt-1 text-xl font-semibold">Recent activity</h2>
        </div>
      </div>

      <div>
        <p className="mb-3 text-sm font-semibold text-washi">Symptom searches</p>
        <div className="space-y-2">
          {isLoading ? (
            <div className="rounded-[16px] border border-washi/10 bg-washi/[0.045] p-3 text-sm text-washi/60">
              Loading history...
            </div>
          ) : searches.length ? searches.map((item) => (
            <div key={item} className="rounded-[16px] border border-washi/10 bg-washi/[0.045] p-3 text-sm text-washi/60">
              {item}
            </div>
          )) : (
            <div className="rounded-[16px] border border-washi/10 bg-washi/[0.045] p-3 text-sm text-washi/60">
              No recommendation history yet.
            </div>
          )}
        </div>
      </div>

      <div className="mt-7">
        <p className="mb-3 flex items-center gap-2 text-sm font-semibold text-washi">
          <Clock3 className="h-4 w-4 text-[#ffc2bd]" aria-hidden="true" />
          Recently viewed medicines
        </p>
        <div className="space-y-2">
          {medicines.length ? medicines.map((item) => (
            <div key={item} className="rounded-[16px] border border-[#ffaaa5]/15 bg-[#ffaaa5]/10 p-3 text-sm text-washi/65">
              {item}
            </div>
          )) : (
            <div className="rounded-[16px] border border-[#ffaaa5]/15 bg-[#ffaaa5]/10 p-3 text-sm text-washi/65">
              Recommended medicines will appear here.
            </div>
          )}
        </div>
      </div>
    </motion.section>
  );
}

export default RecommendationHistory;
