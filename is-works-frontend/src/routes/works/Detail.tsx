"use client"

import { useState, useEffect } from "react"
import { useParams, Link, useNavigate } from "react-router-dom"
import { worksAPI, type Work } from "../../lib/api"
import { useAuth } from "../../hooks/useAuth"
import { useToast } from "../../hooks/useToast"
import { formatDate } from "../../lib/http"

export function WorkDetail() {
  const { id } = useParams<{ id: string }>()
  const [work, setWork] = useState<Work | null>(null)
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState(false)
  const { user } = useAuth()
  const { showToast } = useToast()
  const navigate = useNavigate()

  useEffect(() => {
    if (!id) return

    worksAPI
      .getById(id)
      .then(setWork)
      .catch((error: any) => {
        showToast(error.message || "Error al cargar el trabajo", "error")
      })
      .finally(() => setLoading(false))
  }, [id])

  const handleDelete = async () => {
    if (!work || !window.confirm("¿Estás seguro de eliminar este trabajo?")) return

    setDeleting(true)
    try {
      await worksAPI.delete(work.id, work.version)
      showToast("Trabajo eliminado correctamente", "success")
      navigate("/works")
    } catch (error: any) {
      if (error.message.includes("Version conflict")) {
        showToast("El trabajo fue modificado. Recarga la página e intenta de nuevo.", "error")
      } else {
        showToast(error.message || "Error al eliminar el trabajo", "error")
      }
    } finally {
      setDeleting(false)
    }
  }

  if (loading) {
    return (
      <div className="container my-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
      </div>
    )
  }

  if (!work) {
    return (
      <div className="container my-5">
        <div className="alert alert-danger">Trabajo no encontrado</div>
        <Link to="/works" className="btn btn-primary">
          Volver a Trabajos
        </Link>
      </div>
    )
  }

  return (
    <div className="container my-5">
      <div className="row">
        <div className="col-lg-8 mx-auto">
          <div className="mb-3">
            <Link to="/works" className="text-decoration-none">
              ← Volver a Trabajos
            </Link>
          </div>

          <div className="card shadow">
            <div className="card-body p-4">
              <div className="d-flex justify-content-between align-items-start mb-3">
                <h1 className="h2">{work.title}</h1>
                <span className="badge bg-primary fs-6">{work.category}</span>
              </div>

              <div className="mb-4">
                {work.tags.map((tag, index) => (
                  <span key={index} className="badge bg-secondary me-2">
                    {tag}
                  </span>
                ))}
              </div>

              <p className="lead">{work.description}</p>

              <hr />

              <div className="mb-3">
                <strong>Enlace:</strong>{" "}
                <a href={work.link} target="_blank" rel="noopener noreferrer">
                  {work.link}
                </a>
              </div>

              <div className="text-muted small">
                <div>Creado: {formatDate(work.createdAt)}</div>
                <div>Actualizado: {formatDate(work.updatedAt)}</div>
              </div>

              {user && (
                <div className="mt-4 d-flex gap-2">
                  <Link to={`/works/${work.id}/edit`} className="btn btn-warning">
                    Editar
                  </Link>
                  <button className="btn btn-danger" onClick={handleDelete} disabled={deleting}>
                    {deleting ? "Eliminando..." : "Eliminar"}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
