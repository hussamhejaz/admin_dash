// src/components/RequireAdmin.jsx
import React from "react";
import { Navigate, useLocation } from "react-router-dom";

export default function RequireAdmin({ children }) {
  // 1. Check if we have a stored token from Login
  const token = localStorage.getItem("sa_token");
  const role  = localStorage.getItem("sa_role") || "superadmin"; 
  // ^ for now we assume superadmin. Later we'll store real role after Supabase login.

  const location = useLocation();

  // Not logged in at all -> go login
  if (!token) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  // Logged in but wrong role -> block UI
  if (role !== "superadmin") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 text-slate-100 p-8 text-center">
        <div>
          <div className="text-xl font-semibold mb-4">Access denied</div>
          <p className="text-sm text-slate-400">
            Your account is not authorized to view this dashboard.
          </p>
        </div>
      </div>
    );
  }

  // Allowed
  return children;
}
