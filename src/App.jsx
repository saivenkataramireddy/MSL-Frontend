// App.jsx
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";

import ProtectedRoute from "./components/ProtectedRoute";
import AppShell from "./components/AppShell";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Doctors from "./pages/Doctors";
import Interactions from "./pages/Interactions";
import Objections from "./pages/Objections";
import TourPlans from "./pages/TourPlans";
import Knowledge from "./pages/Knowledge";
import Office from "./pages/Office";
import Notifications from "./pages/Notifications";
import Users from "./pages/Users";
import Roles from "./pages/Roles";
import HODDashboard from "./pages/HODDashboard";

function ProtectedShell({ children, requiredRoles }) {
  return (
    <ProtectedRoute requiredRoles={requiredRoles}>
      <AppShell>{children}</AppShell>
    </ProtectedRoute>
  );
}

export default function App() {
  const { user } = useAuth();

  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/login" element={<Login />} />

        {/* Dashboard */}
        <Route
          path="/dashboard"
          element={
            <ProtectedShell>
              {user?.role?.name === "HOD" ? (
                <HODDashboard />
              ) : (
                <Dashboard />
              )}
            </ProtectedShell>
          }
        />

        {/* All Authenticated Routes */}
        <Route
          path="/doctors"
          element={
            <ProtectedShell>
              <Doctors />
            </ProtectedShell>
          }
        />

        <Route
          path="/interactions"
          element={
            <ProtectedShell>
              <Interactions />
            </ProtectedShell>
          }
        />

        <Route
          path="/objections"
          element={
            <ProtectedShell>
              <Objections />
            </ProtectedShell>
          }
        />

        <Route
          path="/tour-plans"
          element={
            <ProtectedShell>
              <TourPlans />
            </ProtectedShell>
          }
        />

        <Route
          path="/knowledge"
          element={
            <ProtectedShell>
              <Knowledge />
            </ProtectedShell>
          }
        />

        <Route
          path="/office"
          element={
            <ProtectedShell>
              <Office />
            </ProtectedShell>
          }
        />

        <Route
          path="/notifications"
          element={
            <ProtectedShell>
              <Notifications />
            </ProtectedShell>
          }
        />

        {/* Admin + HOD Only */}
        <Route
          path="/users"
          element={
            <ProtectedShell requiredRoles={["Admin", "HOD"]}>
              <Users />
            </ProtectedShell>
          }
        />

        <Route
          path="/roles"
          element={
            <ProtectedShell requiredRoles={["Admin", "HOD"]}>
              <Roles />
            </ProtectedShell>
          }
        />

        {/* Default */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}