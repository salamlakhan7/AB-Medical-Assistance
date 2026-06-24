import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ShieldCheck, Sparkles, Stethoscope } from "lucide-react";
import CatalogFilters from "../components/customer/CatalogFilters.jsx";
import CustomerNav from "../components/customer/CustomerNav.jsx";
import ProductCard from "../components/customer/ProductCard.jsx";
import ProductDetailPanel from "../components/customer/ProductDetailPanel.jsx";
import { authFetch, getAuthHeaders, getCurrentUser } from "../auth.js";


const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://ab-medical-assistance-production.up.railway.app/api";

const accentByCategory = {
  rehydration: "cyan",
  analgesic: "coral",
  respiratory: "coral",
  supplement: "cyan",
  digestive: "sage"
};

function normalizeProduct(product) {
  const category = product.category || {};
  const price = Number(product.price || 0);
  const stockQuantity = Number(product.stock_quantity || 0);
  const lowStockThreshold = Number(product.low_stock_threshold || 0);
  const isOutOfStock = !product.is_active || stockQuantity <= 0;
  const isLowStock = !isOutOfStock && stockQuantity <= lowStockThreshold;

  return {
    id: product.id,
    name: product.name,
    category: category.name || "General",
    categorySlug: category.slug || "general",
    description: product.description || "Verified store medicine.",
    fullDescription: product.description || "Verified store medicine with pharmacist-ready guidance.",
    price: `$${price.toFixed(2)}`,
    priceValue: price,
    imageUrl: product.image_url || product.image || "",
    status: isOutOfStock ? "Out of Stock" : isLowStock ? "Low Stock" : "In Stock",
    stockQuantity,
    lowStockThreshold,
    isOutOfStock,
    rating: "4.8",
    dosage: product.dosage_note || "Follow the product label and pharmacist guidance.",
    safety: product.safety_note || "Consult a qualified healthcare professional for medical advice.",
    accent: accentByCategory[category.slug] || "sage"
  };
}

function ProductCatalog() {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedAvailability, setSelectedAvailability] = useState("all");
  const [minimumPrice, setMinimumPrice] = useState(5);
  const [maximumPrice, setMaximumPrice] = useState(10000);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [cartMessage, setCartMessage] = useState("");
  const [feedbackData, setFeedbackData] = useState({ average_rating: null, feedback_count: 0, results: [] });
  const [feedbackForm, setFeedbackForm] = useState({ rating: "5", comment: "" });
  const [feedbackMessage, setFeedbackMessage] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    async function fetchCatalogData() {
      try {
        setIsLoading(true);
        setError("");

        const [categoriesResponse, productsResponse] = await Promise.all([
          fetch(`${API_BASE_URL}/categories/`, { signal: controller.signal }),
          fetch(`${API_BASE_URL}/products/`, { signal: controller.signal })
        ]);

        if (!categoriesResponse.ok || !productsResponse.ok) {
          throw new Error("Unable to load product catalog.");
        }

        const [categoryData, productData] = await Promise.all([
          categoriesResponse.json(),
          productsResponse.json()
        ]);
        const normalizedProducts = productData.map(normalizeProduct);

        setCategories(categoryData);
        setProducts(normalizedProducts);
        setSelectedProduct(normalizedProducts[0] || null);
      } catch (requestError) {
        if (requestError.name !== "AbortError") {
          setError(requestError.message || "Unable to load product catalog.");
        }
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    }

    fetchCatalogData();

    return () => controller.abort();
  }, []);

  const priceCeiling = useMemo(() => {
    if (!products.length) return 10000;

    return Math.ceil(Math.max(...products.map((product) => product.priceValue)));
  }, [products]);

  useEffect(() => {
    setMaximumPrice(priceCeiling);
  }, [priceCeiling]);

  const filteredProducts = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    return products.filter((product) => {
      const matchesSearch =
        !normalizedSearch ||
        product.name.toLowerCase().includes(normalizedSearch) ||
        product.description.toLowerCase().includes(normalizedSearch);
      const matchesCategory =
        selectedCategory === "all" || product.categorySlug === selectedCategory;
      const matchesAvailability =
        selectedAvailability === "all" || product.status === selectedAvailability;
      const matchesPrice =
        product.priceValue >= minimumPrice && product.priceValue <= maximumPrice;

      return matchesSearch && matchesCategory && matchesAvailability && matchesPrice;
    });
  }, [maximumPrice, minimumPrice, products, searchTerm, selectedAvailability, selectedCategory]);

  useEffect(() => {
    if (!filteredProducts.length) {
      setSelectedProduct(null);
      return;
    }

    const selectedStillVisible = filteredProducts.some(
      (product) => product.id === selectedProduct?.id
    );

    if (!selectedStillVisible) {
      setSelectedProduct(filteredProducts[0]);
    }
  }, [filteredProducts, selectedProduct?.id]);

  async function loadProductFeedback(productId, signal) {
    if (!productId) return;

    try {
      setFeedbackMessage("");
      const response = await fetch(`${API_BASE_URL}/feedback/product/${productId}/`, { signal });

      if (!response.ok) {
        throw new Error("Unable to load product feedback.");
      }

      setFeedbackData(await response.json());
    } catch (requestError) {
      if (requestError.name !== "AbortError") {
        setFeedbackData({ average_rating: null, feedback_count: 0, results: [] });
        setFeedbackMessage(requestError.message || "Unable to load product feedback.");
      }
    }
  }

  useEffect(() => {
    const controller = new AbortController();
    loadProductFeedback(selectedProduct?.id, controller.signal);

    return () => controller.abort();
  }, [selectedProduct?.id]);

  async function handleAddToCart(product) {
    const user = getCurrentUser();

    if (!user) {
      window.location.href = "/login";
      return;
    }

    if (user.role !== "customer") {
      setCartMessage("Only customer accounts can add medicines to the cart.");
      return;
    }

    if (product.isOutOfStock) {
      setCartMessage(`${product.name} is currently out of stock.`);
      return;
    }

    try {
      setCartMessage("");
      const response = await authFetch(`${API_BASE_URL}/cart/items/`, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...getAuthHeaders() },
        body: JSON.stringify({ product_id: product.id, quantity: 1 })
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => ({}));
        throw new Error(Object.values(payload).flat().join(" ") || "Unable to add item to cart.");
      }

      setCartMessage(`${product.name} was added to your cart.`);
    } catch (requestError) {
      setCartMessage(requestError.message || "Unable to add item to cart.");
    }
  }

  function handleFeedbackChange(field, value) {
    setFeedbackForm((current) => ({ ...current, [field]: value }));
    setFeedbackMessage("");
  }

  async function handleFeedbackSubmit(event) {
    event.preventDefault();
    const user = getCurrentUser();

    if (!user) {
      window.location.href = "/login";
      return;
    }

    if (user.role !== "customer") {
      setFeedbackMessage("Only customer accounts can submit product feedback.");
      return;
    }

    try {
      setFeedbackMessage("");
      const response = await authFetch(`${API_BASE_URL}/feedback/`, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...getAuthHeaders() },
        body: JSON.stringify({
          product_id: selectedProduct.id,
          rating: Number(feedbackForm.rating),
          comment: feedbackForm.comment.trim()
        })
      });
      const payload = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(Object.values(payload).flat().join(" ") || "Unable to submit feedback.");
      }

      setFeedbackForm({ rating: "5", comment: "" });
      setFeedbackMessage("Thank you. Your feedback was saved.");
      await loadProductFeedback(selectedProduct.id);
    } catch (requestError) {
      setFeedbackMessage(requestError.message || "Unable to submit feedback.");
    }
  }

  const currentUser = getCurrentUser();

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
        {currentUser?.role === "customer" ? (
          <CustomerNav />
        ) : (
          <a
            href="/ai-assistant"
            className="hidden rounded-full border border-washi/15 bg-washi/[0.055] px-4 py-2 text-sm text-washi/72 transition hover:border-[#a7e4e8]/35 hover:text-[#a7e4e8] sm:inline-flex"
          >
            AI Assistant
          </a>
        )}
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
            Verified pharmacy inventory
          </div>
          <h1 className="text-balance text-5xl font-semibold leading-[0.98] text-washi sm:text-6xl lg:text-7xl">
            Medicine Catalog
          </h1>
          <p className="mt-6 max-w-3xl text-base leading-8 text-washi/70 sm:text-lg">
            Browse verified store medicines with clear availability, guidance
            notes, and a calm pharmaceutical shopping experience designed for
            informed care.
          </p>
        </motion.div>

        <CatalogFilters
          categories={categories}
          searchTerm={searchTerm}
          selectedCategory={selectedCategory}
          selectedAvailability={selectedAvailability}
          minimumPrice={minimumPrice}
          maximumPrice={maximumPrice}
          priceCeiling={priceCeiling}
          onSearchTermChange={setSearchTerm}
          onCategoryChange={setSelectedCategory}
          onAvailabilityChange={setSelectedAvailability}
          onMinimumPriceChange={(value) => setMinimumPrice(Math.min(value, maximumPrice))}
          onMaximumPriceChange={(value) => setMaximumPrice(Math.max(value, minimumPrice))}
        />

        {cartMessage ? (
          <div className="mt-5 landing-glass border-[#a7e4e8]/25 p-4 text-sm leading-6 text-washi/72">
            {cartMessage}
          </div>
        ) : null}

        <div className="mt-7 grid gap-7 xl:grid-cols-[1fr_360px]">
          <motion.section
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.08, ease: "easeOut" }}
            className="grid min-w-0 gap-4 sm:grid-cols-2 lg:grid-cols-3"
          >
            {isLoading ? (
              <div className="landing-glass p-6 text-sm leading-7 text-washi/64 sm:col-span-2 lg:col-span-3">
                Loading verified medicines...
              </div>
            ) : error ? (
              <div className="landing-glass border-[#ffaaa5]/25 bg-[#ffaaa5]/10 p-6 text-sm leading-7 text-[#ffc2bd] sm:col-span-2 lg:col-span-3">
                {error}
              </div>
            ) : filteredProducts.length ? (
              filteredProducts.map((product, index) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  index={index}
                  isSelected={selectedProduct?.id === product.id}
                  onSelect={setSelectedProduct}
                  onAddToCart={handleAddToCart}
                />
              ))
            ) : (
              <div className="landing-glass p-6 text-sm leading-7 text-washi/64 sm:col-span-2 lg:col-span-3">
                No medicines match the current filters.
              </div>
            )}
          </motion.section>

          <aside className="xl:sticky xl:top-6 xl:h-fit">
            {selectedProduct ? (
              <ProductDetailPanel
                product={selectedProduct}
                onAddToCart={handleAddToCart}
                feedbackData={feedbackData}
                feedbackForm={feedbackForm}
                onFeedbackChange={handleFeedbackChange}
                onFeedbackSubmit={handleFeedbackSubmit}
                feedbackMessage={feedbackMessage}
                canSubmitFeedback={currentUser?.role === "customer"}
              />
            ) : (
              <div className="landing-glass p-6 text-sm leading-7 text-washi/60">
                Select a medicine to view details.
              </div>
            )}
          </aside>
        </div>

        <div className="mt-7 landing-glass p-5 sm:p-6">
          <div className="flex items-start gap-4">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-[14px] border border-[#d8e9cf]/25 bg-[#d8e9cf]/10 text-[#d8e9cf]">
              <ShieldCheck className="h-5 w-5" aria-hidden="true" />
            </span>
            <p className="text-sm leading-7 text-washi/60">
              Catalog content is a static prototype. Always read product labels
              and consult a qualified healthcare professional for diagnosis,
              dosage, interactions, pregnancy, chronic conditions, or urgent symptoms.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}

export default ProductCatalog;
