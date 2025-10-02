"use client"

import type React from "react"

import { useState } from "react"
import { validateForm } from "../lib/http"
import { contactSchema } from "../lib/validators"
import { useToast } from "../hooks/useToast"

export function Contact() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [message, setMessage] = useState("")
  const [errors, setErrors] = useState<Record<string, string>>({})
  const { showToast } = useToast()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setErrors({})

    const validation = validateForm(contactSchema, { name, email, message })
    if (!validation.success) {
      setErrors(validation.errors)
      return
    }

    showToast("Mensaje enviado correctamente", "success")
    setName("")
    setEmail("")
    setMessage("")
  }

  return (
    <div className="container my-5">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <h1 className="mb-4">Contacto</h1>
          <div className="card shadow">
            <div className="card-body p-4">
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="name" className="form-label">
                    Nombre
                  </label>
                  <input
                    type="text"
                    className={`form-control ${errors.name ? "is-invalid" : ""}`}
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                  {errors.name && <div className="invalid-feedback">{errors.name}</div>}
                </div>
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">
                    Email
                  </label>
                  <input
                    type="email"
                    className={`form-control ${errors.email ? "is-invalid" : ""}`}
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                </div>
                <div className="mb-3">
                  <label htmlFor="message" className="form-label">
                    Mensaje
                  </label>
                  <textarea
                    className={`form-control ${errors.message ? "is-invalid" : ""}`}
                    id="message"
                    rows={5}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                  ></textarea>
                  {errors.message && <div className="invalid-feedback">{errors.message}</div>}
                </div>
                <button type="submit" className="btn btn-primary">
                  Enviar Mensaje
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
