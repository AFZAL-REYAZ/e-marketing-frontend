import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
    setMenuOpen(false);
  };

  return (
    <>
      {/* ===== Mobile Top Bar ===== */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-white border-b px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-xl bg-blue-600 flex items-center justify-center text-white font-semibold">
            GM
          </div>
          <span className="font-semibold text-slate-800">Nexus Mail</span>
        </div>

        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="text-slate-700 text-xl"
        >
          {menuOpen ? "✕" : "☰"}
        </button>

      </div>

      {/* ===== Overlay (Mobile) ===== */}
      {menuOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          onClick={() => setMenuOpen(false)}
        />
      )}

      {/* ===== Sidebar ===== */}
      <aside
        className={`fixed top-0 left-0 z-50 h-screen w-64 bg-white border-r border-slate-200 flex flex-col transform transition-transform duration-300
        ${menuOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
      >
        {/* Logo */}
        <div className="px-6 pt-6 pb-4 border-b">
          <Link to="/" className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-2xl bg-blue-600 flex items-center justify-center text-white font-semibold">
              GM
            </div>
            <div>
              <div className="text-sm font-semibold">Nexus Mail</div>
              <div className="text-xs text-slate-400">
                Admin workspace
              </div>
            </div>
          </Link>
        </div>

        {/* Menu */}
        {token && (
          <nav className="px-2 py-4 space-y-1 flex-1">
            {role === "admin" && (
              <SidebarItem
                label="Dashboard"
                to="/admin-dashboard"
                active={isActive("/admin-dashboard")}
                onClick={() => setMenuOpen(false)}
              />
            )}

            {role === "superadmin" && (
              <>
                <SidebarItem
                  label="Dashboard"
                  to="/superadmin"
                  active={isActive("/superadmin")}
                  onClick={() => setMenuOpen(false)}
                />
                <SidebarItem
                  label="Create admin"
                  to="/create-admin"
                  active={isActive("/create-admin")}
                  onClick={() => setMenuOpen(false)}
                />
              </>
            )}

            <SidebarItem 
              label="Campaigns" 
              to="/" 
              active={isActive("/")} 
              onClick={() => setMenuOpen(false)}
              />
            <SidebarItem 
              label="History" 
              to="/history" 
              active={isActive("/history")} 
              onClick={() => setMenuOpen(false)}
              />
            <SidebarItem 
              label="Broadcasts" 
              to="/broadcasts" 
              active={isActive("/broadcasts")} 
              onClick={() => setMenuOpen(false)}
              />
          </nav>
        )}

        {/* Footer */}
        <div className="px-4 pb-4 border-t">
          {token ? (
            <button
              onClick={handleLogout}
              className="w-full text-left text-sm font-medium text-slate-600 hover:bg-slate-50 rounded-xl px-3 py-2"
            >
              Logout
            </button>
          ) : (
            <Link
              to="/login"
              className="w-full inline-flex justify-center text-sm font-medium text-white bg-blue-600 rounded-xl px-3 py-2"
            >
              Login
            </Link>
          )}
        </div>
      </aside>
    </>
  );
};

function SidebarItem({ label, to, active, onClick }) {
  return (
    <Link
      to={to}
      onClick={onClick}
      className={`flex items-center px-4 py-2.5 rounded-xl text-sm font-medium transition
        ${active ? "bg-blue-50 text-blue-700" : "text-slate-600 hover:bg-slate-50"}`}
    >
      {label}
    </Link>
  );
}

export default Header;
