"use client"

import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../hooks/useAuth"

export function NavBar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate("/")
  }

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container">
        <Link className="navbar-brand fw-bold" to="/">
          IS Works
        </Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <Link className="nav-link" to="/">
                Inicio
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/works">
                Trabajos
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/blog">
                Blog
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/contact">
                Contacto
              </Link>
            </li>
            {user ? (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/dashboard">
                    Dashboard
                  </Link>
                </li>
                {user.role === "admin" && (
                  <li className="nav-item">
                    <Link className="nav-link" to="/logs">
                      Logs
                    </Link>
                  </li>
                )}
                <li className="nav-item">
                  <button className="nav-link btn btn-link" onClick={handleLogout}>
                    Salir
                  </button>
                </li>
              </>
            ) : (
              <li className="nav-item">
                <Link className="nav-link" to="/login">
                  Ingresar
                </Link>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  )
}
