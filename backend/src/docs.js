import { Router } from "express";

// OpenAPI spec for the StudyFlow API.
// Swagger UI:  /api/docs   (interactive, "Try it out")
// ReDoc:       /api/redoc  (clean read-only docs)
// Raw spec:    /api/openapi.json

const Task = {
  type: "object",
  properties: {
    id: { type: "string", example: "6710f3c2a1b2c3d4e5f60718" },
    title: { type: "string", example: "Revise MongoDB models" },
    description: { type: "string", example: "Schema, model, document" },
    status: { type: "string", enum: ["pending", "in-progress", "completed"] },
    owner: { type: "string" },
    createdAt: { type: "string", format: "date-time" },
    updatedAt: { type: "string", format: "date-time" }
  }
};
const User = {
  type: "object",
  properties: {
    id: { type: "string" },
    name: { type: "string", example: "Tanush Bhardwaj" },
    email: { type: "string", example: "you@example.com" },
    createdAt: { type: "string", format: "date-time" }
  }
};
const Error = { type: "object", properties: { message: { type: "string" } } };
const AuthResponse = {
  type: "object",
  properties: { message: { type: "string" }, token: { type: "string" }, user: { $ref: "#/components/schemas/User" } }
};

const json = schema => ({ content: { "application/json": { schema } } });
const ref = name => ({ $ref: `#/components/schemas/${name}` });
const err = desc => ({ description: desc, ...json(ref("Error")) });
const idParam = { name: "id", in: "path", required: true, schema: { type: "string" }, description: "Task id" };

export const spec = {
  openapi: "3.0.3",
  info: {
    title: "StudyFlow API",
    version: "1.0.0",
    description:
      "Task manager API — Express + MongoDB Atlas + JWT.\n\n" +
      "**How to test protected routes:** call `POST /api/auth/login` (or register), copy the `token` " +
      "from the response, click **Authorize** at the top and paste it."
  },
  servers: [{ url: "/", description: "This server" }],
  tags: [{ name: "Health" }, { name: "Auth" }, { name: "Tasks" }],
  components: {
    securitySchemes: { bearerAuth: { type: "http", scheme: "bearer", bearerFormat: "JWT" } },
    schemas: { Task, User, Error, AuthResponse }
  },
  paths: {
    "/api/health": {
      get: {
        tags: ["Health"], summary: "Server + database status",
        responses: { 200: { description: "OK", ...json({ type: "object", properties: { ok: { type: "boolean" }, db: { type: "string", example: "connected" } } }) } }
      }
    },
    "/api/auth/register": {
      post: {
        tags: ["Auth"], summary: "Create an account",
        requestBody: { required: true, ...json({ type: "object", required: ["name", "email", "password"], properties: {
          name: { type: "string", example: "Tanush Bhardwaj" },
          email: { type: "string", example: "demo@studyflow.dev" },
          password: { type: "string", minLength: 8, example: "password123" } } }) },
        responses: { 201: { description: "Created", ...json(ref("AuthResponse")) }, 400: err("Validation error"), 409: err("Email already registered") }
      }
    },
    "/api/auth/login": {
      post: {
        tags: ["Auth"], summary: "Log in and get a JWT",
        requestBody: { required: true, ...json({ type: "object", required: ["email", "password"], properties: {
          email: { type: "string", example: "demo@studyflow.dev" },
          password: { type: "string", example: "password123" } } }) },
        responses: { 200: { description: "Logged in", ...json(ref("AuthResponse")) }, 401: err("Invalid email or password") }
      }
    },
    "/api/auth/me": {
      get: {
        tags: ["Auth"], summary: "Current user", security: [{ bearerAuth: [] }],
        responses: { 200: { description: "OK", ...json({ type: "object", properties: { user: ref("User") } }) }, 401: err("Missing/invalid token") }
      }
    },
    "/api/tasks": {
      get: {
        tags: ["Tasks"], summary: "List my tasks", security: [{ bearerAuth: [] }],
        parameters: [{ name: "status", in: "query", required: false, schema: { type: "string", enum: ["pending", "in-progress", "completed"] } }],
        responses: { 200: { description: "OK", ...json({ type: "object", properties: { count: { type: "integer" }, tasks: { type: "array", items: ref("Task") } } }) }, 401: err("Missing/invalid token") }
      },
      post: {
        tags: ["Tasks"], summary: "Create a task", security: [{ bearerAuth: [] }],
        requestBody: { required: true, ...json({ type: "object", required: ["title"], properties: {
          title: { type: "string", example: "Connect React with APIs" },
          description: { type: "string", example: "fetch + Bearer token" },
          status: { type: "string", enum: ["pending", "in-progress", "completed"], example: "pending" } } }) },
        responses: { 201: { description: "Created", ...json({ type: "object", properties: { message: { type: "string" }, task: ref("Task") } }) }, 400: err("Title missing"), 401: err("Missing/invalid token") }
      }
    },
    "/api/tasks/{id}": {
      parameters: [idParam],
      get: {
        tags: ["Tasks"], summary: "Get one task", security: [{ bearerAuth: [] }],
        responses: { 200: { description: "OK", ...json({ type: "object", properties: { task: ref("Task") } }) }, 404: err("Not found") }
      },
      patch: {
        tags: ["Tasks"], summary: "Update a task", security: [{ bearerAuth: [] }],
        requestBody: { required: true, ...json({ type: "object", properties: {
          title: { type: "string" }, description: { type: "string" },
          status: { type: "string", enum: ["pending", "in-progress", "completed"], example: "completed" } } }) },
        responses: { 200: { description: "Updated", ...json({ type: "object", properties: { message: { type: "string" }, task: ref("Task") } }) }, 400: err("Invalid update"), 404: err("Not found") }
      },
      delete: {
        tags: ["Tasks"], summary: "Delete a task", security: [{ bearerAuth: [] }],
        responses: { 200: { description: "Deleted", ...json({ type: "object", properties: { message: { type: "string" }, id: { type: "string" } } }) }, 404: err("Not found") }
      }
    }
  }
};

const swaggerHtml = `<!doctype html><html><head><meta charset="utf-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1"/>
<title>StudyFlow API — Swagger</title>
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/swagger-ui-dist@5/swagger-ui.css"/>
</head><body><div id="swagger"></div>
<script src="https://cdn.jsdelivr.net/npm/swagger-ui-dist@5/swagger-ui-bundle.js"></script>
<script>
  SwaggerUIBundle({ url: "/api/openapi.json", dom_id: "#swagger", persistAuthorization: true,
    tryItOutEnabled: true, displayRequestDuration: true, docExpansion: "list" });
</script></body></html>`;

const redocHtml = `<!doctype html><html><head><meta charset="utf-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1"/>
<title>StudyFlow API — ReDoc</title>
<style>body{margin:0}</style></head><body>
<redoc spec-url="/api/openapi.json"></redoc>
<script src="https://cdn.jsdelivr.net/npm/redoc@2/bundles/redoc.standalone.js"></script>
</body></html>`;

const router = Router();
router.get("/openapi.json", (req, res) => res.json(spec));
router.get("/docs", (req, res) => res.type("html").send(swaggerHtml));
router.get("/redoc", (req, res) => res.type("html").send(redocHtml));
export default router;
