import { Navigate, useLocation } from "react-router-dom";
import useAuth from "../hooks/useAuth";

// Logged out? Send to /login and come back here after signing in.
export default function ProtectedRoute({ children }) {
  const user = useAuth();
  const location = useLocation();
  if (!user) return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  return children;
}
