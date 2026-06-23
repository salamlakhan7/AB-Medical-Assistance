import React, { useState } from "react";
import { UserPlus, Stethoscope } from "lucide-react";


const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://ab-medical-assistance-production.up.railway.app/api";

function Register() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    first_name: "",
    last_name: "",
    role: "customer"
  });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    if (!formData.username.trim() || !formData.password || !formData.role) {
      setError("Username, password, and role are required.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(`${API_BASE_URL}/auth/register/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => ({}));
        throw new Error(Object.values(payload).flat().join(" ") || "Unable to register.");
      }

      window.location.href = "/login";
    } catch (requestError) {
      setError(requestError.message || "Unable to register.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#081522] px-5 py-10 text-washi sm:px-8">
      <div className="fixed inset-0 -z-20 bg-[radial-gradient(circle_at_18%_12%,rgba(147,214,220,0.2),transparent_30%),radial-gradient(circle_at_84%_20%,rgba(255,155,154,0.16),transparent_28%),linear-gradient(135deg,#0a1826_0%,#102436_46%,#192633_72%,#1a242a_100%)]" />
      <section className="mx-auto max-w-xl">
        <a href="/" className="mb-8 flex items-center gap-3">
          <span className="grid h-11 w-11 place-items-center rounded-[14px] border border-[#93d6dc]/30 bg-[#dff8f8]/10">
            <Stethoscope className="h-5 w-5 text-[#a7e4e8]" aria-hidden="true" />
          </span>
          <span className="text-sm font-semibold uppercase tracking-[0.24em]">AB Medical</span>
        </a>

        <form onSubmit={handleSubmit} className="landing-glass p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#a7e4e8]">Account Setup</p>
          <h1 className="mt-3 text-3xl font-semibold">Register</h1>

          <div className="mt-7 grid gap-4 sm:grid-cols-2">
            <input className="min-h-12 rounded-[18px] border border-washi/10 bg-[#102436]/60 px-4 text-sm outline-none focus:border-[#a7e4e8]/40" placeholder="Username" value={formData.username} onChange={(event) => setFormData({ ...formData, username: event.target.value })} />
            <input className="min-h-12 rounded-[18px] border border-washi/10 bg-[#102436]/60 px-4 text-sm outline-none focus:border-[#a7e4e8]/40" placeholder="Email" value={formData.email} onChange={(event) => setFormData({ ...formData, email: event.target.value })} />
            <input className="min-h-12 rounded-[18px] border border-washi/10 bg-[#102436]/60 px-4 text-sm outline-none focus:border-[#a7e4e8]/40" placeholder="First name" value={formData.first_name} onChange={(event) => setFormData({ ...formData, first_name: event.target.value })} />
            <input className="min-h-12 rounded-[18px] border border-washi/10 bg-[#102436]/60 px-4 text-sm outline-none focus:border-[#a7e4e8]/40" placeholder="Last name" value={formData.last_name} onChange={(event) => setFormData({ ...formData, last_name: event.target.value })} />
            <input className="min-h-12 rounded-[18px] border border-washi/10 bg-[#102436]/60 px-4 text-sm outline-none focus:border-[#a7e4e8]/40" type="password" placeholder="Password" value={formData.password} onChange={(event) => setFormData({ ...formData, password: event.target.value })} />
            <select className="min-h-12 rounded-[18px] border border-washi/10 bg-[#102436]/60 px-4 text-sm outline-none focus:border-[#a7e4e8]/40" value={formData.role} onChange={(event) => setFormData({ ...formData, role: event.target.value })}>
              <option value="customer">Customer</option>
              <option value="owner">Owner</option>
            </select>
          </div>

          {error ? <p className="mt-4 text-sm text-[#ffc2bd]">{error}</p> : null}

          <button type="submit" disabled={isSubmitting} className="mt-6 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full border border-[#a7e4e8]/45 bg-[#dff8f8] px-6 py-3 text-sm font-bold text-[#0d1b26] transition hover:bg-washi disabled:opacity-60">
            <UserPlus className="h-4 w-4" aria-hidden="true" />
            {isSubmitting ? "Creating..." : "Create Account"}
          </button>

          <p className="mt-5 text-center text-sm text-washi/55">
            Already registered? <a className="text-[#a7e4e8]" href="/login">Login</a>
          </p>
        </form>
      </section>
    </main>
  );
}

export default Register;
