export function Blog() {
  const posts = [
    {
      id: 1,
      title: "Introducción a React y TypeScript",
      excerpt: "Aprende los fundamentos de React con TypeScript para crear aplicaciones robustas.",
      date: "2025-01-15",
    },
    {
      id: 2,
      title: "Mejores prácticas en Node.js",
      excerpt: "Descubre patrones y técnicas para escribir código Node.js mantenible y escalable.",
      date: "2025-01-10",
    },
    {
      id: 3,
      title: "Diseño de APIs RESTful",
      excerpt: "Guía completa para diseñar APIs REST siguiendo las mejores prácticas de la industria.",
      date: "2025-01-05",
    },
  ]

  return (
    <div className="container my-5">
      <h1 className="mb-4">Blog</h1>
      <div className="row g-4">
        {posts.map((post) => (
          <div key={post.id} className="col-md-6">
            <div className="card h-100">
              <div className="card-body">
                <h5 className="card-title">{post.title}</h5>
                <p className="card-text text-muted">{post.excerpt}</p>
                <small className="text-muted">{post.date}</small>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
