// HTTP utility functions with TypeScript generics

export interface FetchOptions extends RequestInit {
  timeout?: number
}

/**
 * Generic fetch wrapper with JSON parsing and error handling
 */
export async function fetchJSON<T>(url: string, options: FetchOptions = {}): Promise<T> {
  const { timeout = 8000, ...fetchOptions } = options

  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), timeout)

  try {
    const response = await fetch(url, {
      ...fetchOptions,
      signal: controller.signal,
      headers: {
        "Content-Type": "application/json",
        ...fetchOptions.headers,
      },
    })

    clearTimeout(timeoutId)

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: response.statusText }))
      throw new Error(error.message || `HTTP ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    clearTimeout(timeoutId)
    if (error instanceof Error && error.name === "AbortError") {
      throw new Error("Request timeout")
    }
    throw error
  }
}

/**
 * Retry function for failed requests (GET only)
 */
export async function retry<T>(fn: () => Promise<T>, maxRetries = 3, delay = 1000): Promise<T> {
  let lastError: Error

  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn()
    } catch (error) {
      lastError = error as Error
      if (i < maxRetries - 1) {
        await new Promise((resolve) => setTimeout(resolve, delay * (i + 1)))
      }
    }
  }

  throw lastError!
}

/**
 * Debounce function for input handlers
 */
export function debounce<T extends (...args: any[]) => any>(func: T, wait: number): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null
      func(...args)
    }

    if (timeout) {
      clearTimeout(timeout)
    }
    timeout = setTimeout(later, wait)
  }
}

/**
 * Format date to readable string
 */
export function formatDate(date: string | Date): string {
  const d = typeof date === "string" ? new Date(date) : date
  return new Intl.DateTimeFormat("es-ES", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(d)
}

/**
 * Validate form data with Zod schema
 */
export function validateForm<T>(
  schema: { parse: (data: unknown) => T },
  data: unknown,
): { success: true; data: T } | { success: false; errors: Record<string, string> } {
  try {
    const validated = schema.parse(data)
    return { success: true, data: validated }
  } catch (error: any) {
    const errors: Record<string, string> = {}
    if (error.errors) {
      error.errors.forEach((err: any) => {
        const path = err.path.join(".")
        errors[path] = err.message
      })
    }
    return { success: false, errors }
  }
}

/**
 * Auth guard - check if user is authenticated
 */
export function guardAuth(): boolean {
  const token = localStorage.getItem("accessToken")
  return !!token
}
