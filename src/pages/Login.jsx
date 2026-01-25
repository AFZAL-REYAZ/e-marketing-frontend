import { useState } from "react";
import { loginAdmin } from "../services/api";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!email || !password) {
      setError("Please enter email and password");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const data = await loginAdmin({ email, password });

      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.admin.role);
      localStorage.setItem("email", data.admin.email);

      if (data.admin.role === "superadmin") {
        navigate("/superadmin");
      } else {
        navigate("/admin-dashboard");
      }
    } catch (err) {
      if (err.response?.status === 403) {
        setError("Your account has been disabled");
      } else {
        setError("Invalid email or password");
      }
    }
    finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-2xl border border-gray-200 shadow-xl px-8 py-10">

        {/* Header */}
        <div className="text-center mb-8">
          <div className="mx-auto mb-4 h-12 w-12 rounded-xl bg-indigo-600 flex items-center justify-center text-white text-xl font-semibold">
            GM
          </div>
          <h1 className="text-2xl font-semibold text-gray-900">
            Admin Login
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Sign in to your administration panel
          </p>
        </div>

        {/* Email */}
        <div className="mb-5">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email address
          </label>
          <input
            type="email"
            className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="admin@company.com"
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        {/* Password */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Password
          </label>

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              className="w-full rounded-xl border border-gray-300 px-4 py-3 pr-12 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="••••••••"
              onChange={(e) => setPassword(e.target.value)}
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
              aria-label="Toggle password visibility"
            >
              {showPassword ? (
                // Eye Off
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13.875 18.825A10.05 10.05 0 0112 19c-5.523 0-10-4.477-10-10 0-1.657.402-3.22 1.125-4.575M6.225 6.225A9.965 9.965 0 0112 5c5.523 0 10 4.477 10 10 0 1.657-.402 3.22-1.125 4.575M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              ) : (
                // Eye
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 text-center">
            {error}
          </div>
        )}

        {/* Button */}
        <button
          onClick={handleLogin}
          disabled={loading}
          className="w-full rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white py-3 text-sm font-semibold transition disabled:opacity-50 shadow-sm"
        >
          {loading ? "Signing in..." : "Sign in"}
        </button>

        {/* Footer */}
        <p className="mt-8 text-center text-xs text-gray-400">
          © {new Date().getFullYear()} Good Mail • Secure Admin Access
        </p>
      </div>
    </div>
  );
}
