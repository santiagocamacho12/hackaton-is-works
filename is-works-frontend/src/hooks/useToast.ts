"use client"

import { useState, useCallback } from "react"

export type ToastType = "success" | "error" | "info"

export interface Toast {
  id: string
  message: string
  type: ToastType
}

let toastListeners: ((toasts: Toast[]) => void)[] = []
let toastsState: Toast[] = []

function notifyListeners() {
  toastListeners.forEach((listener) => listener(toastsState))
}

export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>(toastsState)

  useState(() => {
    toastListeners.push(setToasts)
    return () => {
      toastListeners = toastListeners.filter((l) => l !== setToasts)
    }
  })

  const showToast = useCallback((message: string, type: ToastType = "info") => {
    const id = Math.random().toString(36).substring(7)
    toastsState = [...toastsState, { id, message, type }]
    notifyListeners()

    setTimeout(() => {
      toastsState = toastsState.filter((t) => t.id !== id)
      notifyListeners()
    }, 5000)
  }, [])

  const removeToast = useCallback((id: string) => {
    toastsState = toastsState.filter((t) => t.id !== id)
    notifyListeners()
  }, [])

  return { toasts, showToast, removeToast }
}
