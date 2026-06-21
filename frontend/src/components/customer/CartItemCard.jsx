import React from "react";
import { motion } from "framer-motion";
import { Minus, Pill, Plus, ShieldCheck, Trash2 } from "lucide-react";

const accentClasses = {
  cyan: "from-[#a7e4e8]/20 to-[#dff8f8]/10 text-[#a7e4e8] border-[#a7e4e8]/25",
  coral: "from-[#ffaaa5]/20 to-[#ffc2bd]/10 text-[#ffc2bd] border-[#ffaaa5]/25",
  sage: "from-[#d8e9cf]/20 to-[#d8e9cf]/10 text-[#d8e9cf] border-[#d8e9cf]/25"
};

function statusClass(status) {
  if (status === "Low Stock") return "border-[#ffaaa5]/30 bg-[#ffaaa5]/10 text-[#ffc2bd]";
  return "border-[#d8e9cf]/25 bg-[#d8e9cf]/10 text-[#d8e9cf]";
}

function CartItemCard({ item, index, onIncrease, onDecrease, onRemove }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 22 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: index * 0.06, ease: "easeOut" }}
      whileHover={{ y: -4 }}
      className="landing-glass p-4 sm:p-5"
    >
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
        <div
          className={`grid h-24 w-full shrink-0 place-items-center rounded-[20px] border bg-gradient-to-br sm:w-24 ${accentClasses[item.accent]}`}
        >
          <Pill className="h-10 w-10" aria-hidden="true" />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-col justify-between gap-3 lg:flex-row lg:items-start">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#a7e4e8]">
                {item.category}
              </p>
              <h3 className="mt-2 text-xl font-semibold text-washi">{item.name}</h3>
            </div>
            <div className="flex flex-wrap items-center gap-2">
                <span className={`rounded-full border px-3 py-1 text-xs font-semibold ${statusClass(item.status)}`}>
                  {item.status}
                </span>
              <span className="rounded-full border border-washi/10 bg-washi/[0.045] px-3 py-1 text-xs font-semibold text-washi/52">
                {item.availableStock} available
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-[#ffaaa5]/25 bg-[#ffaaa5]/10 px-3 py-1 text-xs font-semibold text-[#ffc2bd]">
                <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" />
                {item.safetyBadge}
              </span>
            </div>
          </div>

          <div className="mt-5 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <p className="text-2xl font-semibold text-washi">${item.price.toFixed(2)}</p>

            <div className="flex flex-wrap items-center gap-3">
              <div className="inline-flex h-11 items-center rounded-full border border-washi/12 bg-washi/[0.055] p-1">
                <button
                  type="button"
                  onClick={() => onDecrease(item)}
                  className="grid h-9 w-9 place-items-center rounded-full text-washi/70 transition hover:bg-washi/10 hover:text-washi"
                  aria-label={`Decrease ${item.name} quantity`}
                >
                  <Minus className="h-4 w-4" aria-hidden="true" />
                </button>
                <span className="min-w-9 text-center text-sm font-semibold text-washi">{item.quantity}</span>
                <button
                  type="button"
                  onClick={() => onIncrease(item)}
                  disabled={item.quantity >= item.availableStock}
                  className="grid h-9 w-9 place-items-center rounded-full text-washi/70 transition hover:bg-washi/10 hover:text-washi disabled:cursor-not-allowed disabled:text-washi/25"
                  aria-label={`Increase ${item.name} quantity`}
                >
                  <Plus className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>

              <button
                type="button"
                onClick={() => onRemove(item)}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-washi/12 bg-washi/[0.045] px-4 text-sm font-semibold text-washi/62 transition hover:border-[#ffaaa5]/30 hover:bg-[#ffaaa5]/10 hover:text-[#ffc2bd]"
              >
                <Trash2 className="h-4 w-4" aria-hidden="true" />
                Remove
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.article>
  );
}

export default CartItemCard;
