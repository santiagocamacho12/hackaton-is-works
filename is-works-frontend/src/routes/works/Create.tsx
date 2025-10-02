"use client"

import type React from "react"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { worksAPI } from "../../lib/api"
import { validateForm } from "../../lib/http"
import { workSchema } from "../../lib/validators"
import { useToast } from "../../hooks/useToast"

export function CreateWork() {
  const [title, setTitle] = useState("")
  const [category, setCategory] = useState("")
  const [description, setDescription] = useState("")
  const [tags, setTags] = useState("")
  const [link, setLink] = useState("")
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { showToast } = useToast()

  const categories = ["Redes", "Desarrollo Web", "Bases de Datos", "IA", "DevOps", "Otro"]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrors({})

    const tagsArray = tags
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean)

    const validation = validateForm(workSchema, {
      title,
      category,
      description,
      tags: tagsArray,
      link,
    })

    if (!validation.success) {
      setErrors(validation.errors)
      return
    }

    setLoading(true)
    try {
      const work = await worksAPI.create(validation.data)
      showToast("Trabajo creado correctamente", "success")
      navigate(`/works/${work.id}`)
    } catch (error: any) {
      showToast(error.message || "Error al crear el trabajo", "error")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container my-5">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <h1 className="mb-4">Publicar Nuevo Trabajo</h1>

          <div className="card shadow">
            <div className="card-body p-4">
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="title" className="form-label">
                    Título *
                  </label>
                  <input
                    type="text"
                    className={`form-control ${errors.title ? "is-invalid" : ""}`}
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Ej: Sistema de Monitoreo de Red"
                  />
                  {errors.title && <div className="invalid-feedback">{errors.title}</div>}
                </div>

                <div className="mb-3">
                  <label htmlFor="category" className="form-label">
                    Categoría *
                  </label>
                  <select
                    className={`form-select ${errors.category ? "is-invalid" : ""}`}
                    id="category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                  >
                    <option value="">Selecciona una categoría</option>
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                  {errors.category && <div className="invalid-feedback">{errors.category}</div>}
                </div>

                <div className="mb-3">
                  <label htmlFor="description" className="form-label">
                    Descripción *
                  </label>
                  <textarea
                    className={`form-control ${errors.description ? "is-invalid" : ""}`}
                    id="description"
                    rows={5}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe tu trabajo en detalle..."
                  ></textarea>
                  {errors.description && <div className="invalid-feedback">{errors.description}</div>}
                </div>

                <div className="mb-3">
                  <label htmlFor="tags" className="form-label">
                    Tags * (separados por comas)
                  </label>
                  <input
                    type="text"
                    className={`form-control ${errors.tags ? "is-invalid" : ""}`}
                    id="tags"
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                    placeholder="Ej: networking, python, monitoring"
                  />
                  {errors.tags && <div className="invalid-feedback">{errors.tags}</div>}
                </div>

                <div className="mb-3">
                  <label htmlFor="link" className="form-label">
                    Enlace al Proyecto *
                  </label>
                  <input
                    type="url"
                    className={`form-control ${errors.link ? "is-invalid" : ""}`}
                    id="link"
                    value={link}
                    onChange={(e) => setLink(e.target.value)}
                    placeholder="https://github.com/usuario/proyecto"
                  />
                  {errors.link && <div className="invalid-feedback">{errors.link}</div>}
                </div>

                <div className="d-flex gap-2">
                  <button type="submit" className="btn btn-primary" disabled={loading}>
                    {loading ? "Publicando..." : "Publicar Trabajo"}
                  </button>
                  <button type="button" className="btn btn-secondary" onClick={() => navigate("/works")}>
                    Cancelar
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
