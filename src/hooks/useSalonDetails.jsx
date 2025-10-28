// src/hooks/useSalonDetails.js
import { useEffect, useState, useCallback } from "react";
import { API_BASE } from "../config/api";

export function useSalonDetails(salonId) {
  const [salon, setSalon] = useState(null);
  const [owner, setOwner] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  function getAuthHeaders() {
    const token = localStorage.getItem("sa_token");
    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token || ""}`,
    };
  }

  const fetchDetails = useCallback(async () => {
    if (!salonId) return;

    try {
      setLoading(true);
      setError("");

      const res = await fetch(`${API_BASE}/api/superadmin/salons/${salonId}`, {
        method: "GET",
        headers: getAuthHeaders(),
      });

      const data = await res.json();

      if (!res.ok || data.ok === false) {
        throw new Error(data.error || "Failed to load salon");
      }

      setSalon(data.salon || null);
      setOwner(data.owner || null);
    } catch (err) {
      console.error("fetchDetails error:", err);
      setError(err.message || "Failed to load salon");
    } finally {
      setLoading(false);
    }
  }, [salonId]);

  useEffect(() => {
    fetchDetails();
  }, [fetchDetails]);

  return {
    salon,
    owner,
    loading,
    error,
    refetch: fetchDetails,
  };
}
