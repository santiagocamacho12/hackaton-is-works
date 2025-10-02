"use client"

import { useState, useEffect } from "react"
import type { User } from "../lib/api"

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem("accessToken")
    const userData = localStorage.getItem("user")

    if (token && userData) {
      try {
        setUser(JSON.parse(userData))
      } catch {
        localStorage.removeItem("accessToken")
        localStorage.removeItem("user")
      }
    }
    setLoading(false)
  }, [])

  const login = (token: string, userData: User) => {
    localStorage.setItem("accessToken", token)
    localStorage.setItem("user", JSON.stringify(userData))
    setUser(userData)
  }

  const logout = () => {
    localStorage.removeItem("accessToken")
    localStorage.removeItem("user")
    setUser(null)
  }

  return { user, loading, login, logout, isAuthenticated: !!user }
}
