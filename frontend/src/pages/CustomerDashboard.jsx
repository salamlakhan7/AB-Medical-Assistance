import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  Bot,
  BrainCircuit,
  ClipboardList,
  LogOut,
  PackageCheck,
  Pill,
  ReceiptText,
  ShoppingCart,
  Sparkles,
  Stethoscope
} from "lucide-react";
import CustomerNav from "../components/customer/CustomerNav.jsx";
import { authFetch, getAuthHeaders, getCurrentUser } from "../auth.js";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://ab-medical-assistance-production.up.railway.app/api";

function formatDate(value) {
  if (!value) return "Recent";

  return new Date(value).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric"
  });
}

function formatStatus(status) {
  return (status || "pending")
    .replace(/_/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function statusClass(status) {
  if (status === "cancelled") return "border-[#ffaaa5]/30 bg-[#ffaaa5]/10 text-[#ffc2bd]";
  if (status === "fulfilled") return "border-[#d8e9cf]/25 bg-[#d8e9cf]/10 text-[#d8e9cf]";
  if (status === "processing") return "border-[#ffaaa5]/25 bg-[#ffaaa5]/10 text-[#ffc2bd]";
  return "border-[#a7e4e8]/25 bg-[#a7e4e8]/10 text-[#a7e4e8]";
}

function QuickAction({ href, icon: Icon, label, copy, tone = "cyan" }) {
  const toneClass =
    tone === "coral"
      ? "border-[#ffaaa5]/30 bg-[#ffaaa5]/10 text-[#ffc2bd]"
      : tone === "sage"
        ? "border-[#d8e9cf]/25 bg-[#d8e9cf]/10 text-[#d8e9cf]"
        : "border-[#a7e4e8]/30 bg-[#a7e4e8]/10 text-[#a7e4e8]";

  return (
    <a href={href} className="landing-glass block p-5 transition hover:-translate-y-1 hover:border-[#a7e4e8]/30">
      <span className={`grid h-11 w-11 place-items-center rounded-[14px] border ${toneClass}`}>
        <Icon className="h-5 w-5" aria-hidden="true" />
      </span>
      <p className="mt-5 text-lg font-semibold text-washi">{label}</p>
      <p className="mt-2 text-sm leading-6 text-washi/58">{copy}</p>
    </a>
  );
}

function MetricTile({ icon: Icon, label, value, tone = "cyan" }) {
  const textClass = tone === "coral" ? "text-[#ffc2bd]" : tone === "sage" ? "text-[#d8e9cf]" : "text-[#a7e4e8]";

  return (
    <div className="landing-glass p-5">
      <p className={`flex items-center gap-2 text-sm font-semibold ${textClass}`}>
        <Icon className="h-4 w-4" aria-hidden="true" />
        {label}
      </p>
      <p className="mt-3 text-4xl font-semibold text-washi">{value}</p>
    </div>
  );
}

function CustomerDashboard() {
  const user = getCurrentUser();
  const [cart, setCart] = useState(null);
  const [orders, setOrders] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    async function loadDashboard() {
      try {
        setIsLoading(true);
        setError("");

        const [cartResponse, ordersResponse, recommendationsResponse] = await Promise.all([
          authFetch(`${API_BASE_URL}/cart/`, { headers: getAuthHeaders(), signal: controller.signal }),
          authFetch(`${API_BASE_URL}/orders/`, { headers: getAuthHeaders(), signal: controller.signal }),
          authFetch(`${API_BASE_URL}/recommendations/`, { headers: getAuthHeaders(), signal: controller.signal })
        ]);

        if (!cartResponse.ok || !ordersResponse.ok || !recommendationsResponse.ok) {
          throw new Error("Unable to load your dashboard data.");
        }

        const [cartData, orderData, recommendationData] = await Promise.all([
          cartResponse.json(),
          ordersResponse.json(),
          recommendationsResponse.json()
        ]);

        setCart(cartData);
        setOrders(Array.isArray(orderData) ? orderData : []);
        setRecommendations(Array.isArray(recommendationData) ? recommendationData : []);
      } catch (requestError) {
        if (requestError.name !== "AbortError") {
          setError(requestError.message || "Unable to load your dashboard data.");
        }
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    }

    loadDashboard();

    return () => controller.abort();
  }, []);

  const cartItemCount = useMemo(
    () => (cart?.items || []).reduce((sum, item) => sum + Number(item.quantity || 0), 0),
    [cart]
  );
  const recentOrders = orders.slice(0, 5);
  const recentRecommendations = recommendations.slice(0, 5);

  return (
    <main className="min-h-screen overflow-hidden bg-[#081522] text-washi">
      <div className="fixed inset-0 -z-20 bg-[radial-gradient(circle_at_16%_10%,rgba(147,214,220,0.2),transparent_30%),radial-gradient(circle_at_86%_18%,rgba(255,155,154,0.15),transparent_28%),radial-gradient(circle_at_50%_92%,rgba(244,239,228,0.08),transparent_34%),linear-gradient(135deg,#0a1826_0%,#102436_46%,#192633_76%,#1a242a_100%)]" />
      <div className="fixed inset-0 -z-20 bg-[radial-gradient(circle_at_50%_0%,rgba(244,239,228,0.1),transparent_36%)]" />
      <div className="fixed inset-0 -z-20 opacity-[0.04] bg-[linear-gradient(rgba(244,239,228,0.82)_1px,transparent_1px),linear-gradient(90deg,rgba(244,239,228,0.82)_1px,transparent_1px)] bg-[size:76px_76px]" />

      <header className="relative z-10 mx-auto flex w-full max-w-7xl items-center justify-between px-5 py-7 sm:px-8">
        <a href="/" className="flex items-center gap-3" aria-label="AB Medical Assistance">
          <span className="grid h-11 w-11 place-items-center rounded-[14px] border border-[#93d6dc]/30 bg-[#dff8f8]/10 shadow-[0_0_34px_rgba(147,214,220,.12)] backdrop-blur">
            <Stethoscope className="h-5 w-5 text-[#a7e4e8]" aria-hidden="true" />
          </span>
          <span className="text-sm font-semibold uppercase tracking-[0.24em] text-washi/90">
            AB Medical
          </span>
        </a>
        <CustomerNav />
      </header>

      <section className="mx-auto w-full max-w-7xl px-5 pb-20 pt-6 sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, ease: "easeOut" }}
          className="mb-8"
        >
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#ffaaa5]/30 bg-[#ffaaa5]/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#ffc2bd] shadow-[0_0_30px_rgba(255,155,154,.1)] backdrop-blur">
            <Sparkles className="h-4 w-4" aria-hidden="true" />
            Customer workspace
          </div>
          <div className="landing-glass p-6 sm:p-8">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#a7e4e8]">
              Welcome back
            </p>
            <h1 className="mt-3 text-balance text-4xl font-semibold leading-tight text-washi sm:text-5xl">
              {user?.username || "Customer"}
            </h1>
            <p className="mt-5 max-w-3xl text-sm leading-7 text-washi/64 sm:text-base">
              Continue shopping, review your active cart, revisit AI medicine guidance, and track your orders from one calm customer hub.
            </p>
          </div>
        </motion.div>

        {error ? (
          <div className="mb-6 landing-glass border-[#ffaaa5]/25 bg-[#ffaaa5]/10 p-5 text-sm leading-7 text-[#ffc2bd]">
            {error}
          </div>
        ) : null}

        <div className="mb-7 grid gap-4 md:grid-cols-3">
          <MetricTile icon={ShoppingCart} label="Cart Items" value={isLoading ? "..." : cartItemCount} />
          <MetricTile icon={ReceiptText} label="Orders" value={isLoading ? "..." : orders.length} tone="sage" />
          <MetricTile icon={BrainCircuit} label="AI Searches" value={isLoading ? "..." : recommendations.length} tone="coral" />
        </div>

        <div className="mb-8 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          <QuickAction href="/products" icon={Pill} label="Browse Products" copy="Shop available medicines." />
          <QuickAction href="/ai-assistant" icon={Bot} label="AI Assistant" copy="Ask for guided suggestions." tone="coral" />
          <QuickAction href="/cart" icon={ShoppingCart} label="My Cart" copy="Review checkout items." tone="sage" />
          <QuickAction href="/orders" icon={ClipboardList} label="My Orders" copy="Track order history." />
          <QuickAction href="/logout" icon={LogOut} label="Logout" copy="End this session." tone="coral" />
        </div>

        <div className="grid gap-7 xl:grid-cols-2">
          <section className="landing-glass overflow-hidden">
            <div className="border-b border-washi/10 p-5 sm:p-6">
              <h2 className="text-2xl font-semibold">Recent Orders</h2>
            </div>
            <div className="divide-y divide-washi/10">
              {isLoading ? (
                <p className="p-5 text-sm leading-7 text-washi/60">Loading orders...</p>
              ) : recentOrders.length ? (
                recentOrders.map((order) => (
                  <a key={order.id} href="/orders" className="block p-5 transition hover:bg-washi/[0.045]">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <p className="font-semibold text-washi">{order.order_number}</p>
                        <p className="mt-1 text-sm text-washi/58">{formatDate(order.created_at)}</p>
                      </div>
                      <div className="text-right">
                        <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${statusClass(order.status)}`}>
                          {formatStatus(order.status)}
                        </span>
                        <p className="mt-2 text-sm font-semibold text-washi">${Number(order.total || 0).toFixed(2)}</p>
                      </div>
                    </div>
                  </a>
                ))
              ) : (
                <p className="p-5 text-sm leading-7 text-washi/60">No orders yet.</p>
              )}
            </div>
          </section>

          <section className="landing-glass overflow-hidden">
            <div className="border-b border-washi/10 p-5 sm:p-6">
              <h2 className="text-2xl font-semibold">Recent Recommendations</h2>
            </div>
            <div className="divide-y divide-washi/10">
              {isLoading ? (
                <p className="p-5 text-sm leading-7 text-washi/60">Loading recommendations...</p>
              ) : recentRecommendations.length ? (
                recentRecommendations.map((session) => (
                  <a key={session.id} href="/ai-assistant" className="block p-5 transition hover:bg-washi/[0.045]">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="line-clamp-2 font-semibold text-washi">
                          {session.input_text || "Symptom review"}
                        </p>
                        <p className="mt-2 text-sm text-washi/58">{formatDate(session.created_at)}</p>
                      </div>
                      <span className={`shrink-0 rounded-full border px-3 py-1 text-xs font-semibold ${statusClass(session.status)}`}>
                        {formatStatus(session.status)}
                      </span>
                    </div>
                  </a>
                ))
              ) : (
                <p className="p-5 text-sm leading-7 text-washi/60">No recommendation history yet.</p>
              )}
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}

export default CustomerDashboard;
