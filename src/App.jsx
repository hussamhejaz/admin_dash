// src/App.jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";

// layouts
import DashboardLayout from "./layouts/DashboardLayout";

// auth gate
import RequireAdmin from "./components/RequireAdmin";

// dashboard pages
import DashboardHome from "./pages/dashboard/DashboardHome";
import SalonsList from "./pages/dashboard/SalonsList";
import SalonDetailsPage from "./pages/dashboard/SalonDetailsPage";
import AddSalonPage from "./pages/dashboard/AddSalonPage";

// (optional) if you already created it; if not, you can stub it:

// If you don't have SettingsPage yet, create a tiny placeholder:
// export default function SettingsPage() {
//   return (
//     <section className="text-slate-100">
//       <h1 className="text-xl font-semibold text-white tracking-tight">
//         Settings
//       </h1>
//       <p className="text-slate-400 text-sm mt-2">
//         Platform-level configuration coming soon.
//       </p>
//     </section>
//   );
// }

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* public login */}
        <Route path="/login" element={<Login />} />

        {/* protected dashboard */}
        <Route
          path="/dashboard"
          element={
            <RequireAdmin>
              <DashboardLayout />
            </RequireAdmin>
          }
        >
          {/* /dashboard */}
          <Route index element={<DashboardHome />} />

          {/* /dashboard/salons */}
          <Route path="salons" element={<SalonsList />} />

          {/* /dashboard/salons/new */}
          <Route path="salons/new" element={<AddSalonPage />} />

          {/* /dashboard/salons/:salonId */}
          <Route path="salons/:salonId" element={<SalonDetailsPage />} />

          {/* /dashboard/settings */}
         
        </Route>

        {/* catch-all / 404 */}
        <Route
          path="*"
          element={
            <div className="min-h-screen flex flex-col items-center justify-center bg-slate-900 text-slate-100 p-8 text-center">
              <h1 className="text-lg font-semibold mb-4">
                Page not found
              </h1>

              <a
                href="/login"
                className="rounded-lg bg-[#E39B34] text-slate-900 text-sm font-semibold px-4 py-2 shadow ring-1 ring-white/10 hover:bg-[#cf8a2b] transition"
              >
                Go to Login
              </a>
            </div>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
