import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role"); // "admin" | "superadmin"

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <aside className="h-screen bg-white border-r border-slate-200 w-64 hidden md:flex flex-col fixed left-0 top-0 z-40">
      <div className="px-6 pt-6 pb-4 border-b border-slate-100">
        <Link to="/" className="flex items-center gap-2">
          <div className="h-9 w-9 rounded-2xl bg-blue-600 flex items-center justify-center text-white text-lg font-semibold">
            GM
          </div>
          <div>
            <div className="text-sm font-semibold text-slate-900">
              Good Mail
            </div>
            <div className="text-xs text-slate-400">
              Admin workspace
            </div>
          </div>
        </Link>
      </div>

      {token && (
        <nav className="px-2 py-4 space-y-1 flex-1">
          {role === "admin" && (
            <SidebarItem
              label="Dashboard"
              to="/admin-dashboard"
              active={isActive("/admin-dashboard")}
            />
          )}
          {role === "superadmin" && (
            <>
              <SidebarItem
                label="Dashboard"
                to="/superadmin"
                active={isActive("/superadmin")}
              />
              <SidebarItem
                label="Create admin"
                to="/create-admin"
                active={isActive("/create-admin")}
              />
            </>
          )}
          <SidebarItem label="Campaigns" to="/" active={isActive("/")} />
          <SidebarItem
            label="History"
            to="/history"
            active={isActive("/history")}
          />
          <SidebarItem label="Broadcasts" to="/broadcasts" active={isActive("/broadcasts")} />
        </nav>
      )}

      <div className="px-4 pb-4 border-t border-slate-100">
        {token ? (
          <button
            onClick={handleLogout}
            className="w-full text-left text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-xl px-3 py-2"
          >
            Logout
          </button>
        ) : (
          <Link
            to="/login"
            className="w-full inline-flex justify-center text-sm font-medium text-white bg-blue-600 hover:bg-blue-500 rounded-xl px-3 py-2"
          >
            Login
          </Link>
        )}
      </div>

      <button
        className="md:hidden absolute top-4 right-4 text-slate-700"
        onClick={() => setMenuOpen(!menuOpen)}
      >
        {menuOpen ? "Close" : "Menu"}
      </button>
    </aside>
  );
};

function SidebarItem({ label, to, active }) {
  const base =
    "flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors";
  const activeClasses = "bg-blue-50 text-blue-700";
  const inactiveClasses =
    "text-slate-600 hover:bg-slate-50 hover:text-slate-900";

  return (
    <Link
      to={to}
      className={`${base} ${active ? activeClasses : inactiveClasses}`}
    >
      {label}
    </Link>
  );
}

export default Header;
