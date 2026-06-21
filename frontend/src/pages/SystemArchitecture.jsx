import React from "react";
import { motion } from "framer-motion";
import {
  ArrowDown,
  BrainCircuit,
  Database,
  KeyRound,
  Layers3,
  LockKeyhole,
  MonitorSmartphone,
  Network,
  RefreshCw,
  ServerCog,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  Workflow
} from "lucide-react";
import BackButton from "../components/BackButton.jsx";

const layers = [
  {
    label: "Presentation Layer",
    icon: MonitorSmartphone,
    number: "L1",
    summary: "Responsive customer and operations experiences delivered through a modern component architecture.",
    items: ["React", "Vite", "Responsive UI", "Role-Based Navigation"],
    tone: "clinic"
  },
  {
    label: "Application Layer",
    icon: ServerCog,
    number: "L2",
    summary: "Service orchestration, protected workflows, and business rules exposed through structured interfaces.",
    items: ["Django", "REST APIs", "Authentication", "Authorization", "Business Logic"],
    tone: "sakura"
  },
  {
    label: "Intelligence Layer",
    icon: BrainCircuit,
    number: "L3",
    summary: "Safety-aware recommendation services connect symptom signals with products available in the pharmacy catalog.",
    items: ["Symptom Analysis Engine", "Recommendation Engine", "Safety Validation Rules", "Inventory-Aware Suggestions"],
    tone: "matcha"
  },
  {
    label: "Data Layer",
    icon: Database,
    number: "L4",
    summary: "Operational records preserve product, customer, transaction, feedback, and recommendation context.",
    items: ["Products", "Orders", "Customers", "Feedback", "Recommendation Logs"],
    tone: "clinic"
  }
];

const securityControls = [
  { icon: KeyRound, title: "JWT Authentication", copy: "Signed access and refresh tokens protect authenticated API traffic." },
  { icon: ShieldCheck, title: "Role-Based Access Control", copy: "Customer, owner, and administrator capabilities remain explicitly separated." },
  { icon: LockKeyhole, title: "Protected APIs", copy: "Sensitive operations require authenticated, permission-aware requests." },
  { icon: RefreshCw, title: "Token Refresh Handling", copy: "Expired access tokens can be renewed and failed requests retried once." },
  { icon: Workflow, title: "Secure Session Management", copy: "Session failure clears local credentials and returns users to secure access." }
];

const toneClasses = {
  clinic: "border-[#a7e4e8]/28 bg-[#a7e4e8]/10 text-[#a7e4e8]",
  sakura: "border-[#ffaaa5]/28 bg-[#ffaaa5]/10 text-[#ffc2bd]",
  matcha: "border-[#d8e9cf]/28 bg-[#d8e9cf]/10 text-[#d8e9cf]"
};

function SystemArchitecture() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#081522] text-washi">
      <div className="fixed inset-0 -z-20 bg-[radial-gradient(circle_at_12%_10%,rgba(147,214,220,.18),transparent_28%),radial-gradient(circle_at_88%_16%,rgba(255,155,154,.14),transparent_27%),radial-gradient(circle_at_50%_86%,rgba(216,233,207,.08),transparent_30%),linear-gradient(150deg,#07131f_0%,#102436_44%,#192633_72%,#0b1823_100%)]" />
      <div className="fixed inset-0 -z-20 opacity-[0.045] bg-[linear-gradient(rgba(244,239,228,.8)_1px,transparent_1px),linear-gradient(90deg,rgba(244,239,228,.8)_1px,transparent_1px)] bg-[size:64px_64px]" />

      <motion.div
        animate={{ y: [0, -14, 0], rotate: [0, 5, 0] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
        className="pointer-events-none absolute right-[6%] top-40 hidden h-20 w-20 place-items-center rounded-full border border-[#a7e4e8]/20 bg-[#a7e4e8]/10 text-[#a7e4e8] shadow-[0_0_60px_rgba(147,214,220,.15)] lg:grid"
      >
        <Network className="h-8 w-8" aria-hidden="true" />
      </motion.div>
      <motion.div
        animate={{ y: [0, 12, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="pointer-events-none absolute left-[5%] top-[48rem] hidden h-16 w-16 place-items-center rounded-full border border-[#d8e9cf]/20 bg-[#d8e9cf]/10 text-[#d8e9cf] xl:grid"
      >
        <Layers3 className="h-7 w-7" aria-hidden="true" />
      </motion.div>

      <header className="mx-auto flex w-full max-w-7xl items-center justify-between px-5 py-7 sm:px-8">
        <a href="/" className="flex items-center gap-3" aria-label="AB Medical Assistance home">
          <span className="grid h-11 w-11 place-items-center rounded-[14px] border border-[#93d6dc]/30 bg-[#dff8f8]/10 shadow-[0_0_34px_rgba(147,214,220,.12)]">
            <Stethoscope className="h-5 w-5 text-[#a7e4e8]" aria-hidden="true" />
          </span>
          <span className="text-sm font-semibold uppercase tracking-[0.24em]">AB Medical</span>
        </a>
        <BackButton />
      </header>

      <section className="mx-auto w-full max-w-7xl px-5 pb-14 pt-12 sm:px-8 sm:pt-20">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65 }}
          className="max-w-4xl"
        >
          <p className="inline-flex items-center gap-2 rounded-full border border-[#a7e4e8]/25 bg-[#a7e4e8]/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#a7e4e8]">
            <Sparkles className="h-4 w-4" aria-hidden="true" />
            Platform blueprint
          </p>
          <h1 className="mt-7 text-balance text-5xl font-semibold leading-[0.98] sm:text-6xl lg:text-7xl">
            System Architecture
          </h1>
          <p className="mt-7 max-w-3xl text-base leading-8 text-washi/68 sm:text-lg">
            A layered healthcare technology platform that separates experience, operations, intelligence, and data while maintaining a continuous security boundary.
          </p>
        </motion.div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-5 pb-24 sm:px-8">
        <div className="relative">
          <div className="absolute bottom-10 left-8 top-10 hidden w-px bg-gradient-to-b from-[#a7e4e8]/0 via-[#a7e4e8]/35 to-[#ffaaa5]/0 lg:block" />
          {layers.map((layer, index) => (
            <React.Fragment key={layer.label}>
              <motion.article
                initial={{ opacity: 0, x: index % 2 ? 24 : -24 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.25 }}
                transition={{ duration: 0.58, delay: index * 0.06 }}
                className="landing-glass relative grid gap-6 p-6 sm:p-8 lg:grid-cols-[180px_1fr_1.1fr] lg:items-center"
              >
                <div className="flex items-center gap-4">
                  <span className={`grid h-14 w-14 shrink-0 place-items-center rounded-[16px] border ${toneClasses[layer.tone]}`}>
                    <layer.icon className="h-6 w-6" aria-hidden="true" />
                  </span>
                  <span className="text-sm font-black uppercase tracking-[0.18em] text-washi/35">{layer.number}</span>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#a7e4e8]">Architecture domain</p>
                  <h2 className="mt-2 text-2xl font-semibold sm:text-3xl">{layer.label}</h2>
                  <p className="mt-3 text-sm leading-7 text-washi/58">{layer.summary}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {layer.items.map((item) => (
                    <span key={item} className="rounded-full border border-washi/12 bg-washi/[0.045] px-3 py-2 text-xs font-semibold text-washi/68">
                      {item}
                    </span>
                  ))}
                </div>
              </motion.article>
              {index < layers.length - 1 ? (
                <div className="flex h-16 items-center justify-center text-[#a7e4e8]/55">
                  <ArrowDown className="h-6 w-6" aria-hidden="true" />
                </div>
              ) : null}
            </React.Fragment>
          ))}
        </div>
      </section>

      <section className="border-y border-washi/10 bg-[#102436]/55 px-5 py-20 backdrop-blur-xl sm:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#ffc2bd]">Security control plane</p>
            <h2 className="mt-3 text-3xl font-semibold sm:text-5xl">Protection across every layer.</h2>
            <p className="mt-5 text-sm leading-7 text-washi/60 sm:text-base">
              Identity, permissions, token continuity, and protected interfaces operate as shared platform services rather than isolated features.
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
            {securityControls.map((control, index) => (
              <motion.article
                key={control.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.45, delay: index * 0.05 }}
                className="landing-glass min-h-60 p-5"
              >
                <control.icon className="h-6 w-6 text-[#a7e4e8]" aria-hidden="true" />
                <h3 className="mt-8 text-lg font-semibold">{control.title}</h3>
                <p className="mt-3 text-sm leading-6 text-washi/56">{control.copy}</p>
              </motion.article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

export default SystemArchitecture;
