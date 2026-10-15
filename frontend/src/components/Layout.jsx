import { Link, NavLink, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { auth } from "../config/api";

export default function Layout({ children }) {
  const user = useAuth();
  const navigate = useNavigate();

  function logout() {
    auth.clear();
    navigate("/login");
  }

  return <div className="app-shell">
    <header className="topbar">
      <Link className="brand" to="/"><span className="brand-mark">S</span> StudyFlow</Link>
      <nav>
        <NavLink to="/" end>Overview</NavLink>
        {user ? <>
          <NavLink to="/dashboard">Dashboard</NavLink>
          <a href="#logout" onClick={e => { e.preventDefault(); logout(); }}>Logout ({user.name.split(" ")[0]})</a>
        </> : <>
          <NavLink to="/register">Register</NavLink>
          <NavLink to="/login">Login</NavLink>
        </>}
      </nav>
    </header>
    <main>{children}</main>
    <footer><span>StudyFlow — React + Express + MongoDB Atlas</span><span>JWT secured</span></footer>
  </div>;
}
