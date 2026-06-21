import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  AlertTriangle,
  BarChart3,
  Boxes,
  ClipboardList,
  MessageSquareText,
  ScrollText,
  ShoppingCart,
  Sparkles,
  Stethoscope,
  UploadCloud,
  Wallet
} from "lucide-react";
import DashboardSummaryCard from "../components/dashboard/DashboardSummaryCard.jsx";
import InventoryTable from "../components/dashboard/InventoryTable.jsx";
import OrderTable from "../components/dashboard/OrderTable.jsx";
import LowStockPanel from "../components/dashboard/LowStockPanel.jsx";
import RecommendationLogs from "../components/dashboard/RecommendationLogs.jsx";
import FeedbackPanel from "../components/dashboard/FeedbackPanel.jsx";
import ParticleField from "../components/ParticleField.jsx";
import { authFetch, getAuthHeaders, getCurrentUser } from "../auth.js";

const navItems = [
  { label: "Dashboard", icon: BarChart3 },
  { label: "Products", icon: Boxes },
  { label: "Upload Product", icon: UploadCloud },
  { label: "Orders", icon: ShoppingCart },
  { label: "AI Recommendation Logs", icon: ScrollText },
  { label: "Feedback", icon: MessageSquareText }
];

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "/api";

const emptyProductForm = {
  name: "",
  slug: "",
  category_id: "",
  description: "",
  price: "",
  image: null,
  image_url: "",
  stock_quantity: "0",
  low_stock_threshold: "5",
  dosage_note: "",
  safety_note: "",
  requires_prescription: false,
  is_active: true
};

function OwnerDashboard() {
  const currentUser = getCurrentUser();
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [formData, setFormData] = useState(emptyProductForm);
  const [formErrors, setFormErrors] = useState({});
  const [editingProductId, setEditingProductId] = useState(null);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);
  const [isSavingProduct, setIsSavingProduct] = useState(false);
  const [productError, setProductError] = useState("");
  const [orders, setOrders] = useState([]);
  const [isLoadingOrders, setIsLoadingOrders] = useState(true);
  const [orderError, setOrderError] = useState("");
  const [analytics, setAnalytics] = useState(null);
  const [isLoadingAnalytics, setIsLoadingAnalytics] = useState(true);
  const [analyticsError, setAnalyticsError] = useState("");
  const [feedback, setFeedback] = useState([]);
  const [isLoadingFeedback, setIsLoadingFeedback] = useState(true);
  const [feedbackError, setFeedbackError] = useState("");
  const [recommendationAnalytics, setRecommendationAnalytics] = useState(null);
  const [isLoadingRecommendationAnalytics, setIsLoadingRecommendationAnalytics] = useState(true);
  const [recommendationAnalyticsError, setRecommendationAnalyticsError] = useState("");

  function formatProduct(product) {
    const stockQuantity = Number(product.stock_quantity || 0);
    const lowStockThreshold = Number(product.low_stock_threshold || 0);
    const stockStatus = !product.is_active
      ? "Inactive"
      : stockQuantity <= 0
        ? "Critical"
        : stockQuantity <= lowStockThreshold
          ? "Low Stock"
          : "Available";

    return {
      id: product.id,
      name: product.name,
      slug: product.slug,
      category: product.category?.name || "Uncategorized",
      category_id: product.category?.id ? String(product.category.id) : "",
      stock: stockQuantity,
      low_stock_threshold: lowStockThreshold,
      price: `$${Number(product.price || 0).toFixed(2)}`,
      rawPrice: product.price,
      image_url: product.image_url || product.image || "",
      status: stockStatus,
      description: product.description || "",
      dosage_note: product.dosage_note || "",
      safety_note: product.safety_note || "",
      requires_prescription: Boolean(product.requires_prescription),
      is_active: Boolean(product.is_active)
    };
  }

  function createSlug(value) {
    return value
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  }

  async function loadProductManagementData(signal) {
    setIsLoadingProducts(true);
    setProductError("");

    try {
      const [categoriesResponse, productsResponse] = await Promise.all([
        fetch(`${API_BASE_URL}/categories/`, { signal }),
        fetch(`${API_BASE_URL}/products/`, { signal })
      ]);

      if (!categoriesResponse.ok || !productsResponse.ok) {
        throw new Error("Unable to load product management data.");
      }

      const [categoryData, productData] = await Promise.all([
        categoriesResponse.json(),
        productsResponse.json()
      ]);

      setCategories(categoryData);
      setProducts(productData.map(formatProduct));
    } catch (error) {
      if (error.name !== "AbortError") {
        setProductError(error.message || "Unable to load product management data.");
      }
    } finally {
      if (!signal?.aborted) {
        setIsLoadingProducts(false);
      }
    }
  }

  async function loadOrders(signal) {
    setIsLoadingOrders(true);
    setOrderError("");

    try {
      const response = await authFetch(`${API_BASE_URL}/orders/`, {
        headers: getAuthHeaders(),
        signal
      });

      if (!response.ok) {
        throw new Error("Unable to load orders.");
      }

      setOrders(await response.json());
    } catch (error) {
      if (error.name !== "AbortError") {
        setOrderError(error.message || "Unable to load orders.");
      }
    } finally {
      if (!signal?.aborted) {
        setIsLoadingOrders(false);
      }
    }
  }

  async function loadAnalytics(signal) {
    setIsLoadingAnalytics(true);
    setAnalyticsError("");

    try {
      const response = await authFetch(`${API_BASE_URL}/dashboard/analytics/`, {
        headers: getAuthHeaders(),
        signal
      });

      if (!response.ok) {
        throw new Error("Unable to load dashboard analytics.");
      }

      setAnalytics(await response.json());
    } catch (error) {
      if (error.name !== "AbortError") {
        setAnalyticsError(error.message || "Unable to load dashboard analytics.");
      }
    } finally {
      if (!signal?.aborted) {
        setIsLoadingAnalytics(false);
      }
    }
  }

  async function loadFeedback(signal) {
    setIsLoadingFeedback(true);
    setFeedbackError("");

    try {
      const response = await authFetch(`${API_BASE_URL}/feedback/`, {
        headers: getAuthHeaders(),
        signal
      });

      if (!response.ok) {
        throw new Error("Unable to load feedback.");
      }

      setFeedback(await response.json());
    } catch (error) {
      if (error.name !== "AbortError") {
        setFeedbackError(error.message || "Unable to load feedback.");
      }
    } finally {
      if (!signal?.aborted) {
        setIsLoadingFeedback(false);
      }
    }
  }

  async function loadRecommendationAnalytics(signal) {
    setIsLoadingRecommendationAnalytics(true);
    setRecommendationAnalyticsError("");

    try {
      const response = await authFetch(`${API_BASE_URL}/dashboard/recommendations/`, {
        headers: getAuthHeaders(),
        signal
      });

      if (!response.ok) {
        throw new Error("Unable to load AI recommendation analytics.");
      }

      setRecommendationAnalytics(await response.json());
    } catch (error) {
      if (error.name !== "AbortError") {
        setRecommendationAnalyticsError(error.message || "Unable to load AI recommendation analytics.");
      }
    } finally {
      if (!signal?.aborted) {
        setIsLoadingRecommendationAnalytics(false);
      }
    }
  }

  useEffect(() => {
    const controller = new AbortController();
    loadProductManagementData(controller.signal);
    loadOrders(controller.signal);
    loadAnalytics(controller.signal);
    loadFeedback(controller.signal);
    loadRecommendationAnalytics(controller.signal);

    return () => controller.abort();
  }, []);

  const summary = useMemo(
    () => [
      {
        label: "Total Products",
        value: isLoadingAnalytics ? "..." : String(analytics?.total_products ?? 0),
        trend: analyticsError
          ? "Needs API review"
          : `${analytics?.active_products ?? 0} active / ${analytics?.low_stock_products ?? 0} low stock`,
        icon: Boxes,
        tone: "clinic"
      },
      {
        label: "Customers",
        value: isLoadingAnalytics ? "..." : String(analytics?.total_customers ?? 0),
        trend: "Registered customer accounts",
        icon: AlertTriangle,
        tone: "koi"
      },
      {
        label: "Orders",
        value: isLoadingAnalytics ? "..." : String(analytics?.total_orders ?? 0),
        trend: analyticsError
          ? "Needs API review"
          : `${analytics?.pending_orders ?? 0} pending / ${analytics?.processing_orders ?? 0} processing`,
        icon: ClipboardList,
        tone: "matcha"
      },
      {
        label: "Recommendations",
        value: isLoadingAnalytics ? "..." : String(analytics?.total_recommendations ?? 0),
        trend: `${analytics?.total_feedback ?? 0} feedback records`,
        icon: Wallet,
        tone: "sakura"
      }
    ],
    [analytics, analyticsError, isLoadingAnalytics]
  );

  const lowStockItems = useMemo(
    () =>
      products
        .filter((product) => product.status === "Low Stock" || product.status === "Critical")
        .map((product) => ({
          name: product.name,
          stock: product.stock,
          threshold: product.low_stock_threshold,
        })),
    [products]
  );

  function handleFormChange(field, value) {
    setFormData((current) => {
      if (field === "name" && !editingProductId) {
        return { ...current, name: value, slug: createSlug(value) };
      }

      return { ...current, [field]: value };
    });
    setFormErrors((current) => ({ ...current, [field]: "", form: "" }));
  }

  function validateProductForm() {
    const errors = {};

    if (!formData.name.trim()) errors.name = "Product name is required.";
    if (!formData.slug.trim()) errors.slug = "Slug is required.";
    if (!formData.category_id) errors.category_id = "Category is required.";
    if (!formData.price || Number(formData.price) <= 0) {
      errors.price = "Price must be greater than 0.";
    }
    if (formData.stock_quantity === "" || Number(formData.stock_quantity) < 0) {
      errors.stock_quantity = "Stock quantity cannot be negative.";
    }
    if (formData.low_stock_threshold === "" || Number(formData.low_stock_threshold) < 0) {
      errors.low_stock_threshold = "Low-stock threshold cannot be negative.";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  }

  function buildProductPayload() {
    const payload = new FormData();
    payload.append("name", formData.name.trim());
    payload.append("slug", formData.slug.trim());
    payload.append("category_id", String(Number(formData.category_id)));
    payload.append("description", formData.description.trim());
    payload.append("price", Number(formData.price).toFixed(2));
    payload.append("stock_quantity", String(Number(formData.stock_quantity)));
    payload.append("low_stock_threshold", String(Number(formData.low_stock_threshold)));
    payload.append("dosage_note", formData.dosage_note.trim());
    payload.append("safety_note", formData.safety_note.trim());
    payload.append("requires_prescription", String(formData.requires_prescription));
    payload.append("is_active", String(formData.is_active));

    if (formData.image instanceof File) {
      payload.append("image", formData.image);
    }

    return payload;
  }

  async function handleProductSubmit(event) {
    event.preventDefault();

    if (!validateProductForm()) return;

    setIsSavingProduct(true);
    setFormErrors({});

    try {
      const endpoint = editingProductId
        ? `${API_BASE_URL}/products/${editingProductId}/`
        : `${API_BASE_URL}/products/`;
      const response = await authFetch(endpoint, {
        method: editingProductId ? "PATCH" : "POST",
        headers: getAuthHeaders(),
        body: buildProductPayload()
      });

      if (!response.ok) {
        const errorPayload = await response.json().catch(() => ({}));
        throw new Error(
          Object.values(errorPayload).flat().join(" ") || "Unable to save product."
        );
      }

      setFormData(emptyProductForm);
      setEditingProductId(null);
      await loadProductManagementData();
      await loadAnalytics();
    } catch (error) {
      setFormErrors({ form: error.message || "Unable to save product." });
    } finally {
      setIsSavingProduct(false);
    }
  }

  function handleEditProduct(product) {
    setEditingProductId(product.id);
    setFormData({
      name: product.name,
      slug: product.slug,
      category_id: product.category_id,
      description: product.description,
      price: String(product.rawPrice),
      image: null,
      image_url: product.image_url,
      stock_quantity: String(product.stock),
      low_stock_threshold: String(product.low_stock_threshold),
      dosage_note: product.dosage_note,
      safety_note: product.safety_note,
      requires_prescription: product.requires_prescription,
      is_active: product.is_active
    });
    setFormErrors({});
    window.location.hash = "upload-product";
  }

  function handleCancelEdit() {
    setEditingProductId(null);
    setFormData(emptyProductForm);
    setFormErrors({});
  }

  async function handleDeleteProduct(product) {
    const confirmed = window.confirm(`Delete ${product.name}?`);
    if (!confirmed) return;

    try {
      const response = await authFetch(`${API_BASE_URL}/products/${product.id}/`, {
        method: "DELETE",
        headers: getAuthHeaders()
      });

      if (!response.ok && response.status !== 204) {
        throw new Error("Unable to delete product.");
      }

      if (editingProductId === product.id) {
        handleCancelEdit();
      }
      await loadProductManagementData();
      await loadAnalytics();
    } catch (error) {
      setFormErrors({ form: error.message || "Unable to delete product." });
    }
  }

  async function handleOrderStatusChange(orderId, status) {
    setOrderError("");

    try {
      const response = await authFetch(`${API_BASE_URL}/orders/${orderId}/status/`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", ...getAuthHeaders() },
        body: JSON.stringify({ status })
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => ({}));
        throw new Error(payload.detail || Object.values(payload).flat().join(" ") || "Unable to update order status.");
      }

      const updatedOrder = await response.json();
      setOrders((current) =>
        current.map((order) => (order.id === updatedOrder.id ? updatedOrder : order))
      );
      await loadAnalytics();
    } catch (error) {
      setOrderError(error.message || "Unable to update order status.");
    }
  }

  return (
    <main className="min-h-screen overflow-hidden bg-[#07111c] text-washi">
      <div className="fixed inset-0 -z-20 bg-[radial-gradient(circle_at_12%_12%,rgba(141,248,255,0.24),transparent_28%),radial-gradient(circle_at_86%_18%,rgba(255,122,162,0.22),transparent_26%),radial-gradient(circle_at_54%_92%,rgba(255,54,95,0.12),transparent_30%),linear-gradient(135deg,#07111c_0%,#0b1724_38%,#111923_66%,#171616_100%)]" />
      <div className="fixed inset-0 -z-20 bg-[radial-gradient(circle_at_50%_0%,rgba(244,239,228,0.08),transparent_32%)]" />
      <div className="fixed inset-0 -z-20 opacity-[0.07] bg-[linear-gradient(rgba(244,239,228,0.8)_1px,transparent_1px),linear-gradient(90deg,rgba(244,239,228,0.8)_1px,transparent_1px)] bg-[size:52px_52px]" />
      <div className="fixed inset-0 -z-20 bg-[linear-gradient(115deg,transparent_0%,rgba(141,248,255,.055)_42%,rgba(255,122,162,.045)_56%,transparent_72%)]" />
      <ParticleField />

      <div className="grid min-h-screen lg:grid-cols-[280px_1fr]">
        <aside className="border-b border-washi/10 bg-[#091522]/80 px-4 py-4 shadow-[28px_0_90px_rgba(0,0,0,0.22)] backdrop-blur-2xl lg:border-b-0 lg:border-r lg:border-clinic/10 lg:px-5 lg:py-7">
          <a href="/" className="mb-5 flex items-center gap-3 lg:mb-9" aria-label="AB Medical home">
            <span className="grid h-11 w-11 place-items-center border border-clinic/35 bg-[radial-gradient(circle_at_30%_20%,rgba(141,248,255,.28),rgba(141,248,255,.08))] shadow-glow">
              <Stethoscope className="h-5 w-5 text-clinic" aria-hidden="true" />
            </span>
            <span>
              <span className="block text-sm font-semibold uppercase tracking-[0.26em] text-washi">AB Medical</span>
              <span className="text-xs text-clinic/62">Owner Console</span>
            </span>
          </a>

          <nav className="flex gap-2 overflow-x-auto pb-1 lg:block lg:space-y-3 lg:overflow-visible lg:pb-0">
            {navItems.map((item, index) => (
              <motion.a
                key={item.label}
                href={`#${item.label.toLowerCase().replaceAll(" ", "-")}`}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.35, delay: index * 0.04 }}
                className={`flex shrink-0 items-center gap-3 border px-3.5 py-3 text-sm transition lg:w-full ${
                  index === 0
                    ? "border-clinic/45 bg-gradient-to-r from-clinic/16 to-sakura/10 text-clinic shadow-glow"
                    : "border-washi/10 bg-[#102033]/50 text-washi/60 hover:border-clinic/35 hover:bg-clinic/10 hover:text-clinic"
                }`}
              >
                <item.icon className="h-4 w-4" aria-hidden="true" />
                <span className="whitespace-nowrap">{item.label}</span>
              </motion.a>
            ))}
          </nav>
        </aside>

        <section className="min-w-0 px-4 py-6 sm:px-6 lg:px-9 lg:py-9">
          <motion.header
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: "easeOut" }}
            className="mb-8 flex flex-col justify-between gap-5 border-b border-clinic/10 pb-7 xl:flex-row xl:items-end"
          >
            <div>
              <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.24em] text-sakura">
                <Sparkles className="h-4 w-4" aria-hidden="true" />
                Pharmaceutical AI Operations
              </p>
              <h1 className="mt-3 text-3xl font-black uppercase leading-none text-washi drop-shadow-[0_0_28px_rgba(141,248,255,.18)] sm:text-5xl">
                Owner Dashboard
              </h1>
            </div>
            <div className="dashboard-glass px-5 py-3 text-sm text-washi/68">
              {currentUser?.username ? `${currentUser.username} · ` : ""}
              Live product management · <a className="text-clinic" href="/logout">Logout</a>
            </div>
          </motion.header>

          <section id="dashboard" className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {summary.map((item, index) => (
              <DashboardSummaryCard key={item.label} index={index} {...item} />
            ))}
          </section>

          <section className="mt-6 grid gap-6 xl:grid-cols-[1.45fr_0.8fr]">
            <div>
              {productError ? (
                <div className="dashboard-glass mb-4 border-koi/30 p-4 text-sm text-koi">
                  {productError}
                </div>
              ) : null}
              <InventoryTable
                products={products}
                categories={categories}
                formData={formData}
                formErrors={formErrors}
                isSaving={isSavingProduct}
                editingProductId={editingProductId}
                onFormChange={handleFormChange}
                onSubmit={handleProductSubmit}
                onEdit={handleEditProduct}
                onCancelEdit={handleCancelEdit}
                onDelete={handleDeleteProduct}
              />
            </div>
            <LowStockPanel items={lowStockItems} />
          </section>

          <section className="mt-6">
            <OrderTable
              orders={orders}
              isLoading={isLoadingOrders}
              error={orderError}
              onStatusChange={handleOrderStatusChange}
            />
          </section>

          <section className="mt-6 grid gap-6 xl:grid-cols-[1.18fr_0.82fr]">
            <RecommendationLogs
              analytics={recommendationAnalytics}
              isLoading={isLoadingRecommendationAnalytics}
              error={recommendationAnalyticsError}
            />
            <FeedbackPanel
              feedback={feedback}
              isLoading={isLoadingFeedback}
              error={feedbackError}
            />
          </section>
        </section>
      </div>
    </main>
  );
}

export default OwnerDashboard;
