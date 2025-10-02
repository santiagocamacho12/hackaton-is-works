import { Link } from "react-router-dom"
import type { Work } from "../lib/api"

interface WorkCardProps {
  work: Work
}

export function WorkCard({ work }: WorkCardProps) {
  return (
    <div className="card h-100 shadow-sm">
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-start mb-2">
          <h5 className="card-title">{work.title}</h5>
          <span className="badge bg-primary">{work.category}</span>
        </div>
        <p className="card-text text-muted">{work.description}</p>
        <div className="mb-3">
          {work.tags.map((tag, index) => (
            <span key={index} className="badge bg-secondary me-1">
              {tag}
            </span>
          ))}
        </div>
        <div className="d-flex justify-content-between align-items-center">
          <Link to={`/works/${work.id}`} className="btn btn-sm btn-outline-primary">
            Ver Detalles
          </Link>
          <a href={work.link} target="_blank" rel="noopener noreferrer" className="btn btn-sm btn-link">
            Enlace Externo
          </a>
        </div>
      </div>
    </div>
  )
}
