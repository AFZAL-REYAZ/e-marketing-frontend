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
      <div className="min-h-screen flex items-center justify-center text-slate-400 animate-pulse">
        Initializing system dashboard...
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* HEADER */}
      <div>
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest">
          Super admin
        </p>
        <h1 className="text-3xl sm:text-4xl font-semibold text-gray-900 mt-1">
          System overview
        </h1>
        <p className="text-sm text-gray-500 mt-2">
          Global control, monitoring and administration
        </p>
      </div>

      {/* INFO BANNER */}
      <div className="bg-gradient-to-r from-indigo-600 to-blue-600 rounded-3xl px-6 py-5 text-white shadow-lg">
        <p className="text-xs uppercase tracking-widest font-semibold text-indigo-100">
          Platform status
        </p>
        <p className="text-sm mt-2 max-w-2xl">
          You have full access to system-wide analytics, admin management,
          email campaigns, templates and logs.
        </p>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard title="Total admins" value={stats.totalAdmins} accent="bg-blue-600" />
        <StatCard title="Active admins" value={stats.activeAdmins} accent="bg-emerald-500" />
        <StatCard title="Total campaigns" value={stats.totalCampaigns} accent="bg-indigo-500" />
        <StatCard title="Total emails" value={stats.totalEmails} accent="bg-violet-500" />
        <StatCard title="Emails today" value={stats.emailsToday} accent="bg-cyan-500" />
        <StatCard
          title="Failed emails"
          value={stats.failedEmails}
          accent="bg-rose-500"
          danger
        />
      </div>

      {/* PANELS */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        {/* SYSTEM METRICS */}
        <div className="bg-white rounded-3xl border border-gray-200 p-6 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-semibold text-gray-900">
              System metrics
            </h3>
            <span className="text-xs text-gray-500">
              Real-time overview
            </span>
          </div>

          <dl className="grid grid-cols-2 gap-4">
            <Metric label="Admins" value={stats.totalAdmins} />
            <Metric label="Active admins" value={stats.activeAdmins} />
            <Metric label="Campaigns" value={stats.totalCampaigns} />
            <Metric label="Emails sent" value={stats.totalEmails} />
            <Metric label="Emails today" value={stats.emailsToday} />
            <Metric label="Failed" value={stats.failedEmails} danger />
          </dl>
        </div>

        {/* QUICK ACTIONS */}
        <div className="bg-white rounded-3xl border border-gray-200 p-6 shadow-sm">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">
            Administrative actions
          </h3>

          <div className="flex flex-wrap gap-3">
            <Action to="/create-admin" label="Create admin" />
            <Action to="/admin-list" label="Manage admins" />
            <Action to="/templates" label="Templates" />
            <Action to="/templates/create" label="Create template" />
            {/* <Action to="/history" label="System logs" /> */}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ================= COMPONENTS ================= */

function StatCard({ title, value, accent, danger }) {
  return (
    <div className="bg-white rounded-3xl border border-gray-200 p-5 shadow-sm flex items-center gap-4">
      <div
        className={`h-11 w-11 rounded-full flex items-center justify-center text-white ${accent}`}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 12l4 4 8-8" />
        </svg>
      </div>
      <div>
        <p className="text-xs uppercase tracking-widest text-gray-500">
          {title}
        </p>
        <p
          className={`text-2xl font-semibold mt-1 ${
            danger ? "text-rose-600" : "text-gray-900"
          }`}
        >
          {value}
        </p>
      </div>
    </div>
  );
}

function Metric({ label, value, danger }) {
  return (
    <div>
      <dt className="text-xs text-gray-500">{label}</dt>
      <dd
        className={`text-xl font-semibold mt-1 ${
          danger ? "text-rose-600" : "text-gray-900"
        }`}
      >
        {value}
      </dd>
    </div>
  );
}

function Action({ to, label, primary }) {
  return (
    <Link
      to={to}
      className={`px-5 py-3 rounded-xl text-sm font-semibold transition-colors ${
        primary
          ? "bg-blue-600 text-white hover:bg-blue-500"
          : "bg-slate-100 text-slate-800 hover:bg-slate-200"
      }`}
    >
      {label}
    </Link>
  );
}
