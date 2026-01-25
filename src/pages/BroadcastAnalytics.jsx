import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getBroadcastById } from "../services/api";

export default function BroadcastAnalytics() {
  const { id } = useParams();
  const [broadcast, setBroadcast] = useState(null);

  useEffect(() => {
    getBroadcastById(id).then(setBroadcast);
  }, [id]);

  if (!broadcast) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-700 font-medium">
        Loading analytics...
      </div>
    );
  }

  const { stats } = broadcast;

  const openRate = stats.sent
    ? ((stats.opened / stats.sent) * 100).toFixed(1)
    : 0;

  const clickRate = stats.sent
    ? ((stats.clicked / stats.sent) * 100).toFixed(1)
    : 0;

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest">
          Broadcast analytics
        </p>
        <h1 className="text-3xl sm:text-4xl font-semibold text-gray-900 mt-1">
          Performance overview
        </h1>
        <p className="text-sm text-gray-500 mt-2">
          {broadcast.subject}
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Stat label="Sent" value={stats.sent} />
        <Stat label="Opened" value={stats.opened} />
        <Stat label="Clicked" value={stats.clicked} />
        <Stat label="Open rate" value={`${openRate}%`} />
        <Stat label="Click rate" value={`${clickRate}%`} />
        <Stat label="Unsubscribed" value={stats.unsubscribed} />

      </div>

      <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-200">
        <Bar label="Sent emails" value={stats.sent} max={stats.sent} />
        <Bar label="Opened emails" value={stats.opened} max={stats.sent} />
        <Bar label="Clicked emails" value={stats.clicked} max={stats.sent} />
        <Bar label="Unsubscribed" value={stats.unsubscribed} max={stats.sent} />
      </div>
    </div>
  );
}

/* ================= SMALL COMPONENTS ================= */

function Stat({ label, value }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm p-5 border border-gray-200">
      <p className="text-xs font-medium text-gray-500 uppercase tracking-widest">
        {label}
      </p>
      <p className="mt-1 text-2xl font-semibold text-gray-900">
        {value}
      </p>
    </div>
  );
}

function Bar({ label, value, max }) {
  const width = max ? (value / max) * 100 : 0;

  return (
    <div className="mb-5">
      <div className="flex justify-between text-sm font-medium text-slate-700 mb-1">
        <span>{label}</span>
        <span className="text-slate-900">{value}</span>
      </div>

      <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
        <div
          className="h-2.5 bg-blue-600 rounded-full transition-all"
          style={{ width: `${width}%` }}
        />
      </div>
    </div>
  );
}
