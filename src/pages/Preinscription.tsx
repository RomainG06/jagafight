import { Helmet } from 'react-helmet-async'
import Breadcrumb from '../components/common/Breadcrumb'
import PreinscriptionForm from '../components/sections/preinscription/PreinscriptionForm'

export default function Preinscription() {
  return (
    <>
      <Breadcrumb
        items={[
          { name: 'Préinscription', url: 'https://www.jagafight.fr/preinscription' }
        ]}
      />

      <Helmet>
        <title>Préinscription — Jaga Fight Cagnes-sur-Mer</title>
        <meta
          name="description"
          content="Inscris-toi avant l'ouverture de Jaga Fight à Cagnes-sur-Mer. Laisse tes coordonnées et sois contacté(e) en priorité."
        />
        <link rel="canonical" href="https://www.jagafight.fr/preinscription" />
      </Helmet>

      {/* Hero */}
      <section className="py-20 bg-[#eb0071]/10 border-b border-[#eb0071]/20 relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: 'linear-gradient(#eb0071 1px, transparent 1px), linear-gradient(90deg, #eb0071 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />
        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="inline-block px-4 py-1.5 border border-[#eb0071]/60 text-[#eb0071] text-xs font-semibold tracking-[0.2em] uppercase mb-6 rounded-sm">
            Ouverture prochaine
          </span>
          <h1 className="font-title text-5xl sm:text-7xl text-[#F5F5F0] mb-6 leading-tight">
            L'ÉCOLE OUVRE SES PORTES —<br />
            <span className="text-[#eb0071]">SOIS DES PREMIERS.</span>
          </h1>
          <p className="text-[#F5F5F0]/60 text-base sm:text-lg max-w-xl mx-auto leading-relaxed">
            Jaga Fight arrive à Cagnes-sur-Mer. Laisse-nous tes coordonnées et nous te contactons en priorité à l'ouverture.
          </p>
        </div>
      </section>

      {/* Formulaire */}
      <section className="py-20 bg-[#0a0a0a]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto">
            <h2 className="font-title text-3xl text-[#F5F5F0] text-center mb-10 tracking-wide">
              FORMULAIRE DE PRÉINSCRIPTION
            </h2>
            <PreinscriptionForm />
          </div>
        </div>
      </section>
    </>
  )
}
