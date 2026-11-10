import { Outlet } from "react-router";
import NavBar from "./NavBar.jsx";
import { useLocalStorage } from "../hooks/useLocalStorage.js";

export default function Layout() {
  const [theme, setTheme] = useLocalStorage("theme", "light");

  function toggleTheme() {
    setTheme((current) => (current === "light" ? "dark" : "light"));
  }

  return (
    <div className={`app ${theme}`}>
      <header>
        <NavBar theme={theme} onToggleTheme={toggleTheme} />
      </header>
      <main>
        <Outlet />
      </main>
      <footer>
        <p>Online Shop - Web Programming Assignment 7</p>
      </footer>
    </div>
  );
}
