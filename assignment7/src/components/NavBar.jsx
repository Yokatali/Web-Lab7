import { NavLink } from "react-router";

export default function NavBar() {
  return (
    <nav>
      <NavLink to="/" end>
        Home
      </NavLink>
      <NavLink to="/products">Products</NavLink>
    </nav>
  );
}
