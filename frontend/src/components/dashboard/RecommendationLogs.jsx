import React from "react";
import { motion } from "framer-motion";

function formatDate(value) {
  return new Date(value).toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });
}

function RecommendationLogs({ analytics, isLoading, error }) {
  const recentRecommendations = analytics?.recent_recommendations || [];
  const topProducts = analytics?.most_recommended_products || [];
  const topCategories = analytics?.most_common_symptom_categories || [];
  const emergencies = analytics?.recent_emergency_sessions || [];

  return (
    <motion.article
      id="ai-recommendation-logs"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.55 }}
      className="dashboard-glass overflow-hidden"
    >
      <div className="border-b border-sakura/10 bg-sakura/[0.025] p-6">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-sakura">AI Logs</p>
        <h2 className="mt-2 text-xl font-semibold">Recommendation Activity</h2>
      </div>

      <div className="grid gap-3 border-b border-sakura/10 p-5 sm:grid-cols-2">
        <div className="border border-sakura/15 bg-sakura/10 p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-sakura/75">
            Recommendations
          </p>
          <p className="mt-2 text-3xl font-semibold text-washi">
            {isLoading ? "..." : analytics?.total_recommendations || 0}
          </p>
        </div>
        <div className="border border-koi/20 bg-koi/10 p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-koi/80">
            Emergency Blocks
          </p>
          <p className="mt-2 text-3xl font-semibold text-washi">
            {isLoading ? "..." : analytics?.total_emergency_blocks || 0}
          </p>
        </div>
      </div>

      {error ? (
        <div className="border-b border-koi/20 bg-koi/10 p-4 text-sm text-koi">
          {error}
        </div>
      ) : null}

      <div className="grid gap-4 border-b border-sakura/10 p-5 lg:grid-cols-2">
        <div>
          <p className="mb-3 text-sm font-semibold text-washi">Top recommended products</p>
          <div className="space-y-2">
            {isLoading ? (
              <div className="border border-washi/10 bg-[#102033]/55 p-3 text-sm text-washi/60">
                Loading products...
              </div>
            ) : topProducts.length ? topProducts.map((product) => (
              <div key={`${product.product_id}-${product.product_name_snapshot}`} className="flex items-center justify-between border border-washi/10 bg-[#102033]/55 p-3">
                <span className="text-sm text-washi/72">{product.product_name_snapshot}</span>
                <span className="text-sm font-semibold text-clinic">{product.count}</span>
              </div>
            )) : (
              <div className="border border-washi/10 bg-[#102033]/55 p-3 text-sm text-washi/60">
                No recommended products yet.
              </div>
            )}
          </div>
        </div>

        <div>
          <p className="mb-3 text-sm font-semibold text-washi">Common symptom categories</p>
          <div className="space-y-2">
            {isLoading ? (
              <div className="border border-washi/10 bg-[#102033]/55 p-3 text-sm text-washi/60">
                Loading categories...
              </div>
            ) : topCategories.length ? topCategories.map((category) => (
              <div key={category.matched_category_id} className="flex items-center justify-between border border-washi/10 bg-[#102033]/55 p-3">
                <span className="text-sm text-washi/72">{category.matched_category__name}</span>
                <span className="text-sm font-semibold text-sakura">{category.count}</span>
              </div>
            )) : (
              <div className="border border-washi/10 bg-[#102033]/55 p-3 text-sm text-washi/60">
                No matched categories yet.
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[620px] text-left text-sm">
          <thead className="border-b border-sakura/10 bg-[#1b2030]/42 text-xs uppercase tracking-[0.16em] text-sakura/58">
            <tr>
              <th className="px-5 py-4 font-medium">Symptom Searched</th>
              <th className="px-5 py-4 font-medium">Medicine Recommended</th>
              <th className="px-5 py-4 font-medium">Category</th>
              <th className="px-5 py-4 font-medium">Time</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td className="px-5 py-5 text-washi/60" colSpan="4">
                  Loading recommendation activity...
                </td>
              </tr>
            ) : recentRecommendations.length ? recentRecommendations.map((log) => (
              <tr key={log.id} className="border-b border-washi/10 transition hover:bg-sakura/[0.055]">
                <td className="px-5 py-4 text-washi/72">{log.symptoms}</td>
                <td className="px-5 py-4 font-semibold text-washi">
                  {log.recommended_products.length ? log.recommended_products.join(", ") : "No product"}
                </td>
                <td className="px-5 py-4 text-clinic">{log.matched_category || log.status}</td>
                <td className="px-5 py-4 text-washi/55">{formatDate(log.created_at)}</td>
              </tr>
            )) : (
              <tr>
                <td className="px-5 py-5 text-washi/60" colSpan="4">
                  No recommendation activity yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="border-t border-sakura/10 p-5">
        <p className="mb-3 text-sm font-semibold text-washi">Recent emergency sessions</p>
        <div className="space-y-2">
          {isLoading ? (
            <div className="border border-koi/20 bg-koi/10 p-3 text-sm text-washi/60">
              Loading emergency sessions...
            </div>
          ) : emergencies.length ? emergencies.map((session) => (
            <div key={session.id} className="border border-koi/25 bg-koi/10 p-3">
              <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
                <p className="text-sm font-semibold text-washi">{session.symptoms}</p>
                <span className="text-xs text-koi">{formatDate(session.created_at)}</span>
              </div>
              <p className="mt-2 text-xs text-washi/60">{session.emergency_reason}</p>
            </div>
          )) : (
            <div className="border border-washi/10 bg-[#102033]/55 p-3 text-sm text-washi/60">
              No emergency blocks yet.
            </div>
          )}
        </div>
      </div>
    </motion.article>
  );
}

export default RecommendationLogs;
