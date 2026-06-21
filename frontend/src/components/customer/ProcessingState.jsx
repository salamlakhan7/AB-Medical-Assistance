import React from "react";
import { motion } from "framer-motion";
import { Bot, HeartPulse } from "lucide-react";

function ProcessingState() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.16, ease: "easeOut" }}
      className="landing-glass p-5 sm:p-6"
    >
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <span className="relative grid h-14 w-14 place-items-center rounded-full border border-[#a7e4e8]/28 bg-[#a7e4e8]/10 text-[#a7e4e8]">
            <motion.span
              animate={{ scale: [1, 1.55, 1], opacity: [0.32, 0.04, 0.32] }}
              transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
              className="absolute inset-0 rounded-full bg-[#a7e4e8]"
            />
            <Bot className="relative h-6 w-6" aria-hidden="true" />
          </span>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#ffc2bd]">
              AI processing
            </p>
            <h2 className="mt-2 text-xl font-semibold text-washi">
              Reviewing symptoms with care
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-washi/60">
              Matching your description with supportive medicines, safety notes,
              and inventory availability.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 rounded-full border border-[#d8e9cf]/25 bg-[#d8e9cf]/10 px-4 py-2 text-sm text-[#d8e9cf]">
          <HeartPulse className="h-4 w-4" aria-hidden="true" />
          Gentle review active
        </div>
      </div>
    </motion.section>
  );
}

export default ProcessingState;
