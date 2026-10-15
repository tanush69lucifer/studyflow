import { useEffect, useState } from "react";
import { auth } from "../config/api";

// Re-renders whenever login/logout happens anywhere in the app (or another tab).
export default function useAuth() {
  const [user, setUser] = useState(auth.getUser());
  useEffect(() => {
    const sync = () => setUser(auth.getToken() ? auth.getUser() : null);
    window.addEventListener("auth-change", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("auth-change", sync);
      window.removeEventListener("storage", sync);
    };
  }, []);
  return user;
}
