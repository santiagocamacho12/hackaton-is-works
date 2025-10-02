export function Hero() {
  return (
    <div className="hero bg-gradient py-5">
      <div className="container">
        <div className="row align-items-center">
          <div className="col-lg-8 mx-auto text-center text-white">
            <h1 className="display-4 fw-bold mb-3">Trabajos de Ingeniería de Sistemas</h1>
            <p className="lead mb-4">
              Explora proyectos innovadores en redes, desarrollo web, bases de datos, inteligencia artificial y DevOps
              creados por estudiantes y profesionales.
            </p>
            <div className="d-flex gap-3 justify-content-center">
              <a href="/works" className="btn btn-light btn-lg">
                Ver Trabajos
              </a>
              <a href="/works/create" className="btn btn-outline-light btn-lg">
                Publicar Trabajo
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
