// src/pages/dashboard/SalonsList.jsx
import { useNavigate } from "react-router-dom";
import { useSalons } from "../../hooks/useSalons";

export default function SalonsList() {
  const navigate = useNavigate();
  const {
    salons,
    loading,
    error,
    deletingId,
    deleteSalon,
  } = useSalons();

  return (
    <section className="text-slate-100">
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-xl font-semibold text-white tracking-tight">
            All Salons
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Manage onboarded salons.
          </p>
        </div>

        <button
          className="rounded-lg bg-[#E39B34] text-slate-900 text-sm font-semibold px-4 py-2 shadow ring-1 ring-white/10 hover:bg-[#cf8a2b] transition disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={() => {
            navigate("/dashboard/salons/new");
          }}
        >
          + New Salon
        </button>
      </div>

      {/* State messages */}
      <div className="mt-4 min-height-[1.5rem]">
        {loading && (
          <p className="text-slate-400 text-sm">Loading salons…</p>
        )}

        {!loading && error && (
          <p className="text-rose-400 text-sm">{error}</p>
        )}

        {!loading && !error && salons.length === 0 && (
          <p className="text-slate-500 text-sm">
            No salons yet. Add your first one.
          </p>
        )}
      </div>

      {/* Table */}
      <div className="mt-6 overflow-x-auto rounded-xl border border-slate-800 bg-slate-900/60 ring-1 ring-white/5 shadow-lg">
        <table className="min-w-full text-left text-sm text-slate-300">
          <thead className="text-xs uppercase text-slate-400 bg-slate-900/40 border-b border-slate-800">
            <tr>
              <th className="py-3 px-4">Name</th>
              <th className="py-3 px-4">City</th>
              <th className="py-3 px-4">Plan</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4">Actions</th>
            </tr>
          </thead>

          <tbody>
            {salons.map((s) => (
              <tr
                key={s.id}
                className="border-b border-slate-800/60 last:border-0 hover:bg-slate-800/40 transition"
              >
                {/* Name */}
                <td className="py-3 px-4 font-medium text-white">
                  <div className="flex flex-col">
                    <span>{s.name}</span>
                    <span className="text-[11px] text-slate-500">
                      {s.whatsapp || s.phone || ""}
                    </span>
                  </div>
                </td>

                {/* City */}
                <td className="py-3 px-4">{s.city || "-"}</td>

                {/* Plan badge */}
                <td className="py-3 px-4">
                  {s.plan_type === "premium" ? (
                    <span className="inline-flex items-center rounded-md bg-emerald-500/10 px-2 py-0.5 text-xs font-medium text-emerald-400 ring-1 ring-inset ring-emerald-500/30">
                      Premium
                    </span>
                  ) : (
                    <span className="inline-flex items-center rounded-md bg-slate-500/10 px-2 py-0.5 text-xs font-medium text-slate-300 ring-1 ring-inset ring-slate-500/30">
                      Basic
                    </span>
                  )}
                </td>

                {/* Status badge */}
                <td className="py-3 px-4">
                  {s.is_active ? (
                    <span className="inline-flex items-center rounded-md bg-teal-500/10 px-2 py-0.5 text-[11px] font-medium text-teal-400 ring-1 ring-inset ring-teal-500/30">
                      Active
                    </span>
                  ) : (
                    <span className="inline-flex items-center rounded-md bg-rose-500/10 px-2 py-0.5 text-[11px] font-medium text-rose-400 ring-1 ring-inset ring-rose-500/30">
                      Disabled
                    </span>
                  )}
                </td>

                {/* Actions */}
                <td className="py-3 px-4 whitespace-nowrap">
                  <button
                    className="text-xs font-medium text-[#E39B34] hover:text-white transition"
                    onClick={() => {
                      navigate(`/dashboard/salons/${s.id}`);
                    }}
                  >
                    View
                  </button>

                  <span className="text-slate-600 px-2">|</span>

                  <button
                    className={`text-xs font-medium ${
                      s.is_active
                        ? "text-rose-400 hover:text-white"
                        : "text-slate-500 cursor-not-allowed"
                    } transition disabled:opacity-50 disabled:cursor-not-allowed`}
                    disabled={deletingId === s.id}
                    onClick={() => {
                      if (window.confirm(`Delete ${s.name}?`)) {
                        deleteSalon(s.id);
                      }
                    }}
                  >
                    {deletingId === s.id ? "Deleting..." : "Delete"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
