import React from "react";
import { motion } from "framer-motion";
import { MessageSquareText } from "lucide-react";

function FeedbackPanel({ feedback, isLoading, error }) {
  return (
    <motion.article
      id="feedback"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.55, delay: 0.08 }}
      className="dashboard-glass p-6"
    >
      <div className="flex items-center gap-3">
        <span className="grid h-11 w-11 place-items-center border border-clinic/35 bg-clinic/10 text-clinic shadow-[0_0_26px_rgba(141,248,255,.12)]">
          <MessageSquareText className="h-5 w-5" aria-hidden="true" />
        </span>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-clinic">Feedback</p>
          <h2 className="mt-1 text-xl font-semibold">Recent Customers</h2>
        </div>
      </div>

      <div className="mt-6 space-y-3">
        {isLoading ? (
          <div className="border border-clinic/10 bg-[#102033]/55 p-4 text-sm text-washi/60">
            Loading feedback...
          </div>
        ) : error ? (
          <div className="border border-koi/30 bg-koi/10 p-4 text-sm text-koi">
            {error}
          </div>
        ) : feedback.length ? feedback.map((item) => (
          <div key={item.id} className="border border-clinic/10 bg-[#102033]/55 p-4 shadow-[inset_0_1px_0_rgba(244,239,228,.05)] transition hover:border-clinic/35 hover:bg-clinic/[0.045]">
            <div className="flex items-center justify-between gap-4">
              <p className="font-semibold">{item.username || "Customer"}</p>
              <span className="border border-clinic/30 bg-clinic/10 px-2 py-1 text-xs text-clinic">
                {item.rating}.0
              </span>
            </div>
            <p className="mt-2 text-xs text-clinic/70">{item.product_name || "Product"}</p>
            <p className="mt-3 text-sm leading-6 text-washi/60">{item.comment || "No written comment."}</p>
          </div>
        )) : (
          <div className="border border-clinic/10 bg-[#102033]/55 p-4 text-sm text-washi/60">
            No feedback has been submitted yet.
          </div>
        )}
      </div>
    </motion.article>
  );
}

export default FeedbackPanel;
