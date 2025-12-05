import { NavLink } from "react-router-dom";

function Navbar({ loggedIn, onLogout }) {
  return (
    <nav className="navbar">
      <div className="navbar-left">
        <span className="navbar-brand">Notes App</span>
      </div>

      <div className="navbar-right">
        <NavLink
          to="/notes"
          className={({ isActive }) =>
            isActive ? "nav-link active" : "nav-link"
          }
        >
          Notes
        </NavLink>

        {!loggedIn && (
          <NavLink
            to="/login"
            className={({ isActive }) =>
              isActive ? "nav-link active" : "nav-link"
            }
          >
            Login
          </NavLink>
        )}

        {loggedIn && (
          <button className="nav-button" onClick={onLogout}>
            Logout
          </button>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
