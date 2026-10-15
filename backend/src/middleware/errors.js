export function notFound(req, res) {
  res.status(404).json({ message: `Route not found: ${req.method} ${req.originalUrl}` });
}

// eslint-disable-next-line no-unused-vars
export function errorHandler(err, req, res, next) {
  if (err.name === "ValidationError") {
    const message = Object.values(err.errors).map(e => e.message).join(", ");
    return res.status(400).json({ message });
  }
  if (err.name === "CastError") return res.status(400).json({ message: "Invalid id" });
  if (err.code === 11000) return res.status(409).json({ message: "Email is already registered" });
  if (err.type === "entity.parse.failed") return res.status(400).json({ message: "Invalid JSON body" });

  console.error(err);
  res.status(err.status || 500).json({ message: err.status ? err.message : "Something went wrong on the server" });
}
