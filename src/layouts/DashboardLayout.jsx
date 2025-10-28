// src/layouts/DashboardLayout.jsx
import Sidebar from "../components/Sidebar";
import { Outlet } from "react-router-dom";

export default function DashboardLayout() {
  return (
    <div className="min-h-screen flex bg-slate-950 text-slate-100">
      {/* Left sidebar */}
      <Sidebar />

      {/* Right content area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar / header */}
        <header className="h-16 flex items-center justify-between border-b border-slate-800 bg-slate-900/60 backdrop-blur px-4">
          {/* left side: title / breadcrumb */}
          <div className="text-sm font-medium text-white">
            Super Admin Dashboard
          </div>

          {/* right side: version + avatar */}
          <div className="flex items-center gap-4">
            <div className="text-xs text-slate-400">
              v0.1
            </div>

            <div className="h-8 w-8 rounded-full bg-[#E39B34] text-slate-900 text-xs font-bold grid place-items-center ring-2 ring-white/10 shadow">
              SA
            </div>
          </div>
        </header>

        {/* Scrollable page content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-slate-950">
          <div className="max-w-7xl mx-auto w-full">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
