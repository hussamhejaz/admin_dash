// src/pages/dashboard/DashboardHome.jsx
import { useDashboardStats } from "../../hooks/useDashboardStats";

export default function DashboardHome() {
  const { stats, loading, error } = useDashboardStats();

  // format helpers
  const money = (num) => `SAR ${Number(num || 0).toLocaleString()}`;

  return (
    <section className="text-slate-100">
      {/* Page header */}
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-xl font-semibold text-white tracking-tight">
            Overview
          </h1>

          <p className="text-slate-400 text-sm mt-2 max-w-prose">
            High-level status of the platform: salons, bookings, revenue,
            issues. Only visible to Super Admin.
          </p>
        </div>
      </div>

      {/* state message area */}
      <div className="mt-4 min-h-6">
        {loading && (
          <p className="text-slate-400 text-sm">Loading stats…</p>
        )}

        {!loading && error && (
          <p className="text-rose-400 text-sm">{error}</p>
        )}
      </div>

      {/* headline stats row */}
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total Salons"
          value={loading ? "…" : stats.totalSalons}
          note={
            loading
              ? ""
              : `${stats.activeSalons} active / ${stats.premiumSalons} premium`
          }
        />

        <StatCard
          label="Active Bookings"
          value={loading ? "…" : stats.activeBookings}
          note={loading ? "" : "live now"}
        />

        <StatCard
          label="Monthly Revenue"
          value={loading ? "…" : money(stats.monthlyRevenueSAR)}
          note={loading ? "" : "est."}
        />

        <StatCard
          label="Open Complaints"
          value={loading ? "…" : stats.openComplaints}
          note={loading ? "" : "needs follow-up"}
        />
      </div>

      {/* system health row */}
      <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-4">
        <HealthCard
          title="Salon Status"
          items={[
            {
              k: "Active salons",
              v: loading ? "…" : stats.activeSalons,
            },
            {
              k: "Total salons",
              v: loading ? "…" : stats.totalSalons,
            },
            {
              k: "Premium salons",
              v: loading ? "…" : stats.premiumSalons,
            },
          ]}
        />

        <HealthCard
          title="Bookings / Ops"
          items={[
            {
              k: "Active bookings",
              v: loading ? "…" : stats.activeBookings,
            },
            {
              k: "Open complaints",
              v: loading ? "…" : stats.openComplaints,
            },
          ]}
        />

        <HealthCard
          title="Finance Snapshot"
          items={[
            {
              k: "Monthly revenue",
              v: loading ? "…" : money(stats.monthlyRevenueSAR),
            },
            {
              k: "AR issues",
              v: loading ? "…" : "0 pending",
            },
          ]}
        />
      </div>
    </section>
  );
}

function StatCard({ label, value, note }) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 shadow-lg ring-1 ring-white/5">
      <div className="text-xs uppercase text-slate-400 font-medium tracking-wide">
        {label}
      </div>

      <div className="mt-2 text-2xl font-bold text-white leading-tight">
        {value}
      </div>

      {note && (
        <div className="mt-1 text-[11px] text-slate-500">{note}</div>
      )}
    </div>
  );
}

function HealthCard({ title, items }) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 shadow-lg ring-1 ring-white/5 flex flex-col">
      <div className="text-xs uppercase text-slate-400 font-medium tracking-wide">
        {title}
      </div>

      <dl className="mt-4 text-sm text-slate-300 space-y-2">
        {items.map((row, i) => (
          <div
            key={i}
            className="flex items-baseline justify-between gap-4"
          >
            <dt className="text-slate-500">{row.k}</dt>
            <dd className="text-white font-medium">{row.v}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
