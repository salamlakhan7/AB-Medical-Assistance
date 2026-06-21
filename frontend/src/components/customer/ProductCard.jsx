import React from "react";
import { motion } from "framer-motion";
import { Pill, ShoppingCart, Star } from "lucide-react";

const accentClasses = {
  cyan: "from-[#a7e4e8]/20 to-[#dff8f8]/10 text-[#a7e4e8] border-[#a7e4e8]/25",
  coral: "from-[#ffaaa5]/20 to-[#ffc2bd]/10 text-[#ffc2bd] border-[#ffaaa5]/25",
  sage: "from-[#d8e9cf]/20 to-[#d8e9cf]/10 text-[#d8e9cf] border-[#d8e9cf]/25"
};

function statusClass(status) {
  if (status === "Out of Stock") return "border-washi/15 bg-washi/[0.045] text-washi/55";
  if (status === "Low Stock") return "border-[#ffaaa5]/30 bg-[#ffaaa5]/10 text-[#ffc2bd]";
  return "border-[#d8e9cf]/25 bg-[#d8e9cf]/10 text-[#d8e9cf]";
}

function ProductCard({ product, index, isSelected, onSelect, onAddToCart }) {
  const isOutOfStock = product.isOutOfStock || product.status === "Out of Stock";

  return (
    <motion.article
      initial={{ opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.45, delay: index * 0.05, ease: "easeOut" }}
      whileHover={{ y: -6 }}
      className={`landing-glass flex min-h-full flex-col overflow-hidden p-4 transition ${
        isSelected ? "border-[#a7e4e8]/35" : ""
      }`}
    >
      <button
        type="button"
        onClick={() => onSelect(product)}
        className={`mb-5 grid aspect-[4/3] w-full place-items-center overflow-hidden rounded-[20px] border bg-gradient-to-br ${accentClasses[product.accent]}`}
        aria-label={`Preview ${product.name}`}
      >
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.name}
            className="h-full w-full object-cover"
          />
        ) : (
          <Pill className="h-12 w-12" aria-hidden="true" />
        )}
      </button>

      <div className="flex flex-1 flex-col">
        <div className="mb-3 flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#a7e4e8]">
              {product.category}
            </p>
            <h3 className="mt-2 text-xl font-semibold text-washi">{product.name}</h3>
          </div>
          <span className="flex items-center gap-1 rounded-full border border-[#ffaaa5]/25 bg-[#ffaaa5]/10 px-2.5 py-1 text-xs text-[#ffc2bd]">
            <Star className="h-3.5 w-3.5 fill-current" aria-hidden="true" />
            {product.rating}
          </span>
        </div>

        <p className="text-sm leading-6 text-washi/60">{product.description}</p>

        <div className="mt-5 flex items-center justify-between gap-3">
          <p className="text-2xl font-semibold text-washi">{product.price}</p>
          <span className={`rounded-full border px-3 py-1 text-xs font-semibold ${statusClass(product.status)}`}>
            {product.status}
          </span>
        </div>
        <p className="mt-2 text-xs text-washi/45">
          {isOutOfStock ? "Unavailable for purchase" : `${product.stockQuantity} unit${product.stockQuantity === 1 ? "" : "s"} available`}
        </p>

        <div className="mt-5 flex flex-col gap-2 sm:flex-row md:flex-col 2xl:flex-row">
          <button
            type="button"
            onClick={() => onAddToCart(product)}
            disabled={isOutOfStock}
            className="inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-full border border-[#a7e4e8]/40 bg-[#dff8f8] px-4 py-2 text-sm font-semibold text-[#0d1b26] transition hover:bg-washi disabled:cursor-not-allowed disabled:border-washi/10 disabled:bg-washi/10 disabled:text-washi/40"
          >
            <ShoppingCart className="h-4 w-4" aria-hidden="true" />
            {isOutOfStock ? "Out of Stock" : "Add to Cart"}
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

export default ProductCard;
