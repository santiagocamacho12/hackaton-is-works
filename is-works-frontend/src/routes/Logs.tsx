"use client"

import { useState, useEffect } from "react"
import { logsAPI, type LogEntry } from "../lib/api"
import { useToast } from "../hooks/useToast"

export function Logs() {
  const [logs, setLogs] = useState<LogEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const { showToast } = useToast()
  const limit = 20

  useEffect(() => {
    fetchLogs(page)
  }, [page])

  const fetchLogs = async (currentPage: number) => {
    setLoading(true)
    try {
      const response = await logsAPI.getAll({ page: currentPage, limit })
      setLogs(response.logs)
      setTotal(response.total)
    } catch (error: any) {
      showToast(error.message || "Error al cargar logs", "error")
    } finally {
      setLoading(false)
    }
  }

  const totalPages = Math.ceil(total / limit)

  const getLevelBadge = (level: string) => {
    const badges: Record<string, string> = {
      error: "danger",
      warn: "warning",
      info: "info",
      debug: "secondary",
    }
    return badges[level] || "secondary"
  }

  return (
    <div className="container my-5">
      <h1 className="mb-4">Logs del Sistema</h1>

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
        </div>
      ) : logs.length === 0 ? (
        <div className="alert alert-info">No hay logs disponibles</div>
      ) : (
        <>
          <div className="card shadow">
            <div className="card-body p-0">
              <div className="table-responsive">
                <table className="table table-hover mb-0">
                  <thead className="table-light">
                    <tr>
                      <th>Timestamp</th>
                      <th>Nivel</th>
                      <th>Mensaje</th>
                      <th>Usuario</th>
                      <th>IP</th>
                    </tr>
                  </thead>
                  <tbody>
                    {logs.map((log) => (
                      <tr key={log.id}>
                        <td className="text-nowrap">
                          <small>{new Date(log.timestamp).toLocaleString("es-ES")}</small>
                        </td>
                        <td>
                          <span className={`badge bg-${getLevelBadge(log.level)}`}>{log.level}</span>
                        </td>
                        <td>{log.message}</td>
                        <td>
                          <small className="text-muted">{log.userId || "-"}</small>
                        </td>
                        <td>
                          <small className="text-muted">{log.ip || "-"}</small>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {totalPages > 1 && (
            <nav className="mt-4">
              <ul className="pagination justify-content-center">
                <li className={`page-item ${page === 1 ? "disabled" : ""}`}>
                  <button className="page-link" onClick={() => setPage(page - 1)} disabled={page === 1}>
                    Anterior
                  </button>
                </li>
                {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                  const p = i + 1
                  return (
                    <li key={p} className={`page-item ${page === p ? "active" : ""}`}>
                      <button className="page-link" onClick={() => setPage(p)}>
                        {p}
                      </button>
                    </li>
                  )
                })}
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
