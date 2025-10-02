import type { Request, Response, NextFunction } from "express"
import { z } from "zod"
import { authService } from "../services/auth.service"
import { logRequest } from "../config/logger"

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
})

export const authController = {
  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = loginSchema.parse(req.body)
      const result = await authService.login(email, password)

      const ip = req.ip || req.socket.remoteAddress
      const userAgent = req.get("user-agent")
      logRequest("info", `User logged in: ${email}`, result.user.id, ip, userAgent)

      res.cookie("refreshToken", result.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      })

      res.json({
        accessToken: result.accessToken,
        user: result.user,
      })
    } catch (error) {
      next(error)
    }
  },

  async refresh(req: Request, res: Response, next: NextFunction) {
    try {
      const refreshToken = req.cookies.refreshToken
      if (!refreshToken) {
        throw new Error("Unauthorized")
      }

      const result = await authService.refresh(refreshToken)
      res.json(result)
    } catch (error) {
      next(error)
    }
  },
}
