import { NavLink } from "react-router";
import { useAuth } from "../context/AuthContext.jsx";
import { useCartStore } from "../store/cartStore.js";

export default function NavBar({ theme, onToggleTheme }) {
  const { user, dispatch } = useAuth();
  const itemCount = useCartStore((state) =>
    state.items.reduce((sum, item) => sum + item.quantity, 0),
  );

  return (
    <nav>
      <NavLink to="/" end>
        Home
      </NavLink>
      <NavLink to="/products">Products</NavLink>
      <NavLink to="/cart">Cart ({itemCount})</NavLink>
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
      <button type="button" onClick={onToggleTheme}>
        {theme === "light" ? "Dark mode" : "Light mode"}
      </button>
    </nav>
  );
}
