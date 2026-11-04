import { courses, formatSlot, type Course } from '../../../data/planning'
import { coursePageFor } from '../../../data/coursePages'

// Prix d'appel repris de la page /tarifs (abonnement 6 mois) — à mettre à jour avec elle.
const offers: Array<{ title: string; audience: string; ids: string[]; price: string; trialId?: string }> = [
    { title: 'Muay Thaï adultes', audience: 'Débutants à confirmés, 3 cours par semaine', ids: ['muay-thai'], price: 'dès 270 € / 6 mois', trialId: 'muay-thai' },
    { title: 'Muay Thaï féminin', audience: 'Un cours 100 % femmes, en confiance', ids: ['feminin'], price: 'dès 170 € / 6 mois', trialId: 'feminin' },
    { title: 'Enfants & ados', audience: 'Discipline, respect et confiance en soi', ids: ['kids', 'ados'], price: 'dès 180 € / 6 mois', trialId: 'kids' },
    { title: 'Self défense', audience: 'Se protéger et réagir, pour tous les adultes', ids: ['self-defense'], price: 'dès 180 € / 6 mois', trialId: 'self-defense' },
    { title: 'Footing', audience: 'Cardio et endurance en groupe', ids: ['footing'], price: 'dès 60 € / 6 mois' },
]

const DAY_SHORT: Record<string, string> = { Lundi: 'Lun', Mardi: 'Mar', Mercredi: 'Mer', Jeudi: 'Jeu', Vendredi: 'Ven', Samedi: 'Sam' }

const byId = (id: string) => courses.find(course => course.id === id) as Course

export default function CoursesSection() {
    return (
        <section id="cours" aria-labelledby="cours-title" className="border-t border-white/10 bg-[#0d0d0d] py-20 sm:py-24">
            <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
                <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <span className="mb-4 block text-xs font-semibold uppercase tracking-[0.2em] text-[#eb0071]">Nos cours</span>
                        <h2 id="cours-title" className="font-title text-4xl text-[#F5F5F0] sm:text-5xl">TROUVEZ VOTRE COURS</h2>
                    </div>
                    <a href="/planning" className="text-sm font-semibold text-[#eb0071] transition-colors hover:text-[#ff0096]">
                        Voir tout le planning →
                    </a>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {offers.map(offer => (
                        <article key={offer.title} className="flex flex-col border border-white/10 bg-[#0a0a0a] p-6 transition-colors hover:border-[#eb0071]/50">
                            <h3 className="font-title text-3xl text-[#F5F5F0]">
                                {coursePageFor(offer.ids[0]) ? (
                                    <a href={`/cours/${coursePageFor(offer.ids[0])?.slug}`} className="transition-colors hover:text-[#eb0071]">
                                        {offer.title}
                                    </a>
                                ) : offer.title}
                            </h3>
                            <p className="mt-1 text-sm text-[#F5F5F0]/55">{offer.audience}</p>

                            <ul className="mt-5 space-y-1.5 border-l-2 border-[#eb0071] pl-3 text-sm text-[#F5F5F0]/80">
                                {offer.ids.map(byId).map(course => (
                                    <li key={course.id}>
                                        {offer.ids.length > 1 ? <span className="text-[#F5F5F0]/50">{course.audience} · </span> : null}
                                        {course.days.map(day => DAY_SHORT[day]).join(' · ')}
                                        <span className="font-title text-lg text-[#F5F5F0]"> — {formatSlot(course)}</span>
                                    </li>
                                ))}
                            </ul>

                            <div className="mt-auto flex items-end justify-between gap-3 pt-6">
                                <p className="text-sm text-[#F5F5F0]/60">{offer.price}</p>
                                {offer.trialId ? (
                                    <a
                                        href={`/essai-gratuit?cours=${offer.trialId}`}
                                        className="shrink-0 rounded bg-[#eb0071] px-4 py-2 text-xs font-semibold uppercase tracking-wider text-white transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#eb0071]"
                                    >
                                        Essai gratuit
                                    </a>
                                ) : (
                                    <a href="/tarifs" className="shrink-0 text-xs font-semibold uppercase tracking-wider text-[#eb0071]">
                                        Tarifs →
                                    </a>
                                )}
                            </div>
                        </article>
                    ))}

                    <aside className="flex flex-col justify-center border border-[#eb0071]/40 bg-[#eb0071]/10 p-6">
                        <p className="font-title text-3xl text-[#F5F5F0]">1ER COURS OFFERT</p>
                        <p className="mt-2 text-sm leading-relaxed text-[#F5F5F0]/70">
                            Débutant ? C’est le bon endroit. Venez tester gratuitement, sans engagement.
                        </p>
                        <a href="/tarifs" className="mt-4 text-sm font-semibold text-[#eb0071] hover:text-[#ff0096]">
                            Voir tous les tarifs et packs →
                        </a>
                    </aside>
                </div>
            </div>
        </section>
    )
}
