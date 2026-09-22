import { useEffect } from 'react'
import { navigate } from 'vike/client/router'
import { useAuth } from '../contexts/auth-context'
import type { ReactNode } from 'react'

export default function MemberRoute({ children }: { children: ReactNode }) {
    const { session, loading } = useAuth()

    useEffect(() => {
        if (!loading && !session) navigate('/connexion')
    }, [loading, session])

    if (loading) {
        return (
            <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-[#eb0071] border-t-transparent rounded-full animate-spin" />
            </div>
        )
    }

    if (!session) return null

    return <>{children}</>
}
