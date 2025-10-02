import type { Request, Response, NextFunction } from "express"
import { ZodError } from "zod"
import { logRequest } from "../config/logger"

export function errorHandler(err: Error, req: Request, res: Response, next: NextFunction) {
  const userId = (req as any).user?.id
  const ip = req.ip || req.socket.remoteAddress
  const userAgent = req.get("user-agent")

  if (err instanceof ZodError) {
    logRequest("warn", `Validation error: ${err.message}`, userId, ip, userAgent)
    return res.status(400).json({
      error: "Validation error",
      details: err.errors.map((e) => ({
        path: e.path.join("."),
        message: e.message,
      })),
    })
  }

  if (err.message === "Unauthorized") {
    logRequest("warn", "Unauthorized access attempt", userId, ip, userAgent)
    return res.status(401).json({ error: "Unauthorized" })
  }

  if (err.message === "Forbidden") {
    logRequest("warn", "Forbidden access attempt", userId, ip, userAgent)
    return res.status(403).json({ error: "Forbidden" })
  }

  if (err.message === "Not found") {
    return res.status(404).json({ error: "Not found" })
  }

  if (err.message.includes("Version conflict")) {
    logRequest("warn", `Concurrency conflict: ${err.message}`, userId, ip, userAgent)
    return res.status(409).json({ error: err.message })
  }

  logRequest("error", `Server error: ${err.message}`, userId, ip, userAgent)
  res.status(500).json({ error: "Internal server error" })
}

export function notFound(req: Request, res: Response) {
  res.status(404).json({ error: "Route not found" })
}
