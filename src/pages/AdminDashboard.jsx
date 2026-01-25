import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        "https://e-marketing-backend.onrender.com/api/admin-dashboard/stats",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setStats(res.data);
    };

    fetchStats();
  }, []);

  if (!stats) {
    return (
      <div className="min-h-screen flex items-center justify-center text-cyan-400 font-mono">
        <span className="animate-pulse">INITIALIZING DASHBOARD SYSTEM...</span>
      </div>
    );
  }

  const email = localStorage.getItem("email") || "";
  const displayName = email.split("@")[0] || "Admin";

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest">
            Dashboard
          </p>
          <h1 className="text-3xl sm:text-4xl font-semibold text-gray-900 mt-1">
            Welcome, <span className="text-gray-900">{displayName}</span>
          </h1>
        </div>
        <div className="w-full max-w-xs">
          <div className="relative">
            <input
              type="text"
              className="w-full bg-white border border-gray-200 rounded-2xl py-2.5 pl-10 pr-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 shadow-sm"
              placeholder="Search in dashboard"
            />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-4.35-4.35M11 18a7 7 0 100-14 7 7 0 000 14z"
              />
            </svg>
          </div>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-3xl px-6 py-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 shadow-md">
        <div>
          <p className="text-xs font-semibold text-blue-700 uppercase tracking-widest">
            Your account is approved
          </p>
          <p className="text-sm text-blue-900 mt-1 max-w-xl">
            You can now send up to 100 emails per day. Use the button to
            start a new campaign or explore your existing history.
          </p>
        </div>
        <Link
          to="/"
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-sm font-semibold text-white shadow-sm"
        >
          Get started
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M14 5l7 7m0 0l-7 7m7-7H3"
            />
          </svg>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard
          title="Total campaigns"
          value={stats.totalCampaigns}
          trend="+"
          accent="bg-blue-600"
        />
        <StatCard
          title="Emails sent"
          value={stats.totalEmails}
          trend="+"
          accent="bg-indigo-500"
        />
        <StatCard
          title="Sent today"
          value={stats.emailsToday}
          trend="+"
          accent="bg-emerald-500"
        />
        <StatCard
          title="Failed emails"
          value={stats.failedEmails}
          trend="-"
          accent="bg-rose-500"
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <div className="bg-white rounded-3xl border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-gray-900">
              Main metrics
            </h3>
            <span className="text-xs text-slate-500">
              Last 30 days overview
            </span>
          </div>

          <dl className="grid grid-cols-2 gap-4">
            <div>
              <dt className="text-xs text-gray-500">Total emails</dt>
              <dd className="text-2xl font-semibold text-gray-900 mt-1">
                {stats.totalEmails}
              </dd>
            </div>
            <div>
              <dt className="text-xs text-gray-500">Sent today</dt>
              <dd className="text-2xl font-semibold text-emerald-600 mt-1">
                {stats.emailsToday}
              </dd>
            </div>
            <div>
              <dt className="text-xs text-gray-500">Campaigns</dt>
              <dd className="text-xl font-semibold text-blue-600 mt-1">
                {stats.totalCampaigns}
              </dd>
            </div>
            <div>
              <dt className="text-xs text-gray-500">Failed</dt>
              <dd className="text-xl font-semibold text-rose-500 mt-1">
                {stats.failedEmails}
              </dd>
            </div>
          </dl>
        </div>

        <div className="bg-white rounded-3xl border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-gray-900">
              Quick actions
            </h3>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              to="/"
              className="px-5 py-3 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-500 transition-colors flex items-center gap-2"
            >
              Start new campaign
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M14 5l7 7m0 0l-7 7m7-7H3"
                />
              </svg>
            </Link>
            <Link
              to="/history"
              className="px-5 py-3 rounded-xl bg-slate-100 text-slate-800 text-sm font-semibold hover:bg-slate-200 transition-colors"
            >
              View logs
            </Link>
            <Link
              to="/templates/create"
              className="px-5 py-3 rounded-xl bg-slate-100 text-slate-800 text-sm font-semibold hover:bg-slate-200 transition-colors"
            >
              ➕ Create Template
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, trend, accent }) {
  return (
    <div className="bg-white rounded-3xl border border-gray-200 p-5 shadow-sm flex items-center gap-4">
      <div
        className={`h-10 w-10 rounded-full flex items-center justify-center text-white ${accent}`}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 12l4 4 8-8"
          />
        </svg>
      </div>
      <div className="flex-1">
        <p className="text-xs text-gray-500 uppercase tracking-widest">
          {title}
        </p>
        <div className="flex items-baseline gap-2 mt-1">
          <span className="text-2xl font-semibold text-slate-900">
            {value}
          </span>
          {trend === "+" && (
            <span className="text-xs font-semibold text-emerald-400">
              +100%
            </span>
          )}
          {trend === "-" && (
            <span className="text-xs font-semibold text-rose-400">
              -5%
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
