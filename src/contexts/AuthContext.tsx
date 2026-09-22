import {
    useEffect,
    useMemo,
    useState,
    type ReactNode
} from 'react'
import type { Session } from '@supabase/supabase-js'
import { supabase } from '../lib/supabase'
import { AuthContext } from './auth-context'

export function AuthProvider({ children }: { children: ReactNode }) {
    const [session, setSession] = useState<Session | null>(null)
    const [loading, setLoading] = useState(true)
    const [isAdmin, setIsAdmin] = useState(false)

    useEffect(() => {
        async function updateAuth(newSession: Session | null) {
            setLoading(true)
            setSession(newSession)

            if (!newSession?.user) {
                setIsAdmin(false)
                setLoading(false)
                return
            }

            const { data } = await supabase
                .from('user_roles')
                .select('role')
                .eq('user_id', newSession.user.id)
                .maybeSingle()

            setIsAdmin(data?.role === 'admin')
            setLoading(false)
        }

        supabase.auth.getSession().then(({ data }) => {
            updateAuth(data.session)
        })

        const { data: listener } = supabase.auth.onAuthStateChange(
            (_event, newSession) => {
                updateAuth(newSession)
            }
        )

        return () => listener.subscription.unsubscribe()
    }, [])

    const value = useMemo(
        () => ({ session, loading, isAdmin }),
        [session, loading, isAdmin]
    )

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}
