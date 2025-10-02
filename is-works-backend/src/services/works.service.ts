import { db } from "../db/memory"
import type { Work, CreateWorkDTO, UpdateWorkDTO } from "../models/work.model"

export const worksService = {
  getAll(search?: string, page = 1, limit = 10): { works: Work[]; total: number } {
    let filtered = db.works

    if (search) {
      const searchLower = search.toLowerCase()
      filtered = filtered.filter(
        (w) =>
          w.title.toLowerCase().includes(searchLower) ||
          w.description.toLowerCase().includes(searchLower) ||
          w.category.toLowerCase().includes(searchLower) ||
          w.tags.some((t) => t.toLowerCase().includes(searchLower)),
      )
    }

    const total = filtered.length
    const start = (page - 1) * limit
    const works = filtered.slice(start, start + limit)

    return { works, total }
  },

  getById(id: string): Work {
    const work = db.works.find((w) => w.id === id)
    if (!work) {
      throw new Error("Not found")
    }
    return work
  },

  create(data: CreateWorkDTO): Work {
    const work: Work = {
      ...data,
      id: (db.works.length + 1).toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      version: 1,
    }

    db.works.push(work)
    return work
  },

  update(id: string, data: UpdateWorkDTO, expectedVersion: number): Work {
    const index = db.works.findIndex((w) => w.id === id)
    if (index === -1) {
      throw new Error("Not found")
    }

    const work = db.works[index]
    if (work.version !== expectedVersion) {
      throw new Error(`Version conflict: expected ${expectedVersion}, got ${work.version}`)
    }

    const updated: Work = {
      ...work,
      ...data,
      updatedAt: new Date().toISOString(),
      version: work.version + 1,
    }

    db.works[index] = updated
    return updated
  },

  delete(id: string, expectedVersion: number): void {
    const index = db.works.findIndex((w) => w.id === id)
    if (index === -1) {
      throw new Error("Not found")
    }

    const work = db.works[index]
    if (work.version !== expectedVersion) {
      throw new Error(`Version conflict: expected ${expectedVersion}, got ${work.version}`)
    }

    db.works.splice(index, 1)
  },
}
