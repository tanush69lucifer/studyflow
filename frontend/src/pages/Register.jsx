import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import Field from "../components/Field";
import ApiNotice from "../components/ApiNotice";
import { api, auth } from "../config/api";
import useAuth from "../hooks/useAuth";

export default function Register() {
  const user = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (user) return <Navigate to="/dashboard" replace />;

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    if (password.length < 8) return setError("Password must be at least 8 characters.");
    setLoading(true);
    try {
      // POST /api/auth/register  { name, email, password }
      const data = await api("/api/auth/register", { method: "POST", body: { name, email, password } });
      auth.save(data.token, data.user);
      navigate("/dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return <section className="auth-layout">
    <div className="auth-copy"><span className="eyebrow">START SIMPLE</span><h1>A clearer space for everything you need to do.</h1>
      <p>Create an account and your tasks are saved to the cloud, private to you.</p>
      <div className="steps"><span>01 <small>Collect details</small></span><span>02 <small>Send to backend</small></span><span>03 <small>Handle response</small></span></div>
    </div>
    <div className="form-card"><span className="eyebrow">CREATE YOUR ACCOUNT</span><h2>Get started</h2><p className="muted">Basic details bhar kar shuru karo.</p>
      <ApiNotice tone="error">{error}</ApiNotice>
      <form onSubmit={handleSubmit}>
        <Field label="Full name" id="register-name" value={name} onChange={e => setName(e.target.value)} placeholder="Rahul Sharma" autoComplete="name" />
        <Field label="Email address" id="register-email" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" autoComplete="email" />
        <Field label="Password" id="register-password" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="At least 8 characters" autoComplete="new-password" />
        <button className="btn primary full" type="submit" disabled={loading}>{loading ? "Creating account…" : "Create account →"}</button>
      </form>
      <p className="form-bottom">Already registered? <Link to="/login">Sign in</Link></p>
      <div className="api-hint"><b>API</b><code>POST /api/auth/register</code><small>src/pages/Register.jsx → handleSubmit()</small></div>
    </div>
  </section>;
}
