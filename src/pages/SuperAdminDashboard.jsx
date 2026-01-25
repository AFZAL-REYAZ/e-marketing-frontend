import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

export default function SuperAdminDashboard() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        "https://e-marketing-backend.onrender.com/api/dashboard/stats",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setStats(res.data);
    };

    fetchStats();
  }, []);

  if (!stats) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <span className="text-sm text-gray-500 animate-pulse">
          Loading system dashboard…
        </span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white py-12 px-6">
      <div className="max-w-7xl mx-auto space-y-10">

        {/* Header */}
        <div>
          <h1 className="text-3xl font-semibold text-gray-900">
            System Overview
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Global administration and monitoring
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          <StatCard title="Total admins" value={stats.totalAdmins} />
          <StatCard title="Active admins" value={stats.activeAdmins} />
          <StatCard title="Campaigns" value={stats.totalCampaigns} />
          <StatCard title="Total emails" value={stats.totalEmails} />
          <StatCard title="Emails (24h)" value={stats.emailsToday} />
          <StatCard title="Failed emails" value={stats.failedEmails} danger />
        </div>

        {/* Actions */}
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Administrative actions
          </h2>

          <div className="flex flex-wrap gap-3">
            <ActionButton
              to="/create-admin"
              label="Create new admin"
              primary
            />
            <ActionButton
              to="/admin-list"
              label="Manage admins"
            />
            <ActionButton
              to="/history"
              label="System logs"
            />
            <ActionButton
              to="/templates/create"
              label="Create Templates"
            />
            <ActionButton
              to="/templates"
              label="Templates"
            />
          </div>
        </div>

      </div>
    </div>
  );
}

/* ===== Components ===== */

function StatCard({ title, value, danger }) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-5">
      <p className="text-xs text-gray-500 uppercase tracking-wide">
        {title}
      </p>
      <p
        className={`text-2xl font-semibold mt-2 ${
          danger ? "text-rose-600" : "text-gray-900"
        }`}
      >
        {value}
      </p>
    </div>
  );
}

function ActionButton({ to, label, primary }) {
  return (
    <Link
      to={to}
      className={`px-5 py-3 rounded-lg text-sm font-semibold transition-colors ${
        primary
          ? "bg-blue-600 text-white hover:bg-blue-500"
          : "bg-gray-100 text-gray-800 hover:bg-gray-200"
      }`}
    >
      {label}
    </Link>
  );
}
