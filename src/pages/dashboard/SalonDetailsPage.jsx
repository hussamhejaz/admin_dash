// src/pages/SalonDetailsPage.jsx
import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useSalonDetails } from "../../hooks/useSalonDetails";

const API_BASE = "http://localhost:4000/api/superadmin";

export default function SalonDetailsPage() {
  const { salonId } = useParams();
  const navigate = useNavigate();
  const { salon, owner, loading, error, refetch } = useSalonDetails(salonId);

  const [isEditing, setIsEditing] = useState(false);
  const [editPayload, setEditPayload] = useState({
    name: "",
    city: "",
    address: "",
    phone: "",
    whatsapp: "",
    brand_color: "",
    plan_type: "",
    is_active: true,
  });
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");

  // when we click "Edit", preload current salon data into the form
  function startEdit() {
    if (!salon) return;
    setEditPayload({
      name: salon.name || "",
      city: salon.city || "",
      address: salon.address || "",
      phone: salon.phone || "",
      whatsapp: salon.whatsapp || "",
      brand_color: salon.brand_color || "#E39B34",
      plan_type: salon.plan_type || "basic",
      is_active: !!salon.is_active,
    });
    setIsEditing(true);
  }

  // update form fields
  function handleFieldChange(field, value) {
    setEditPayload((prev) => ({
      ...prev,
      [field]: value,
    }));
  }

  // send PATCH to backend (you'll add this route on backend soon)
  async function handleSave() {
    try {
      setSaving(true);
      setSaveError("");

      const token = localStorage.getItem("sa_token");

      const res = await fetch(`${API_BASE}/salons/${salonId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token || ""}`,
        },
        body: JSON.stringify(editPayload),
      });

      const data = await res.json();

      if (!res.ok || data.ok === false) {
        throw new Error(data.error || "Failed to update salon");
      }

      // refresh the data from server
      await refetch();

      // done editing
      setIsEditing(false);
    } catch (err) {
      console.error("save salon error:", err);
      setSaveError(err.message || "Failed to save salon");
    } finally {
      setSaving(false);
    }
  }

  const statusBadge = salon?.is_active ? (
    <span className="inline-flex items-center rounded-md bg-teal-500/10 px-2 py-0.5 text-[11px] font-medium text-teal-400 ring-1 ring-inset ring-teal-500/30">
      Active
    </span>
  ) : (
    <span className="inline-flex items-center rounded-md bg-rose-500/10 px-2 py-0.5 text-[11px] font-medium text-rose-400 ring-1 ring-inset ring-rose-500/30">
      Disabled
    </span>
  );

  const planBadge =
    salon?.plan_type === "premium" ? (
      <span className="inline-flex items-center rounded-md bg-emerald-500/10 px-2 py-0.5 text-[11px] font-medium text-emerald-400 ring-1 ring-inset ring-emerald-500/30">
        Premium
      </span>
    ) : (
      <span className="inline-flex items-center rounded-md bg-slate-500/10 px-2 py-0.5 text-[11px] font-medium text-slate-300 ring-1 ring-inset ring-slate-500/30">
        Basic
      </span>
    );

  return (
    <section className="text-slate-100">
      {/* Header / actions */}
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <button
            onClick={() => navigate(-1)}
            className="text-xs text-slate-400 hover:text-white transition mb-2"
          >
            ← Back
          </button>

          <h1 className="text-xl font-semibold text-white tracking-tight flex items-center flex-wrap gap-2">
            {salon ? salon.name : "Loading..."}
            {salon && (
              <>
                {statusBadge}
                {planBadge}
              </>
            )}
          </h1>

          <p className="text-slate-400 text-sm mt-1">
            Salon details and owner access.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {!isEditing ? (
            <button
              className="rounded-lg bg-slate-800 text-slate-200 text-xs font-medium px-3 py-2 shadow ring-1 ring-white/10 hover:bg-slate-700 transition"
              onClick={startEdit}
            >
              Edit Salon
            </button>
          ) : (
            <>
              <button
                className="rounded-lg bg-slate-700 text-slate-100 text-xs font-medium px-3 py-2 shadow ring-1 ring-white/10 hover:bg-slate-600 transition disabled:opacity-50"
                disabled={saving}
                onClick={() => setIsEditing(false)}
              >
                Cancel
              </button>

              <button
                className="rounded-lg bg-[#E39B34] text-slate-900 text-xs font-semibold px-3 py-2 shadow ring-1 ring-white/10 hover:bg-[#cf8a2b] transition disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={saving}
                onClick={handleSave}
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </>
          )}
        </div>
      </div>

      {/* Loading / error states */}
      <div className="mt-4 min-h-6">
        {loading && (
          <p className="text-slate-400 text-sm">Loading salon…</p>
        )}

        {!loading && error && (
          <p className="text-rose-400 text-sm">{error}</p>
        )}

        {!loading && !error && !salon && (
          <p className="text-slate-500 text-sm">Salon not found.</p>
        )}

        {saveError && (
          <p className="text-rose-400 text-sm">{saveError}</p>
        )}
      </div>

      {/* Edit Card (only when editing) */}
      {isEditing && (
        <div className="mt-6 rounded-xl border border-slate-800 bg-slate-900/80 ring-1 ring-white/5 shadow-lg p-4">
          <h2 className="text-sm font-semibold text-white flex items-center justify-between">
            <span>Edit Salon</span>
            <span className="text-[10px] font-normal text-slate-500">
              Update public info / plan / status
            </span>
          </h2>

          <form
            className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 text-sm text-slate-300"
            onSubmit={(e) => {
              e.preventDefault();
              if (!saving) handleSave();
            }}
          >
            <Field
              label="Name"
              value={editPayload.name}
              onChange={(v) => handleFieldChange("name", v)}
            />
            <Field
              label="City"
              value={editPayload.city}
              onChange={(v) => handleFieldChange("city", v)}
            />
            <Field
              label="Address"
              value={editPayload.address}
              onChange={(v) => handleFieldChange("address", v)}
            />
            <Field
              label="Phone"
              value={editPayload.phone}
              onChange={(v) => handleFieldChange("phone", v)}
            />
            <Field
              label="WhatsApp"
              value={editPayload.whatsapp}
              onChange={(v) => handleFieldChange("whatsapp", v)}
            />
            <Field
              label="Brand Color"
              value={editPayload.brand_color}
              onChange={(v) => handleFieldChange("brand_color", v)}
            />

            {/* plan_type select */}
            <SelectField
              label="Plan"
              value={editPayload.plan_type}
              onChange={(v) => handleFieldChange("plan_type", v)}
              options={[
                { value: "basic", label: "Basic (booking only)" },
                { value: "premium", label: "Premium (booking + store)" },
              ]}
            />

            {/* is_active toggle */}
            <SelectField
              label="Status"
              value={editPayload.is_active ? "active" : "disabled"}
              onChange={(v) =>
                handleFieldChange("is_active", v === "active")
              }
              options={[
                { value: "active", label: "Active" },
                { value: "disabled", label: "Disabled" },
              ]}
            />
          </form>
        </div>
      )}

      {/* Normal view cards */}
      {salon && (
        <div className="mt-6 grid gap-6 md:grid-cols-2">
          {/* Salon Info Card */}
          <div className="rounded-xl border border-slate-800 bg-slate-900/60 ring-1 ring-white/5 shadow-lg p-4">
            <h2 className="text-sm font-semibold text-white flex items-center justify-between">
              <span>Salon Info</span>
              <span
                className="text-[10px] font-normal text-slate-500"
                style={{
                  color: salon.brand_color || "#E39B34",
                }}
              >
                {salon.brand_color || "#E39B34"}
              </span>
            </h2>

            <dl className="mt-4 text-sm text-slate-300 space-y-2">
              <Row label="Name" value={salon.name} />
              <Row label="City" value={salon.city || "—"} />
              <Row label="Address" value={salon.address || "—"} />
              <Row label="Phone" value={salon.phone || "—"} />
              <Row label="WhatsApp" value={salon.whatsapp || "—"} />
              <Row label="Plan" value={salon.plan_type} />
              <Row
                label="Status"
                value={salon.is_active ? "Active" : "Disabled"}
              />
            </dl>
          </div>

          {/* Owner / Access Card */}
          <div className="rounded-xl border border-slate-800 bg-slate-900/60 ring-1 ring-white/5 shadow-lg p-4">
            <h2 className="text-sm font-semibold text-white flex items-center justify-between">
              <span>Owner / Access</span>
              <span className="text-[10px] font-normal text-slate-500">
                Login user
              </span>
            </h2>

            {owner ? (
              <dl className="mt-4 text-sm text-slate-300 space-y-2">
                <Row label="Owner Email" value={owner.email} />
                <Row label="Role" value={owner.role} />
                <Row
                  label="Active"
                  value={owner.is_active ? "Yes" : "No"}
                />
                <Row
                  label="Created"
                  value={
                    owner.created_at
                      ? new Date(owner.created_at).toLocaleString()
                      : "—"
                  }
                />
              </dl>
            ) : (
              <p className="text-slate-500 text-sm mt-4">
                No owner user found.
              </p>
            )}
          </div>

          {/* Meta / Audit Card */}
          <div className="rounded-xl border border-slate-800 bg-slate-900/60 ring-1 ring-white/5 shadow-lg p-4 md:col-span-2">
            <h2 className="text-sm font-semibold text-white flex items-center justify-between">
              <span>Meta / Audit</span>
              <span className="text-[10px] font-normal text-slate-500">
                Internal
              </span>
            </h2>

            <dl className="mt-4 text-sm text-slate-300 space-y-2">
              <Row label="Salon ID" value={salon.id} mono />
              <Row
                label="Created at"
                value={
                  salon.created_at
                    ? new Date(salon.created_at).toLocaleString()
                    : "—"
                }
              />
              <Row
                label="Updated at"
                value={
                  salon.updated_at
                    ? new Date(salon.updated_at).toLocaleString()
                    : "—"
                }
              />
            </dl>
          </div>
        </div>
      )}
    </section>
  );
}

function Row({ label, value, mono = false }) {
  return (
    <div className="flex justify-between gap-4">
      <dt className="text-slate-500">{label}</dt>
      <dd
        className={`text-white text-right max-w-[60%] wrap-break-words ${
          mono ? "font-mono text-xs" : ""
        }`}
      >
        {value ?? "—"}
      </dd>
    </div>
  );
}

function Field({ label, value, onChange }) {
  return (
    <label className="flex flex-col gap-1">
      <span className="text-[11px] uppercase tracking-wide text-slate-400">
        {label}
      </span>
      <input
        className="rounded-lg bg-slate-800 text-white text-sm px-3 py-2 ring-1 ring-white/10 shadow-inner placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#E39B34]"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </label>
  );
}

function SelectField({ label, value, onChange, options }) {
  return (
    <label className="flex flex-col gap-1">
      <span className="text-[11px] uppercase tracking-wide text-slate-400">
        {label}
      </span>
      <select
        className="rounded-lg bg-slate-800 text-white text-sm px-3 py-2 ring-1 ring-white/10 shadow-inner focus:outline-none focus:ring-2 focus:ring-[#E39B34]"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        {options.map((opt) => (
          <option
            key={opt.value}
            value={opt.value}
            className="bg-slate-900 text-white"
          >
            {opt.label}
          </option>
        ))}
      </select>
    </label>
  );
}
