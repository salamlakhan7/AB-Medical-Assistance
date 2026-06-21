import React from "react";
import { motion } from "framer-motion";
import {
  BarChart3,
  Boxes,
  BrainCircuit,
  ClipboardCheck,
  HeartPulse,
  MessageSquareText,
  PackageCheck,
  ShieldCheck,
  Sparkles,
  Stethoscope
} from "lucide-react";
import BackButton from "../components/BackButton.jsx";

const services = [
  {
    number: "01",
    icon: BrainCircuit,
    title: "AI-Guided Symptom Assessment",
    copy: "Structured symptom intake connects customers with inventory-aware medicine guidance while preserving clear emergency escalation boundaries.",
    detail: "Guided analysis / Safety-first outcomes",
    tone: "clinic"
  },
  {
    number: "02",
    icon: Boxes,
    title: "Smart Pharmaceutical Inventory",
    copy: "Real-time product availability, stock thresholds, and prescription indicators give pharmacy teams a reliable operational view.",
    detail: "Live stock / Product intelligence",
    tone: "matcha"
  },
  {
    number: "03",
    icon: PackageCheck,
    title: "Secure Order Processing",
    copy: "A controlled cart-to-order workflow preserves product snapshots, delivery information, stock validation, and fulfillment status.",
    detail: "Verified checkout / Traceable orders",
    tone: "sakura"
  },
  {
    number: "04",
    icon: BarChart3,
    title: "Pharmacy Operations Dashboard",
    copy: "Owners receive focused analytics for products, orders, inventory health, recommendations, and customer feedback in one workspace.",
    detail: "Operational clarity / Role protection",
    tone: "clinic"
  },
  {
    number: "05",
    icon: MessageSquareText,
    title: "Clinical Feedback Ecosystem",
    copy: "Verified purchase feedback creates a transparent loop between customers, products, and pharmacy decision-making.",
    detail: "Purchase-aware reviews / Service insight",
    tone: "matcha"
  }
];

const toneClasses = {
  clinic: "border-[#a7e4e8]/25 bg-[#a7e4e8]/10 text-[#a7e4e8]",
  matcha: "border-[#d8e9cf]/25 bg-[#d8e9cf]/10 text-[#d8e9cf]",
  sakura: "border-[#ffaaa5]/25 bg-[#ffaaa5]/10 text-[#ffc2bd]"
};

function Services() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#081522] text-washi">
      <div className="fixed inset-0 -z-20 bg-[radial-gradient(circle_at_16%_8%,rgba(147,214,220,0.19),transparent_30%),radial-gradient(circle_at_86%_18%,rgba(255,155,154,0.14),transparent_27%),linear-gradient(145deg,#081522_0%,#102436_48%,#192633_76%,#111d27_100%)]" />
      <div className="fixed inset-0 -z-20 opacity-[0.04] bg-[linear-gradient(rgba(244,239,228,.8)_1px,transparent_1px),linear-gradient(90deg,rgba(244,239,228,.8)_1px,transparent_1px)] bg-[size:76px_76px]" />

      <motion.div
        animate={{ y: [0, -12, 0], rotate: [0, 4, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="pointer-events-none absolute right-[7%] top-36 hidden h-20 w-20 place-items-center rounded-full border border-[#a7e4e8]/20 bg-[#a7e4e8]/10 text-[#a7e4e8] shadow-[0_0_55px_rgba(147,214,220,.14)] lg:grid"
      >
        <HeartPulse className="h-8 w-8" aria-hidden="true" />
      </motion.div>
      <motion.div
        animate={{ y: [0, 14, 0] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut", delay: 0.8 }}
        className="pointer-events-none absolute left-[4%] top-[42rem] hidden h-16 w-16 place-items-center rounded-full border border-[#ffaaa5]/20 bg-[#ffaaa5]/10 text-[#ffc2bd] shadow-[0_0_45px_rgba(255,155,154,.12)] xl:grid"
      >
        <ClipboardCheck className="h-7 w-7" aria-hidden="true" />
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

      <section className="mx-auto w-full max-w-7xl px-5 pb-16 pt-12 sm:px-8 sm:pt-20">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, ease: "easeOut" }}
          className="max-w-4xl"
        >
          <p className="inline-flex items-center gap-2 rounded-full border border-[#ffaaa5]/25 bg-[#ffaaa5]/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#ffc2bd]">
            <Sparkles className="h-4 w-4" aria-hidden="true" />
            Connected care capabilities
          </p>
          <h1 className="mt-7 text-balance text-5xl font-semibold leading-[0.98] sm:text-6xl lg:text-7xl">
            Intelligent Healthcare Services
          </h1>
          <p className="mt-7 max-w-3xl text-base leading-8 text-washi/68 sm:text-lg">
            A coordinated digital pharmacy experience that combines customer guidance, safe commerce, and operational intelligence without losing clinical clarity.
          </p>
        </motion.div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-5 pb-24 sm:px-8">
        <div className="grid gap-5 lg:grid-cols-2">
          {services.map((service, index) => (
            <motion.article
              key={service.title}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.55, delay: index * 0.06 }}
              whileHover={{ y: -5 }}
              className={`landing-glass relative min-h-72 overflow-hidden p-6 sm:p-8 ${index === 0 ? "lg:col-span-2" : ""}`}
            >
              <div className="absolute right-6 top-5 text-6xl font-black text-washi/[0.045] sm:text-7xl">
                {service.number}
              </div>
              <span className={`grid h-14 w-14 place-items-center rounded-[16px] border ${toneClasses[service.tone]}`}>
                <service.icon className="h-6 w-6" aria-hidden="true" />
              </span>
              <h2 className="mt-8 max-w-2xl text-2xl font-semibold sm:text-3xl">{service.title}</h2>
              <p className="mt-4 max-w-3xl text-sm leading-7 text-washi/62 sm:text-base">{service.copy}</p>
              <p className="mt-8 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.15em] text-[#a7e4e8]">
                <ShieldCheck className="h-4 w-4" aria-hidden="true" />
                {service.detail}
              </p>
            </motion.article>
          ))}
        </div>
      </section>
    </main>
  );
}

export default Services;
