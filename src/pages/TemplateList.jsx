import { useEffect, useState } from "react";
import { getTemplates } from "../services/api";
import { Link } from "react-router-dom";

export default function TemplateList() {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getTemplates()
      .then(setTemplates)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-slate-500">
        Loading templates…
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 px-6 py-10">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-10">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">
              Email Templates
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Create, manage and reuse your email designs
            </p>
          </div>

          <Link
            to="/templates/create"
            className="inline-flex items-center justify-center rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 transition shadow-sm"
          >
            + Create template
          </Link>
        </div>

        {/* Empty state */}
        {templates.length === 0 && (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-500">
            No templates created yet
          </div>
        )}

        {/* Card Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {templates.map((t) => (
            <div
              key={t._id}
              className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition p-6 flex flex-col"
            >
              {/* Top */}
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-slate-900 truncate">
                  {t.name}
                </h3>
                <p className="text-sm text-slate-500 mt-1 line-clamp-2">
                  {t.subject}
                </p>
              </div>

              {/* Meta */}
              <div className="flex items-center justify-between text-xs text-slate-500 mb-5">
                <span>{t.blocks.length} blocks</span>
                <span>
                  {new Date(t.createdAt).toLocaleDateString()}
                </span>
              </div>

              {/* Preview snippet */}
              <div className="flex-1 bg-slate-50 rounded-xl p-4 text-sm text-slate-700 mb-5 line-clamp-4">
                {t.blocks
                  .filter((b) => b.type === "text")
                  .map((b) => b.text)
                  .join(" ")
                  || "No text content"}
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between mt-auto">
                <Link
                  to={`/templates/${t._id}`}
                  className="text-sm font-medium text-indigo-600 hover:text-indigo-800"
                >
                  Preview
                </Link>

                <Link
                  to={`/?template=${t._id}`}
                  className="inline-flex items-center rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700 transition"
                >
                  Use template
                </Link>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
