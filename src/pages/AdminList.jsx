import { useEffect, useState } from "react";
import { getAdmins, toggleAdminStatus } from "../services/api";

export default function AdminList() {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);

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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Loading administrators...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pt-24 pb-12 px-6">
      <div className="max-w-6xl mx-auto">
        {/* HEADER */}
        <div className="mb-10">
          <h1 className="text-2xl font-semibold text-gray-900 mb-1">
            Administrator management
          </h1>
          <p className="text-sm text-gray-500">
            Manage administrator access and account status.
          </p>
        </div>

        {/* TABLE */}
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-gray-700">
              <thead className="bg-gray-50 border-b border-gray-200 text-xs uppercase text-gray-500">
                <tr>
                  <th className="p-4 text-left font-semibold">Email</th>
                  <th className="p-4 text-left font-semibold">Role</th>
                  <th className="p-4 text-left font-semibold">Status</th>
                  <th className="p-4 text-left font-semibold">Action</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {admins.map((admin) => (
                  <tr
                    key={admin._id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="p-4 text-gray-800">
                      {admin.email}
                    </td>

                    <td className="p-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${
                          admin.role === "superadmin"
                            ? "bg-purple-50 border-purple-200 text-purple-700"
                            : "bg-blue-50 border-blue-200 text-blue-700"
                        }`}
                      >
                        {admin.role}
                      </span>
                    </td>

                    <td className="p-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${
                          admin.isActive
                            ? "bg-emerald-50 border-emerald-200 text-emerald-700"
                            : "bg-rose-50 border-rose-200 text-rose-700"
                        }`}
                      >
                        {admin.isActive ? "Active" : "Disabled"}
                      </span>
                    </td>

                    <td className="p-4">
                      {admin.role !== "superadmin" && (
                        <button
                          onClick={() => handleToggle(admin._id)}
                          className={`px-3 py-1.5 rounded-md text-xs font-medium border transition ${
                            admin.isActive
                              ? "border-rose-300 text-rose-700 hover:bg-rose-50"
                              : "border-emerald-300 text-emerald-700 hover:bg-emerald-50"
                          }`}
                        >
                          {admin.isActive ? "Disable" : "Enable"}
                        </button>
                      )}
                    </td>
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
