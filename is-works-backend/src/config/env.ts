import dotenv from "dotenv"

dotenv.config()

export const env = {
  PORT: process.env.PORT || "3000",
  AUTH_MODE: (process.env.AUTH_MODE || "jwt") as "static" | "jwt",
  JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET || "default_access_secret",
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET || "default_refresh_secret",
  STATIC_USER_EMAIL: process.env.STATIC_USER_EMAIL || "admin@example.com",
  STATIC_USER_PASSWORD: process.env.STATIC_USER_PASSWORD || "admin123",
  CORS_ORIGIN: process.env.CORS_ORIGIN || "http://localhost:5173",
}
