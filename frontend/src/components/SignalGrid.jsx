import React from "react";
import { motion } from "framer-motion";
import { Activity, Cross, ScanLine } from "lucide-react";

const rows = [
  { label: "Comfort", value: "82", unit: "%", color: "text-[#ffaaa5]" },
  { label: "Clarity", value: "98", unit: "%", color: "text-[#a7e4e8]" },
  { label: "Guidance", value: "Calm", unit: "AI", color: "text-[#d8e9cf]" }
];

function SignalGrid() {
  return (
    <div className="landing-glass relative p-3 sm:p-4">
      <div className="absolute -right-3 -top-3 h-20 w-20 rounded-tr-[28px] border-r border-t border-[#ffaaa5]/25" />
      <div className="absolute -bottom-3 -left-3 h-20 w-20 rounded-bl-[28px] border-b border-l border-[#a7e4e8]/25" />

      <div className="relative overflow-hidden rounded-[22px] border border-washi/10 bg-[#102436]/60 p-4 sm:p-5">
        <motion.div
          animate={{ y: ["-30%", "130%"] }}
          transition={{ duration: 6.4, repeat: Infinity, ease: "linear" }}
          className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-[#a7e4e8]/10 to-transparent"
        />
        <div className="mb-5 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-washi/45">
              Guided Care Preview
            </p>
            <h2 className="mt-2 text-2xl font-semibold">Aiko Assistant</h2>
          </div>
          <div className="grid h-12 w-12 place-items-center rounded-[14px] border border-[#ffaaa5]/30 bg-[#ffaaa5]/10">
            <Cross className="h-6 w-6 text-[#ffaaa5]" aria-hidden="true" />
          </div>
        </div>

        <div className="relative mb-5 h-56 overflow-hidden rounded-[20px] border border-washi/10 bg-[linear-gradient(180deg,rgba(147,214,220,0.08),rgba(255,155,154,0.045))] sm:h-64">
          <motion.div
            animate={{ x: ["-20%", "105%"] }}
            transition={{ duration: 5.6, repeat: Infinity, ease: "linear" }}
            className="absolute inset-y-0 w-20 bg-[#a7e4e8]/10"
          />
          <div className="absolute inset-0 opacity-45 bg-[linear-gradient(rgba(244,239,228,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(244,239,228,0.08)_1px,transparent_1px)] bg-[size:36px_36px]" />
          <motion.div
            animate={{ pathLength: [0.35, 1, 0.35], opacity: [0.42, 0.78, 0.42] }}
            transition={{ duration: 4.6, repeat: Infinity, ease: "easeInOut" }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <svg viewBox="0 0 420 160" className="h-44 w-full" role="img" aria-label="animated medical signal">
              <motion.path
                d="M 10 90 L 54 90 L 75 46 L 102 124 L 132 72 L 162 90 L 212 90 L 238 58 L 264 110 L 293 90 L 410 90"
                fill="none"
                stroke="currentColor"
                strokeWidth="4"
                strokeLinecap="round"
                className="text-[#a7e4e8] drop-shadow-[0_0_14px_rgba(147,214,220,0.35)]"
              />
            </svg>
          </motion.div>
          <ScanLine className="absolute bottom-4 right-4 h-8 w-8 text-washi/35" aria-hidden="true" />
          <div className="absolute left-4 top-4 rounded-full border border-[#a7e4e8]/30 bg-[#a7e4e8]/10 px-3 py-1 text-[10px] uppercase tracking-[0.16em] text-[#a7e4e8]">
            care analysis
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          {rows.map((row) => (
            <div key={row.label} className="rounded-[16px] border border-washi/10 bg-washi/[0.045] p-4">
              <p className="text-xs uppercase tracking-[0.14em] text-washi/42">{row.label}</p>
              <p className={`mt-4 text-2xl font-semibold ${row.color}`}>
                {row.value}
                <span className="ml-1 text-xs text-washi/45">{row.unit}</span>
              </p>
            </div>
          ))}
        </div>

        <div className="mt-5 flex items-center gap-3 rounded-[16px] border border-[#d8e9cf]/25 bg-[#d8e9cf]/10 px-4 py-3 text-sm text-[#d8e9cf]">
          <Activity className="h-4 w-4" aria-hidden="true" />
          AI confidence stable. Human review ready.
        </div>
      </div>
    </div>
  );
}

export default SignalGrid;
