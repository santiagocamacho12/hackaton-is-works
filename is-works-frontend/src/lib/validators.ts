import { z } from "zod"

export const loginSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
})

export const workSchema = z.object({
  title: z.string().min(3, "El título debe tener al menos 3 caracteres"),
  category: z.string().min(1, "La categoría es requerida"),
  description: z.string().min(10, "La descripción debe tener al menos 10 caracteres"),
  tags: z.array(z.string()).min(1, "Debe incluir al menos un tag"),
  link: z.string().url("Debe ser una URL válida"),
})

export const contactSchema = z.object({
  name: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  email: z.string().email("Email inválido"),
  message: z.string().min(10, "El mensaje debe tener al menos 10 caracteres"),
})

export type LoginFormData = z.infer<typeof loginSchema>
export type WorkFormData = z.infer<typeof workSchema>
export type ContactFormData = z.infer<typeof contactSchema>
