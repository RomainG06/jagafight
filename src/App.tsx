import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import Home from './pages/Home'
import Coaching from './pages/Coaching'
import Preinscription from './pages/Preinscription'
import MentionsLegales from './pages/MentionsLegales'
import PolitiqueConfidentialite from './pages/PolitiqueConfidentialite'

function App() {
  return (
    <HelmetProvider>
      <BrowserRouter>
        <div className="flex flex-col min-h-screen bg-[#0a0a0a]">
          <Navbar />
          <main className="flex-1 pt-16">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/coaching" element={<Coaching />} />
              <Route path="/preinscription" element={<Preinscription />} />
              <Route path="/mentions-legales" element={<MentionsLegales />} />
              <Route path="/politique-confidentialite" element={<PolitiqueConfidentialite />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </BrowserRouter>
    </HelmetProvider>
  )
}

export default App
