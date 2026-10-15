import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Field from "../components/Field";
import ApiNotice from "../components/ApiNotice";
import { api } from "../config/api";

export default function TaskDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [task, setTask] = useState(null);
  const [form, setForm] = useState({ title: "", description: "", status: "pending" });
  const [error, setError] = useState("");
  const [saved, setSaved] = useState("");
  const [saving, setSaving] = useState(false);

  // GET /api/tasks/:id
  useEffect(() => {
    api(`/api/tasks/${id}`)
      .then(({ task }) => { setTask(task); setForm({ title: task.title, description: task.description, status: task.status }); })
      .catch(err => setError(err.message));
  }, [id]);

  async function save(event) {
    event.preventDefault();
    setError(""); setSaved(""); setSaving(true);
    try {
      const data = await api(`/api/tasks/${id}`, { method: "PATCH", body: form });
      setTask(data.task);
      setSaved("Saved.");
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function remove() {
    if (!window.confirm("Delete this task?")) return;
    try {
      await api(`/api/tasks/${id}`, { method: "DELETE" });
      navigate("/dashboard");
    } catch (err) {
      setError(err.message);
    }
  }

  const set = key => e => setForm(f => ({ ...f, [key]: e.target.value }));

  return <section className="auth-layout">
    <div className="auth-copy"><span className="eyebrow">TASK DETAIL</span><h1>{task ? task.title : error ? "Task not available" : "Loading…"}</h1>
      {task && <p>Created {new Date(task.createdAt).toLocaleString()} · Updated {new Date(task.updatedAt).toLocaleString()}</p>}
      <p><Link to="/dashboard">← Back to dashboard</Link></p>
    </div>
    {task && <div className="form-card"><span className="eyebrow">EDIT</span><h2>Update task</h2>
      <ApiNotice tone="error">{error}</ApiNotice>
      <ApiNotice tone="success">{saved}</ApiNotice>
      <form onSubmit={save}>
        <Field label="Title" id="task-title" value={form.title} onChange={set("title")} />
        <Field label="Description" id="task-desc" value={form.description} onChange={set("description")} />
        <label className="field" htmlFor="task-status"><span>Status</span>
          <select id="task-status" value={form.status} onChange={set("status")}
            style={{ padding: "12px 14px", borderRadius: 10, border: "1px solid var(--line)", font: "inherit", background: "#fff" }}>
            <option value="pending">pending</option>
            <option value="in-progress">in-progress</option>
            <option value="completed">completed</option>
          </select>
        </label>
        <button className="btn primary full" type="submit" disabled={saving}>{saving ? "Saving…" : "Save changes"}</button>
      </form>
      <p className="form-bottom"><a href="#delete" onClick={e => { e.preventDefault(); remove(); }} style={{ color: "#c53030" }}>Delete this task</a></p>
    </div>}
    {!task && error && <div className="form-card"><ApiNotice tone="error">{error}</ApiNotice></div>}
  </section>;
}
