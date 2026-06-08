import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export default function AdminLogin() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    async function handleSubmit(e: FormEvent) {
        e.preventDefault()
        setError('')
        setLoading(true)

        const { error: authError } = await supabase.auth.signInWithPassword({ email, password })

        setLoading(false)

        if (authError) {
            setError('Identifiants incorrects.')
        } else {
            navigate('/admin')
        }
    }

    return (
        <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-4">
            <div className="w-full max-w-sm">
                <h1 className="font-title text-3xl text-[#F5F5F0] tracking-widest uppercase mb-8 text-center">
                    Admin
                </h1>

                <form onSubmit={handleSubmit} noValidate className="space-y-5">
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
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 text-[#F5F5F0] px-4 py-3 text-sm focus:outline-none focus:border-[#eb0071] transition-colors placeholder:text-white/20"
                            placeholder="admin@jagafight.fr"
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
                            autoComplete="current-password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 text-[#F5F5F0] px-4 py-3 text-sm focus:outline-none focus:border-[#eb0071] transition-colors placeholder:text-white/20"
                            placeholder="••••••••"
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
                        className="w-full py-4 bg-[#eb0071] text-[#F5F5F0] font-semibold tracking-widest uppercase text-sm hover:bg-[#eb0071] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Connexion…' : 'Se connecter'}
                    </button>
                </form>
            </div>
        </div>
    )
}
