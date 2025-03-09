"use client"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../../contexts/AuthContext"
import "./Navbar.css"

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate("/login")
  }

  if (!isAuthenticated) {
    return (
      <nav className="navbar">
        <div className="container navbar-container">
          <Link to="/" className="navbar-brand">
            Inventory Management
          </Link>
          <div className="navbar-menu">
            <Link to="/login" className="navbar-link">
              Login
            </Link>
            <Link to="/register" className="navbar-link">
              Register
            </Link>
          </div>
        </div>
      </nav>
    )
  }

  return (
    <nav className="navbar">
      <div className="container navbar-container">
        <Link to="/dashboard" className="navbar-brand">
          Inventory Management
        </Link>
        <div className="navbar-menu">
          <Link to="/dashboard" className="navbar-link">
            Dashboard
          </Link>
          <Link to="/products" className="navbar-link">
            Products
          </Link>
          <Link to="/orders" className="navbar-link">
            Orders
          </Link>
          {user?.role === "ADMIN" && (
            <Link to="/users" className="navbar-link">
              Users
            </Link>
          )}
          <div className="navbar-dropdown">
            <button className="navbar-dropdown-toggle">{user?.username || "User"} ▼</button>
            <div className="navbar-dropdown-menu">
              <Link to="/profile" className="dropdown-item">
                Profile
              </Link>
              <button onClick={handleLogout} className="dropdown-item">
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar

