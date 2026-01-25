import { useEffect, useState } from "react";
import { getBroadcasts } from "../services/api";
import { Link } from "react-router-dom";

export default function BroadcastList() {
  const [broadcasts, setBroadcasts] = useState([]);

  useEffect(() => {
    getBroadcasts().then(setBroadcasts);
  }, []);

  return (
    <div className="space-y-6">
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

      <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <span className="text-sm font-semibold text-gray-900">
            All broadcasts
          </span>
          <span className="text-xs text-gray-500">
            {broadcasts.length} total
          </span>
        </div>

        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-left text-gray-600">
            <tr>
              <th className="px-6 py-3 font-medium">Subject</th>
              <th className="px-6 py-3 font-medium">Sent</th>
              <th className="px-6 py-3 font-medium">Opened</th>
              <th className="px-6 py-3 font-medium">Clicked</th>
              <th className="px-6 py-3 font-medium">Unsubscribed</th>
              <th className="px-6 py-3 font-medium text-right">Action</th>
            </tr>
          </thead>

          <tbody>
            {broadcasts.length === 0 ? (
              <tr>
                <td
                  colSpan="5"
                  className="px-6 py-10 text-center text-slate-400 text-sm"
                >
                  No broadcasts yet. Send your first campaign to see it here.
                </td>
              </tr>
            ) : (
              broadcasts.map((b, index) => (
                <tr
                  key={b._id}
                  className={`border-t border-slate-100 ${
                    index % 2 === 1 ? "bg-slate-50/50" : "bg-white"
                  } hover:bg-slate-50 transition-colors`}
                >
                  <td className="px-6 py-4 text-gray-900">
                    <div className="font-medium truncate max-w-xs">
                      {b.subject}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-700">{b.stats.sent}</td>
                  <td className="px-6 py-4 text-gray-700">
                    {b.stats.opened}
                  </td>
                  <td className="px-6 py-4 text-gray-700">
                    {b.stats.clicked}
                  </td>
                  <td className="px-6 py-4 text-gray-700">
                    {b.stats.unsubscribed}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Link
                      to={`/broadcasts/${b._id}`}
                      className="inline-flex items-center gap-1 text-sm font-semibold text-blue-600 hover:text-blue-500"
                    >
                      View analytics
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
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
