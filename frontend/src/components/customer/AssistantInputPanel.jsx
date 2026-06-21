import React from "react";
import { motion } from "framer-motion";
import { BrainCircuit, Search } from "lucide-react";

function AssistantInputPanel({ symptoms, onSymptomsChange, onSubmit, isLoading }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.08, ease: "easeOut" }}
      className="landing-glass p-5 sm:p-6"
    >
      <div className="mb-5 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#a7e4e8]">
            <BrainCircuit className="h-4 w-4" aria-hidden="true" />
            Symptom Input
          </p>
          <h2 className="mt-2 text-2xl font-semibold text-washi">
            Tell us what you are feeling
          </h2>
        </div>
        <span className="rounded-full border border-[#d8e9cf]/25 bg-[#d8e9cf]/10 px-3 py-2 text-xs text-[#d8e9cf]">
          Live inventory mode
        </span>
      </div>

      <textarea
        className="min-h-44 w-full resize-none rounded-[22px] border border-washi/10 bg-[#102436]/60 p-5 text-base leading-7 text-washi outline-none transition placeholder:text-washi/35 focus:border-[#a7e4e8]/40 focus:shadow-[0_0_42px_rgba(147,214,220,.1)]"
        placeholder="Describe symptoms such as headache, fever, cough, anxiety, stomach pain..."
        value={symptoms}
        onChange={(event) => onSymptomsChange(event.target.value)}
      />

      <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm leading-6 text-washi/55">
          Include age, duration, allergies, and current medicines when possible.
        </p>
        <button
          type="button"
          onClick={onSubmit}
          disabled={isLoading}
          className="group inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-[#a7e4e8]/45 bg-[#dff8f8] px-6 py-3 text-sm font-bold text-[#0d1b26] shadow-[0_18px_45px_rgba(147,214,220,.16)] transition hover:bg-washi disabled:cursor-not-allowed disabled:opacity-70"
        >
          <Search className="h-4 w-4" aria-hidden="true" />
          {isLoading ? "Analyzing..." : "Analyze Symptoms"}
        </button>
      </div>
    </motion.section>
  );
}

export default AssistantInputPanel;
