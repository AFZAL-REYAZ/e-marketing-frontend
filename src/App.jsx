import { BrowserRouter, Routes, Route } from "react-router-dom";
import SendEmail from "./pages/SendEmail";
import EmailHistory from "./pages/EmailHistory";
import Login from "./pages/Login";
import ProtectedRoute from "./components/ProtectedRoute";
import Header from "./components/Header";
import Footer from "./components/Footer";
import RoleProtectedRoute from "./components/RoleProtectedRoute";
import CreateAdmin from "./pages/CreateAdmin";
import SuperAdminDashboard from "./pages/SuperAdminDashboard";
import AdminList from "./pages/AdminList";
import AdminDashboard from "./pages/AdminDashboard";
import BroadcastList from "./pages/BroadcastList";
import BroadcastAnalytics from "./pages/BroadcastAnalytics";
import CreateTemplate from "./pages/CreateTemplate";
import TemplateList from "./pages/TemplateList";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* 🔓 PUBLIC ROUTE */}
        <Route path="/login" element={<Login />} />

        {/* 🔐 PROTECTED ROUTES */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <DashboardShell>
                <SendEmail />
              </DashboardShell>
            </ProtectedRoute>
          }
        />

        <Route
          path="/history"
          element={
            <ProtectedRoute>
              <DashboardShell>
                <EmailHistory />
              </DashboardShell>
            </ProtectedRoute>
          }
        />

        {/* 👑 CREATE ADMIN (SUPER ADMIN ONLY) */}
        <Route
          path="/create-admin"
          element={
            <RoleProtectedRoute allowedRole="superadmin">
              <DashboardShell>
                <CreateAdmin />
              </DashboardShell>
            </RoleProtectedRoute>
          }
        />
        <Route
          path="/superadmin"
          element={
            <RoleProtectedRoute allowedRole="superadmin">
              <DashboardShell>
                <SuperAdminDashboard />
              </DashboardShell>
            </RoleProtectedRoute>
          }
        />

        <Route
          path="/admin-list"
          element={
            <RoleProtectedRoute allowedRole="superadmin">
              <DashboardShell>
                <AdminList />
              </DashboardShell>
            </RoleProtectedRoute>
          }
        />

        <Route
          path="/admin-dashboard"
          element={
            <ProtectedRoute>
              <DashboardShell>
                <AdminDashboard />
              </DashboardShell>
            </ProtectedRoute>
          }
        />
        <Route
          path="/broadcasts"
          element={
            <ProtectedRoute>
              <DashboardShell>
                <BroadcastList />
              </DashboardShell>
            </ProtectedRoute>
          }
        />
        <Route
          path="/broadcasts/:id"
          element={
            <ProtectedRoute>
              <DashboardShell>
                <BroadcastAnalytics />
              </DashboardShell>
            </ProtectedRoute>
          }
        />
 {/* 📧 TEMPLATES */}
        <Route
          path="/templates"
          element={
            <ProtectedRoute>
              <DashboardShell>
                <TemplateList />
              </DashboardShell>
            </ProtectedRoute>
          }
        />

        <Route
          path="/templates/create"
          element={
            <ProtectedRoute>
              <DashboardShell>
                <CreateTemplate />
              </DashboardShell>
            </ProtectedRoute>
          }
        />

      </Routes>

    </BrowserRouter>
  );
}

export default App;

function DashboardShell({ children }) {
  return (
    <div className="min-h-screen bg-white flex">
      <Header />
      <div className="flex-1 ml-0 md:ml-64 flex flex-col">
        <main className="flex-1 px-4 sm:px-6 lg:px-10 py-8">
          <div className="max-w-6xl mx-auto">{children}</div>
        </main>
        <Footer />
      </div>
    </div>
  );
}
