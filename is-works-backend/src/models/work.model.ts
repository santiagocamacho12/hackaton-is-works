export interface Work {
  id: string
  title: string
  category: string
  description: string
  tags: string[]
  link: string
  createdAt: string
  updatedAt: string
  version: number
}

export interface CreateWorkDTO {
  title: string
  category: string
  description: string
  tags: string[]
  link: string
}

export interface UpdateWorkDTO {
  title?: string
  category?: string
  description?: string
  tags?: string[]
  link?: string
}
