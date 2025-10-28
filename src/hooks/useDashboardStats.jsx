// src/hooks/useDashboardStats.js
import { useEffect, useState, useCallback } from "react";
import { API_BASE } from "../config/api";

export function useDashboardStats() {
  const [stats, setStats] = useState({
    totalSalons: 0,
    activeSalons: 0,
    premiumSalons: 0,
    activeBookings: 0,
    monthlyRevenueSAR: 0,
    openComplaints: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchStats = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("sa_token");

      const res = await fetch(`${API_BASE}/api/superadmin/stats`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token || ""}`,
        },
      });

      const data = await res.json();

      if (!res.ok || data.ok === false) {
        throw new Error(data.error || "Failed to load dashboard stats");
      }

      setStats(data.stats || {});
    } catch (err) {
      console.error("fetchStats error:", err);
      setError(err.message || "Failed to load dashboard stats");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return { stats, loading, error, refetch: fetchStats };
}
