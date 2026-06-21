import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { BrowserRouter, Navigate, Route, Routes, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  BrainCircuit,
  HeartPulse,
  Pill,
  ShieldCheck,
  Sparkles,
  Stethoscope
} from "lucide-react";
import AiRecommendationCard from "./components/AiRecommendationCard.jsx";
import FloatingPharmaVisuals from "./components/FloatingPharmaVisuals.jsx";
import MetricCard from "./components/MetricCard.jsx";
import ServiceCard from "./components/ServiceCard.jsx";
import SignalGrid from "./components/SignalGrid.jsx";
import CustomerAiAssistant from "./pages/CustomerAiAssistant.jsx";
import CustomerCartCheckout from "./pages/CustomerCartCheckout.jsx";
import CustomerDashboard from "./pages/CustomerDashboard.jsx";
import CustomerOrders from "./pages/CustomerOrders.jsx";
import Contact from "./pages/Contact.jsx";
import ProductCatalog from "./pages/ProductCatalog.jsx";
import OwnerDashboard from "./pages/OwnerDashboard.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Services from "./pages/Services.jsx";
import SystemArchitecture from "./pages/SystemArchitecture.jsx";
import { clearAuth, getAuthHeaders, getCurrentUser, getRefreshToken, userHasRole } from "./auth.js";

const services = [
  {
    icon: BrainCircuit,
    title: "AI Triage",
    copy: "Symptom intake, urgency scoring, and smart routing for faster medical assistance."
  },
  {
    icon: HeartPulse,
    title: "Patient Monitoring",
    copy: "Live vitals context, risk markers, and care alerts presented with clinical clarity."
  },
  {
    icon: ShieldCheck,
    title: "Secure Care Flow",
    copy: "Privacy-first workflows for teams coordinating sensitive patient support."
  }
];

const stats = [
  { label: "Response Model", value: "24/7" },
  { label: "Care Routing", value: "AI+" },
  { label: "Signal Review", value: "Live" }
];

function AccessNotice({ title, message, actionHref = "/login", actionLabel = "Login" }) {
  return (
    <main className="min-h-screen bg-[#081522] px-5 py-10 text-washi sm:px-8">
      <div className="fixed inset-0 -z-20 bg-[radial-gradient(circle_at_18%_12%,rgba(147,214,220,0.2),transparent_30%),radial-gradient(circle_at_84%_20%,rgba(255,155,154,0.16),transparent_28%),linear-gradient(135deg,#0a1826_0%,#102436_46%,#192633_72%,#1a242a_100%)]" />
      <section className="mx-auto flex min-h-[70vh] max-w-xl items-center">
        <div className="landing-glass w-full p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#a7e4e8]">Access Control</p>
          <h1 className="mt-3 text-3xl font-semibold">{title}</h1>
          <p className="mt-4 text-sm leading-7 text-washi/60">{message}</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <a className="rounded-full border border-[#a7e4e8]/45 bg-[#dff8f8] px-5 py-3 text-sm font-bold text-[#0d1b26]" href={actionHref}>
              {actionLabel}
            </a>
            <a className="rounded-full border border-washi/15 bg-washi/[0.055] px-5 py-3 text-sm font-semibold text-washi/75" href="/products">
              Browse Products
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}

function ProtectedRoute({ allowedRoles, children }) {
  const user = getCurrentUser();

  if (!user) {
    return (
      <AccessNotice
        title="Login required"
        message="Please login before opening this protected workspace."
      />
    );
  }

  if (!userHasRole(user, allowedRoles)) {
    return (
      <AccessNotice
        title="Access blocked"
        message="Your current role cannot open this page."
        actionHref={user.role === "customer" ? "/cart" : "/owner-dashboard"}
        actionLabel={user.role === "customer" ? "Go to Cart" : "Go to Dashboard"}
      />
    );
  }

  return children;
}

function Logout() {
  const navigate = useNavigate();

  React.useEffect(() => {
    async function logout() {
      const refresh = getRefreshToken();

      if (refresh) {
        try {
          await fetch("/api/auth/logout/", {
            method: "POST",
            headers: { "Content-Type": "application/json", ...getAuthHeaders() },
            body: JSON.stringify({ refresh })
          });
        } catch {
          // Local logout should still complete during development if the API is unavailable.
        }
      }

      clearAuth();
      navigate("/", { replace: true });
    }

    logout();
  }, [navigate]);

  return (
    <AccessNotice
      title="Logging out"
      message="Ending your session and returning you to the public home page."
      actionHref="/"
      actionLabel="Home"
    />
  );
}

function RedirectToLogin() {
  return <Navigate to="/login" replace />;
}

function Home() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#081522] text-washi">
      <div className="fixed inset-0 -z-20 bg-[radial-gradient(circle_at_18%_12%,rgba(147,214,220,0.2),transparent_30%),radial-gradient(circle_at_84%_20%,rgba(255,155,154,0.16),transparent_28%),radial-gradient(circle_at_52%_86%,rgba(244,239,228,0.08),transparent_32%),linear-gradient(135deg,#0a1826_0%,#102436_46%,#192633_72%,#1a242a_100%)]" />
      <div className="fixed inset-0 -z-20 bg-[radial-gradient(circle_at_50%_0%,rgba(244,239,228,0.1),transparent_36%)]" />
      <div className="fixed inset-0 -z-20 opacity-[0.045] bg-[linear-gradient(rgba(244,239,228,0.82)_1px,transparent_1px),linear-gradient(90deg,rgba(244,239,228,0.82)_1px,transparent_1px)] bg-[size:72px_72px]" />
      <div className="fixed inset-0 -z-20 bg-[linear-gradient(115deg,transparent_0%,rgba(147,214,220,.04)_42%,rgba(255,155,154,.035)_58%,transparent_78%)]" />

      <header className="relative z-10 mx-auto flex w-full max-w-7xl items-center justify-between px-5 py-7 sm:px-8">
        <a href="/" className="flex items-center gap-3" aria-label="AB Medical Assistance">
          <span className="grid h-11 w-11 place-items-center rounded-[14px] border border-[#93d6dc]/30 bg-[#dff8f8]/10 shadow-[0_0_34px_rgba(147,214,220,.12)] backdrop-blur">
            <Stethoscope className="h-5 w-5 text-[#a7e4e8]" aria-hidden="true" />
          </span>
          <span className="text-sm font-semibold uppercase tracking-[0.24em] text-washi/90">
            AB Medical
          </span>
        </a>

        <nav className="hidden items-center gap-8 text-sm text-washi/60 md:flex">
          <a className="transition hover:text-[#a7e4e8]" href="/services">
            Services
          </a>
          <a className="transition hover:text-[#a7e4e8]" href="/system">
            System
          </a>
          <a className="transition hover:text-[#a7e4e8]" href="/contact">
            Contact
          </a>
          <a className="transition hover:text-[#a7e4e8]" href="/login">
            Login
          </a>
          <a className="transition hover:text-[#a7e4e8]" href="/register">
            Register
          </a>
        </nav>
      </header>

      <section className="relative mx-auto grid min-h-[calc(100vh-92px)] w-full max-w-7xl items-center gap-14 px-5 pb-20 pt-8 sm:px-8 lg:grid-cols-[1.02fr_0.98fr] lg:gap-16 lg:pb-24">
        <FloatingPharmaVisuals />
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="relative z-10 max-w-3xl"
        >
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-[#ffaaa5]/30 bg-[#ffaaa5]/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#ffc2bd] shadow-[0_0_30px_rgba(255,155,154,.1)] backdrop-blur">
            <Sparkles className="h-4 w-4" aria-hidden="true" />
            Tokyo pharmaceutical AI
          </div>

          <h1 className="text-balance text-5xl font-semibold leading-[0.96] tracking-normal text-washi sm:text-6xl md:text-7xl lg:text-[5.7rem]">
            AB Medical
            <span className="block bg-gradient-to-r from-[#a7e4e8] via-[#f4efe4] to-[#ffb0a8] bg-clip-text text-transparent drop-shadow-[0_0_24px_rgba(147,214,220,.18)]">
              Assistance
            </span>
          </h1>
          <p className="mt-8 max-w-2xl text-base leading-8 text-washi/70 sm:text-lg">
            A precision pharmaceutical AI platform for symptom analysis, medicine
            guidance, clinical routing, and real-time assistance with a calm
            Japanese future-clinic interface.
          </p>

          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <a
              href="/contact"
              className="group inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-[#a7e4e8]/45 bg-[#dff8f8] px-6 py-3 text-sm font-bold text-[#0d1b26] shadow-[0_18px_45px_rgba(147,214,220,.16)] transition hover:bg-washi"
            >
              Start Assessment
              <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" aria-hidden="true" />
            </a>
            <a
              href="/services"
              className="inline-flex min-h-12 items-center justify-center rounded-full border border-washi/15 bg-washi/[0.055] px-6 py-3 text-sm font-semibold text-washi/80 backdrop-blur transition hover:border-[#ffaaa5]/35 hover:bg-[#ffaaa5]/10 hover:text-[#ffc2bd]"
            >
              Explore Platform
            </a>
          </div>

          <div className="mt-12 grid max-w-2xl grid-cols-1 gap-3 sm:grid-cols-3">
            {stats.map((stat) => (
              <MetricCard key={stat.label} {...stat} />
            ))}
          </div>
        </motion.div>

        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, scale: 0.96, x: 30 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
            className="relative z-10 mx-auto w-full max-w-xl"
          >
            <SignalGrid />
          </motion.div>
        </AnimatePresence>
      </section>

      <motion.section
        id="services"
        initial={{ opacity: 0, y: 36 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.18 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="relative border-y border-washi/10 bg-[#102436]/54 px-5 py-20 backdrop-blur-xl sm:px-8"
      >
        <div className="mx-auto max-w-7xl">
          <div className="mb-9 flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#a7e4e8]">
                Clinical Intelligence
              </p>
              <h2 className="mt-3 text-3xl font-semibold text-washi sm:text-5xl">
                Built for calm decisions under pressure.
              </h2>
            </div>
            <p className="max-w-xl text-sm leading-6 text-washi/60">
              Layered AI assistance for pharmacy workflows, patient context,
              and guided recommendations without sacrificing visual clarity.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {services.map((service, index) => (
              <ServiceCard key={service.title} index={index} {...service} />
            ))}
          </div>
        </div>
      </motion.section>

      <motion.section
        id="system"
        initial={{ opacity: 0, y: 36 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="px-5 py-20 sm:px-8"
      >
        <div className="mx-auto grid max-w-7xl gap-5 lg:grid-cols-[0.82fr_1.18fr]">
          <div className="landing-glass p-6">
            <Pill className="mb-6 h-8 w-8 text-[#ffaaa5]" aria-hidden="true" />
            <h2 className="text-2xl font-semibold">Kyoto Protocol Interface</h2>
            <p className="mt-4 text-sm leading-7 text-washi/60">
              A disciplined visual language blending Japanese night-city
              restraint, pharmacy-grade scanning, and readable medical telemetry.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            {["Symptom Intake", "Care Matching", "Escalation"].map((item, index) => (
              <motion.div
                key={item}
                whileHover={{ y: -6 }}
                className="landing-glass p-5"
              >
                <p className="text-xs font-semibold text-[#a7e4e8]">0{index + 1}</p>
                <p className="mt-10 text-lg font-semibold">{item}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      <section className="px-5 pb-20 sm:px-8">
        <div className="mx-auto grid max-w-7xl gap-5 lg:grid-cols-[0.94fr_1.06fr] lg:items-center">
          <motion.div
            initial={{ opacity: 0, x: -28 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.35 }}
            transition={{ duration: 0.65, ease: "easeOut" }}
          >
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#a7e4e8]">
              Recommendation Engine
            </p>
            <h2 className="mt-3 text-3xl font-semibold text-washi sm:text-5xl">
              AI suggestions with visible confidence.
            </h2>
            <p className="mt-5 max-w-xl text-sm leading-7 text-washi/60">
              The demo card previews how the platform can communicate symptom
              intake, medicine options, confidence levels, and processing state
              without overwhelming the user.
            </p>
          </motion.div>
          <AiRecommendationCard />
        </div>
      </section>

      <footer id="contact" className="border-t border-washi/10 px-5 py-8 sm:px-8">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-4 text-sm text-washi/55 md:flex-row">
          <p>AB Medical Assistance</p>
          <p>Medical AI landing page prototype</p>
        </div>
      </footer>
    </main>
  );
}

function OrdersRoute() {
  const user = getCurrentUser();

  if (!user) {
    return <RedirectToLogin />;
  }

  return (
    <ProtectedRoute allowedRoles={["customer"]}>
      <CustomerOrders />
    </ProtectedRoute>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/services" element={<Services />} />
        <Route path="/system" element={<SystemArchitecture />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/products" element={<ProductCatalog />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/logout" element={<Logout />} />
        <Route
          path="/customer-dashboard"
          element={
            <ProtectedRoute allowedRoles={["customer"]}>
              <CustomerDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/cart"
          element={
            <ProtectedRoute allowedRoles={["customer"]}>
              <CustomerCartCheckout />
            </ProtectedRoute>
          }
        />
        <Route path="/orders" element={<OrdersRoute />} />
        <Route
          path="/ai-assistant"
          element={
            <ProtectedRoute allowedRoles={["customer"]}>
              <CustomerAiAssistant />
            </ProtectedRoute>
          }
        />
        <Route
          path="/owner-dashboard"
          element={
            <ProtectedRoute allowedRoles={["owner", "admin"]}>
              <OwnerDashboard />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
