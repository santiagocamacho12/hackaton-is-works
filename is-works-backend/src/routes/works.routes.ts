import { Router } from "express"
import { worksController } from "../controllers/works.controller"
import { authenticate } from "../middlewares/auth"

export const worksRouter = Router()

worksRouter.get("/", worksController.getAll)
worksRouter.get("/:id", worksController.getById)
worksRouter.post("/", authenticate, worksController.create)
worksRouter.put("/:id", authenticate, worksController.update)
worksRouter.delete("/:id", authenticate, worksController.delete)
