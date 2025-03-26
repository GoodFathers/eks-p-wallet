import { Suspense } from "react";
import { useRoutes, Routes, Route } from "react-router-dom";
import Home from "./components/home";
import Balance from "./components/pages/Balance";
import Network from "./components/pages/Network";
import Training from "./components/pages/Training";
import PPOB from "./components/pages/PPOB";
import Security from "./components/pages/Security";
import Settings from "./components/pages/Settings";
import AuthPage from "./components/auth/AuthPage";
import RequireAuth from "./components/auth/RequireAuth";
import Unauthorized from "./components/pages/Unauthorized";
import { AuthProvider } from "./contexts/AuthContext";
// @ts-ignore
import routes from "tempo-routes";

function App() {
  return (
    <AuthProvider>
      <Suspense fallback={<p>Loading...</p>}>
        <>
          <Routes>
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/unauthorized" element={<Unauthorized />} />
            <Route
              path="/"
              element={
                <RequireAuth>
                  <Home />
                </RequireAuth>
              }
            />
            <Route
              path="/balance"
              element={
                <RequireAuth>
                  <Balance />
                </RequireAuth>
              }
            />
            <Route
              path="/network"
              element={
                <RequireAuth>
                  <Network />
                </RequireAuth>
              }
            />
            <Route
              path="/training"
              element={
                <RequireAuth>
                  <Training />
                </RequireAuth>
              }
            />
            <Route
              path="/ppob"
              element={
                <RequireAuth>
                  <PPOB />
                </RequireAuth>
              }
            />
            <Route
              path="/security"
              element={
                <RequireAuth>
                  <Security />
                </RequireAuth>
              }
            />
            <Route
              path="/settings"
              element={
                <RequireAuth>
                  <Settings />
                </RequireAuth>
              }
            />

            {/* Admin routes */}
            <Route
              path="/admin/users"
              element={
                <RequireAuth allowedRoles={["super_admin", "admin"]}>
                  <div>User Management Page</div>
                </RequireAuth>
              }
            />

            {/* Super Admin routes */}
            <Route
              path="/admin/system"
              element={
                <RequireAuth allowedRoles={["super_admin"]}>
                  <div>System Settings Page</div>
                </RequireAuth>
              }
            />

            {import.meta.env.VITE_TEMPO === "true" && (
              <Route path="/tempobook/*" />
            )}
          </Routes>
          {import.meta.env.VITE_TEMPO === "true" && useRoutes(routes)}
        </>
      </Suspense>
    </AuthProvider>
  );
}

export default App;
