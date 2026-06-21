import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { BadgeCheck, Pill, ShieldCheck, ShoppingCart, Star } from "lucide-react";

const accentClasses = {
  cyan: "from-[#a7e4e8]/20 to-[#dff8f8]/10 text-[#a7e4e8] border-[#a7e4e8]/25",
  coral: "from-[#ffaaa5]/20 to-[#ffc2bd]/10 text-[#ffc2bd] border-[#ffaaa5]/25",
  sage: "from-[#d8e9cf]/20 to-[#d8e9cf]/10 text-[#d8e9cf] border-[#d8e9cf]/25"
};

function ProductDetailPanel({
  product,
  onAddToCart,
  feedbackData,
  feedbackForm,
  onFeedbackChange,
  onFeedbackSubmit,
  feedbackMessage,
  canSubmitFeedback
}) {
  const averageRating = feedbackData?.average_rating;
  const feedbackCount = feedbackData?.feedback_count || 0;
  const isOutOfStock = product.isOutOfStock || product.status === "Out of Stock";

  return (
    <AnimatePresence mode="wait">
      <motion.section
        key={product.name}
        initial={{ opacity: 0, x: 24 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 12 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className="landing-glass overflow-hidden p-5 sm:p-6"
      >
        <div className="mb-5 flex items-center gap-2 rounded-full border border-[#d8e9cf]/25 bg-[#d8e9cf]/10 px-3 py-2 text-xs font-semibold text-[#d8e9cf]">
          <BadgeCheck className="h-4 w-4" aria-hidden="true" />
          Owner verified store medicine
        </div>

        <div className={`mb-5 grid aspect-[4/3] place-items-center overflow-hidden rounded-[22px] border bg-gradient-to-br ${accentClasses[product.accent]}`}>
          {product.imageUrl ? (
            <img
              src={product.imageUrl}
              alt={product.name}
              className="h-full w-full object-cover"
            />
          ) : (
            <Pill className="h-16 w-16" aria-hidden="true" />
          )}
        </div>

        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#a7e4e8]">
              {product.category}
            </p>
            <h2 className="mt-2 text-2xl font-semibold text-washi">{product.name}</h2>
          </div>
          <span className="flex items-center gap-1 rounded-full border border-[#ffaaa5]/25 bg-[#ffaaa5]/10 px-2.5 py-1 text-xs text-[#ffc2bd]">
            <Star className="h-3.5 w-3.5 fill-current" aria-hidden="true" />
            {averageRating ? averageRating.toFixed(1) : product.rating}
          </span>
        </div>

        <p className="mt-4 text-sm leading-7 text-washi/60">{product.fullDescription}</p>

        <div className="mt-5 grid gap-3">
          <div className="rounded-[18px] border border-washi/10 bg-washi/[0.045] p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#a7e4e8]">
              Dosage note
            </p>
            <p className="mt-2 text-sm leading-6 text-washi/60">{product.dosage}</p>
          </div>
          <div className="rounded-[18px] border border-[#ffaaa5]/20 bg-[#ffaaa5]/10 p-4">
            <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-[#ffc2bd]">
              <ShieldCheck className="h-4 w-4" aria-hidden="true" />
              Safety note
            </p>
            <p className="mt-2 text-sm leading-6 text-washi/60">{product.safety}</p>
          </div>
        </div>

        <div className="mt-5 rounded-[18px] border border-washi/10 bg-washi/[0.045] p-4">
          <div className="flex items-center justify-between gap-3">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#a7e4e8]">
              Customer feedback
            </p>
            <span className="text-xs text-washi/50">
              {feedbackCount} review{feedbackCount === 1 ? "" : "s"}
            </span>
          </div>

          {feedbackData?.results?.length ? (
            <div className="mt-3 space-y-3">
              {feedbackData.results.slice(0, 3).map((item) => (
                <div key={item.id} className="rounded-[16px] border border-washi/10 bg-[#102436]/55 p-3">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm font-semibold text-washi">{item.username || "Customer"}</p>
                    <span className="flex items-center gap-1 text-xs text-[#ffc2bd]">
                      <Star className="h-3.5 w-3.5 fill-current" aria-hidden="true" />
                      {item.rating}
                    </span>
                  </div>
                  {item.comment ? (
                    <p className="mt-2 text-xs leading-5 text-washi/60">{item.comment}</p>
                  ) : null}
                </div>
              ))}
            </div>
          ) : (
            <p className="mt-3 text-sm leading-6 text-washi/55">
              No customer feedback has been submitted yet.
            </p>
          )}

          {canSubmitFeedback ? (
            <form onSubmit={onFeedbackSubmit} className="mt-4 space-y-3">
              <div className="grid gap-3 sm:grid-cols-[110px_1fr] xl:grid-cols-1">
                <select
                  className="min-h-11 rounded-[16px] border border-washi/10 bg-[#102436]/70 px-3 text-sm text-washi outline-none focus:border-[#a7e4e8]/45"
                  value={feedbackForm.rating}
                  onChange={(event) => onFeedbackChange("rating", event.target.value)}
                >
                  {[5, 4, 3, 2, 1].map((rating) => (
                    <option key={rating} value={rating}>
                      {rating} stars
                    </option>
                  ))}
                </select>
                <input
                  className="min-h-11 rounded-[16px] border border-washi/10 bg-[#102436]/70 px-3 text-sm text-washi outline-none placeholder:text-washi/35 focus:border-[#a7e4e8]/45"
                  value={feedbackForm.comment}
                  onChange={(event) => onFeedbackChange("comment", event.target.value)}
                  placeholder="Share feedback after purchase"
                />
              </div>
              <button
                type="submit"
                className="inline-flex min-h-10 items-center justify-center rounded-full border border-[#d8e9cf]/30 bg-[#d8e9cf]/10 px-4 text-xs font-semibold text-[#d8e9cf] transition hover:bg-[#d8e9cf]/15"
              >
                Submit Feedback
              </button>
            </form>
          ) : null}

          {feedbackMessage ? (
            <p className="mt-3 text-xs leading-5 text-washi/60">{feedbackMessage}</p>
          ) : null}
        </div>

        <div className="mt-6 flex items-center justify-between gap-4">
          <p className="text-3xl font-semibold text-washi">{product.price}</p>
          <span className="rounded-full border border-[#d8e9cf]/25 bg-[#d8e9cf]/10 px-3 py-1 text-xs font-semibold text-[#d8e9cf]">
            {product.status}
          </span>
        </div>
        <p className="mt-2 text-xs text-washi/48">
          {isOutOfStock ? "This medicine is visible but cannot be added until restocked." : `${product.stockQuantity} unit${product.stockQuantity === 1 ? "" : "s"} available`}
        </p>

        <div className="mt-5 grid gap-2 sm:grid-cols-2 xl:grid-cols-1">
          <button
            type="button"
            onClick={() => onAddToCart(product)}
            disabled={isOutOfStock}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-[#a7e4e8]/40 bg-[#dff8f8] px-4 py-2 text-sm font-semibold text-[#0d1b26] transition hover:bg-washi disabled:cursor-not-allowed disabled:border-washi/10 disabled:bg-washi/10 disabled:text-washi/40"
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
      </motion.section>
    </AnimatePresence>
  );
}

export default ProductDetailPanel;
