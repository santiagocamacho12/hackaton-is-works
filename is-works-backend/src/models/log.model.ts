export interface LogEntry {
  id: string
  timestamp: string
  level: string
  message: string
  userId?: string
  ip?: string
  userAgent?: string
}
