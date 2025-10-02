"use client"

import type React from "react"

import { Navigate } from "react-router-dom"
import { useAuth } from "../hooks/useAuth"

interface ProtectedRouteProps {
  children: React.ReactNode
  requireAdmin?: boolean
}

export function ProtectedRoute({ children, requireAdmin = false }: ProtectedRouteProps) {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "50vh" }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  if (requireAdmin && user.role !== "admin") {
    return <Navigate to="/dashboard" replace />
  }

  return <>{children}</>
}
