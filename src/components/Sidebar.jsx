import React from "react";
import { NavLink } from "react-router-dom";

function Icon({ name, className = "h-5 w-5" }) {
  // built-in minimal icons, brand color comes from parent
  switch (name) {
    case "home":
      return (
        <svg
          viewBox="0 0 24 24"
          className={className}
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
        >
          <path
            d="M3 11 12 3l9 8v9a1 1 0 0 1-1 1h-5v-5H9v5H4a1 1 0 0 1-1-1v-9Z"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );

    case "salons":
      return (
        <svg
          viewBox="0 0 24 24"
          className={className}
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
        >
          {/* top/bottom bars for "list" */}
          <path
            d="M4 10h16M4 14h16M7 6h10M9 18h6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* rounded rectangle frame */}
          <rect
            x="3"
            y="4"
            width="18"
            height="16"
            rx="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );

    case "add":
      return (
        <svg
          viewBox="0 0 24 24"
          className={className}
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
        >
          <circle cx="12" cy="12" r="9" />
          <path d="M12 9v6M9 12h6" strokeLinecap="round" />
        </svg>
      );

    // case "settings":
    //   return (
    //     <svg
    //       viewBox="0 0 24 24"
    //       className={className}
    //       fill="none"
    //       stroke="currentColor"
    //       strokeWidth="1.8"
    //     >
    //       <circle cx="12" cy="12" r="3" />
    //       <path
    //         d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.2a1.7 1.7 0 0 0-1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.2a1.7 1.7 0 0 0 1.5-1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H10a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.2a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8v.2a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.2a1.7 1.7 0 0 0-1.5 1Z"
    //         strokeLinecap="round"
    //         strokeLinejoin="round"
    //       />
    //     </svg>
    //   );

    case "logout":
      return (
        <svg
          viewBox="0 0 24 24"
          className={className}
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
        >
          {/* door */}
          <path
            d="M10 7V5a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-6a2 2 0 0 1-2-2v-2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* arrow */}
          <path
            d="M15 12H3m0 0 3-3m-3 3 3 3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );

    default:
      return null;
  }
}

// Sidebar nav config
const navItems = [
  { to: "/dashboard", icon: "home", label: "Dashboard" },
  { to: "/dashboard/salons", icon: "salons", label: "All Salons" },
  { to: "/dashboard/salons/new", icon: "add", label: "Add Salon" },
//   { to: "/dashboard/settings", icon: "settings", label: "Settings" },
];

export default function Sidebar() {
  function handleLogout() {
    // wipe auth/session keys
    try {
      localStorage.removeItem("sa_token");
      localStorage.removeItem("sa_role");

      localStorage.removeItem("admin_token");
      localStorage.removeItem("admin_user");
    } catch (e) {
      console.warn("logout storage error:", e);
    }

    // hard redirect so in-memory React state is gone
    window.location.href = "/login";
  }

  return (
    <aside className="hidden md:flex md:flex-col bg-slate-900 text-slate-100 w-64 shrink-0 border-r border-slate-800">
      {/* Header / brand */}
      <div className="h-16 flex items-center px-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-[#E39B34] text-slate-900 font-bold grid place-items-center text-sm shadow-lg ring-2 ring-white/10">
            SA
          </div>
          <div className="leading-tight">
            <div className="text-sm font-semibold text-white">Super Admin</div>
            <div className="text-[11px] text-slate-400">Control Panel</div>
          </div>
        </div>
      </div>

      {/* Navigation links */}
      <nav className="flex-1 overflow-y-auto py-4">
        <ul className="px-3 space-y-1">
          {navItems.map((item) => (
            <li key={item.to}>
              <NavLink
                to={item.to}
                end={item.to === "/dashboard"} // so /dashboard isn't active on /dashboard/salons
                className={({ isActive }) =>
                  [
                    "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition",
                    isActive
                      ? "bg-slate-800 text-white shadow-inner ring-1 ring-white/10"
                      : "text-slate-300 hover:text-white hover:bg-slate-800/60",
                  ].join(" ")
                }
              >
                <span className="text-[#E39B34] group-hover:text-[#E39B34]">
                  <Icon name={item.icon} className="h-5 w-5" />
                </span>
                <span>{item.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* Logout button */}
      <div className="border-t border-slate-800 p-3">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-400 hover:bg-slate-800/60 hover:text-white transition"
        >
          <span className="text-slate-500 group-hover:text-white">
            <Icon name="logout" className="h-5 w-5" />
          </span>
          <span>Sign out</span>
        </button>
      </div>
    </aside>
  );
}

