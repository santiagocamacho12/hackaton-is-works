import express from "express"
import cors from "cors"
import helmet from "helmet"
import morgan from "morgan"
import cookieParser from "cookie-parser"
import { env } from "./config/env"
import { authRouter } from "./routes/auth.routes"
import { worksRouter } from "./routes/works.routes"
import { logsRouter } from "./routes/logs.routes"
import { errorHandler, notFound } from "./middlewares/errorHandler"

export function createServer() {
  const app = express()

  // Middlewares
  app.use(helmet())
  app.use(
    cors({
      origin: env.CORS_ORIGIN,
      credentials: true,
    }),
  )
  app.use(morgan("combined"))
  app.use(express.json())
  app.use(cookieParser())

  // Routes
  app.get("/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() })
  })

  app.use("/api/auth", authRouter)
  app.use("/api/works", worksRouter)
  app.use("/api/logs", logsRouter)

  // Error handling
  app.use(notFound)
  app.use(errorHandler)

  return app
}
