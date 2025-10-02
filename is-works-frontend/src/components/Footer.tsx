export function Footer() {
  return (
    <footer className="bg-dark text-white py-4 mt-5">
      <div className="container">
        <div className="row">
          <div className="col-md-6">
            <h5 className="fw-bold">IS Works</h5>
            <p className="text-muted">Plataforma para compartir y descubrir trabajos de Ingeniería de Sistemas</p>
          </div>
          <div className="col-md-3">
            <h6 className="fw-bold">Enlaces</h6>
            <ul className="list-unstyled">
              <li>
                <a href="/works" className="text-muted text-decoration-none">
                  Trabajos
                </a>
              </li>
              <li>
                <a href="/blog" className="text-muted text-decoration-none">
                  Blog
                </a>
              </li>
              <li>
                <a href="/contact" className="text-muted text-decoration-none">
                  Contacto
                </a>
              </li>
            </ul>
          </div>
          <div className="col-md-3">
            <h6 className="fw-bold">Redes</h6>
            <ul className="list-unstyled">
              <li>
                <a href="#" className="text-muted text-decoration-none">
                  GitHub
                </a>
              </li>
              <li>
                <a href="#" className="text-muted text-decoration-none">
                  LinkedIn
                </a>
              </li>
              <li>
                <a href="#" className="text-muted text-decoration-none">
                  Twitter
                </a>
              </li>
            </ul>
          </div>
        </div>
        <hr className="my-3 border-secondary" />
        <div className="text-center text-muted">
          <small>&copy; 2025 IS Works. Todos los derechos reservados.</small>
        </div>
      </div>
    </footer>
  )
}
