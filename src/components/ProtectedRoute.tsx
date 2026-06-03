import { Navigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import type { ReactNode } from 'react'

export default function ProtectedRoute({ children }: { children: ReactNode }) {
    const { session, loading } = useAuth()

    if (loading) {
        return (
            <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-[#8B0020] border-t-transparent rounded-full animate-spin" />
            </div>
        )
    }

    if (!session) {
        return <Navigate to="/admin/login" replace />
    }

    return <>{children}</>
}
