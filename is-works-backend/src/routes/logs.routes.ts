import { Router } from "express"
import { logsController } from "../controllers/logs.controller"
import { authenticate, requireAdmin } from "../middlewares/auth"

export const logsRouter = Router()

logsRouter.get("/", authenticate, requireAdmin, logsController.getAll)
