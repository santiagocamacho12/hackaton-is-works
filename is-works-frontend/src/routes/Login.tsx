"use client"

import type React from "react"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { authAPI } from "../lib/api"
import { useAuth } from "../hooks/useAuth"
import { validateForm } from "../lib/http"
import { loginSchema } from "../lib/validators"
import { useToast } from "../hooks/useToast"

export function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()
  const { showToast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrors({})

    const validation = validateForm(loginSchema, { email, password })
    if (!validation.success) {
      setErrors(validation.errors)
      return
    }

    setLoading(true)
    try {
      const response = await authAPI.login(email, password)
      login(response.accessToken, response.user)
      showToast("Inicio de sesión exitoso", "success")
      navigate("/dashboard")
    } catch (error: any) {
      showToast(error.message || "Error al iniciar sesión", "error")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container my-5">
      <div className="row justify-content-center">
        <div className="col-md-5">
          <div className="card shadow">
            <div className="card-body p-5">
              <h2 className="text-center mb-4">Iniciar Sesión</h2>
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">
                    Email
                  </label>
                  <input
                    type="email"
                    className={`form-control ${errors.email ? "is-invalid" : ""}`}
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                </div>
                <div className="mb-3">
                  <label htmlFor="password" className="form-label">
                    Contraseña
                  </label>
                  <input
                    type="password"
                    className={`form-control ${errors.password ? "is-invalid" : ""}`}
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  {errors.password && <div className="invalid-feedback">{errors.password}</div>}
                </div>
                <button type="submit" className="btn btn-primary w-100" disabled={loading}>
                  {loading ? "Ingresando..." : "Ingresar"}
                </button>
              </form>
              <div className="mt-3 text-center text-muted">
                <small>Demo: admin@example.com / Admin123</small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
