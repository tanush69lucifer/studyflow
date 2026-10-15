// Small status banner: tone = "info" | "error" | "success"
export default function ApiNotice({ children, tone = "info" }) {
  if (!children) return null;
  const colors = {
    info: undefined,
    error: { background: "#fdecec", borderColor: "#f3c2c2", color: "#9b2c2c" },
    success: { background: "#e8f5ee", borderColor: "#bfe1cf", color: "#176b50" }
  };
  return <div className="api-notice" role={tone === "error" ? "alert" : "status"} style={colors[tone]}>
    <span className="dot" style={tone === "error" ? { background: "#c53030" } : undefined} />{children}
  </div>;
}
