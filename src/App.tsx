import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import Home from './pages/Home'
import Coaching from './pages/Coaching'
import Formations from './pages/Formations'
import NotreAdn from './pages/NotreAdn'
import Preinscription from './pages/Preinscription'
import MentionsLegales from './pages/MentionsLegales'
import PolitiqueConfidentialite from './pages/PolitiqueConfidentialite'
import AdminLogin from './pages/AdminLogin'
import AdminDashboard from './pages/AdminDashboard'
import { AuthProvider } from './contexts/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'

function App() {
  return (
    <HelmetProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Routes publiques avec Navbar/Footer */}
            <Route path="/*" element={
              <div className="flex flex-col min-h-screen bg-[#0a0a0a]">
                <Navbar />
                <main className="flex-1 pt-16">
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/coaching" element={<Coaching />} />
                    <Route path="/formations" element={<Formations />} />
                    <Route path="/notre-adn" element={<NotreAdn />} />
                    <Route path="/preinscription" element={<Preinscription />} />
                    <Route path="/mentions-legales" element={<MentionsLegales />} />
                    <Route path="/politique-confidentialite" element={<PolitiqueConfidentialite />} />
                  </Routes>
                </main>
                <Footer />
              </div>
            } />

            {/* Routes admin — sans Navbar/Footer */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin" element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            } />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </HelmetProvider>
  )
}

export default App
