import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, BadgeCheck, CreditCard } from "lucide-react";

function OrderSummaryPanel({
  subtotal,
  serviceFee,
  total,
  onClearCart,
  canClearCart,
  onCheckout,
  isCheckingOut
}) {
  return (
    <motion.aside
      initial={{ opacity: 0, x: 24 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.55, ease: "easeOut" }}
      className="landing-glass p-5 sm:p-6 xl:sticky xl:top-6"
    >
      <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#d8e9cf]/25 bg-[#d8e9cf]/10 px-3 py-2 text-xs font-semibold text-[#d8e9cf]">
        <BadgeCheck className="h-4 w-4" aria-hidden="true" />
        Pharmacist-ready order
      </div>

      <h2 className="text-2xl font-semibold text-washi">Order Summary</h2>
      <div className="mt-6 space-y-4 text-sm">
        <div className="flex items-center justify-between border-b border-washi/10 pb-4 text-washi/62">
          <span>Subtotal</span>
          <span className="font-semibold text-washi">${subtotal.toFixed(2)}</span>
        </div>
        <div className="flex items-center justify-between border-b border-washi/10 pb-4 text-washi/62">
          <span>Service fee</span>
          <span className="font-semibold text-washi">${serviceFee.toFixed(2)}</span>
        </div>
        <div className="flex items-center justify-between text-base text-washi">
          <span>Estimated total</span>
          <span className="text-3xl font-semibold">${total.toFixed(2)}</span>
        </div>
      </div>

      <button
        type="button"
        onClick={onCheckout}
        disabled={!canClearCart || isCheckingOut}
        className="group mt-7 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full border border-[#a7e4e8]/40 bg-[#dff8f8] px-5 py-3 text-sm font-bold text-[#0d1b26] shadow-[0_18px_45px_rgba(147,214,220,.14)] transition hover:bg-washi"
      >
        <CreditCard className="h-4 w-4" aria-hidden="true" />
        {isCheckingOut ? "Creating Order..." : "Continue Checkout"}
        <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" aria-hidden="true" />
      </button>

      {canClearCart ? (
        <button
          type="button"
          onClick={onClearCart}
          className="mt-3 inline-flex min-h-11 w-full items-center justify-center rounded-full border border-[#ffaaa5]/30 bg-[#ffaaa5]/10 px-5 py-2 text-sm font-semibold text-[#ffc2bd] transition hover:bg-[#ffaaa5]/15"
        >
          Clear Cart
        </button>
      ) : null}

      <p className="mt-4 text-center text-xs leading-5 text-washi/50">
        Final approval may depend on store verification and prescription requirements.
      </p>
    </motion.aside>
  );
}

export default OrderSummaryPanel;
