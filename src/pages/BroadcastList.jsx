import { useEffect, useState } from "react";
import { getBroadcasts } from "../services/api";
import { Link } from "react-router-dom";

export default function BroadcastList() {
  const [broadcasts, setBroadcasts] = useState([]);

  useEffect(() => {
    getBroadcasts().then(setBroadcasts);
  }, []);

  const getStatusBadge = (status) => {
    const base =
      "px-2 py-1 rounded-full text-xs font-semibold inline-block";

    switch (status) {
      case "scheduled":
        return (
          <span className={`${base} bg-yellow-100 text-yellow-700`}>
            🟡 Scheduled
          </span>
        );
      case "sending":
        return (
          <span className={`${base} bg-blue-100 text-blue-700`}>
            🔵 Sending
          </span>
        );
      case "sent":
        return (
          <span className={`${base} bg-green-100 text-green-700`}>
            🟢 Sent
          </span>
        );
      default:
        return (
          <span className={`${base} bg-gray-100 text-gray-600`}>
            Unknown
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div>
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest">
          Broadcasts
        </p>
        <h1 className="text-3xl sm:text-4xl font-semibold text-gray-900 mt-1">
          Campaign performance
        </h1>
        <p className="text-sm text-gray-500 mt-2">
          Review all bulk campaigns and open detailed analytics for each send.
        </p>
      </div>

      {/* DESKTOP TABLE */}
      <div className="hidden md:block bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between">
          <span className="text-sm font-semibold">All broadcasts</span>
          <span className="text-xs text-gray-500">
            {broadcasts.length} total
          </span>
        </div>

        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-left text-gray-600">
            <tr>
              <th className="px-6 py-3">Subject</th>
              <th className="px-6 py-3">Sent</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3 text-right">Action</th>
            </tr>
          </thead>

          <tbody>
            {broadcasts.map((b, i) => (
              <tr
                key={b._id}
                className={`border-t ${
                  i % 2 ? "bg-slate-50/50" : "bg-white"
                }`}
              >
                <td className="px-6 py-4 font-medium truncate max-w-xs">
                  {b.subject}
                </td>

                <td className="px-6 py-4">{b.stats.sent}</td>

                <td className="px-6 py-4">
                  {getStatusBadge(b.status)}
                </td>

                <td className="px-6 py-4 text-right">
                  <Link
                    to={`/broadcasts/${b._id}`}
                    className="text-blue-600 font-semibold"
                  >
                    Analytics →
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MOBILE CARDS */}
      <div className="md:hidden space-y-4">
        {broadcasts.map((b) => (
          <div
            key={b._id}
            className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm"
          >
            <div className="flex justify-between items-center">
              <h3 className="font-semibold truncate">{b.subject}</h3>
              {getStatusBadge(b.status)}
            </div>

            <div className="grid grid-cols-2 gap-3 text-sm mt-3">
              <MiniStat label="Sent" value={b.stats.sent} />
              <MiniStat label="Opened" value={b.stats.opened} />
              <MiniStat label="Clicked" value={b.stats.clicked} />
              <MiniStat label="Unsub" value={b.stats.unsubscribed} />
            </div>

            <Link
              to={`/broadcasts/${b._id}`}
              className="inline-block mt-4 text-sm font-semibold text-blue-600"
            >
              View analytics →
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

function MiniStat({ label, value }) {
  return (
    <div>
      <p className="text-xs text-gray-500">{label}</p>
      <p className="font-semibold">{value}</p>
    </div>
  );
}
