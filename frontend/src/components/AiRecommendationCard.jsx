import React from "react";
import { motion } from "framer-motion";
import { Bot, ChevronRight, Pill, Sparkles } from "lucide-react";

const recommendations = [
  { name: "Acetaminophen", dose: "500 mg", confidence: 94 },
  { name: "Oral rehydration salts", dose: "200 ml", confidence: 88 },
  { name: "Cetirizine", dose: "10 mg", confidence: 76 }
];

function AiRecommendationCard() {
  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.35 }}
      transition={{ duration: 0.65, ease: "easeOut" }}
      className="landing-glass relative overflow-hidden p-5 sm:p-6"
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#a7e4e8]/70 to-transparent" />
      <motion.div
        animate={{ x: ["-45%", "135%"] }}
        transition={{ duration: 5.2, repeat: Infinity, ease: "linear" }}
        className="pointer-events-none absolute inset-y-0 w-24 bg-gradient-to-r from-transparent via-[#a7e4e8]/10 to-transparent"
      />

      <div className="relative flex items-start justify-between gap-4">
        <div>
          <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#ffc2bd]">
            <Bot className="h-4 w-4" aria-hidden="true" />
            AI Care Guidance
          </p>
          <h2 className="mt-3 text-2xl font-semibold text-washi sm:text-3xl">
            Assisted medicine guidance
          </h2>
        </div>
        <div className="grid h-12 w-12 shrink-0 place-items-center rounded-[14px] border border-[#a7e4e8]/30 bg-[#a7e4e8]/10 text-[#a7e4e8] shadow-[0_0_28px_rgba(147,214,220,.12)]">
          <Sparkles className="h-5 w-5" aria-hidden="true" />
        </div>
      </div>

      <div className="relative mt-6 rounded-[18px] border border-washi/10 bg-[#102436]/60 p-4">
        <p className="text-xs uppercase tracking-[0.2em] text-washi/42">Patient symptoms</p>
        <p className="mt-3 min-h-7 text-sm text-[#a7e4e8] sm:text-base">
          fever, headache, mild dehydration
          <motion.span
            animate={{ opacity: [0, 1, 0] }}
            transition={{ duration: 1.2, repeat: Infinity }}
            className="ml-1 inline-block h-5 w-1.5 translate-y-1 bg-[#a7e4e8]/80"
          />
        </p>
      </div>

      <div className="relative mt-4 space-y-3">
        {recommendations.map((item, index) => (
          <motion.div
            key={item.name}
            initial={{ opacity: 0, x: -18 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45, delay: index * 0.1 }}
            className="group rounded-[18px] border border-washi/10 bg-washi/[0.045] p-4 transition hover:border-[#a7e4e8]/30 hover:bg-[#a7e4e8]/10"
          >
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-[12px] border border-[#ffaaa5]/25 bg-[#ffaaa5]/10 text-[#ffaaa5]">
                  <Pill className="h-5 w-5" aria-hidden="true" />
                </div>
                <div>
                  <p className="font-semibold text-washi">{item.name}</p>
                  <p className="text-xs text-washi/50">{item.dose} suggested range</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold text-[#a7e4e8]">{item.confidence}%</p>
                <p className="text-[10px] uppercase tracking-[0.16em] text-washi/38">confidence</p>
              </div>
            </div>
            <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-washi/10">
              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: `${item.confidence}%` }}
                viewport={{ once: true }}
                transition={{ duration: 0.85, delay: 0.2 + index * 0.1, ease: "easeOut" }}
                className="h-full bg-gradient-to-r from-[#a7e4e8] via-[#d8e9cf] to-[#ffaaa5]"
              />
            </div>
          </motion.div>
        ))}
      </div>

      <div className="relative mt-5 flex items-center gap-2 rounded-[18px] border border-[#d8e9cf]/25 bg-[#d8e9cf]/10 px-4 py-3 text-sm text-[#d8e9cf]">
        <motion.span
          animate={{ scale: [1, 1.45, 1], opacity: [0.65, 1, 0.65] }}
          transition={{ duration: 1.4, repeat: Infinity }}
          className="h-2.5 w-2.5 rounded-full bg-[#d8e9cf]"
        />
        Reviewing context with human-safe guidance
        <ChevronRight className="ml-auto h-4 w-4" aria-hidden="true" />
      </div>
    </motion.article>
  );
}

export default AiRecommendationCard;
