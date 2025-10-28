// src/hooks/useAdminSession.js
import { useMemo } from "react";

export default function useAdminSession() {
  const token =
    localStorage.getItem("sa_token") ||
    localStorage.getItem("admin_token") ||
    null;

  const role =
    localStorage.getItem("sa_role") ||
    (() => {
      const u = localStorage.getItem("admin_user");
      try { return (u && JSON.parse(u)?.role) || "superadmin"; } catch { return "superadmin"; }
    })();

  return useMemo(() => ({ isAuthed: !!token, role, token }), [token, role]);
}
