import { Outlet } from 'react-router'

export default function Layout() {
  return (
    <div className="app">
      <main>
        <Outlet />
      </main>
      <footer>
        <p>Online Shop - Web Programming Assignment 7</p>
      </footer>
    </div>
  )
}