import type { Request, Response, NextFunction } from "express"
import jwt from "jsonwebtoken"
import { env } from "../config/env"

export interface AuthRequest extends Request {
  user?: {
    id: string
    email: string
    role: "admin" | "user"
  }
}

export function authenticate(req: Request, res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new Error("Unauthorized")
    }

    const token = authHeader.substring(7)
    const decoded = jwt.verify(token, env.JWT_ACCESS_SECRET) as {
      id: string
      email: string
      role: "admin" | "user"
    }
    ;(req as AuthRequest).user = decoded
    next()
  } catch (error) {
    next(new Error("Unauthorized"))
  }
}

export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  const authReq = req as AuthRequest
  if (!authReq.user || authReq.user.role !== "admin") {
    return next(new Error("Forbidden"))
  }
  next()
}
