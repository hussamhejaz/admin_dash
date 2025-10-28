// src/hooks/useAdminAuth.js
import { useState, useCallback } from "react";

const API_BASE = (import.meta.env.VITE_API_URL || "").replace(/\/+$/, "");

export default function useAdminAuth() {
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState("");

  const login = useCallback(async ({ email, password }) => {
    setSubmitting(true);
    setServerError("");

    try {
      if (!email || !password) {
        throw new Error("Missing email or password");
      }
      
      const res = await fetch(`${API_BASE}/api/superadmin/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      // Read body once as text
      const raw = await res.text();

      // Try to decode JSON from the body
      let data = null;
      try {
        data = raw ? JSON.parse(raw) : null;
      } catch (e) {
        data = e;
      }

      // If HTTP status is not ok, throw with best message we have
      if (!res.ok) {
        const msg =
          (data && (data.error || data.message)) ||
          `Login failed (${res.status})`;
        throw new Error(msg);
      }

      // Accept either shape:
      // { ok:true, token, user }  OR  { token, user }
      const ok = data?.ok ?? Boolean(data?.token);

      if (!ok || !data?.token || !data?.user) {
        throw new Error(
          (data && data.error) || "Invalid response from server"
        );
      }

      const { token, user } = data;

      // Persist session (support both naming schemes)
      localStorage.setItem("admin_token", token);
      localStorage.setItem("admin_user", JSON.stringify(user));

      localStorage.setItem("sa_token", token);
      localStorage.setItem("sa_role", user.role || "superadmin");

      return { ok: true, user };
    } catch (err) {
      console.error("login error:", err);
      setServerError(err.message || "Login failed");
      return { ok: false };
    } finally {
      setSubmitting(false);
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("admin_token");
    localStorage.removeItem("admin_user");
    localStorage.removeItem("sa_token");
    localStorage.removeItem("sa_role");
  }, []);

  return {
    submitting,
    serverError,
    login,
    logout,
    clearError: () => setServerError(""),
  };
}
