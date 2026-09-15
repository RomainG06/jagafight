import { useState, type FormEvent } from 'react'
import { navigate } from 'vike/client/router'
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
        const { error: authError, data } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: { civilite, prenom, nom, role: 'member' },
            },
        })
        setLoading(false)

        if (authError) {
            setError(authError.message === 'User already registered'
                ? 'Cette adresse email est déjà utilisée.'
                : "Erreur lors de la création du compte.")
            return
        }

        // If email confirmation is disabled in Supabase, session is immediately available
        if (data.session) {
            navigate('/espace-membre')
        } else {
            setSuccess(true)
        }
    }

    if (success) {
        return (
            <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-4">
                <div className="w-full max-w-sm text-center space-y-4">
                    <div className="w-12 h-12 bg-green-500/10 border border-green-500/30 rounded-full flex items-center justify-center mx-auto">
                        <svg className="w-6 h-6 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <h2 className="font-title text-2xl text-[#F5F5F0] tracking-widest uppercase">Compte créé !</h2>
                    <p className="text-sm text-[#F5F5F0]/60">
                        Un email de confirmation vous a été envoyé. Cliquez sur le lien pour activer votre compte.
                    </p>
                    <a href="/connexion" className="inline-block text-sm text-[#eb0071] hover:underline mt-2">
                        Se connecter
                    </a>
                </div>
            </div>
        )
    }

    return (
        <>
            <Helmet>
                <title>Inscription — Jaga Fight</title>
                <meta name="description" content="Créez votre espace membre Jaga Fight pour vous inscrire à nos cours de Muay Thaï à Cagnes-sur-Mer." />
            </Helmet>

            <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-4 py-20">
                <div className="w-full max-w-sm">
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
                                    type="text"
                                    required
                                    value={prenom}
                                    onChange={e => setPrenom(e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 text-[#F5F5F0] px-4 py-3 text-sm focus:outline-none focus:border-[#eb0071] transition-colors"
                                />
                            </div>
                            <div>
                                <label htmlFor="nom" className="block text-xs font-semibold tracking-widest uppercase text-[#F5F5F0]/60 mb-2">
                                    Nom
                                </label>
                                <input
                                    id="nom"
                                    type="text"
                                    required
                                    value={nom}
                                    onChange={e => setNom(e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 text-[#F5F5F0] px-4 py-3 text-sm focus:outline-none focus:border-[#eb0071] transition-colors"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="email" className="block text-xs font-semibold tracking-widest uppercase text-[#F5F5F0]/60 mb-2">
                                Email
                            </label>
                            <input
                                id="email"
                                type="email"
                                required
                                autoComplete="email"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 text-[#F5F5F0] px-4 py-3 text-sm focus:outline-none focus:border-[#eb0071] transition-colors"
                            />
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-xs font-semibold tracking-widest uppercase text-[#F5F5F0]/60 mb-2">
                                Mot de passe
                            </label>
                            <input
                                id="password"
                                type="password"
                                required
                                autoComplete="new-password"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 text-[#F5F5F0] px-4 py-3 text-sm focus:outline-none focus:border-[#eb0071] transition-colors"
                                placeholder="8 caractères minimum"
                            />
                        </div>

                        <div>
                            <label htmlFor="confirm" className="block text-xs font-semibold tracking-widest uppercase text-[#F5F5F0]/60 mb-2">
                                Confirmer le mot de passe
                            </label>
                            <input
                                id="confirm"
                                type="password"
                                required
                                autoComplete="new-password"
                                value={confirm}
                                onChange={e => setConfirm(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 text-[#F5F5F0] px-4 py-3 text-sm focus:outline-none focus:border-[#eb0071] transition-colors"
                            />
                        </div>

                        {error && (
                            <p className="text-sm text-red-400 bg-red-400/10 border border-red-400/30 px-4 py-3">
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
        </>
    )
}
