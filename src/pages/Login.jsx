import { useState } from "react";
import { loginAdmin } from "../services/api";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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
  } catch {
    setError("Invalid email or password");
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-purple-600/30 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-cyan-600/30 rounded-full blur-[120px]" />

      <div className="w-full max-w-md glass-panel rounded-2xl p-8 relative z-10 border border-white/10 shadow-2xl shadow-black/50">

        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-white mb-2 tracking-tight">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">
              Admin Portal
            </span>
          </h2>
          <p className="text-sm text-gray-400">
            Authenticate to access the mainframe
          </p>
        </div>

        {/* Email */}
        <div className="mb-5">
          <label className="block text-xs font-medium text-cyan-400 uppercase tracking-wider mb-2">
            Email Identity
          </label>
          <input
            type="email"
            className="w-full bg-black/40 border border-white/10 rounded-lg text-white p-3 text-sm focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all duration-300 placeholder-gray-600"
            placeholder="admin@system.com"
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        {/* Password */}
        <div className="mb-8">
          <label className="block text-xs font-medium text-purple-400 uppercase tracking-wider mb-2">
            Security Key
          </label>
          <input
            type="password"
            className="w-full bg-black/40 border border-white/10 rounded-lg text-white p-3 text-sm focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all duration-300 placeholder-gray-600"
            placeholder="••••••••"
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 p-3 rounded bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center">
            {error}
          </div>
        )}

        {/* Button */}
        <button
          onClick={handleLogin}
          disabled={loading}
          className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white py-3 rounded-lg font-bold tracking-wide shadow-lg shadow-cyan-900/20 transition-all duration-300 hover:shadow-cyan-500/30 disabled:opacity-50 disabled:cursor-not-allowed border border-white/10"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing...
            </span>
          ) : (
            "INITIATE LOGIN"
          )}
        </button>

        {/* Footer */}
        <p className="text-[10px] text-gray-500 text-center mt-8 uppercase tracking-widest">
          Secure System • {new Date().getFullYear()}
        </p>
      </div>
    </div>
  );
}
