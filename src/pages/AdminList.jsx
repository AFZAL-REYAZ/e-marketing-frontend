import { useEffect, useState } from "react";
import {
  getAdmins,
  toggleAdminStatus,
  deleteAdmin,
} from "../services/api";

export default function AdminList() {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);

  const role = localStorage.getItem("role"); // superadmin | admin
  const isSuperAdmin = role === "superadmin";

  const fetchAdmins = async () => {
    try {
      const data = await getAdmins();
      setAdmins(data);
    } catch {
      alert("Failed to load admins");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  const handleToggle = async (id) => {
    await toggleAdminStatus(id);
    fetchAdmins();
  };

  const handleDelete = async (id, email) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete ${email}? This action cannot be undone.`
    );

    if (!confirmDelete) return;

    try {
      await deleteAdmin(id);
      fetchAdmins();
    } catch {
      alert("Failed to delete admin");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Loading administrators...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-12 px-6">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="mb-10">
          <h1 className="text-2xl font-semibold text-slate-900">
            Administrator management
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Manage administrator access and permissions
          </p>
        </div>

        {/* Table */}
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-100 text-slate-600">
                <tr>
                  <th className="px-6 py-4 text-left font-semibold">Email</th>
                  <th className="px-6 py-4 text-left font-semibold">Role</th>
                  <th className="px-6 py-4 text-left font-semibold">Status</th>
                  {isSuperAdmin && (
                    <th className="px-6 py-4 text-right font-semibold">
                      Actions
                    </th>
                  )}
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-200">
                {admins.map((admin) => (
                  <tr
                    key={admin._id}
                    className="hover:bg-slate-50 transition"
                  >
                    <td className="px-6 py-4 font-medium text-slate-900">
                      {admin.email}
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${
                          admin.role === "superadmin"
                            ? "bg-purple-50 border-purple-200 text-purple-700"
                            : "bg-blue-50 border-blue-200 text-blue-700"
                        }`}
                      >
                        {admin.role}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${
                          admin.isActive
                            ? "bg-emerald-50 border-emerald-200 text-emerald-700"
                            : "bg-rose-50 border-rose-200 text-rose-700"
                        }`}
                      >
                        {admin.isActive ? "Active" : "Disabled"}
                      </span>
                    </td>

                    {isSuperAdmin && (
                      <td className="px-6 py-4">
                        {admin.role !== "superadmin" && (
                          <div className="flex justify-end gap-3">
                            <button
                              onClick={() => handleToggle(admin._id)}
                              className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition ${
                                admin.isActive
                                  ? "border-rose-300 text-rose-700 hover:bg-rose-50"
                                  : "border-emerald-300 text-emerald-700 hover:bg-emerald-50"
                              }`}
                            >
                              {admin.isActive ? "Disable" : "Enable"}
                            </button>

                            <button
                              onClick={() =>
                                handleDelete(admin._id, admin.email)
                              }
                              className="px-3 py-1.5 rounded-lg text-xs font-semibold border border-slate-300 text-slate-700 hover:bg-slate-100 transition"
                            >
                              Delete
                            </button>
                          </div>
                        )}
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}
