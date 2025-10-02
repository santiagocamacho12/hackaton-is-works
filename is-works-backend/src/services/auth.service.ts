import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import { env } from "../config/env"
import { db } from "../db/memory"
import type { UserResponse } from "../models/user.model"

export const authService = {
  async login(
    email: string,
    password: string,
  ): Promise<{ accessToken: string; refreshToken: string; user: UserResponse }> {
    if (env.AUTH_MODE === "static") {
      // Static mode: check against env variables
      if (email === env.STATIC_USER_EMAIL && password === env.STATIC_USER_PASSWORD) {
        const user = {
          id: "1",
          email: env.STATIC_USER_EMAIL,
          role: "admin" as const,
        }

        const accessToken = jwt.sign(user, env.JWT_ACCESS_SECRET, { expiresIn: "15m" })
        const refreshToken = jwt.sign({ id: user.id }, env.JWT_REFRESH_SECRET, {
          expiresIn: "7d",
        })

        db.refreshTokens.set(user.id, refreshToken)

        return { accessToken, refreshToken, user }
      }
      throw new Error("Invalid credentials")
    }

    // JWT mode: check against database
    const user = db.users.find((u) => u.email === email)
    if (!user) {
      throw new Error("Invalid credentials")
    }

    const isValid = await bcrypt.compare(password, user.password)
    if (!isValid) {
      throw new Error("Invalid credentials")
    }

    const userResponse: UserResponse = {
      id: user.id,
      email: user.email,
      role: user.role,
    }

    const accessToken = jwt.sign(userResponse, env.JWT_ACCESS_SECRET, { expiresIn: "15m" })
    const refreshToken = jwt.sign({ id: user.id }, env.JWT_REFRESH_SECRET, {
      expiresIn: "7d",
    })

    db.refreshTokens.set(user.id, refreshToken)

    return { accessToken, refreshToken, user: userResponse }
  },

  async refresh(refreshToken: string): Promise<{ accessToken: string }> {
    try {
      const decoded = jwt.verify(refreshToken, env.JWT_REFRESH_SECRET) as { id: string }
      const storedToken = db.refreshTokens.get(decoded.id)

      if (storedToken !== refreshToken) {
        throw new Error("Invalid refresh token")
      }

      const user = db.users.find((u) => u.id === decoded.id)
      if (!user) {
        throw new Error("User not found")
      }

      const userResponse: UserResponse = {
        id: user.id,
        email: user.email,
        role: user.role,
      }

      const accessToken = jwt.sign(userResponse, env.JWT_ACCESS_SECRET, { expiresIn: "15m" })

      return { accessToken }
    } catch (error) {
      throw new Error("Invalid refresh token")
    }
  },
}
