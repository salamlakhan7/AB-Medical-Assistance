import React, { useState } from "react";
import { LogIn, Stethoscope } from "lucide-react";
import { storeAuth } from "../auth.js";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "/api";

function Login() {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    if (!formData.username.trim() || !formData.password) {
      setError("Username and password are required.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(`${API_BASE_URL}/auth/login/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error("Invalid username or password.");
      }

      const authData = await response.json();
      storeAuth(authData);

      if (authData.user.role === "owner" || authData.user.role === "admin") {
        window.location.href = "/owner-dashboard";
      } else {
        window.location.href = "/customer-dashboard";
      }
    } catch (requestError) {
      setError(requestError.message || "Unable to login.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#081522] px-5 py-10 text-washi sm:px-8">
      <div className="fixed inset-0 -z-20 bg-[radial-gradient(circle_at_18%_12%,rgba(147,214,220,0.2),transparent_30%),radial-gradient(circle_at_84%_20%,rgba(255,155,154,0.16),transparent_28%),linear-gradient(135deg,#0a1826_0%,#102436_46%,#192633_72%,#1a242a_100%)]" />
      <section className="mx-auto max-w-md">
        <a href="/" className="mb-8 flex items-center gap-3">
          <span className="grid h-11 w-11 place-items-center rounded-[14px] border border-[#93d6dc]/30 bg-[#dff8f8]/10">
            <Stethoscope className="h-5 w-5 text-[#a7e4e8]" aria-hidden="true" />
          </span>
          <span className="text-sm font-semibold uppercase tracking-[0.24em]">AB Medical</span>
        </a>

        <form onSubmit={handleSubmit} className="landing-glass p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#a7e4e8]">Secure Access</p>
          <h1 className="mt-3 text-3xl font-semibold">Login</h1>

          <label className="mt-7 block">
            <span className="mb-2 block text-sm text-washi/70">Username</span>
            <input
              className="min-h-12 w-full rounded-[18px] border border-washi/10 bg-[#102436]/60 px-4 text-sm outline-none focus:border-[#a7e4e8]/40"
              value={formData.username}
              onChange={(event) => setFormData({ ...formData, username: event.target.value })}
            />
          </label>

          <label className="mt-4 block">
            <span className="mb-2 block text-sm text-washi/70">Password</span>
            <input
              className="min-h-12 w-full rounded-[18px] border border-washi/10 bg-[#102436]/60 px-4 text-sm outline-none focus:border-[#a7e4e8]/40"
              type="password"
              value={formData.password}
              onChange={(event) => setFormData({ ...formData, password: event.target.value })}
            />
          </label>

          {error ? <p className="mt-4 text-sm text-[#ffc2bd]">{error}</p> : null}

          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-6 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full border border-[#a7e4e8]/45 bg-[#dff8f8] px-6 py-3 text-sm font-bold text-[#0d1b26] transition hover:bg-washi disabled:opacity-60"
          >
            <LogIn className="h-4 w-4" aria-hidden="true" />
            {isSubmitting ? "Logging in..." : "Login"}
          </button>

          <p className="mt-5 text-center text-sm text-washi/55">
            New here? <a className="text-[#a7e4e8]" href="/register">Create an account</a>
          </p>
        </form>
      </section>
    </main>
  );
}

export default Login;
