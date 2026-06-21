import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, ShoppingCart } from "lucide-react";

function EmptyCartState() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.55, ease: "easeOut" }}
      className="landing-glass p-6 sm:p-8"
    >
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-4">
          <span className="grid h-14 w-14 shrink-0 place-items-center rounded-[18px] border border-[#a7e4e8]/25 bg-[#dff8f8]/10 text-[#a7e4e8]">
            <ShoppingCart className="h-6 w-6" aria-hidden="true" />
          </span>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#a7e4e8]">
              Empty cart preview
            </p>
            <h2 className="mt-2 text-2xl font-semibold text-washi">Your cart is ready when you are.</h2>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-washi/60">
              Browse verified medicines, review guidance notes, and return here
              for a clear checkout flow when your cart has items.
            </p>
          </div>
        </div>

        <a
          href="/products"
          className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-full border border-[#a7e4e8]/40 bg-[#dff8f8] px-5 py-2 text-sm font-bold text-[#0d1b26] transition hover:bg-washi"
        >
          Browse catalog
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </a>
      </div>
    </motion.section>
  );
}

export default EmptyCartState;
