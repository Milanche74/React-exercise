import { NavLink } from "react-router-dom";

const Nav = () => {
  return (
    <nav className="nav-container">
      <NavLink
        className={({ isActive }) =>
          isActive
            ? "nav-link link-active img-background"
            : "nav-link img-background"
        }
        to="/serbia"
      >
        <span className="link-text">Serbia</span>
      </NavLink>
      <NavLink
        className={({ isActive }) =>
          isActive
            ? "nav-link link-active img-background"
            : "nav-link img-background"
        }
        to="/uk"
      >
        <span className="link-text">United Kingdom</span>
      </NavLink>
      <NavLink
        className={({ isActive }) =>
          isActive
            ? "nav-link link-active img-background"
            : "nav-link img-background"
        }
        to="/hungary"
      >
        <span className="link-text">Hungary</span>
      </NavLink>
    </nav>
  );
};
export default Nav;
