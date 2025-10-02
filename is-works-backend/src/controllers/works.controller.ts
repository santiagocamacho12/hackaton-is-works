import type { Response, NextFunction } from "express"
import { z } from "zod"
import { worksService } from "../services/works.service"
import type { AuthRequest } from "../middlewares/auth"
import { logRequest } from "../config/logger"

const createWorkSchema = z.object({
  title: z.string().min(3),
  category: z.string().min(1),
  description: z.string().min(10),
  tags: z.array(z.string()).min(1),
  link: z.string().url(),
})

const updateWorkSchema = createWorkSchema.partial()

export const worksController = {
  async getAll(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const search = req.query.search as string | undefined
      const page = Number.parseInt(req.query.page as string) || 1
      const limit = Number.parseInt(req.query.limit as string) || 10

      const result = worksService.getAll(search, page, limit)
      res.json({ ...result, page, limit })
    } catch (error) {
      next(error)
    }
  },

  async getById(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const work = worksService.getById(req.params.id)
      res.json(work)
    } catch (error) {
      next(error)
    }
  },

  async create(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const data = createWorkSchema.parse(req.body)
      const work = worksService.create(data)

      const ip = req.ip || req.socket.remoteAddress
      const userAgent = req.get("user-agent")
      logRequest("info", `Work created: ${work.id}`, req.user?.id, ip, userAgent)

      res.status(201).json(work)
    } catch (error) {
      next(error)
    }
  },

  async update(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const data = updateWorkSchema.parse(req.body)
      const version = Number.parseInt(req.get("If-Match") || "0")

      if (!version) {
        throw new Error("If-Match header is required")
      }

      const work = worksService.update(req.params.id, data, version)

      const ip = req.ip || req.socket.remoteAddress
      const userAgent = req.get("user-agent")
      logRequest("info", `Work updated: ${work.id}`, req.user?.id, ip, userAgent)

      res.json(work)
    } catch (error) {
      next(error)
    }
  },

  async delete(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const version = Number.parseInt(req.get("If-Match") || "0")

      if (!version) {
        throw new Error("If-Match header is required")
      }

      worksService.delete(req.params.id, version)

      const ip = req.ip || req.socket.remoteAddress
      const userAgent = req.get("user-agent")
      logRequest("info", `Work deleted: ${req.params.id}`, req.user?.id, ip, userAgent)

      res.status(204).send()
    } catch (error) {
      next(error)
    }
  },
}
