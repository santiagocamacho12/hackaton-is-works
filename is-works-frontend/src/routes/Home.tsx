"use client"

import { Hero } from "../components/Hero"
import { useEffect, useState } from "react"
import { worksAPI, type Work } from "../lib/api"
import { WorkCard } from "../components/WorkCard"

export function Home() {
  const [works, setWorks] = useState<Work[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    worksAPI
      .getAll({ limit: 6 })
      .then((response) => setWorks(response.works))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  return (
    <>
      <Hero />
      <div className="container my-5">
        <h2 className="text-center mb-4">Trabajos Destacados</h2>
        {loading ? (
          <div className="text-center">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Cargando...</span>
            </div>
          </div>
        ) : (
          <div className="row g-4">
            {works.map((work) => (
              <div key={work.id} className="col-md-4">
                <WorkCard work={work} />
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  )
}
