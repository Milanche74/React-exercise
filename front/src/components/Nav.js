import { NavLink } from "react-router-dom";

const Nav = () => {
  return (
    <nav className="nav-container">
      <NavLink className="nav-link" to="/">
        Serbia
      </NavLink>
      <NavLink className="nav-link" to="/uk">
        United Kingdom
      </NavLink>
      <NavLink className="nav-link" to="/hungary">
        Hungary
      </NavLink>
    </nav>
  );
};
export default Nav;
