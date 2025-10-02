import type { LogEntry } from "../models/log.model"
import fs from "fs"
import path from "path"

export const logsService = {
  getAll(page = 1, limit = 20): { logs: LogEntry[]; total: number } {
    // Read logs from file
    const logsPath = path.join(process.cwd(), "logs", "combined.log")

    if (!fs.existsSync(logsPath)) {
      return { logs: [], total: 0 }
    }

    const content = fs.readFileSync(logsPath, "utf-8")
    const lines = content.trim().split("\n").filter(Boolean)

    const logs: LogEntry[] = lines
      .map((line, index) => {
        try {
          const parsed = JSON.parse(line)
          return {
            id: index.toString(),
            timestamp: parsed.timestamp,
            level: parsed.level,
            message: parsed.message,
            userId: parsed.userId,
            ip: parsed.ip,
            userAgent: parsed.userAgent,
          }
        } catch {
          return null
        }
      })
      .filter((log): log is LogEntry => log !== null)
      .reverse() // Most recent first

    const total = logs.length
    const start = (page - 1) * limit
    const paginated = logs.slice(start, start + limit)

    return { logs: paginated, total }
  },
}
