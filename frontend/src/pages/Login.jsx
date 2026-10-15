import { useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import Field from "../components/Field";
import ApiNotice from "../components/ApiNotice";
import { api, auth } from "../config/api";
import useAuth from "../hooks/useAuth";

export default function Login() {
  const user = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const redirectTo = location.state?.from || "/dashboard";

  if (user) return <Navigate to={redirectTo} replace />;

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      // POST /api/auth/login  { email, password }  -> { token, user }
      const data = await api("/api/auth/login", { method: "POST", body: { email, password } });
      auth.save(data.token, data.user);
      navigate(redirectTo, { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return <section className="auth-layout">
    <div className="auth-copy"><span className="eyebrow">WELCOME BACK</span><h1>Your next productive day starts here.</h1>
      <p>Sign in to pick up your tasks right where you left them.</p>
      <div className="auth-step"><b>01</b><span><strong>Login API</strong><small>POST /api/auth/login</small></span></div>
      <div className="auth-step"><b>02</b><span><strong>Receive a token</strong><small>JWT sent as Bearer on every task request</small></span></div>
    </div>
    <div className="form-card"><span className="eyebrow">YOUR WORKSPACE</span><h2>Sign in</h2><p className="muted">Apne account ki details enter karo.</p>
      <ApiNotice tone="error">{error}</ApiNotice>
      <form onSubmit={handleSubmit}>
        <Field label="Email address" id="login-email" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" autoComplete="email" />
        <Field label="Password" id="login-password" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Enter your password" autoComplete="current-password" />
        <button className="btn primary full" type="submit" disabled={loading}>{loading ? "Signing in…" : "Sign in →"}</button>
      </form>
      <p className="form-bottom">New to StudyFlow? <Link to="/register">Create an account</Link></p>
      <div className="api-hint"><b>API</b><code>POST /api/auth/login</code><small>src/pages/Login.jsx → handleSubmit()</small></div>
    </div>
  </section>;
}
