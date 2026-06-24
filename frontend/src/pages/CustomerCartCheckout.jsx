import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { HeartHandshake, ShieldCheck, ShoppingCart, Sparkles, Stethoscope } from "lucide-react";
import CartItemCard from "../components/customer/CartItemCard.jsx";
import CheckoutForm from "../components/customer/CheckoutForm.jsx";
import CustomerNav from "../components/customer/CustomerNav.jsx";
import EmptyCartState from "../components/customer/EmptyCartState.jsx";
import OrderSummaryPanel from "../components/customer/OrderSummaryPanel.jsx";
import { authFetch, getAuthHeaders } from "../auth.js";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://ab-medical-assistance-production.up.railway.app/api";

const accentByCategory = {
  rehydration: "cyan",
  analgesic: "coral",
  respiratory: "coral",
  supplement: "cyan",
  digestive: "sage"
};

function normalizeCartItem(item) {
  const category = item.product_category || "General";
  const categorySlug = category.toLowerCase();

  return {
    id: item.id,
    productId: item.product_id,
    name: item.product_name,
    category,
    price: Number(item.unit_price_snapshot || 0),
    quantity: item.quantity,
    status: item.product_status,
    availableStock: Number(item.available_stock || 0),
    safetyBadge: "API synced",
    accent: accentByCategory[categorySlug] || "sage"
  };
}

function CustomerCartCheckout() {
  const [cartItems, setCartItems] = useState([]);
  const [subtotal, setSubtotal] = useState(0);
  const [serviceFee, setServiceFee] = useState(0);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [error, setError] = useState("");
  const [orderSuccess, setOrderSuccess] = useState("");
  const [checkoutDetails, setCheckoutDetails] = useState({
    customer_name: "",
    phone: "",
    delivery_address: "",
    payment_method: "cash",
    prescription_file: null
  });

  function applyCart(cart) {
    setCartItems((cart.items || []).map(normalizeCartItem));
    setSubtotal(Number(cart.subtotal || 0));
    setServiceFee(Number(cart.service_fee || 0));
    setTotal(Number(cart.total || 0));
  }

  async function loadCart(signal) {
    try {
      setIsLoading(true);
      setError("");
      const response = await authFetch(`${API_BASE_URL}/cart/`, {
        headers: getAuthHeaders(),
        signal
      });

      if (!response.ok) {
        throw new Error("Unable to load your cart.");
      }

      applyCart(await response.json());
    } catch (requestError) {
      if (requestError.name !== "AbortError") {
        setError(requestError.message || "Unable to load your cart.");
      }
    } finally {
      if (!signal?.aborted) {
        setIsLoading(false);
      }
    }
  }

  useEffect(() => {
    const controller = new AbortController();
    loadCart(controller.signal);

    return () => controller.abort();
  }, []);

  async function updateQuantity(item, quantity) {
    if (quantity < 1) return;

    try {
      setOrderSuccess("");
      const response = await authFetch(`${API_BASE_URL}/cart/items/${item.id}/`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", ...getAuthHeaders() },
        body: JSON.stringify({ quantity })
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => ({}));
        throw new Error(Object.values(payload).flat().join(" ") || "Unable to update cart item.");
      }
      applyCart(await response.json());
    } catch (requestError) {
      setError(requestError.message || "Unable to update cart item.");
    }
  }

  async function removeItem(item) {
    try {
      setOrderSuccess("");
      const response = await authFetch(`${API_BASE_URL}/cart/items/${item.id}/`, {
        method: "DELETE",
        headers: getAuthHeaders()
      });

      if (!response.ok) throw new Error("Unable to remove cart item.");
      applyCart(await response.json());
    } catch (requestError) {
      setError(requestError.message || "Unable to remove cart item.");
    }
  }

  async function clearCart() {
    try {
      setOrderSuccess("");
      const response = await authFetch(`${API_BASE_URL}/cart/clear/`, {
        method: "DELETE",
        headers: getAuthHeaders()
      });

      if (!response.ok) throw new Error("Unable to clear cart.");
      applyCart(await response.json());
    } catch (requestError) {
      setError(requestError.message || "Unable to clear cart.");
    }
  }

  async function createOrder() {
    const requiredFields = ["customer_name", "phone", "delivery_address"];
    const hasMissingField = requiredFields.some((field) => !checkoutDetails[field].trim());

    if (hasMissingField) {
      setError("Please complete your name, phone, and delivery address before checkout.");
      return;
    }

    try {
      setIsCheckingOut(true);
      setError("");
      setOrderSuccess("");
      const hasPrescriptionFile = Boolean(checkoutDetails.prescription_file);
      const checkoutPayload = {
        customer_name: checkoutDetails.customer_name,
        phone: checkoutDetails.phone,
        delivery_address: checkoutDetails.delivery_address,
        payment_method: checkoutDetails.payment_method
      };
      const requestBody = hasPrescriptionFile ? new FormData() : JSON.stringify(checkoutPayload);
      const headers = hasPrescriptionFile
        ? getAuthHeaders()
        : { "Content-Type": "application/json", ...getAuthHeaders() };

      if (hasPrescriptionFile) {
        Object.entries({ ...checkoutPayload, prescription_file: checkoutDetails.prescription_file }).forEach(([key, value]) => {
          if (value !== null && value !== undefined) {
            requestBody.append(key, value);
          }
        });
      }

      const response = await authFetch(`${API_BASE_URL}/orders/`, {
        method: "POST",
        headers,
        body: requestBody
      });
      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload.detail || Object.values(payload).flat().join(" ") || "Unable to create order.");
      }

      setOrderSuccess(`Order ${payload.order_number} created successfully.`);
      applyCart({ items: [], subtotal: 0, service_fee: 0, total: 0 });
    } catch (requestError) {
      setError(requestError.message || "Unable to create order.");
    } finally {
      setIsCheckingOut(false);
    }
  }

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
            Guided pharmacy checkout
          </div>
          <h1 className="text-balance text-5xl font-semibold leading-[0.98] text-washi sm:text-6xl lg:text-7xl">
            Your Medicine Cart
          </h1>
          <p className="mt-6 max-w-3xl text-base leading-8 text-washi/70 sm:text-lg">
            Review verified medicines, safety notes, and delivery details in a
            calm checkout flow designed for careful healthcare decisions.
          </p>
        </motion.div>

        <div className="grid gap-7 xl:grid-cols-[1fr_360px]">
          <div className="min-w-0 space-y-4">
            {orderSuccess ? (
              <div className="landing-glass border-[#d8e9cf]/25 bg-[#d8e9cf]/10 p-6 text-sm leading-7 text-[#d8e9cf]">
                {orderSuccess}
              </div>
            ) : null}

            {isLoading ? (
              <div className="landing-glass p-6 text-sm leading-7 text-washi/64">
                Loading your cart...
              </div>
            ) : error ? (
              <div className="landing-glass border-[#ffaaa5]/25 bg-[#ffaaa5]/10 p-6 text-sm leading-7 text-[#ffc2bd]">
                {error}
              </div>
            ) : cartItems.length ? (
              cartItems.map((item, index) => (
                <CartItemCard
                  key={item.id}
                  item={item}
                  index={index}
                  onIncrease={(cartItem) => updateQuantity(cartItem, cartItem.quantity + 1)}
                  onDecrease={(cartItem) => updateQuantity(cartItem, cartItem.quantity - 1)}
                  onRemove={removeItem}
                />
              ))
            ) : (
              <EmptyCartState />
            )}

            {cartItems.length ? (
              <CheckoutForm values={checkoutDetails} onChange={setCheckoutDetails} />
            ) : null}

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.55, ease: "easeOut" }}
              className="landing-glass p-5 sm:p-6"
            >
              <div className="flex items-start gap-4">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-[14px] border border-[#d8e9cf]/25 bg-[#d8e9cf]/10 text-[#d8e9cf]">
                  <ShieldCheck className="h-5 w-5" aria-hidden="true" />
                </span>
                <div>
                  <p className="mb-2 flex items-center gap-2 text-sm font-semibold text-washi">
                    <HeartHandshake className="h-4 w-4 text-[#ffaaa5]" aria-hidden="true" />
                    Safety Reminder
                  </p>
                  <p className="text-sm leading-7 text-washi/60">
                    This platform supports medicine access, but professional
                    medical advice should always be followed.
                  </p>
                </div>
              </div>
            </motion.div>

          </div>

          <OrderSummaryPanel
            subtotal={subtotal}
            serviceFee={serviceFee}
            total={total}
            onClearCart={clearCart}
            canClearCart={cartItems.length > 0}
            onCheckout={createOrder}
            isCheckingOut={isCheckingOut}
          />
        </div>
      </section>
    </main>
  );
}

export default CustomerCartCheckout;
