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
    <div className="min-h-screen bg-slate-50 py-10 px-6">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">
              Email templates
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Manage and reuse your email designs.
            </p>
          </div>

          <Link
            to="/templates/create"
            className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 transition"
          >
            Create template
          </Link>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-100 text-slate-600">
                <tr>
                  <th className="px-6 py-4 text-left font-semibold">Template name</th>
                  <th className="px-6 py-4 text-left font-semibold">Subject</th>
                  <th className="px-6 py-4 text-left font-semibold">Blocks</th>
                  <th className="px-6 py-4 text-left font-semibold">Created</th>
                  <th className="px-6 py-4 text-right font-semibold">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-200">
                {templates.length === 0 ? (
                  <tr>
                    <td
                      colSpan="5"
                      className="px-6 py-10 text-center text-slate-500"
                    >
                      No templates created yet
                    </td>
                  </tr>
                ) : (
                  templates.map((t) => (
                    <tr
                      key={t._id}
                      className="hover:bg-slate-50 transition"
                    >
                      <td className="px-6 py-4 font-medium text-slate-900">
                        {t.name}
                      </td>

                      <td className="px-6 py-4 text-slate-700">
                        {t.subject}
                      </td>

                      <td className="px-6 py-4 text-slate-600">
                        {t.blocks.length}
                      </td>

                      <td className="px-6 py-4 text-slate-500">
                        {new Date(t.createdAt).toLocaleDateString()}
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex justify-end gap-4">
                          <Link
                            to={`/templates/${t._id}`}
                            className="text-indigo-600 hover:text-indigo-800 font-medium"
                          >
                            Preview
                          </Link>

                          <Link
                            to={`/?template=${t._id}`}
                            className="text-emerald-600 hover:text-emerald-800 font-medium"
                          >
                            Use
                          </Link>
                        </div>
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
