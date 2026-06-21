import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  AlertTriangle,
  HeartHandshake,
  ShieldCheck,
  Sparkles,
  Stethoscope
} from "lucide-react";
import AssistantInputPanel from "../components/customer/AssistantInputPanel.jsx";
import CustomerNav from "../components/customer/CustomerNav.jsx";
import ProcessingState from "../components/customer/ProcessingState.jsx";
import RecommendationCard from "../components/customer/RecommendationCard.jsx";
import RecommendationHistory from "../components/customer/RecommendationHistory.jsx";
import { authFetch, getAuthHeaders } from "../auth.js";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "/api";

const accentByCategory = {
  analgesic: "coral",
  respiratory: "sage",
  rehydration: "cyan"
};

function normalizeRecommendation(item) {
  const score = Number(item.match_score || 0);

  return {
    id: item.id,
    productId: item.product_id,
    name: item.product_name,
    category: item.category,
    imageUrl: item.image_url || "",
    purpose: item.reason || "Matched with your symptom description.",
    confidence: Math.max(1, Math.min(99, Math.round(score * 3))),
    dosage: item.safety_note || "Follow the product label and pharmacist guidance.",
    reason: `${item.reason || "Rule matched"} • Match score ${score.toFixed(2)}`,
    accent: accentByCategory[item.category_slug] || "cyan"
  };
}

function CustomerAiAssistant() {
  const [symptoms, setSymptoms] = useState("Headache, mild fever, and feeling dehydrated since morning.");
  const [recommendations, setRecommendations] = useState([]);
  const [history, setHistory] = useState([]);
  const [responseState, setResponseState] = useState(null);
  const [message, setMessage] = useState("");
  const [emergencyKeywords, setEmergencyKeywords] = useState([]);
  const [cartMessage, setCartMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isHistoryLoading, setIsHistoryLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadHistory(signal) {
    try {
      setIsHistoryLoading(true);
      const response = await authFetch(`${API_BASE_URL}/recommendations/`, {
        headers: getAuthHeaders(),
        signal
      });

      if (!response.ok) {
        throw new Error("Unable to load recommendation history.");
      }

      setHistory(await response.json());
    } catch (requestError) {
      if (requestError.name !== "AbortError") {
        setError(requestError.message || "Unable to load recommendation history.");
      }
    } finally {
      if (!signal?.aborted) {
        setIsHistoryLoading(false);
      }
    }
  }

  useEffect(() => {
    const controller = new AbortController();
    loadHistory(controller.signal);

    return () => controller.abort();
  }, []);

  async function analyzeSymptoms() {
    if (!symptoms.trim()) {
      setError("Please describe your symptoms before analysis.");
      return;
    }

    try {
      setIsLoading(true);
      setError("");
      setCartMessage("");
      setResponseState(null);
      setMessage("");
      setEmergencyKeywords([]);
      setRecommendations([]);

      const response = await authFetch(`${API_BASE_URL}/recommendations/`, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...getAuthHeaders() },
        body: JSON.stringify({ symptoms })
      });
      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload.detail || Object.values(payload).flat().join(" ") || "Unable to analyze symptoms.");
      }

      setResponseState(payload.status);
      setMessage(payload.message || "");

      if (payload.status === "blocked_emergency") {
        setEmergencyKeywords(payload.keywords || []);
      }

      if (payload.status === "completed") {
        setRecommendations((payload.recommendations || []).map(normalizeRecommendation));
      }

      await loadHistory();
    } catch (requestError) {
      setError(requestError.message || "Unable to analyze symptoms.");
    } finally {
      setIsLoading(false);
    }
  }

  async function addRecommendationToCart(medicine) {
    try {
      setCartMessage("");
      const response = await authFetch(`${API_BASE_URL}/cart/items/`, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...getAuthHeaders() },
        body: JSON.stringify({ product_id: medicine.productId, quantity: 1 })
      });
      const payload = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(payload.detail || Object.values(payload).flat().join(" ") || "Unable to add recommendation to cart.");
      }

      setCartMessage(`${medicine.name} was added to your cart.`);
    } catch (requestError) {
      setCartMessage(requestError.message || "Unable to add recommendation to cart.");
    }
  }

  const recentSearches = useMemo(
    () => history.map((item) => item.input_text).slice(0, 5),
    [history]
  );
  const viewedMedicines = useMemo(
    () =>
      history
        .flatMap((item) => item.latest_log?.items || [])
        .map((item) => item.product_name_snapshot)
        .filter(Boolean)
        .slice(0, 5),
    [history]
  );

  return (
    <main className="min-h-screen overflow-hidden bg-[#081522] text-washi">
      <div className="fixed inset-0 -z-20 bg-[radial-gradient(circle_at_18%_10%,rgba(147,214,220,0.2),transparent_30%),radial-gradient(circle_at_86%_18%,rgba(255,155,154,0.15),transparent_28%),radial-gradient(circle_at_48%_92%,rgba(244,239,228,0.08),transparent_34%),linear-gradient(135deg,#0a1826_0%,#102436_46%,#192633_76%,#1a242a_100%)]" />
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

      <section className="relative mx-auto grid w-full max-w-7xl gap-8 px-5 pb-20 pt-6 sm:px-8 lg:grid-cols-[1fr_340px] lg:gap-7">
        <div className="min-w-0">
          <motion.div
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, ease: "easeOut" }}
            className="mb-7"
          >
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#ffaaa5]/30 bg-[#ffaaa5]/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#ffc2bd] shadow-[0_0_30px_rgba(255,155,154,.1)] backdrop-blur">
              <Sparkles className="h-4 w-4" aria-hidden="true" />
              Guided medicine support
            </div>
            <h1 className="text-balance text-5xl font-semibold leading-[0.98] text-washi sm:text-6xl lg:text-7xl">
              AI Care Assistant
            </h1>
            <p className="mt-6 max-w-3xl text-base leading-8 text-washi/70 sm:text-lg">
              Explain how you feel and receive calm, AI-guided medicine suggestions
              from the store inventory, designed to support safer conversations
              with a pharmacist or clinician.
            </p>
          </motion.div>

          <div className="grid gap-6">
            <AssistantInputPanel
              symptoms={symptoms}
              onSymptomsChange={setSymptoms}
              onSubmit={analyzeSymptoms}
              isLoading={isLoading}
            />
            {isLoading ? <ProcessingState /> : null}

            {error ? (
              <div className="landing-glass border-[#ffaaa5]/25 bg-[#ffaaa5]/10 p-5 text-sm leading-7 text-[#ffc2bd]">
                {error}
              </div>
            ) : null}

            {cartMessage ? (
              <div className="landing-glass border-[#a7e4e8]/25 p-5 text-sm leading-7 text-washi/72">
                {cartMessage}
              </div>
            ) : null}

            {responseState === "blocked_emergency" ? (
              <motion.section
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, ease: "easeOut" }}
                className="landing-glass border-[#ffaaa5]/30 bg-[#ffaaa5]/10 p-5 sm:p-6"
              >
                <div className="flex items-start gap-4">
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-[14px] border border-[#ffaaa5]/35 bg-[#ffaaa5]/10 text-[#ffc2bd]">
                    <AlertTriangle className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-[#ffc2bd]">Emergency warning</p>
                    <p className="mt-2 text-sm leading-7 text-washi/70">{message}</p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {emergencyKeywords.map((keyword) => (
                        <span
                          key={keyword}
                          className="rounded-full border border-[#ffaaa5]/30 bg-[#ffaaa5]/10 px-3 py-1 text-xs font-semibold text-[#ffc2bd]"
                        >
                          {keyword}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.section>
            ) : null}

            {responseState === "no_match" ? (
              <div className="landing-glass p-5 text-sm leading-7 text-washi/64">
                {message || "No matching medicine category was found. Please add more detail or speak with a pharmacist."}
              </div>
            ) : null}

            {recommendations.length ? (
              <motion.section
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="grid gap-4 md:grid-cols-3"
              >
                {recommendations.map((medicine, index) => (
                  <RecommendationCard
                    key={medicine.id}
                    index={index}
                    medicine={medicine}
                    onAddToCart={addRecommendationToCart}
                  />
                ))}
              </motion.section>
            ) : null}

            <motion.aside
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.35 }}
              transition={{ duration: 0.55, ease: "easeOut" }}
              className="landing-glass p-5 sm:p-6"
            >
              <div className="flex items-start gap-4">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-[14px] border border-[#d8e9cf]/25 bg-[#d8e9cf]/10 text-[#d8e9cf]">
                  <ShieldCheck className="h-5 w-5" aria-hidden="true" />
                </span>
                <div>
                  <p className="text-sm font-semibold text-washi">Safety note</p>
                  <p className="mt-2 text-sm leading-7 text-washi/60">
                    This AI does not replace professional medical advice.
                    Always consult a qualified healthcare professional for
                    diagnosis, dosage decisions, allergies, pregnancy,
                    chronic conditions, or urgent symptoms.
                  </p>
                </div>
              </div>
            </motion.aside>
          </div>
        </div>

        <aside className="lg:sticky lg:top-6 lg:h-fit">
          <RecommendationHistory
            searches={recentSearches}
            medicines={viewedMedicines}
            isLoading={isHistoryLoading}
          />
        </aside>
      </section>

      <footer className="border-t border-washi/10 px-5 py-8 sm:px-8">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-4 text-sm text-washi/55 md:flex-row">
          <p>AB Medical Assistance</p>
          <p className="flex items-center gap-2">
            <HeartHandshake className="h-4 w-4 text-[#a7e4e8]" aria-hidden="true" />
            Calm AI-assisted healthcare
          </p>
        </div>
      </footer>
    </main>
  );
}

export default CustomerAiAssistant;
