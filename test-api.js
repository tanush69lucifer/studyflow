// Tests every StudyFlow API endpoint end-to-end.
// Usage:  node test-api.js https://studyflow-w3py.onrender.com
//         node test-api.js            (defaults to http://localhost:3000)
const BASE = (process.argv[2] || "http://localhost:3000").replace(/\/$/, "");
let token = "";
let pass = 0, fail = 0;

async function call(method, path, body, auth = true) {
  const headers = { "Content-Type": "application/json" };
  if (auth && token) headers.Authorization = `Bearer ${token}`;
  const res = await fetch(BASE + path, { method, headers, body: body ? JSON.stringify(body) : undefined });
  const data = await res.json().catch(() => ({}));
  return { status: res.status, data };
}

function check(name, cond, info) {
  if (cond) { pass++; console.log(`  PASS  ${name}`); }
  else { fail++; console.log(`  FAIL  ${name}  ->  ${JSON.stringify(info)}`); }
}

(async () => {
  console.log(`\nTesting ${BASE}\n`);
  const email = `test${Date.now()}@studyflow.dev`;
  const password = "testpass123";

  let r = await call("GET", "/api/health");
  check("GET  /api/health  (db connected)", r.status === 200 && r.data.db === "connected", r);

  r = await call("GET", "/api/tasks", null, false);
  check("GET  /api/tasks without token -> 401", r.status === 401, r);

  r = await call("POST", "/api/auth/register", { name: "API Tester", email, password });
  check("POST /api/auth/register -> 201 + token", r.status === 201 && r.data.token, r);

  r = await call("POST", "/api/auth/register", { name: "API Tester", email, password });
  check("POST /api/auth/register duplicate -> 409", r.status === 409, r);

  r = await call("POST", "/api/auth/login", { email, password: "wrongpass1" });
  check("POST /api/auth/login wrong password -> 401", r.status === 401, r);

  r = await call("POST", "/api/auth/login", { email, password });
  check("POST /api/auth/login -> 200 + token", r.status === 200 && r.data.token, r);
  token = r.data.token;

  r = await call("GET", "/api/auth/me");
  check("GET  /api/auth/me", r.status === 200 && r.data.user?.email === email, r);

  r = await call("POST", "/api/tasks", { title: "Test task", description: "made by test-api.js" });
  check("POST /api/tasks -> 201", r.status === 201 && r.data.task?.id, r);
  const id = r.data.task?.id;

  r = await call("POST", "/api/tasks", { description: "no title" });
  check("POST /api/tasks without title -> 400", r.status === 400, r);

  r = await call("GET", "/api/tasks");
  check("GET  /api/tasks (list has 1)", r.status === 200 && r.data.count === 1, r);

  r = await call("GET", `/api/tasks/${id}`);
  check("GET  /api/tasks/:id", r.status === 200 && r.data.task?.title === "Test task", r);

  r = await call("PATCH", `/api/tasks/${id}`, { status: "completed" });
  check("PATCH /api/tasks/:id status=completed", r.status === 200 && r.data.task?.status === "completed", r);

  r = await call("PATCH", `/api/tasks/${id}`, { status: "banana" });
  check("PATCH invalid status -> 400", r.status === 400, r);

  r = await call("DELETE", `/api/tasks/${id}`);
  check("DELETE /api/tasks/:id", r.status === 200, r);

  r = await call("GET", `/api/tasks/${id}`);
  check("GET  deleted task -> 404", r.status === 404, r);

  console.log(`\n${pass} passed, ${fail} failed\n`);
  process.exit(fail ? 1 : 0);
})().catch(e => { console.error("Could not reach the API:", e.message); process.exit(1); });
