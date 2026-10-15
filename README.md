# StudyFlow — Full-Stack Task Manager

React + Vite frontend · Express + MongoDB Atlas backend · JWT auth.
Built on the [GLA-FS-PJ1](https://github.com/Abhi-dr/GLA-FS-PJ1) starter — every TODO API call is implemented.

```
studyflow/
├── backend/          Express API (auth + tasks), Mongoose models, JWT middleware
├── frontend/         React + Vite app (the starter, now wired to the API)
├── setup.bat         one-time install + creates .env files
├── start.bat         runs backend + frontend together (dev)
├── prod.bat          builds frontend, serves everything from :3000 (like live)
├── push.bat          git add/commit/push in one go
└── render.yaml       one-click deploy config for Render
```

## 1. MongoDB Atlas (5 min, free)

1. [cloud.mongodb.com](https://cloud.mongodb.com) → create a free **M0** cluster.
2. **Database Access** → Add user (username + password). Avoid `@ : / #` in the password, or URL-encode them.
3. **Network Access** → Add IP → **Allow access from anywhere** (`0.0.0.0/0`) — needed for Render.
4. **Connect → Drivers** → copy the URI. Replace `<password>` and add `studyflow` as the DB name:
   ```
   mongodb+srv://user:pass@cluster0.xxxxx.mongodb.net/studyflow?retryWrites=true&w=majority
   ```

## 2. Run locally (Windows cmd)

```cmd
setup.bat        :: installs everything, creates backend\.env, prints a JWT secret, opens .env in Notepad
start.bat        :: http://localhost:5173 (frontend) + http://localhost:3000 (API)
```

Paste your Atlas URI into `MONGODB_URI` and the printed secret into `JWT_SECRET` in `backend\.env`.

Manual equivalent (any OS):
```bash
npm install && npm run install:all
cp backend/.env.example backend/.env   # fill it in
cp frontend/.env.example frontend/.env
npm run dev
```

## 3. Push to GitHub

Create an **empty** repo on github.com (no README), then:
```cmd
push.bat "Initial commit"
```
It asks for the repo URL the first time. `.env` files are git-ignored — secrets never get pushed.

## 4. Make it live (Render, free)

1. [render.com](https://render.com) → sign in with GitHub → **New → Blueprint** → pick your repo (it reads `render.yaml`).
2. When asked, paste your Atlas URI into `MONGODB_URI`. `JWT_SECRET` is generated automatically.
3. Deploy. Your app is at `https://studyflow-xxxx.onrender.com` — API and frontend on the same URL, so no CORS setup.

Manual alternative: **New → Web Service** → Build `npm run build`, Start `npm start`, add the env vars from `backend/.env.example`.

> Free Render instances sleep after ~15 min idle; the first request after that takes ~30–50s.

**Frontend on Vercel/Netlify instead?** Set root dir to `frontend`, env `VITE_API_BASE_URL=https://your-api.onrender.com`, and add the Vercel URL to `CLIENT_ORIGIN` on the backend (comma-separated).

## API

| Method | Endpoint | Auth | Body |
|---|---|---|---|
| GET | `/api/health` | – | – |
| POST | `/api/auth/register` | – | `{ name, email, password }` → `{ token, user }` |
| POST | `/api/auth/login` | – | `{ email, password }` → `{ token, user }` |
| GET | `/api/auth/me` | Bearer | – |
| GET | `/api/tasks?status=` | Bearer | – |
| POST | `/api/tasks` | Bearer | `{ title, description?, status? }` |
| GET | `/api/tasks/:id` | Bearer | – |
| PATCH | `/api/tasks/:id` | Bearer | any of `{ title, description, status }` |
| DELETE | `/api/tasks/:id` | Bearer | – |

`status` ∈ `pending | in-progress | completed`. Task `owner` always comes from the JWT; users only ever see their own tasks.

## Frontend ↔ API map

| Screen | File | Call |
|---|---|---|
| Register | `src/pages/Register.jsx` | `POST /api/auth/register` → saves token, goes to dashboard |
| Login | `src/pages/Login.jsx` | `POST /api/auth/login` |
| Dashboard load | `src/pages/Dashboard.jsx` | `GET /api/tasks` in `useEffect` |
| Add / toggle / delete | `src/pages/Dashboard.jsx` | `POST`, `PATCH`, `DELETE /api/tasks/:id` |
| Task detail + edit | `src/pages/TaskDetail.jsx` | `GET` / `PATCH` / `DELETE /api/tasks/:id` |

All requests go through `src/config/api.js` (adds `Authorization: Bearer <token>`, parses errors, logs out on 401). `/dashboard` and `/tasks/:id` are protected routes.

**Token storage:** `localStorage` — simple and survives refresh, but readable by any XSS. httpOnly cookies are the safer upgrade.

## Troubleshooting

| Symptom | Fix |
|---|---|
| `Could not connect to MongoDB` | Wrong password in URI, or your IP isn't in Atlas Network Access |
| `querySrv ENOTFOUND` | Typo in cluster host, or your network blocks SRV DNS — try mobile hotspot |
| "Cannot reach the server" in UI | Backend isn't running / wrong `VITE_API_BASE_URL` |
| CORS error in browser | Add the frontend URL to `CLIENT_ORIGIN` in `backend/.env` |
| Changed `.env` but nothing happened | Restart `start.bat` |
