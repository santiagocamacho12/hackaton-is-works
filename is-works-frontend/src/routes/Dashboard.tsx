"use client"

import { useAuth } from "../hooks/useAuth"
import { Link } from "react-router-dom"

export function Dashboard() {
  const { user } = useAuth()

  return (
    <div className="container my-5">
      <h1 className="mb-4">Dashboard</h1>
      <div className="row g-4">
        <div className="col-md-4">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Perfil</h5>
              <p className="card-text">
                <strong>Email:</strong> {user?.email}
              </p>
              <p className="card-text">
                <strong>Rol:</strong> {user?.role}
              </p>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Mis Trabajos</h5>
              <p className="card-text">Gestiona tus trabajos publicados</p>
              <Link to="/works" className="btn btn-primary">
                Ver Trabajos
              </Link>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Nuevo Trabajo</h5>
              <p className="card-text">Publica un nuevo trabajo</p>
              <Link to="/works/create" className="btn btn-success">
                Crear Trabajo
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
