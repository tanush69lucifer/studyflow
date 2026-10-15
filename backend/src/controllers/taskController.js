import Task, { TASK_STATUSES } from "../models/Task.js";

const EDITABLE = ["title", "description", "status"];

function pickEditable(body = {}) {
  return Object.fromEntries(EDITABLE.filter(k => body[k] !== undefined).map(k => [k, body[k]]));
}

// GET /api/tasks?status=pending
export async function listTasks(req, res) {
  const filter = { owner: req.user._id };
  if (req.query.status && TASK_STATUSES.includes(req.query.status)) filter.status = req.query.status;
  const tasks = await Task.find(filter).sort({ createdAt: -1 });
  res.json({ count: tasks.length, tasks });
}

// GET /api/tasks/:id
export async function getTask(req, res) {
  const task = await Task.findOne({ _id: req.params.id, owner: req.user._id });
  if (!task) return res.status(404).json({ message: "Task not found" });
  res.json({ task });
}

// POST /api/tasks  body: { title, description?, status? }  — owner comes from the JWT
export async function createTask(req, res) {
  const data = pickEditable(req.body);
  if (!data.title || !String(data.title).trim()) {
    return res.status(400).json({ message: "Title is required" });
  }
  const task = await Task.create({ ...data, owner: req.user._id });
  res.status(201).json({ message: "Task created", task });
}

// PATCH /api/tasks/:id  body: any of { title, description, status }
export async function updateTask(req, res) {
  const updates = pickEditable(req.body);
  if (Object.keys(updates).length === 0) {
    return res.status(400).json({ message: `Send at least one of: ${EDITABLE.join(", ")}` });
  }
  const task = await Task.findOneAndUpdate(
    { _id: req.params.id, owner: req.user._id },
    updates,
    { new: true, runValidators: true }
  );
  if (!task) return res.status(404).json({ message: "Task not found" });
  res.json({ message: "Task updated", task });
}

// DELETE /api/tasks/:id
export async function deleteTask(req, res) {
  const task = await Task.findOneAndDelete({ _id: req.params.id, owner: req.user._id });
  if (!task) return res.status(404).json({ message: "Task not found" });
  res.json({ message: "Task deleted", id: task._id });
}
