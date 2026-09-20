import { useEffect } from 'react'
import { navigate } from 'vike/client/router'
import { useAuth } from '../contexts/AuthContext'
import type { ReactNode } from 'react'

export default function ProtectedRoute({ children }: { children: ReactNode }) {
    const { session, loading, isAdmin } = useAuth()

    useEffect(() => {
        if (loading) return

        if (!session) {
            navigate('/connexion')
            return
        }

        if (!isAdmin) {
            navigate('/espace-membre')
        }
    }, [loading, session, isAdmin])

    if (loading) {
        return (
            <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-[#eb0071] border-t-transparent rounded-full animate-spin" />
            </div>
        )
    }

    if (!session || !isAdmin) return null

    return <>{children}</>
}