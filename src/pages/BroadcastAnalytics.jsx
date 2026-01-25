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
      <div className="min-h-screen flex items-center justify-center">
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
        <h1 className="text-3xl sm:text-4xl font-semibold mt-1">
          Performance overview
        </h1>
        <p className="text-sm text-gray-500 mt-2">
          {broadcast.subject}
        </p>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        <Stat label="Sent" value={stats.sent} />
        <Stat label="Opened" value={stats.opened} />
        <Stat label="Clicked" value={stats.clicked} />
        <Stat label="Open rate" value={`${openRate}%`} />
        <Stat label="Click rate" value={`${clickRate}%`} />
        <Stat label="Unsubscribed" value={stats.unsubscribed} />
      </div>

      {/* BARS */}
      <div className="bg-white p-4 sm:p-6 rounded-3xl shadow-sm border">
        <Bar label="Sent" value={stats.sent} max={stats.sent} />
        <Bar label="Opened" value={stats.opened} max={stats.sent} />
        <Bar label="Clicked" value={stats.clicked} max={stats.sent} />
        <Bar label="Unsubscribed" value={stats.unsubscribed} max={stats.sent} />
      </div>
    </div>
  );
}

function Stat({ label, value }) {
  return (
    <div className="bg-white p-4 rounded-2xl border shadow-sm">
      <p className="text-xs text-gray-500 uppercase">{label}</p>
      <p className="text-2xl font-semibold">{value}</p>
    </div>
  );
}

function Bar({ label, value, max }) {
  const width = max ? (value / max) * 100 : 0;

  return (
    <div className="mb-4">
      <div className="flex justify-between text-sm mb-1">
        <span>{label}</span>
        <span>{value}</span>
      </div>
      <div className="h-2 bg-gray-100 rounded-full">
        <div
          className="h-2 bg-blue-600 rounded-full"
          style={{ width: `${width}%` }}
        />
      </div>
    </div>
  );
}
