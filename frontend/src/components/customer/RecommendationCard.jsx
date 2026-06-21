import React from "react";
import { motion } from "framer-motion";
import { Pill, ShoppingCart } from "lucide-react";

const accentClasses = {
  cyan: "from-[#a7e4e8]/20 to-[#dff8f8]/10 text-[#a7e4e8] border-[#a7e4e8]/25",
  coral: "from-[#ffaaa5]/20 to-[#ffc2bd]/10 text-[#ffc2bd] border-[#ffaaa5]/25",
  sage: "from-[#d8e9cf]/20 to-[#d8e9cf]/10 text-[#d8e9cf] border-[#d8e9cf]/25"
};

function RecommendationCard({ medicine, index, onAddToCart }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.35 }}
      transition={{ duration: 0.5, delay: index * 0.08, ease: "easeOut" }}
      whileHover={{ y: -6 }}
      className="landing-glass flex min-h-full flex-col overflow-hidden p-4"
    >
      <div className={`mb-5 grid aspect-[4/3] place-items-center overflow-hidden rounded-[20px] border bg-gradient-to-br ${accentClasses[medicine.accent]}`}>
        {medicine.imageUrl ? (
          <img
            src={medicine.imageUrl}
            alt={medicine.name}
            className="h-full w-full object-cover"
          />
        ) : (
          <Pill className="h-12 w-12" aria-hidden="true" />
        )}
      </div>

      <div className="flex flex-1 flex-col">
        <div className="flex items-start justify-between gap-4">
          <h3 className="text-xl font-semibold text-washi">{medicine.name}</h3>
          <span className="rounded-full border border-[#a7e4e8]/25 bg-[#a7e4e8]/10 px-2.5 py-1 text-xs font-semibold text-[#a7e4e8]">
            {medicine.confidence}%
          </span>
        </div>
        {medicine.category ? (
          <p className="mt-2 text-xs font-semibold uppercase tracking-[0.16em] text-[#a7e4e8]">
            {medicine.category}
          </p>
        ) : null}
        <p className="mt-3 text-sm leading-6 text-washi/60">{medicine.purpose}</p>
        <p className="mt-4 rounded-[16px] border border-washi/10 bg-washi/[0.045] p-3 text-xs leading-5 text-washi/60">
          {medicine.dosage}
        </p>
        {medicine.reason ? (
          <p className="mt-3 rounded-[16px] border border-[#d8e9cf]/15 bg-[#d8e9cf]/10 p-3 text-xs leading-5 text-washi/65">
            {medicine.reason}
          </p>
        ) : null}

        <div className="mt-5 flex flex-col gap-2 sm:flex-row md:flex-col xl:flex-row">
          <button
            type="button"
            onClick={() => onAddToCart(medicine)}
            className="inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-full border border-[#a7e4e8]/40 bg-[#dff8f8] px-4 py-2 text-sm font-semibold text-[#0d1b26] transition hover:bg-washi"
          >
            <ShoppingCart className="h-4 w-4" aria-hidden="true" />
            Add to Cart
          </button>
          <span
            aria-hidden="true"
            className="inline-flex h-11 w-11 shrink-0 select-none items-center justify-center rounded-full border border-[#ffaaa5]/30 bg-[#ffaaa5]/10 text-xs font-black uppercase text-[#ffc2bd]"
          >
            AB
          </span>
        </div>
      </div>
    </motion.article>
  );
}

export default RecommendationCard;
