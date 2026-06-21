import React, { useState } from "react";
import { motion } from "framer-motion";

const statusOptions = ["pending", "processing", "fulfilled", "cancelled"];

function statusClass(status) {
  if (status === "cancelled") return "border-koi/40 bg-koi/10 text-koi";
  if (status === "fulfilled") return "border-matcha/40 bg-matcha/10 text-matcha";
  if (status === "processing") return "border-sakura/40 bg-sakura/10 text-sakura";
  return "border-clinic/35 bg-clinic/10 text-clinic";
}

function formatStatus(status) {
  return status.replace(/_/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function formatPaymentMethod(method) {
  return (method || "cash")
    .replace(/_/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function OrderTable({ orders, isLoading, error, onStatusChange }) {
  const [expandedOrderId, setExpandedOrderId] = useState(null);

  return (
    <motion.article
      id="orders"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.55 }}
      className="dashboard-glass overflow-hidden"
    >
      <div className="flex items-center justify-between gap-4 border-b border-clinic/10 bg-clinic/[0.025] p-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-clinic">
            Orders
          </p>
          <h2 className="mt-2 text-xl font-semibold text-washi">Customer Order Queue</h2>
        </div>
        <span className="hidden border border-clinic/30 bg-clinic/10 px-3 py-2 text-xs text-clinic shadow-glow sm:inline-flex">
          Owner managed
        </span>
      </div>

      {error ? (
        <div className="border-b border-koi/20 bg-koi/10 p-4 text-sm text-koi">
          {error}
        </div>
      ) : null}

      <div className="overflow-x-auto">
        <table className="w-full min-w-[820px] text-left text-sm">
          <thead className="border-b border-clinic/10 bg-[#102338]/42 text-xs uppercase tracking-[0.16em] text-clinic/55">
            <tr>
              <th className="px-5 py-4 font-medium">Order</th>
              <th className="px-5 py-4 font-medium">Customer</th>
              <th className="px-5 py-4 font-medium">Total</th>
              <th className="px-5 py-4 font-medium">Status</th>
              <th className="px-5 py-4 font-medium">Items</th>
              <th className="px-5 py-4 font-medium">Update</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td className="px-5 py-6 text-washi/60" colSpan="6">
                  Loading orders...
                </td>
              </tr>
            ) : orders.length ? (
              orders.map((order) => (
                <React.Fragment key={order.id}>
                  <tr className="border-b border-washi/10 transition hover:bg-clinic/[0.055]">
                    <td className="px-5 py-4">
                      <p className="font-semibold text-washi">{order.order_number}</p>
                      <p className="mt-1 text-xs text-washi/45">
                        {new Date(order.created_at).toLocaleDateString()}
                      </p>
                      <button
                        type="button"
                        onClick={() => setExpandedOrderId((current) => (current === order.id ? null : order.id))}
                        className="mt-3 border border-clinic/30 bg-clinic/10 px-3 py-1.5 text-xs font-semibold text-clinic transition hover:bg-clinic/15"
                      >
                        {expandedOrderId === order.id ? "Hide Details" : "View Details"}
                      </button>
                    </td>
                    <td className="px-5 py-4">
                      <p className="font-semibold text-washi/78">{order.customer_name}</p>
                      <p className="mt-1 text-xs text-washi/45">{order.customer_username}</p>
                    </td>
                    <td className="px-5 py-4 font-semibold text-washi">
                      ${Number(order.total || 0).toFixed(2)}
                    </td>
                    <td className="px-5 py-4">
                      <span className={`inline-flex border px-2.5 py-1 text-xs font-semibold ${statusClass(order.status)}`}>
                        {formatStatus(order.status)}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-washi/64">{order.items?.length || 0}</td>
                    <td className="px-5 py-4">
                      <select
                        className="min-h-10 border border-washi/10 bg-[#102033]/70 px-3 text-sm text-washi outline-none transition focus:border-clinic/45"
                        value={order.status}
                        onChange={(event) => onStatusChange(order.id, event.target.value)}
                      >
                        {statusOptions.map((status) => (
                          <option key={status} value={status}>
                            {formatStatus(status)}
                          </option>
                        ))}
                      </select>
                    </td>
                  </tr>
                  {expandedOrderId === order.id ? (
                    <tr className="border-b border-clinic/10 bg-[#102338]/30">
                      <td colSpan="6" className="px-5 py-5">
                        <div className="grid gap-5 xl:grid-cols-[0.92fr_1.08fr]">
                          <div className="border border-washi/10 bg-[#081522]/45 p-4">
                            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-clinic">
                              Delivery Information
                            </p>
                            <dl className="mt-4 grid gap-3 text-sm">
                              <div>
                                <dt className="text-washi/42">Customer name</dt>
                                <dd className="mt-1 font-semibold text-washi">{order.customer_name || "Not provided"}</dd>
                              </div>
                              <div>
                                <dt className="text-washi/42">Phone number</dt>
                                <dd className="mt-1 font-semibold text-washi">{order.phone || "Not provided"}</dd>
                              </div>
                              <div>
                                <dt className="text-washi/42">Delivery address</dt>
                                <dd className="mt-1 whitespace-pre-wrap leading-6 text-washi/78">
                                  {order.delivery_address || "Not provided"}
                                </dd>
                              </div>
                              <div>
                                <dt className="text-washi/42">Payment method</dt>
                                <dd className="mt-1 font-semibold text-washi">{formatPaymentMethod(order.payment_method)}</dd>
                              </div>
                              <div>
                                <dt className="text-washi/42">Prescription</dt>
                                <dd className="mt-1">
                                  {order.prescription_file_url ? (
                                    <a
                                      href={order.prescription_file_url}
                                      target="_blank"
                                      rel="noreferrer"
                                      className="font-semibold text-clinic transition hover:text-washi"
                                    >
                                      Open prescription file
                                    </a>
                                  ) : (
                                    <span className="text-washi/58">No prescription file attached.</span>
                                  )}
                                </dd>
                              </div>
                            </dl>
                          </div>

                          <div className="border border-washi/10 bg-[#081522]/45 p-4">
                            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-clinic">
                              Order Items
                            </p>
                            <div className="mt-4 space-y-3">
                              {(order.items || []).map((item) => (
                                <div
                                  key={item.id}
                                  className="flex flex-wrap items-center justify-between gap-3 border border-washi/10 bg-washi/[0.035] p-3"
                                >
                                  <div>
                                    <p className="font-semibold text-washi">{item.product_name_snapshot}</p>
                                    <p className="mt-1 text-xs text-washi/48">
                                      Qty {item.quantity} x ${Number(item.unit_price_snapshot || 0).toFixed(2)}
                                    </p>
                                  </div>
                                  <p className="font-semibold text-washi">
                                    ${Number(item.subtotal || 0).toFixed(2)}
                                  </p>
                                </div>
                              ))}
                            </div>
                            <div className="mt-4 space-y-2 border-t border-washi/10 pt-4 text-sm">
                              <div className="flex justify-between text-washi/58">
                                <span>Subtotal</span>
                                <span>${Number(order.subtotal || 0).toFixed(2)}</span>
                              </div>
                              <div className="flex justify-between text-washi/58">
                                <span>Service fee</span>
                                <span>${Number(order.service_fee || 0).toFixed(2)}</span>
                              </div>
                              <div className="flex justify-between text-base font-semibold text-washi">
                                <span>Total amount</span>
                                <span>${Number(order.total || 0).toFixed(2)}</span>
                              </div>
                              <div className="flex justify-between text-sm text-washi/58">
                                <span>Status</span>
                                <span>{formatStatus(order.status)}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  ) : null}
                </React.Fragment>
              ))
            ) : (
              <tr>
                <td className="px-5 py-6 text-washi/60" colSpan="6">
                  No orders yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </motion.article>
  );
}

export default OrderTable;
