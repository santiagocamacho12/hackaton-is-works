import { fetchJSON, retry } from "./http"

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000"

export interface User {
  id: string
  email: string
  role: "admin" | "user"
}

export interface LoginResponse {
  accessToken: string
  user: User
}

export interface Work {
  id: string
  title: string
  category: string
  description: string
  tags: string[]
  link: string
  createdAt: string
  updatedAt: string
  version: number
}

export interface WorksResponse {
  works: Work[]
  total: number
  page: number
  limit: number
}

export interface LogEntry {
  timestamp: string
  level: string
  message: string
  userId?: string
  ip?: string
  userAgent?: string
}

export interface LogsResponse {
  logs: LogEntry[]
  total: number
  page: number
  limit: number
}

// Auth API
export const authAPI = {
  login: async (email: string, password: string): Promise<LoginResponse> => {
    return fetchJSON<LoginResponse>(`${API_URL}/api/auth/login`, {
      method: "POST",
      body: JSON.stringify({ email, password }),
      credentials: "include",
    })
  },

  refresh: async (): Promise<{ accessToken: string }> => {
    return fetchJSON<{ accessToken: string }>(`${API_URL}/api/auth/refresh`, {
      method: "POST",
      credentials: "include",
    })
  },
}

// Works API
export const worksAPI = {
  getAll: async (params?: { search?: string; page?: number; limit?: number }): Promise<WorksResponse> => {
    const query = new URLSearchParams()
    if (params?.search) query.set("search", params.search)
    if (params?.page) query.set("page", params.page.toString())
    if (params?.limit) query.set("limit", params.limit.toString())

    const url = `${API_URL}/api/works${query.toString() ? `?${query}` : ""}`

    return retry(() =>
      fetchJSON<WorksResponse>(url, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      }),
    )
  },

  getById: async (id: string): Promise<Work> => {
    return retry(() =>
      fetchJSON<Work>(`${API_URL}/api/works/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      }),
    )
  },

  create: async (work: Omit<Work, "id" | "createdAt" | "updatedAt" | "version">): Promise<Work> => {
    return fetchJSON<Work>(`${API_URL}/api/works`, {
      method: "POST",
      body: JSON.stringify(work),
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    })
  },

  update: async (id: string, work: Partial<Work>, version: number): Promise<Work> => {
    return fetchJSON<Work>(`${API_URL}/api/works/${id}`, {
      method: "PUT",
      body: JSON.stringify(work),
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        "If-Match": version.toString(),
      },
    })
  },

  delete: async (id: string, version: number): Promise<void> => {
    return fetchJSON<void>(`${API_URL}/api/works/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        "If-Match": version.toString(),
      },
    })
  },
}

// Logs API
export const logsAPI = {
  getAll: async (params?: { page?: number; limit?: number }): Promise<LogsResponse> => {
    const query = new URLSearchParams()
    if (params?.page) query.set("page", params.page.toString())
    if (params?.limit) query.set("limit", params.limit.toString())

    return fetchJSON<LogsResponse>(`${API_URL}/api/logs?${query}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    })
  },
}
