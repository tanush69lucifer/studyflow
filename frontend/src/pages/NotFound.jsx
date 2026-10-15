import { Link } from "react-router-dom";

// Unknown frontend URL ke liye fallback page.
export default function NotFound() {
  return <section className="not-found"><span className="eyebrow">404 / PAGE NOT FOUND</span><h1>This page took a detour.</h1><p>URL check karo ya homepage par wapas jao.</p><Link className="btn primary" to="/">Back to overview</Link></section>;
}
