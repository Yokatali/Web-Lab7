import { NavLink } from "react-router";
import { useAuth } from "../context/AuthContext.jsx";

export default function NavBar() {
  const { user, dispatch } = useAuth();

  return (
    <nav>
      <NavLink to="/" end>
        Home
      </NavLink>
      <NavLink to="/products">Products</NavLink>
      {user ? (
        <>
          <span>{user.username}</span>
          <button
            type="button"
            onClick={() => dispatch({ type: "LOGGED_OUT" })}
          >
            Logout
          </button>
        </>
      ) : (
        <NavLink to="/login">Login</NavLink>
      )}
    </nav>
  );
}
