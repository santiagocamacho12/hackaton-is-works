import type { Response, NextFunction } from "express"
import { logsService } from "../services/logs.service"
import type { AuthRequest } from "../middlewares/auth"

export const logsController = {
  async getAll(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const page = Number.parseInt(req.query.page as string) || 1
      const limit = Number.parseInt(req.query.limit as string) || 20

      const result = logsService.getAll(page, limit)
      res.json({ ...result, page, limit })
    } catch (error) {
      next(error)
    }
  },
}
