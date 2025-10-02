import { createServer } from "./server"
import { env } from "./config/env"
import { initializeDB } from "./db/memory"
import fs from "fs"
import path from "path"

// Create logs directory if it doesn't exist
const logsDir = path.join(process.cwd(), "logs")
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true })
}

// Initialize database
await initializeDB()

// Start server
const app = createServer()
const port = Number.parseInt(env.PORT)

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
  console.log(`Auth mode: ${env.AUTH_MODE}`)
  console.log(`CORS origin: ${env.CORS_ORIGIN}`)
})
