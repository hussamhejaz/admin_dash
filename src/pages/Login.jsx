// src/pages/Login.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import useAdminAuth from "../hooks/useAdminAuth";

const BRAND = "#E39B34";
const BRAND_DARK = "#CF8A2B";
const BG_TINT = "rgba(227,155,52,0.08)";

export default function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});

  // from hook
  const { submitting, serverError, login, clearError } = useAdminAuth();

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));

    if (serverError) clearError();
  }

  function validate(values) {
    const e = {};

    if (!values.email.trim()) {
      e.email = "Enter your email.";
    } else if (!/^[^@]+@[^@]+\.[^@]+$/.test(values.email)) {
      e.email = "Please enter a valid email.";
    }

    if (!values.password) {
      e.password = "Enter your password.";
    }

    return e;
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const v = validate(form);
    setErrors(v);
    if (Object.keys(v).length > 0) return;

    const result = await login({
      email: form.email,
      password: form.password,
    });

    if (result.ok) {
      // go to dashboard home
      navigate("/dashboard", { replace: true });
    }
  }

  return (
    <main
      className="min-h-screen flex items-center justify-center px-4 py-12"
      style={{
        backgroundImage: `radial-gradient(circle at 20% 20%, ${BG_TINT} 0%, transparent 60%)`,
        backgroundColor: "#0f172a",
      }}
    >
      {/* Card */}
      <section className="w-full max-w-md">
        <div className="rounded-2xl bg-white shadow-2xl ring-1 ring-black/5 p-8 relative overflow-hidden">
          {/* Header / badge */}
          <div className="text-center">
            <div
              className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-full text-white font-extrabold shadow-lg ring-4 ring-white"
              style={{ backgroundColor: BRAND }}
            >
              SA
            </div>

            <h1 className="text-xl font-semibold text-slate-900 tracking-tight">
              Super Admin Login
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Sign in to manage salons.
            </p>
          </div>

          {/* server error */}
          {serverError && (
            <div
              className="mt-6 rounded-xl p-3 text-sm font-medium text-center"
              style={{
                backgroundColor: "rgba(220,38,38,0.08)",
                color: "#b91c1c",
                border: "1px solid rgba(220,38,38,0.2)",
              }}
            >
              {serverError}
            </div>
          )}

          {/* form */}
          <form onSubmit={handleSubmit} className="mt-6 space-y-5">
            <Field
              id="email"
              name="email"
              type="email"
              label="Email"
              value={form.email}
              onChange={handleChange}
              error={errors.email}
              autoComplete="email"
            />

            <Field
              id="password"
              name="password"
              type="password"
              label="Password"
              value={form.password}
              onChange={handleChange}
              error={errors.password}
              autoComplete="current-password"
            />

            <button
              type="submit"
              disabled={submitting}
              className="w-full inline-flex items-center justify-center rounded-xl font-semibold text-white text-sm px-4 py-3 shadow-sm transition disabled:opacity-60"
              style={{ backgroundColor: BRAND }}
              onMouseEnter={(e) => {
                if (!submitting)
                  e.currentTarget.style.backgroundColor = BRAND_DARK;
              }}
              onMouseLeave={(e) => {
                if (!submitting)
                  e.currentTarget.style.backgroundColor = BRAND;
              }}
            >
              {submitting ? "Signing in..." : "Sign in"}
            </button>
          </form>

          {/* footer helper */}
          <div className="mt-6 text-center text-xs text-slate-500 flex flex-col gap-2">
            <button
              type="button"
              className="hover:text-slate-700 transition underline underline-offset-2"
              onClick={() => {
                alert("TODO: forgot password flow");
              }}
            >
              Forgot password?
            </button>

            <span className="text-[10px] leading-relaxed text-slate-400">
              This panel is for platform administrators only.
            </span>
          </div>

          {/* glow blob */}
          <div
            className="pointer-events-none absolute -z-10 blur-2xl opacity-30"
            style={{
              background: BRAND,
              width: "240px",
              height: "240px",
              borderRadius: "9999px",
              left: "50%",
              top: "60%",
              transform: "translateX(-50%)",
              filter: "blur(80px)",
            }}
          />
        </div>
      </section>
    </main>
  );
}

function Field({
  id,
  name,
  type,
  label,
  value,
  onChange,
  error,
  autoComplete,
}) {
  const hasValue = value && value.length > 0;

  return (
    <div className="group text-left">
      <div
        className="relative rounded-xl border bg-white transition ring-0 focus-within:ring-2"
        style={{
          borderColor: error
            ? "rgba(220,38,38,0.4)"
            : "rgba(227,155,52,0.25)",
          boxShadow: "inset 0 1px 0 rgba(255,255,255,.6)",
        }}
      >
        <input
          id={id}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : undefined}
          autoComplete={autoComplete}
          className="peer w-full bg-transparent outline-none rounded-xl px-4 py-3 text-sm text-slate-900 placeholder-transparent"
          placeholder={label}
        />

        <label
          htmlFor={id}
          className={`absolute pointer-events-none text-slate-500 text-sm left-4 top-1/2 -translate-y-1/2 transition-all
            peer-focus:top-2 peer-focus:text-[10px] peer-focus:text-slate-500
            ${hasValue ? "top-2 text-[10px] text-slate-500" : ""}`}
        >
          {label}
        </label>
      </div>

      {error && (
        <p
          id={`${id}-error`}
          className="mt-1 text-xs text-rose-600 font-medium"
        >
          {error}
        </p>
      )}
    </div>
  );
}
