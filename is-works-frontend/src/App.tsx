import { BrowserRouter, Routes, Route } from "react-router-dom"
import { Header } from "./components/Header"
import { NavBar } from "./components/NavBar"
import { Footer } from "./components/Footer"
import { ToastContainer } from "./components/ToastContainer"
import { ProtectedRoute } from "./components/ProtectedRoute"
import { Home } from "./routes/Home"
import { Login } from "./routes/Login"
import { Dashboard } from "./routes/Dashboard"
import { Blog } from "./routes/Blog"
import { Contact } from "./routes/Contact"
import { Logs } from "./routes/Logs"
import { WorksList } from "./routes/works/List"
import { WorkDetail } from "./routes/works/Detail"
import { CreateWork } from "./routes/works/Create"
import { EditWork } from "./routes/works/Edit"

function App() {
  return (
    <BrowserRouter>
      <div className="d-flex flex-column min-vh-100">
        <Header />
        <NavBar />
        <main className="flex-grow-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/works" element={<WorksList />} />
            <Route path="/works/:id" element={<WorkDetail />} />
            <Route
              path="/works/create"
              element={
                <ProtectedRoute>
                  <CreateWork />
                </ProtectedRoute>
              }
            />
            <Route
              path="/works/:id/edit"
              element={
                <ProtectedRoute>
                  <EditWork />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/logs"
              element={
                <ProtectedRoute requireAdmin>
                  <Logs />
                </ProtectedRoute>
              }
            />
          </Routes>
        </main>
        <Footer />
        <ToastContainer />
      </div>
    </BrowserRouter>
  )
}

export default App
