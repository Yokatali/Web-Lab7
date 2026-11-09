import { Outlet } from "react-router";
import NavBar from "./NavBar.jsx";

export default function Layout() {
  return (
    <div className="app">
      <header>
        <NavBar />
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