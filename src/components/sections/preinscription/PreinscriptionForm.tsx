import { useState, type FormEvent } from 'react'
import { supabase } from '../../../lib/supabase'

const AGE_OPTIONS = ['Enfant (moins de 12 ans)', 'Adolescent (12–17 ans)', 'Adulte (18–59 ans)', 'Senior (60 ans et +)']

const ACTIVITIES = [
    { id: 'cours_collectif', label: 'Cours collectif' },
    { id: 'cours_particulier', label: 'Cours particulier' },
    { id: 'self_defense', label: 'Self-défense' },
    { id: 'formation', label: 'Formation diplômante' },
    { id: 'stage', label: 'Stage intensif' },
    { id: 'autre', label: 'Autre' },
]

type FormState = {
    prenom: string
    nom: string
    email: string
    tel: string
    age: string
    activites: string[]
    message: string
    rgpd: boolean
}

const INITIAL_STATE: FormState = {
    prenom: '',
    nom: '',
    email: '',
    tel: '',
    age: '',
    activites: [],
    message: '',
    rgpd: false,
}

export default function PreinscriptionForm() {
    const [form, setForm] = useState<FormState>(INITIAL_STATE)
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
    const [errorMsg, setErrorMsg] = useState('')

    function toggleActivity(id: string) {
        setForm((prev) => ({
            ...prev,
            activites: prev.activites.includes(id)
                ? prev.activites.filter((a) => a !== id)
                : [...prev.activites, id],
        }))
    }

    async function handleSubmit(e: FormEvent) {
        e.preventDefault()
        if (!form.rgpd) {
            setErrorMsg('Vous devez accepter la politique de confidentialité pour continuer.')
            return
        }

        setStatus('loading')
        setErrorMsg('')

        const { error } = await supabase.from('preinscriptions').insert([
            {
                prenom: form.prenom.trim(),
                nom: form.nom.trim(),
                email: form.email.trim().toLowerCase(),
                tel: form.tel.trim() || null,
                age: form.age || null,
                activites: form.activites.length > 0 ? form.activites : null,
                message: form.message.trim() || null,
                rgpd: form.rgpd,
            },
        ])

        if (error) {
            setStatus('error')
            setErrorMsg('Une erreur est survenue. Veuillez réessayer ou nous contacter directement.')
        } else {
            setStatus('success')
            setForm(INITIAL_STATE)
        }
    }

    if (status === 'success') {
        return (
            <div className="max-w-xl mx-auto text-center py-16 px-4">
                <div className="w-16 h-16 border-2 border-[#eb0071] rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg className="w-8 h-8 text-[#eb0071]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                </div>
                <h3 className="font-title text-4xl text-[#F5F5F0] mb-4">MERCI !</h3>
                <p className="text-[#F5F5F0]/70 text-base leading-relaxed">
                    Tu es sur la liste. On te contacte très bientôt.
                </p>
                <button
                    onClick={() => setStatus('idle')}
                    className="mt-8 text-sm text-[#eb0071] hover:text-[#ff0096] transition-colors underline underline-offset-4"
                >
                    Faire une autre préinscription
                </button>
            </div>
        )
    }

    return (
        <div className="max-w-2xl mx-auto px-4">
            <form onSubmit={handleSubmit} noValidate className="space-y-6">
                {/* Prénom / Nom */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="prenom" className="block text-xs font-semibold tracking-widest uppercase text-[#F5F5F0]/60 mb-2">
                            Prénom *
                        </label>
                        <input
                            id="prenom"
                            type="text"
                            required
                            autoComplete="given-name"
                            value={form.prenom}
                            onChange={(e) => setForm({ ...form, prenom: e.target.value })}
                            className="w-full bg-white/5 border border-white/10 text-[#F5F5F0] px-4 py-3 text-sm focus:outline-none focus:border-[#eb0071] transition-colors placeholder:text-white/20"
                            placeholder="Votre prénom"
                        />
                    </div>
                    <div>
                        <label htmlFor="nom" className="block text-xs font-semibold tracking-widest uppercase text-[#F5F5F0]/60 mb-2">
                            Nom *
                        </label>
                        <input
                            id="nom"
                            type="text"
                            required
                            autoComplete="family-name"
                            value={form.nom}
                            onChange={(e) => setForm({ ...form, nom: e.target.value })}
                            className="w-full bg-white/5 border border-white/10 text-[#F5F5F0] px-4 py-3 text-sm focus:outline-none focus:border-[#eb0071] transition-colors placeholder:text-white/20"
                            placeholder="Votre nom"
                        />
                    </div>
                </div>

                {/* Email */}
                <div>
                    <label htmlFor="email" className="block text-xs font-semibold tracking-widest uppercase text-[#F5F5F0]/60 mb-2">
                        Email *
                    </label>
                    <input
                        id="email"
                        type="email"
                        required
                        autoComplete="email"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        className="w-full bg-white/5 border border-white/10 text-[#F5F5F0] px-4 py-3 text-sm focus:outline-none focus:border-[#eb0071] transition-colors placeholder:text-white/20"
                        placeholder="votre@email.com"
                    />
                </div>

                {/* Téléphone */}
                <div>
                    <label htmlFor="tel" className="block text-xs font-semibold tracking-widest uppercase text-[#F5F5F0]/60 mb-2">
                        Téléphone
                    </label>
                    <input
                        id="tel"
                        type="tel"
                        autoComplete="tel"
                        value={form.tel}
                        onChange={(e) => setForm({ ...form, tel: e.target.value })}
                        className="w-full bg-white/5 border border-white/10 text-[#F5F5F0] px-4 py-3 text-sm focus:outline-none focus:border-[#eb0071] transition-colors placeholder:text-white/20"
                        placeholder="06 00 00 00 00"
                    />
                </div>

                {/* Tranche d'âge */}
                <div>
                    <label htmlFor="age" className="block text-xs font-semibold tracking-widest uppercase text-[#F5F5F0]/60 mb-2">
                        Tranche d'âge
                    </label>
                    <select
                        id="age"
                        value={form.age}
                        onChange={(e) => setForm({ ...form, age: e.target.value })}
                        className="w-full bg-[#0a0a0a] border border-white/10 text-[#F5F5F0] px-4 py-3 text-sm focus:outline-none focus:border-[#eb0071] transition-colors"
                    >
                        <option value="">Sélectionner</option>
                        {AGE_OPTIONS.map((o) => (
                            <option key={o} value={o}>{o}</option>
                        ))}
                    </select>
                </div>

                {/* Activités souhaitées */}
                <div>
                    <p className="block text-xs font-semibold tracking-widest uppercase text-[#F5F5F0]/60 mb-3">
                        Activité(s) souhaitée(s)
                    </p>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {ACTIVITIES.map((act) => (
                            <label
                                key={act.id}
                                className={`flex items-center gap-2 px-3 py-2.5 border cursor-pointer transition-colors text-sm ${form.activites.includes(act.id)
                                    ? 'border-[#eb0071] text-[#F5F5F0] bg-[#eb0071]/10'
                                    : 'border-white/10 text-[#F5F5F0]/60 hover:border-white/30'
                                    }`}
                            >
                                <input
                                    type="checkbox"
                                    className="sr-only"
                                    checked={form.activites.includes(act.id)}
                                    onChange={() => toggleActivity(act.id)}
                                />
                                <span
                                    className={`w-3.5 h-3.5 border flex-shrink-0 flex items-center justify-center ${form.activites.includes(act.id) ? 'border-[#eb0071] bg-[#eb0071]' : 'border-white/30'
                                        }`}
                                >
                                    {form.activites.includes(act.id) && (
                                        <svg className="w-2 h-2 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                        </svg>
                                    )}
                                </span>
                                {act.label}
                            </label>
                        ))}
                    </div>
                </div>

                {/* Message libre */}
                <div>
                    <label htmlFor="message" className="block text-xs font-semibold tracking-widest uppercase text-[#F5F5F0]/60 mb-2">
                        Message (optionnel)
                    </label>
                    <textarea
                        id="message"
                        rows={4}
                        value={form.message}
                        onChange={(e) => setForm({ ...form, message: e.target.value })}
                        className="w-full bg-white/5 border border-white/10 text-[#F5F5F0] px-4 py-3 text-sm focus:outline-none focus:border-[#eb0071] transition-colors placeholder:text-white/20 resize-none"
                        placeholder="Un projet particulier, une question…"
                    />
                </div>

                {/* RGPD */}
                <div>
                    <label className="flex items-start gap-3 cursor-pointer">
                        <div
                            onClick={() => setForm({ ...form, rgpd: !form.rgpd })}
                            className={`w-4 h-4 border flex-shrink-0 mt-0.5 flex items-center justify-center cursor-pointer transition-colors ${form.rgpd ? 'border-[#eb0071] bg-[#eb0071]' : 'border-white/30'
                                }`}
                        >
                            {form.rgpd && (
                                <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                </svg>
                            )}
                        </div>

                        <span className="text-xs text-[#F5F5F0]/50 leading-relaxed">
                            J'accepte que mes données soient utilisées pour être recontacté(e) par Jaga Fight. *{' '}
                            <a href="/politique-confidentialite" className="underline hover:text-[#F5F5F0]">
                                Politique de confidentialité
                            </a>
                        </span>
                    </label>
                </div>

                {/* Erreur */}
                {errorMsg && (
                    <p className="text-sm text-red-400 bg-red-400/10 border border-red-400/30 px-4 py-3">
                        {errorMsg}
                    </p>
                )}

                {/* Submit */}
                <button
                    type="submit"
                    disabled={status === 'loading'}
                    className="w-full py-4 bg-[#eb0071] text-[#F5F5F0] font-semibold tracking-widest uppercase text-sm rounded hover:bg-[#eb0071] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {status === 'loading' ? 'Envoi en cours…' : "M'inscrire sur la liste"}
                </button>

                <p className="text-xs text-[#F5F5F0]/30 text-center">
                    * Champs obligatoires · Données stockées en France · RGPD compliant
                </p>
            </form>
        </div>
    )
}
