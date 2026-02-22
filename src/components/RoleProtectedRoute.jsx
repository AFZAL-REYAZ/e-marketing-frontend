import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

export default function RoleProtectedRoute({ children, allowedRole }) {
  const token = localStorage.getItem("token");

  if (!token) return <Navigate to="/login" />;

  try {
    const decoded = jwtDecode(token);

    // Expiry check
    if (decoded.exp * 1000 < Date.now()) {
      localStorage.removeItem("token");
      return <Navigate to="/login" />;
    }

    // Role check from token
    if (decoded.role !== allowedRole) {
      return <Navigate to="/" />;
    }

    return children;

  } catch (err) {
    localStorage.removeItem("token");
    return <Navigate to="/login" />;
  }
}