// src/pages/dashboard/AddSalonPage.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_BASE } from "../../config/api";

export default function AddSalonPage() {
  const navigate = useNavigate();

  // form state
  const [form, setForm] = useState({
    name: "",
    city: "",
    address: "",
    phone: "",
    whatsapp: "",
    plan_type: "basic", // "basic" or "premium"
    ownerEmail: "",
    ownerPassword: "",
  });

  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  function updateField(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (submitting) return;

    setSubmitting(true);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      const token = localStorage.getItem("sa_token");

      const res = await fetch(`${API_BASE}/api/superadmin/salons`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token || ""}`,
        },
        body: JSON.stringify({
          name: form.name,
          city: form.city,
          address: form.address,
          phone: form.phone,
          whatsapp: form.whatsapp,
          plan_type: form.plan_type,
          ownerEmail: form.ownerEmail,
          ownerPassword: form.ownerPassword,
        }),
      });

      const data = await res.json();

      if (!res.ok || data.ok === false) {
        throw new Error(data.error || "Failed to create salon");
      }

      // success!
      setSuccessMsg("Salon created successfully ✨");

      // backend should send { ok: true, salon: {...}, ownerUser: {...} }
      const newSalonId = data.salon?.id;
      if (newSalonId) {
        navigate(`/dashboard/salons/${newSalonId}`);
      } else {
        navigate("/dashboard/salons");
      }
    } catch (err) {
      console.error("AddSalon error:", err);
      setErrorMsg(err.message || "Failed to create salon");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="text-slate-100">
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <button
            onClick={() => navigate(-1)}
            className="text-xs text-slate-400 hover:text-white transition mb-2"
          >
            ← Back
          </button>

          <h1 className="text-xl font-semibold text-white tracking-tight flex items-center gap-2 flex-wrap">
            Add New Salon
            {form.plan_type === "premium" ? (
              <span className="inline-flex items-center rounded-md bg-emerald-500/10 px-2 py-0.5 text-[11px] font-medium text-emerald-400 ring-1 ring-inset ring-emerald-500/30">
                Premium
              </span>
            ) : (
              <span className="inline-flex items-center rounded-md bg-slate-500/10 px-2 py-0.5 text-[11px] font-medium text-slate-300 ring-1 ring-inset ring-slate-500/30">
                Basic
              </span>
            )}
          </h1>

          <p className="text-slate-400 text-sm mt-1">
            Create a salon profile and owner login.
          </p>
        </div>
      </div>

      {/* Messages */}
      <div className="mt-4 min-h-6">
        {errorMsg && (
          <p className="text-rose-400 text-sm">{errorMsg}</p>
        )}

        {successMsg && (
          <p className="text-emerald-400 text-sm">{successMsg}</p>
        )}
      </div>

      {/* Form card */}
      <div className="mt-6 rounded-xl border border-slate-800 bg-slate-900/70 ring-1 ring-white/5 shadow-lg p-4">
        <h2 className="text-sm font-semibold text-white flex items-center justify-between">
          <span>Salon Info</span>
          <span className="text-[10px] font-normal text-slate-500">
            Public details
          </span>
        </h2>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 text-sm text-slate-300"
        >
          {/* Salon fields */}
          <Field
            label="Salon Name *"
            placeholder="Glow Beauty Center"
            value={form.name}
            onChange={(v) => updateField("name", v)}
          />

          <Field
            label="City"
            placeholder="Riyadh"
            value={form.city}
            onChange={(v) => updateField("city", v)}
          />

          <Field
            label="Address"
            placeholder="King Fahd Rd, Exit 5..."
            value={form.address}
            onChange={(v) => updateField("address", v)}
          />

          <Field
            label="Phone"
            placeholder="0551234567"
            value={form.phone}
            onChange={(v) => updateField("phone", v)}
          />

          <Field
            label="WhatsApp"
            placeholder="0551234567"
            value={form.whatsapp}
            onChange={(v) => updateField("whatsapp", v)}
          />

          <SelectField
            label="Plan Type"
            value={form.plan_type}
            onChange={(v) => updateField("plan_type", v)}
            options={[
              { value: "basic", label: "Basic (booking only)" },
              {
                value: "premium",
                label: "Premium (booking + online store)",
              },
            ]}
          />

          {/* Owner login section */}
          <div className="md:col-span-2 rounded-lg border border-slate-800 bg-slate-900/40 p-4 ring-1 ring-white/5">
            <h3 className="text-xs font-semibold text-slate-200 uppercase tracking-wide mb-3">
              Owner Account
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field
                label="Owner Email *"
                placeholder="owner@glowbeauty.com"
                value={form.ownerEmail}
                onChange={(v) => updateField("ownerEmail", v)}
              />

              <Field
                label="Owner Password *"
                placeholder="••••••••"
                type="password"
                value={form.ownerPassword}
                onChange={(v) => updateField("ownerPassword", v)}
              />
            </div>

            <p className="text-[11px] text-slate-500 mt-3 leading-relaxed">
              The owner will use this email + password to log into their
              salon dashboard later. You’re saving this password hash in
              <span className="text-slate-300"> salon_users </span> table.
            </p>
          </div>

          {/* Submit actions */}
          <div className="md:col-span-2 flex flex-wrap gap-3 pt-2">
            <button
              type="button"
              className="rounded-lg bg-slate-700 text-slate-100 text-xs font-medium px-3 py-2 shadow ring-1 ring-white/10 hover:bg-slate-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={() => navigate(-1)}
              disabled={submitting}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="rounded-lg bg-[#E39B34] text-slate-900 text-xs font-semibold px-3 py-2 shadow ring-1 ring-white/10 hover:bg-[#cf8a2b] transition disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={
                submitting ||
                !form.name.trim() ||
                !form.ownerEmail.trim() ||
                !form.ownerPassword.trim()
              }
            >
              {submitting ? "Creating…" : "Create Salon"}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}

// shared field components
function Field({ label, value, onChange, placeholder, type = "text" }) {
  return (
    <label className="flex flex-col gap-1">
      <span className="text-[11px] uppercase tracking-wide text-slate-400">
        {label}
      </span>
      <input
        className="rounded-lg bg-slate-800 text-white text-sm px-3 py-2 ring-1 ring-white/10 shadow-inner placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#E39B34]"
        value={value}
        type={type}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
      />
    </label>
  );
}

function SelectField({ label, value, onChange, options }) {
  return (
    <label className="flex flex-col gap-1">
      <span className="text-[11px] uppercase tracking-wide text-slate-400">
        {label}
      </span>
      <select
        className="rounded-lg bg-slate-800 text-white text-sm px-3 py-2 ring-1 ring-white/10 shadow-inner focus:outline-none focus:ring-2 focus:ring-[#E39B34]"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        {options.map((opt) => (
          <option
            key={opt.value}
            value={opt.value}
            className="bg-slate-900 text-white"
          >
            {opt.label}
          </option>
        ))}
      </select>
    </label>
  );
}
