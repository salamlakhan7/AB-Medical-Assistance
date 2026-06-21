import React from "react";
import { motion } from "framer-motion";
import {
  Building2,
  Globe2,
  Handshake,
  Headphones,
  HeartPulse,
  MessageSquareText,
  Network,
  Radio,
  Sparkles,
  Stethoscope
} from "lucide-react";
import BackButton from "../components/BackButton.jsx";

const contactGroups = [
  {
    icon: MessageSquareText,
    title: "General Inquiries",
    copy: "Clear pathways for understanding the platform and its healthcare technology capabilities.",
    items: ["Product Information", "Partnership Requests", "Healthcare Technology Questions"],
    tone: "clinic"
  },
  {
    icon: Headphones,
    title: "Technical Support",
    copy: "Structured assistance for navigating digital pharmacy and account experiences.",
    items: ["Platform Assistance", "Account Support", "System Guidance"],
    tone: "sakura"
  },
  {
    icon: Handshake,
    title: "Business Collaboration",
    copy: "A collaboration channel for organizations advancing connected healthcare delivery.",
    items: ["Healthcare Providers", "Pharmaceutical Partners", "Technology Integrations"],
    tone: "matcha"
  }
];

const presenceItems = [
  { icon: Globe2, title: "Global Healthcare Technology Platform", copy: "Digital-first infrastructure designed for accessible, connected care experiences." },
  { icon: Building2, title: "Digital Pharmacy Operations", copy: "Operational tools that bring inventory, orders, guidance, and feedback into one environment." },
  { icon: Network, title: "Modern Healthcare Solutions", copy: "A modular platform foundation ready for responsible healthcare technology collaboration." }
];

const toneClasses = {
  clinic: "border-[#a7e4e8]/25 bg-[#a7e4e8]/10 text-[#a7e4e8]",
  sakura: "border-[#ffaaa5]/25 bg-[#ffaaa5]/10 text-[#ffc2bd]",
  matcha: "border-[#d8e9cf]/25 bg-[#d8e9cf]/10 text-[#d8e9cf]"
};

function Contact() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#081522] text-washi">
      <div className="fixed inset-0 -z-20 bg-[radial-gradient(circle_at_14%_8%,rgba(147,214,220,.19),transparent_30%),radial-gradient(circle_at_86%_20%,rgba(255,155,154,.14),transparent_28%),radial-gradient(circle_at_50%_88%,rgba(216,233,207,.08),transparent_30%),linear-gradient(145deg,#081522_0%,#102436_46%,#192633_74%,#111d27_100%)]" />
      <div className="fixed inset-0 -z-20 opacity-[0.04] bg-[linear-gradient(rgba(244,239,228,.82)_1px,transparent_1px),linear-gradient(90deg,rgba(244,239,228,.82)_1px,transparent_1px)] bg-[size:76px_76px]" />

      <motion.div
        animate={{ y: [0, -12, 0], rotate: [0, -5, 0] }}
        transition={{ duration: 8.5, repeat: Infinity, ease: "easeInOut" }}
        className="pointer-events-none absolute right-[7%] top-40 hidden h-20 w-20 place-items-center rounded-full border border-[#a7e4e8]/20 bg-[#a7e4e8]/10 text-[#a7e4e8] shadow-[0_0_60px_rgba(147,214,220,.14)] lg:grid"
      >
        <Radio className="h-8 w-8" aria-hidden="true" />
      </motion.div>
      <motion.div
        animate={{ y: [0, 14, 0] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut", delay: 1.1 }}
        className="pointer-events-none absolute left-[5%] top-[43rem] hidden h-16 w-16 place-items-center rounded-full border border-[#ffaaa5]/20 bg-[#ffaaa5]/10 text-[#ffc2bd] xl:grid"
      >
        <HeartPulse className="h-7 w-7" aria-hidden="true" />
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
          transition={{ duration: 0.65 }}
          className="max-w-5xl"
        >
          <p className="inline-flex items-center gap-2 rounded-full border border-[#ffaaa5]/25 bg-[#ffaaa5]/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#ffc2bd]">
            <Sparkles className="h-4 w-4" aria-hidden="true" />
            Connected communication
          </p>
          <h1 className="mt-7 max-w-5xl text-balance text-5xl font-semibold leading-[0.98] sm:text-6xl lg:text-7xl">
            Healthcare Technology Contact Center
          </h1>
          <p className="mt-7 max-w-3xl text-base leading-8 text-washi/68 sm:text-lg">
            Professional communication pathways for platform guidance, healthcare collaboration, and digital pharmacy technology inquiries.
          </p>
        </motion.div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-5 pb-24 sm:px-8">
        <div className="grid gap-5 lg:grid-cols-3">
          {contactGroups.map((group, index) => (
            <motion.article
              key={group.title}
              initial={{ opacity: 0, y: 26 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.52, delay: index * 0.07 }}
              whileHover={{ y: -5 }}
              className="landing-glass min-h-[420px] p-6 sm:p-7"
            >
              <span className={`grid h-14 w-14 place-items-center rounded-[16px] border ${toneClasses[group.tone]}`}>
                <group.icon className="h-6 w-6" aria-hidden="true" />
              </span>
              <h2 className="mt-8 text-2xl font-semibold">{group.title}</h2>
              <p className="mt-4 text-sm leading-7 text-washi/60">{group.copy}</p>
              <ul className="mt-8 space-y-4">
                {group.items.map((item) => (
                  <li key={item} className="flex items-center gap-3 border-t border-washi/10 pt-4 text-sm font-semibold text-washi/76">
                    <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#a7e4e8] shadow-[0_0_12px_rgba(147,214,220,.55)]" />
                    {item}
                  </li>
                ))}
              </ul>
            </motion.article>
          ))}
        </div>
      </section>

      <section className="border-y border-washi/10 bg-[#102436]/55 px-5 py-20 backdrop-blur-xl sm:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-10 lg:grid-cols-[0.72fr_1.28fr] lg:items-start">
            <div className="max-w-xl">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#a7e4e8]">Office presence</p>
              <h2 className="mt-3 text-3xl font-semibold sm:text-5xl">Digital by design. Healthcare focused.</h2>
              <p className="mt-5 text-sm leading-7 text-washi/60 sm:text-base">
                AB Medical represents a modern technology presence built around responsible pharmacy operations, accessible service, and scalable collaboration.
              </p>
            </div>
            <div className="grid gap-4">
              {presenceItems.map((item, index) => (
                <motion.article
                  key={item.title}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.48, delay: index * 0.06 }}
                  className="landing-glass grid gap-4 p-5 sm:grid-cols-[56px_1fr] sm:items-center sm:p-6"
                >
                  <span className="grid h-12 w-12 place-items-center rounded-[14px] border border-[#a7e4e8]/25 bg-[#a7e4e8]/10 text-[#a7e4e8]">
                    <item.icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <div>
                    <h3 className="text-lg font-semibold">{item.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-washi/56">{item.copy}</p>
                  </div>
                </motion.article>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default Contact;
