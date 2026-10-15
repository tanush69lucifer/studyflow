// VITE_API_BASE_URL = backend base URL (not an endpoint).
// Empty string = same origin (used when the backend serves the built frontend in production).
export const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || "").replace(/\/$/, "");

const TOKEN_KEY = "studyflow_token";
const USER_KEY = "studyflow_user";

// Trade-off: localStorage is simple and survives refresh, but any XSS on the page could read it.
// httpOnly cookies are safer but need cookie/CSRF setup on the backend. Fine for this project.
export const auth = {
  getToken: () => localStorage.getItem(TOKEN_KEY),
  getUser: () => { try { return JSON.parse(localStorage.getItem(USER_KEY)); } catch { return null; } },
  save(token, user) {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    window.dispatchEvent(new Event("auth-change"));
  },
  clear() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    window.dispatchEvent(new Event("auth-change"));
  }
};

// One fetch wrapper for every request: JSON body, Bearer token, readable errors.
export async function api(path, { method = "GET", body } = {}) {
  const headers = { "Content-Type": "application/json" };
  const token = auth.getToken();
  if (token) headers.Authorization = `Bearer ${token}`;

  let res;
  try {
    res = await fetch(`${API_BASE_URL}${path}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined
    });
  } catch {
    throw new Error("Cannot reach the server. Is the backend running?");
  }

  const data = await res.json().catch(() => ({}));
  if (res.status === 401 && token) auth.clear(); // expired/invalid token -> log out
  if (!res.ok) throw new Error(data.message || `Request failed (${res.status})`);
  return data;
}

/*
  POST   /api/auth/register  -> Register.jsx handleSubmit()
  POST   /api/auth/login     -> Login.jsx handleSubmit()
  GET    /api/tasks          -> Dashboard.jsx useEffect (page load)
  POST   /api/tasks          -> Dashboard.jsx handleCreateTask()
  GET    /api/tasks/:id      -> TaskDetail.jsx
  PATCH  /api/tasks/:id      -> Dashboard.jsx handleUpdateTask() / TaskDetail.jsx
  DELETE /api/tasks/:id      -> Dashboard.jsx handleDeleteTask() / TaskDetail.jsx
*/
