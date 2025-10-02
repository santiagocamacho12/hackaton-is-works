export interface User {
  id: string
  email: string
  password: string
  role: "admin" | "user"
  createdAt: string
}

export interface UserResponse {
  id: string
  email: string
  role: "admin" | "user"
}
