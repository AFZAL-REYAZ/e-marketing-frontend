import { useEffect, useState } from "react";
import { getEmailHistory } from "../services/api";

export default function EmailHistory() {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    getEmailHistory().then(setLogs);
  }, []);

  const total = logs.length;
  const sent = logs.filter((l) => l.status === "sent").length;
  const failed = logs.filter((l) => l.status !== "sent").length;

  return (
    <div className="min-h-screen bg-white pt-24 pb-12 px-6">
      <div className="max-w-7xl mx-auto">
        {/* HEADER */}
        <div className="mb-10">
          <h1 className="text-2xl font-semibold text-gray-900 mb-1">
            Email activity
          </h1>
          <p className="text-sm text-gray-500">
            View the history and delivery status of sent email campaigns.
          </p>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
          <StatCard label="Total emails" value={total} />
          <StatCard label="Successfully sent" value={sent} />
          <StatCard label="Failed deliveries" value={failed} />
        </div>

        {/* TABLE */}
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-gray-700">
              <thead className="bg-gray-50 border-b border-gray-200 text-xs uppercase text-gray-500">
                <tr>
                  <th className="p-4 text-left font-semibold">Recipients</th>
                  <th className="p-4 text-left font-semibold">Subject</th>
                  <th className="p-4 text-left font-semibold">Status</th>
                  <th className="p-4 text-left font-semibold">Sent at</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {logs.length === 0 ? (
                  <tr>
                    <td
                      colSpan={4}
                      className="p-10 text-center text-gray-400"
                    >
                      No email history available.
                    </td>
                  </tr>
                ) : (
                  logs.map((log) => (
                    <tr
                      key={log._id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="p-4 max-w-xs truncate text-gray-600">
                        {log.recipients.join(", ")}
                      </td>

                      <td className="p-4 font-medium text-gray-900">
                        {log.subject}
                      </td>

                      <td className="p-4">
                        <StatusBadge status={log.status} />
                      </td>

                      <td className="p-4 text-gray-500 text-xs">
                        {new Date(log.createdAt).toLocaleString()}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

/* 🔹 Small Components */

function StatCard({ label, value }) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
      <p className="text-sm text-gray-500 mb-2">{label}</p>
      <p className="text-3xl font-semibold text-gray-900">{value}</p>
    </div>
  );
}

function StatusBadge({ status }) {
  const isSent = status === "sent";

  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${
        isSent
          ? "bg-emerald-50 border-emerald-200 text-emerald-700"
          : "bg-rose-50 border-rose-200 text-rose-700"
      }`}
    >
      {isSent ? "Sent" : "Failed"}
    </span>
  );
}
