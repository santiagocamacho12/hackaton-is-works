"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { worksAPI, type Work } from "../../lib/api"
import { WorkCard } from "../../components/WorkCard"
import { debounce } from "../../lib/http"
import { useToast } from "../../hooks/useToast"

export function WorksList() {
  const [works, setWorks] = useState<Work[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const { showToast } = useToast()
  const limit = 9

  const fetchWorks = async (searchTerm: string, currentPage: number) => {
    setLoading(true)
    try {
      const response = await worksAPI.getAll({
        search: searchTerm,
        page: currentPage,
        limit,
      })
      setWorks(response.works)
      setTotal(response.total)
    } catch (error: any) {
      showToast(error.message || "Error al cargar trabajos", "error")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchWorks(search, page)
  }, [search, page])

  const handleSearchChange = debounce((value: string) => {
    setSearch(value)
    setPage(1)
  }, 500)

  const totalPages = Math.ceil(total / limit)

  return (
    <div className="container my-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Trabajos de Ingeniería</h1>
        <Link to="/works/create" className="btn btn-primary">
          Publicar Trabajo
        </Link>
      </div>

      <div className="mb-4">
        <input
          type="text"
          className="form-control"
          placeholder="Buscar por título, categoría, descripción o tags..."
          onChange={(e) => handleSearchChange(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
        </div>
      ) : works.length === 0 ? (
        <div className="text-center py-5">
          <p className="text-muted">No se encontraron trabajos</p>
        </div>
      ) : (
        <>
          <div className="row g-4">
            {works.map((work) => (
              <div key={work.id} className="col-md-4">
                <WorkCard work={work} />
              </div>
            ))}
          </div>

          {totalPages > 1 && (
            <nav className="mt-4">
              <ul className="pagination justify-content-center">
                <li className={`page-item ${page === 1 ? "disabled" : ""}`}>
                  <button className="page-link" onClick={() => setPage(page - 1)} disabled={page === 1}>
                    Anterior
                  </button>
                </li>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <li key={p} className={`page-item ${page === p ? "active" : ""}`}>
                    <button className="page-link" onClick={() => setPage(p)}>
                      {p}
                    </button>
                  </li>
                ))}
                <li className={`page-item ${page === totalPages ? "disabled" : ""}`}>
                  <button className="page-link" onClick={() => setPage(page + 1)} disabled={page === totalPages}>
                    Siguiente
                  </button>
                </li>
              </ul>
            </nav>
          )}
        </>
      )}
    </div>
  )
}
