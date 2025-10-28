// src/hooks/useSalons.js
import { useEffect, useState, useCallback } from "react";
import { API_BASE } from "../config/api";

export function useSalons() {
  const [salons, setSalons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState(null);

  function getAuthHeaders() {
    const token = localStorage.getItem("sa_token");
    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token || ""}`,
    };
  }

  const fetchSalons = useCallback(async () => {
    console.log("[useSalons] API_BASE =", API_BASE);

    try {
      setLoading(true);
      setError("");

      const res = await fetch(`${API_BASE}/api/superadmin/salons`, {
        method: "GET",
        headers: getAuthHeaders(),
      });

      console.log("[useSalons] fetch status =", res.status);

      // try/catch because if CORS blocks, .json() can throw
      const data = await res.json().catch(() => ({}));
      console.log("[useSalons] response body =", data);

      if (!res.ok || data.ok === false) {
        throw new Error(data.error || "Failed to load salons");
      }

      setSalons(data.salons || []);
    } catch (err) {
      console.error("[useSalons] error:", err);
      setError(err.message || "Failed to load salons");
      setSalons([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteSalon = useCallback(async (salonId) => {
    if (!salonId) return;

    try {
      setDeletingId(salonId);
      setError("");

      const res = await fetch(
        `${API_BASE}/api/superadmin/salons/${salonId}`,
        {
          method: "DELETE",
          headers: getAuthHeaders(),
        }
      );

      console.log("[useSalons] delete status =", res.status);

      const data = await res.json().catch(() => ({}));
      console.log("[useSalons] delete response body =", data);

      if (!res.ok || data.ok === false) {
        throw new Error(data.error || "Failed to delete salon");
      }

      setSalons((prev) => prev.filter((s) => s.id !== salonId));
    } catch (err) {
      console.error("[useSalons] delete error:", err);
      setError(err.message || "Failed to delete salon");
    } finally {
      setDeletingId(null);
    }
  }, []);

  useEffect(() => {
    fetchSalons();
  }, [fetchSalons]);

  return {
    salons,
    loading,
    error,
    deletingId,
    fetchSalons,
    deleteSalon,
  };
}
