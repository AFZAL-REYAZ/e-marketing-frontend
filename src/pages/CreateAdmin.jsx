import { useState } from "react";
import axios from "axios";

export default function CreateAdmin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("admin");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCreate = async () => {
    if (!email || !password) {
      setStatus("All fields are required.");
      return;
    }

    try {
      setLoading(true);
      setStatus("");

      const token = localStorage.getItem("token");

      await axios.post(
        "https://e-marketing-backend.onrender.com/api/admin/create",
        { email, password, role },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setStatus("Admin account successfully created.");
      setEmail("");
      setPassword("");
      setRole("admin");
    } catch (error) {
      setStatus(
        error.response?.data?.message || "Failed to create admin account."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-6">
      <div className="w-full max-w-lg bg-white border border-gray-200 rounded-xl p-8 shadow-sm">

        {/* Header */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900">
            Create administrator
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Provision a new admin or super admin account
          </p>
        </div>

        {/* Email */}
        <div className="mb-5">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email address
          </label>
          <input
            type="email"
            className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="admin@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        {/* Password */}
        <div className="mb-5">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Password
          </label>
          <input
            type="password"
            className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {/* Role */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Role
          </label>
          <select
            className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="admin">Admin</option>
            <option value="superadmin">Super admin</option>
          </select>
        </div>

        {/* Status */}
        {status && (
          <div
            className={`mb-6 rounded-lg px-4 py-3 text-sm ${
              status.includes("successfully")
                ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                : "bg-rose-50 text-rose-700 border border-rose-200"
            }`}
          >
            {status}
          </div>
        )}

        {/* Button */}
        <button
          onClick={handleCreate}
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-blue-600 text-white text-sm font-semibold hover:bg-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading && (
            <svg
              className="animate-spin h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              />
            </svg>
          )}
          {loading ? "Creating admin…" : "Create admin"}
        </button>

      </div>
    </div>
  );
}
