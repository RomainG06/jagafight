import { useState, type FormEvent } from 'react'
import { navigate } from 'vike/client/router'
import { Helmet } from 'react-helmet-async'
import { supabase } from '../lib/supabase'

export default function Connexion() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const [resetSent, setResetSent] = useState(false)

    async function handleSubmit(e: FormEvent) {
        e.preventDefault()
        setError('')
        setLoading(true)

        const { error: authError, data } = await supabase.auth.signInWithPassword({
            email,
            password,
        })

        if (authError) {
            setLoading(false)
            setError('Email ou mot de passe incorrect.')
            return
        }

        const userId = data.user?.id

        if (!userId) {
            setLoading(false)
            setError('Utilisateur introuvable.')
            return
        }

        const { data: roleData, error: roleError } = await supabase
            .from('user_roles')
            .select('role')
            .eq('user_id', userId)
            .maybeSingle()

        setLoading(false)

        if (roleError) {
            setError('Impossible de récupérer votre rôle.')
            return
        }

        if (roleData?.role === 'admin') {
            navigate('/admin')
        } else {
            navigate('/espace-membre')
        }
    }

    async function handleReset() {
        if (!email) {
            setError('Saisissez votre email pour réinitialiser le mot de passe.')
            return
        }
        await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${window.location.origin}/espace-membre`,
        })
        setResetSent(true)
    }

    return (
        <>
            <Helmet>
                <title>Connexion — Jaga Fight</title>
                <meta name="robots" content="noindex" />
            </Helmet>

            <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-4">
                <div className="w-full max-w-3xl">
                    <h1 className="font-title text-3xl text-[#F5F5F0] tracking-widest uppercase mb-2 text-center">
                        Connexion
                    </h1>
                    <p className="text-sm text-[#F5F5F0]/40 text-center mb-8">Connectez-vous à votre compte</p>

                    <form onSubmit={handleSubmit} noValidate className="space-y-5">
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
                                autoComplete="current-password"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 text-[#F5F5F0] px-4 py-3 text-sm focus:border-[#eb0071] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#eb0071] transition-colors"
                            />
                        </div>

                        {error && (
                            <p role="alert" className="text-sm text-red-400 bg-red-400/10 border border-red-400/30 px-4 py-3">
                                {error}
                            </p>
                        )}

                        {resetSent && (
                            <p role="status" aria-live="polite" className="text-sm text-green-400 bg-green-400/10 border border-green-400/30 px-4 py-3">
                                Email de réinitialisation envoyé.
                            </p>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-4 bg-[#eb0071] text-[#F5F5F0] font-semibold tracking-widest uppercase text-sm hover:opacity-90 transition-opacity disabled:opacity-50 cursor-pointer disabled:cursor-default"
                        >
                            {loading ? 'Connexion…' : 'Se connecter'}
                        </button>

                        <div className="flex justify-between items-center text-sm">
                            <button
                                type="button"
                                onClick={handleReset}
                                className="text-[#F5F5F0]/40 hover:text-[#F5F5F0] transition-colors cursor-pointer"
                            >
                                Mot de passe oublié ?
                            </button>
                            <a href="/inscription" className="text-[#eb0071] hover:underline">
                                Créer un compte
                            </a>
                        </div>
                    </form>
                </div>
            </div>
        </>
    )
}
