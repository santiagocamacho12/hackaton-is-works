"use client"

import { useToast } from "../hooks/useToast"

export function ToastContainer() {
  const { toasts, removeToast } = useToast()

  return (
    <div className="toast-container position-fixed top-0 end-0 p-3" style={{ zIndex: 9999 }}>
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`toast show align-items-center text-white bg-${
            toast.type === "success" ? "success" : toast.type === "error" ? "danger" : "info"
          } border-0`}
          role="alert"
        >
          <div className="d-flex">
            <div className="toast-body">{toast.message}</div>
            <button
              type="button"
              className="btn-close btn-close-white me-2 m-auto"
              onClick={() => removeToast(toast.id)}
            ></button>
          </div>
        </div>
      ))}
    </div>
  )
}
