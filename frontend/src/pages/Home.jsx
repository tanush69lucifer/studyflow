import { Link } from "react-router-dom";
import { API_BASE_URL } from "../config/api";

const features = [
  ["01", "Create an account", "Registration form se name, email aur password collect karo."],
  ["02", "Login securely", "Login par JWT milta hai jo har protected request mein Bearer token ban kar jaata hai."],
  ["03", "Manage tasks", "Tasks create, update, delete karo — sab MongoDB Atlas mein save hota hai."]
];

export default function Home() {
  return <div className="container">
    <section className="hero">
      <div>
        <span className="eyebrow">FULL-STACK TASK MANAGER</span>
        <h1>Plan your work.<br/><em>Flow through it.</em></h1>
        <p>React + Express + MongoDB Atlas task manager with JWT auth. Sign up, add tasks, track progress.</p>
        <div className="actions">
          <Link className="btn primary" to="/register">Create account ↗</Link>
          <Link className="btn secondary" to="/dashboard">Open dashboard</Link>
        </div>
              </div>
      <div className="hero-art">
        <div className="preview">
          <span className="eyebrow">YOUR WORKSPACE</span><h2>Today's focus</h2>
          <div className="progress"><span /></div><div className="progress-label"><span>Daily progress</span><b>2 of 4</b></div>
          <div className="preview-task done">✓ <span>Review JavaScript</span><small>Done</small></div>
          <div className="preview-task">○ <span>Understand JWT flow</span><small>In progress</small></div>
          <div className="preview-task">○ <span>Connect React APIs</span><small>Pending</small></div>
          <div className="preview-task">○ <span>Test protected routes</span><small>Pending</small></div>
        </div>
      </div>
    </section>
    <section className="section">
      <div className="section-title"><span className="eyebrow">THE LEARNING FLOW</span><h2>One frontend. Three key flows.</h2><p>Har screen real backend API se connected hai.</p></div>
      <div className="cards">{features.map(([n, title, text]) => <article className="card" key={n}><b>{n}</b><h3>{title}</h3><p>{text}</p></article>)}</div>
    </section>
    <section className="connection"><div><span className="eyebrow">BACKEND CONNECTION</span><h2>Where does the API URL go?</h2><p>Base URL frontend/.env mein hai. Production mein backend hi frontend serve karta hai, isliye same origin.</p></div><code>{API_BASE_URL || window.location.origin + " (same origin)"}</code></section>
  </div>;
}
