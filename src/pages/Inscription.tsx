import { useState, type FormEvent } from 'react'
import { Helmet } from 'react-helmet-async'
import { supabase } from '../lib/supabase'

export default function Inscription() {
    const [civilite, setCivilite] = useState<'M.' | 'Mme'>('M.')
    const [prenom, setPrenom] = useState('')
    const [nom, setNom] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirm, setConfirm] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)
    const [requiresEmailConfirmation, setRequiresEmailConfirmation] = useState(false)

    async function handleSubmit(e: FormEvent) {
        e.preventDefault()
        setError('')

        if (password !== confirm) {
            setError('Les mots de passe ne correspondent pas.')
            return
        }
        if (password.length < 8) {
            setError('Le mot de passe doit contenir au moins 8 caractères.')
            return
        }

        setLoading(true)
        const { data, error: authError } = await supabase.auth.signUp({
            email,
            password,
            options: {
                emailRedirectTo: `${window.location.origin}/connexion`,
                data: {
                    civilite,
                    prenom,
                    nom,
                    role: 'member',
                },
            },
        })
        setLoading(false)

        if (authError) {
            setError(authError.message === 'User already registered'
                ? 'Cette adresse email est déjà utilisée.'
                : "Erreur lors de la création du compte.")
            return
        }

        setRequiresEmailConfirmation(!data.session)
        setSuccess(true)
    }

    return (
        <>
            <Helmet>
                <title>Inscription — Jaga Fight</title>
                <meta name="description" content="Créez votre espace membre Jaga Fight pour vous inscrire à nos cours de Muay Thaï à Cagnes-sur-Mer." />
            </Helmet>

            <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-4 py-20">
                <div className="w-full max-w-3xl">
                    <h1 className="font-title text-3xl text-[#F5F5F0] tracking-widest uppercase mb-2 text-center">
                        Créer un compte
                    </h1>
                    <p className="text-sm text-[#F5F5F0]/40 text-center mb-8">
                        Accédez à votre espace membre pour finaliser votre inscription
                    </p>

                    <form onSubmit={handleSubmit} noValidate className="space-y-5">
                        {/* Civilité */}
                        <div>
                            <span className="block text-xs font-semibold tracking-widest uppercase text-[#F5F5F0]/60 mb-2">
                                Civilité
                            </span>
                            <div className="flex gap-4">
                                {(['M.', 'Mme'] as const).map(c => (
                                    <label key={c} className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="radio"
                                            name="civilite"
                                            value={c}
                                            checked={civilite === c}
                                            onChange={() => setCivilite(c)}
                                            className="accent-[#eb0071]"
                                        />
                                        <span className="text-sm text-[#F5F5F0]/70">{c}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label htmlFor="prenom" className="block text-xs font-semibold tracking-widest uppercase text-[#F5F5F0]/60 mb-2">
                                    Prénom
                                </label>
                                <input
                                    id="prenom"
                                    name="prenom"
                                    type="text"
                                    required
                                    autoComplete="given-name"
                                    value={prenom}
                                    onChange={e => setPrenom(e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 text-[#F5F5F0] px-4 py-3 text-sm focus:border-[#eb0071] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#eb0071] transition-colors"
                                />
                            </div>
                            <div>
                                <label htmlFor="nom" className="block text-xs font-semibold tracking-widest uppercase text-[#F5F5F0]/60 mb-2">
                                    Nom
                                </label>
                                <input
                                    id="nom"
                                    name="nom"
                                    type="text"
                                    required
                                    autoComplete="family-name"
                                    value={nom}
                                    onChange={e => setNom(e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 text-[#F5F5F0] px-4 py-3 text-sm focus:border-[#eb0071] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#eb0071] transition-colors"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="email" className="block text-xs font-semibold tracking-widest uppercase text-[#F5F5F0]/60 mb-2">
                                Email
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                required
                                autoComplete="email"
                                spellCheck={false}
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 text-[#F5F5F0] px-4 py-3 text-sm focus:border-[#eb0071] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#eb0071] transition-colors"
                            />
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-xs font-semibold tracking-widest uppercase text-[#F5F5F0]/60 mb-2">
                                Mot de passe
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                required
                                autoComplete="new-password"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 text-[#F5F5F0] px-4 py-3 text-sm focus:border-[#eb0071] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#eb0071] transition-colors"
                                placeholder="8 caractères minimum…"
                            />
                        </div>

                        <div>
                            <label htmlFor="confirm" className="block text-xs font-semibold tracking-widest uppercase text-[#F5F5F0]/60 mb-2">
                                Confirmer le mot de passe
                            </label>
                            <input
                                id="confirm"
                                name="confirm-password"
                                type="password"
                                required
                                autoComplete="new-password"
                                value={confirm}
                                onChange={e => setConfirm(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 text-[#F5F5F0] px-4 py-3 text-sm focus:border-[#eb0071] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#eb0071] transition-colors"
                            />
                        </div>

                        {error && (
                            <p role="alert" className="text-sm text-red-400 bg-red-400/10 border border-red-400/30 px-4 py-3">
                                {error}
                            </p>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-4 bg-[#eb0071] text-[#F5F5F0] font-semibold tracking-widest uppercase text-sm hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Création…' : 'Créer mon compte'}
                        </button>

                        <p className="text-center text-sm text-[#F5F5F0]/40">
                            Déjà un compte ?{' '}
                            <a href="/connexion" className="text-[#eb0071] hover:underline">
                                Se connecter
                            </a>
                        </p>
                    </form>
                </div>
            </div>

            {success && (
                <div
                    className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 px-4 backdrop-blur-sm"
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="inscription-success-title"
                    aria-describedby="inscription-success-description"
                >
                    <div className="w-full max-w-md border border-green-500/30 bg-[#0d0d0d] p-7 text-center shadow-2xl sm:p-9">
                        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-green-500/30 bg-green-500/10">
                            <svg className="h-7 w-7 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>

                        <p className="mt-6 text-xs font-semibold uppercase tracking-[0.2em] text-green-400">
                            Inscription réussie
                        </p>
                        <h2 id="inscription-success-title" className="mt-2 font-title text-3xl uppercase tracking-widest text-[#F5F5F0]">
                            Compte créé !
                        </h2>
                        <p id="inscription-success-description" className="mt-4 text-sm leading-relaxed text-[#F5F5F0]/60">
                            {requiresEmailConfirmation
                                ? 'Un e-mail de confirmation vous a été envoyé. Cliquez sur le lien reçu pour activer votre compte.'
                                : 'Votre compte est prêt. Vous pouvez maintenant accéder à votre espace membre et compléter votre dossier.'}
                        </p>

                        <a
                            href={requiresEmailConfirmation ? '/connexion' : '/espace-membre'}
                            autoFocus
                            className="mt-7 inline-flex w-full justify-center bg-[#eb0071] px-6 py-3.5 text-sm font-semibold text-[#F5F5F0] transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#eb0071]"
                        >
                            {requiresEmailConfirmation ? 'Retour à la connexion' : 'Accéder à mon espace'}
                        </a>
                    </div>
                </div>
            )}
        </>
    )
}
