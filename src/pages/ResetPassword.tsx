import { useEffect, useState, type FormEvent } from 'react'
import { Helmet } from 'react-helmet-async'
import { supabase } from '../lib/supabase'

export default function ResetPassword() {
    const [password, setPassword] = useState('')
    const [confirmation, setConfirmation] = useState('')
    const [checkingLink, setCheckingLink] = useState(true)
    const [linkReady, setLinkReady] = useState(false)
    const [saving, setSaving] = useState(false)
    const [success, setSuccess] = useState(false)
    const [error, setError] = useState('')

    useEffect(() => {
        let active = true
        const hashParams = new URLSearchParams(window.location.hash.slice(1))
        const searchParams = new URLSearchParams(window.location.search)
        const recoveryError = hashParams.get('error_description') ?? searchParams.get('error_description')
        const hasRecoveryParams = (
            hashParams.get('type') === 'recovery'
            || searchParams.get('type') === 'recovery'
            || hashParams.has('access_token')
            || searchParams.has('code')
            || searchParams.has('token_hash')
        )

        function markLinkReady() {
            if (!active) return
            setLinkReady(true)
            setCheckingLink(false)
            setError('')
            window.history.replaceState({}, document.title, window.location.pathname)
        }

        const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
            if (event === 'PASSWORD_RECOVERY' && session) markLinkReady()
        })

        void supabase.auth.getSession().then(({ data, error: sessionError }) => {
            if (!active) return

            if (recoveryError) {
                setError('Ce lien de réinitialisation est invalide ou a expiré. Demandez un nouvel e-mail.')
                setCheckingLink(false)
                return
            }

            if (sessionError) {
                setError('Impossible de vérifier le lien de réinitialisation. Demandez un nouvel e-mail.')
                setCheckingLink(false)
                return
            }

            if (data.session && hasRecoveryParams) {
                markLinkReady()
                return
            }

            setError('Ce lien de réinitialisation est invalide ou a expiré. Demandez un nouvel e-mail.')
            setCheckingLink(false)
        })

        return () => {
            active = false
            listener.subscription.unsubscribe()
        }
    }, [])

    async function handleSubmit(event: FormEvent) {
        event.preventDefault()
        setError('')

        if (password.length < 8) {
            setError('Le mot de passe doit contenir au moins 8 caractères.')
            return
        }

        if (password !== confirmation) {
            setError('Les mots de passe ne correspondent pas.')
            return
        }

        setSaving(true)
        const { error: updateError } = await supabase.auth.updateUser({ password })

        if (updateError) {
            setSaving(false)
            setError('Le mot de passe n’a pas pu être modifié. Le lien a peut-être expiré.')
            return
        }

        await supabase.auth.signOut()
        setSaving(false)
        setSuccess(true)
        setPassword('')
        setConfirmation('')
    }

    return (
        <>
            <Helmet>
                <title>Réinitialiser le mot de passe — Jaga Fight</title>
                <meta name="robots" content="noindex, nofollow" />
            </Helmet>

            <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-4 py-20">
                <div className="w-full max-w-3xl">
                    <p className="text-[#eb0071] text-xs font-semibold tracking-[0.2em] uppercase mb-4 text-center">
                        Espace membre
                    </p>
                    <h1 className="font-title text-3xl sm:text-4xl text-[#F5F5F0] tracking-widest uppercase mb-2 text-center">
                        Nouveau mot de passe
                    </h1>
                    <p className="text-sm text-[#F5F5F0]/40 text-center mb-8">
                        Choisissez un nouveau mot de passe pour accéder à votre compte.
                    </p>

                    {checkingLink ? (
                        <div role="status" className="flex flex-col items-center gap-4 py-10 text-sm text-[#F5F5F0]/50">
                            <div className="w-8 h-8 border-2 border-[#eb0071] border-t-transparent rounded-full animate-spin" />
                            Vérification du lien…
                        </div>
                    ) : success ? (
                        <div className="border border-green-500/30 bg-green-500/10 px-5 py-6 text-center">
                            <p role="status" className="text-sm text-green-400">
                                Votre mot de passe a bien été modifié.
                            </p>
                            <a
                                href="/connexion"
                                className="mt-5 inline-flex bg-[#eb0071] px-6 py-3 text-sm font-semibold text-[#F5F5F0] hover:opacity-90 transition-opacity"
                            >
                                Se connecter
                            </a>
                        </div>
                    ) : linkReady ? (
                        <form onSubmit={handleSubmit} noValidate className="space-y-5">
                            <div>
                                <label htmlFor="new-password" className="block text-xs font-semibold tracking-widest uppercase text-[#F5F5F0]/60 mb-2">
                                    Nouveau mot de passe
                                </label>
                                <input
                                    id="new-password"
                                    name="new-password"
                                    type="password"
                                    required
                                    minLength={8}
                                    autoComplete="new-password"
                                    value={password}
                                    onChange={event => setPassword(event.target.value)}
                                    className="w-full bg-white/5 border border-white/10 text-[#F5F5F0] px-4 py-3 text-sm focus:border-[#eb0071] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#eb0071] transition-colors"
                                />
                                <p className="mt-2 text-xs text-[#F5F5F0]/35">8 caractères minimum</p>
                            </div>

                            <div>
                                <label htmlFor="confirm-password" className="block text-xs font-semibold tracking-widest uppercase text-[#F5F5F0]/60 mb-2">
                                    Confirmer le mot de passe
                                </label>
                                <input
                                    id="confirm-password"
                                    name="confirm-password"
                                    type="password"
                                    required
                                    minLength={8}
                                    autoComplete="new-password"
                                    value={confirmation}
                                    onChange={event => setConfirmation(event.target.value)}
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
                                disabled={saving}
                                className="w-full py-4 bg-[#eb0071] text-[#F5F5F0] font-semibold tracking-widest uppercase text-sm hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-default"
                            >
                                {saving ? 'Modification…' : 'Modifier le mot de passe'}
                            </button>
                        </form>
                    ) : (
                        <div className="border border-red-500/30 bg-red-500/10 px-5 py-6 text-center">
                            <p role="alert" className="text-sm text-red-400">{error}</p>
                            <a href="/connexion" className="mt-5 inline-block text-sm text-[#eb0071] hover:underline">
                                Demander un nouveau lien
                            </a>
                        </div>
                    )}
                </div>
            </div>
        </>
    )
}
