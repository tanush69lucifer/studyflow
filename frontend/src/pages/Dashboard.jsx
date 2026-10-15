import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ApiNotice from "../components/ApiNotice";
import { api } from "../config/api";
import useAuth from "../hooks/useAuth";

const NEXT_STATUS = { pending: "in-progress", "in-progress": "completed", completed: "pending" };

export default function Dashboard() {
  const user = useAuth();
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState(null);
  const [error, setError] = useState("");

  // GET /api/tasks on page load
  useEffect(() => {
    let alive = true;
    api("/api/tasks")
      .then(data => alive && setTasks(data.tasks))
      .catch(err => alive && setError(err.message))
      .finally(() => alive && setLoading(false));
    return () => { alive = false; };
  }, []);

  async function handleCreateTask(event) {
    event.preventDefault();
    if (!title.trim()) return;
    setError("");
    setBusyId("new");
    try {
      // POST /api/tasks — owner is set by the backend from the JWT
      const data = await api("/api/tasks", { method: "POST", body: { title: title.trim(), description: description.trim() } });
      setTasks(current => [data.task, ...current]);
      setTitle("");
      setDescription("");
    } catch (err) {
      setError(err.message);
    } finally {
      setBusyId(null);
    }
  }

  async function handleUpdateTask(id, changes) {
    setError("");
    setBusyId(id);
    try {
      // PATCH /api/tasks/:id — update UI only after the server confirms
      const data = await api(`/api/tasks/${id}`, { method: "PATCH", body: changes });
      setTasks(current => current.map(t => t.id === id ? data.task : t));
    } catch (err) {
      setError(err.message);
    } finally {
      setBusyId(null);
    }
  }

  async function handleDeleteTask(id) {
    if (!window.confirm("Delete this task?")) return;
    setError("");
    setBusyId(id);
    try {
      // DELETE /api/tasks/:id — remove from UI only after success
      await api(`/api/tasks/${id}`, { method: "DELETE" });
      setTasks(current => current.filter(t => t.id !== id));
    } catch (err) {
      setError(err.message);
    } finally {
      setBusyId(null);
    }
  }

  const done = tasks.filter(t => t.status === "completed").length;

  return <div className="container dashboard">
    <div className="dashboard-heading"><div><span className="eyebrow">YOUR WORKSPACE</span><h1>Hi {user?.name?.split(" ")[0]}, good work starts with a plan.</h1><p>Your tasks are saved in MongoDB Atlas and visible only to you.</p></div><span className="demo-pill">LIVE</span></div>
    <ApiNotice tone="error">{error}</ApiNotice>
    <div className="stats">
      <div><span>Total tasks</span><b>{tasks.length}</b><small>From the database</small></div>
      <div><span>Completed</span><b>{done}</b><small>{tasks.length ? Math.round(done / tasks.length * 100) : 0}% done</small></div>
      <div><span>Remaining</span><b>{tasks.length - done}</b><small>Pending + in progress</small></div>
    </div>
    <section className="task-panel">
      <div className="panel-heading"><div><span className="eyebrow">TASK MANAGEMENT</span><h2>Your tasks</h2></div></div>
      <form className="add-form" onSubmit={handleCreateTask}>
        <label className="sr-only" htmlFor="new-task">New task title</label>
        <input id="new-task" value={title} onChange={e => setTitle(e.target.value)} placeholder="What do you need to get done?" maxLength={120} />
        <label className="sr-only" htmlFor="new-task-desc">Description</label>
        <input id="new-task-desc" value={description} onChange={e => setDescription(e.target.value)} placeholder="Details (optional)" maxLength={1000} />
        <button className="btn primary" type="submit" disabled={busyId === "new" || !title.trim()}>{busyId === "new" ? "Adding…" : "Add task +"}</button>
      </form>
      <div className="task-list">
        {loading && <p className="empty">Loading your tasks…</p>}
        {!loading && tasks.map(task => <article className="task-row" key={task.id} style={busyId === task.id ? { opacity: .55 } : undefined}>
          <button type="button" disabled={busyId === task.id} className={`task-check ${task.status === "completed" ? "checked" : ""}`}
            onClick={() => handleUpdateTask(task.id, { status: task.status === "completed" ? "pending" : "completed" })}
            aria-label={`Mark ${task.title} ${task.status === "completed" ? "pending" : "completed"}`}>{task.status === "completed" ? "✓" : ""}</button>
          <div className="task-info">
            <h3 className={task.status === "completed" ? "crossed" : ""}><Link to={`/tasks/${task.id}`} style={{ color: "inherit" }}>{task.title}</Link></h3>
            {task.description && <p>{task.description}</p>}
            <span className={`status ${task.status}`}>{task.status}</span>
          </div>
          <div className="task-actions">
            <button type="button" disabled={busyId === task.id} onClick={() => handleUpdateTask(task.id, { status: NEXT_STATUS[task.status] })}>→ {NEXT_STATUS[task.status]}</button>
            <button className="danger" type="button" disabled={busyId === task.id} onClick={() => handleDeleteTask(task.id)}>Delete</button>
          </div>
        </article>)}
        {!loading && tasks.length === 0 && !error && <p className="empty">No tasks yet. Add your first one above.</p>}
      </div>
    </section>
  </div>;
}
