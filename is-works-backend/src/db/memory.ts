import type { User } from "../models/user.model"
import type { Work } from "../models/work.model"
import type { LogEntry } from "../models/log.model"
import bcrypt from "bcrypt"

// In-memory database
export const db = {
  users: [] as User[],
  works: [] as Work[],
  logs: [] as LogEntry[],
  refreshTokens: new Map<string, string>(), // userId -> refreshToken
}

// Initialize with demo data
export async function initializeDB() {
  // Create admin user
  const hashedPassword = await bcrypt.hash("Admin#12345", 10)
  db.users.push({
    id: "1",
    email: "admin@example.com",
    password: hashedPassword,
    role: "admin",
    createdAt: new Date().toISOString(),
  })

  // Create demo works
  const categories = ["Redes", "Desarrollo Web", "Bases de Datos", "IA", "DevOps"]
  const demoWorks: Omit<Work, "id" | "createdAt" | "updatedAt" | "version">[] = [
    {
      title: "Sistema de Monitoreo de Red",
      category: "Redes",
      description: "Aplicación para monitorear el tráfico de red en tiempo real con alertas automáticas.",
      tags: ["networking", "monitoring", "python"],
      link: "https://github.com/example/network-monitor",
    },
    {
      title: "E-commerce con React y Node",
      category: "Desarrollo Web",
      description: "Plataforma de comercio electrónico completa con carrito de compras y pasarela de pago.",
      tags: ["react", "nodejs", "mongodb"],
      link: "https://github.com/example/ecommerce",
    },
    {
      title: "Optimización de Consultas SQL",
      category: "Bases de Datos",
      description: "Análisis y optimización de consultas SQL para mejorar el rendimiento de bases de datos.",
      tags: ["sql", "postgresql", "optimization"],
      link: "https://github.com/example/sql-optimization",
    },
    {
      title: "Clasificador de Imágenes con CNN",
      category: "IA",
      description: "Red neuronal convolucional para clasificación de imágenes usando TensorFlow.",
      tags: ["machine-learning", "tensorflow", "python"],
      link: "https://github.com/example/image-classifier",
    },
    {
      title: "Pipeline CI/CD con Jenkins",
      category: "DevOps",
      description: "Implementación de pipeline de integración y despliegue continuo usando Jenkins y Docker.",
      tags: ["jenkins", "docker", "cicd"],
      link: "https://github.com/example/cicd-pipeline",
    },
    {
      title: "Chatbot con NLP",
      category: "IA",
      description: "Chatbot inteligente usando procesamiento de lenguaje natural para atención al cliente.",
      tags: ["nlp", "chatbot", "python"],
      link: "https://github.com/example/chatbot",
    },
    {
      title: "API RESTful con Express",
      category: "Desarrollo Web",
      description: "API REST completa con autenticación JWT y documentación Swagger.",
      tags: ["express", "jwt", "swagger"],
      link: "https://github.com/example/rest-api",
    },
    {
      title: "Sistema de Replicación de BD",
      category: "Bases de Datos",
      description: "Implementación de replicación master-slave para alta disponibilidad.",
      tags: ["mysql", "replication", "ha"],
      link: "https://github.com/example/db-replication",
    },
    {
      title: "Configuración de Firewall",
      category: "Redes",
      description: "Scripts y configuraciones para firewall empresarial con iptables.",
      tags: ["security", "firewall", "linux"],
      link: "https://github.com/example/firewall-config",
    },
    {
      title: "Kubernetes Cluster Setup",
      category: "DevOps",
      description: "Guía completa para configurar un cluster de Kubernetes en producción.",
      tags: ["kubernetes", "docker", "orchestration"],
      link: "https://github.com/example/k8s-setup",
    },
  ]

  demoWorks.forEach((work, index) => {
    db.works.push({
      ...work,
      id: (index + 1).toString(),
      createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date().toISOString(),
      version: 1,
    })
  })

  console.log("Database initialized with demo data")
}
