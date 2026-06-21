import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  CalendarDays,
  HeartHandshake,
  PackageCheck,
  ReceiptText,
  ShieldCheck,
  Sparkles,
  Stethoscope
} from "lucide-react";
import CustomerNav from "../components/customer/CustomerNav.jsx";
import { authFetch, getAuthHeaders } from "../auth.js";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "/api";

function formatStatus(status) {
  return status.replace(/_/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function statusClass(status) {
  if (status === "cancelled") return "border-[#ffaaa5]/30 bg-[#ffaaa5]/10 text-[#ffc2bd]";
  if (status === "fulfilled") return "border-[#d8e9cf]/25 bg-[#d8e9cf]/10 text-[#d8e9cf]";
  if (status === "processing") return "border-[#ffaaa5]/25 bg-[#ffaaa5]/10 text-[#ffc2bd]";
  return "border-[#a7e4e8]/25 bg-[#a7e4e8]/10 text-[#a7e4e8]";
}

function formatDate(value) {
  return new Date(value).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric"
  });
}

function CustomerOrders() {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDetailLoading, setIsDetailLoading] = useState(false);
  const [error, setError] = useState("");

  async function loadOrders(signal) {
    try {
      setIsLoading(true);
      setError("");
      const response = await authFetch(`${API_BASE_URL}/orders/`, {
        headers: getAuthHeaders(),
        signal
      });

      if (!response.ok) {
        throw new Error("Unable to load your orders.");
      }

      const orderData = await response.json();
      setOrders(orderData);
      setSelectedOrder(orderData[0] || null);
    } catch (requestError) {
      if (requestError.name !== "AbortError") {
        setError(requestError.message || "Unable to load your orders.");
      }
    } finally {
      if (!signal?.aborted) {
        setIsLoading(false);
      }
    }
  }

  useEffect(() => {
    const controller = new AbortController();
    loadOrders(controller.signal);

    return () => controller.abort();
  }, []);

  async function viewOrderDetail(order) {
    try {
      setIsDetailLoading(true);
      setError("");
      const response = await authFetch(`${API_BASE_URL}/orders/${order.id}/`, {
        headers: getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error("Unable to load order details.");
      }

      setSelectedOrder(await response.json());
    } catch (requestError) {
      setError(requestError.message || "Unable to load order details.");
    } finally {
      setIsDetailLoading(false);
    }
  }

  const totals = useMemo(
    () => ({
      count: orders.length,
      spend: orders.reduce((sum, order) => sum + Number(order.total || 0), 0)
    }),
    [orders]
  );

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
          className="mb-8 max-w-4xl"
        >
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#ffaaa5]/30 bg-[#ffaaa5]/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#ffc2bd] shadow-[0_0_30px_rgba(255,155,154,.1)] backdrop-blur">
            <Sparkles className="h-4 w-4" aria-hidden="true" />
            Pharmacy order history
          </div>
          <h1 className="text-balance text-5xl font-semibold leading-[0.98] text-washi sm:text-6xl lg:text-7xl">
            Your Orders
          </h1>
          <p className="mt-6 max-w-3xl text-base leading-8 text-washi/70 sm:text-lg">
            Review previous medicine orders, fulfillment status, totals, and
            item snapshots from your completed checkouts.
          </p>
        </motion.div>

        <div className="mb-7 grid gap-4 md:grid-cols-2">
          <div className="landing-glass p-5">
            <p className="flex items-center gap-2 text-sm font-semibold text-[#a7e4e8]">
              <ReceiptText className="h-4 w-4" aria-hidden="true" />
              Total Orders
            </p>
            <p className="mt-3 text-4xl font-semibold">{totals.count}</p>
          </div>
          <div className="landing-glass p-5">
            <p className="flex items-center gap-2 text-sm font-semibold text-[#d8e9cf]">
              <PackageCheck className="h-4 w-4" aria-hidden="true" />
              Order Value
            </p>
            <p className="mt-3 text-4xl font-semibold">${totals.spend.toFixed(2)}</p>
          </div>
        </div>

        {error ? (
          <div className="mb-5 landing-glass border-[#ffaaa5]/25 bg-[#ffaaa5]/10 p-5 text-sm leading-7 text-[#ffc2bd]">
            {error}
          </div>
        ) : null}

        <div className="grid gap-7 xl:grid-cols-[1fr_380px]">
          <section className="min-w-0">
            <div className="landing-glass overflow-hidden">
              <div className="border-b border-washi/10 p-5 sm:p-6">
                <h2 className="text-2xl font-semibold">Order History</h2>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full min-w-[760px] text-left text-sm">
                  <thead className="border-b border-washi/10 bg-washi/[0.035] text-xs uppercase tracking-[0.16em] text-[#a7e4e8]/75">
                    <tr>
                      <th className="px-5 py-4 font-medium">Order</th>
                      <th className="px-5 py-4 font-medium">Date</th>
                      <th className="px-5 py-4 font-medium">Status</th>
                      <th className="px-5 py-4 font-medium">Total</th>
                      <th className="px-5 py-4 font-medium">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {isLoading ? (
                      <tr>
                        <td colSpan="5" className="px-5 py-6 text-washi/60">
                          Loading your orders...
                        </td>
                      </tr>
                    ) : orders.length ? (
                      orders.map((order) => (
                        <tr key={order.id} className="border-b border-washi/10 transition hover:bg-washi/[0.045]">
                          <td className="px-5 py-4 font-semibold text-washi">{order.order_number}</td>
                          <td className="px-5 py-4 text-washi/64">
                            <span className="inline-flex items-center gap-2">
                              <CalendarDays className="h-4 w-4 text-[#a7e4e8]" aria-hidden="true" />
                              {formatDate(order.created_at)}
                            </span>
                          </td>
                          <td className="px-5 py-4">
                            <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${statusClass(order.status)}`}>
                              {formatStatus(order.status)}
                            </span>
                          </td>
                          <td className="px-5 py-4 font-semibold text-washi">
                            ${Number(order.total || 0).toFixed(2)}
                          </td>
                          <td className="px-5 py-4">
                            <button
                              type="button"
                              onClick={() => viewOrderDetail(order)}
                              className="inline-flex min-h-10 items-center justify-center rounded-full border border-[#a7e4e8]/35 bg-[#a7e4e8]/10 px-4 text-xs font-semibold text-[#a7e4e8] transition hover:bg-[#a7e4e8]/15"
                            >
                              View Detail
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="5" className="px-5 py-6 text-washi/60">
                          No orders yet.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          <aside className="xl:sticky xl:top-6 xl:h-fit">
            <div className="landing-glass p-5 sm:p-6">
              <div className="mb-5 flex items-center justify-between gap-3">
                <h2 className="text-2xl font-semibold">Order Detail</h2>
                <ReceiptText className="h-5 w-5 text-[#a7e4e8]" aria-hidden="true" />
              </div>

              {isDetailLoading ? (
                <p className="text-sm leading-7 text-washi/60">Loading order detail...</p>
              ) : selectedOrder ? (
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#a7e4e8]">
                    {selectedOrder.order_number}
                  </p>
                  <div className="mt-4 flex flex-wrap items-center gap-2">
                    <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${statusClass(selectedOrder.status)}`}>
                      {formatStatus(selectedOrder.status)}
                    </span>
                    <span className="rounded-full border border-washi/10 bg-washi/[0.045] px-3 py-1 text-xs text-washi/60">
                      {formatDate(selectedOrder.created_at)}
                    </span>
                  </div>

                  <div className="mt-6 space-y-3">
                    {(selectedOrder.items || []).map((item) => (
                      <div
                        key={item.id}
                        className="rounded-[18px] border border-washi/10 bg-washi/[0.045] p-4"
                      >
                        <p className="font-semibold text-washi">{item.product_name_snapshot}</p>
                        <p className="mt-2 text-sm text-washi/60">
                          Qty {item.quantity} × ${Number(item.unit_price_snapshot || 0).toFixed(2)}
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 space-y-3 border-t border-washi/10 pt-5 text-sm">
                    <div className="flex justify-between text-washi/62">
                      <span>Subtotal</span>
                      <span>${Number(selectedOrder.subtotal || 0).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-washi/62">
                      <span>Service fee</span>
                      <span>${Number(selectedOrder.service_fee || 0).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-base font-semibold text-washi">
                      <span>Total</span>
                      <span>${Number(selectedOrder.total || 0).toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-sm leading-7 text-washi/60">
                  Select an order to view item details.
                </p>
              )}
            </div>

            <div className="mt-5 landing-glass p-5">
              <div className="flex items-start gap-4">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-[14px] border border-[#d8e9cf]/25 bg-[#d8e9cf]/10 text-[#d8e9cf]">
                  <ShieldCheck className="h-5 w-5" aria-hidden="true" />
                </span>
                <p className="text-sm leading-7 text-washi/60">
                  Order records preserve checkout snapshots for review and pharmacy verification.
                </p>
              </div>
            </div>
          </aside>
        </div>

        <a
          href="/cart"
          className="mt-8 inline-flex min-h-11 items-center gap-2 rounded-full border border-washi/15 bg-washi/[0.055] px-5 text-sm font-semibold text-washi/70 transition hover:border-[#a7e4e8]/35 hover:text-[#a7e4e8]"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Back to Cart
        </a>

        <footer className="mt-8 border-t border-washi/10 pt-8 text-sm text-washi/55">
          <p className="flex items-center gap-2">
            <HeartHandshake className="h-4 w-4 text-[#a7e4e8]" aria-hidden="true" />
            AB Medical Assistance order records
          </p>
        </footer>
      </section>
    </main>
  );
}

export default CustomerOrders;
