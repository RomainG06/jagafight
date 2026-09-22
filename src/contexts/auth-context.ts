import { createContext, useContext } from 'react'
import type { Session } from '@supabase/supabase-js'

export type AuthContextType = {
    session: Session | null
    loading: boolean
    isAdmin: boolean
}

export const AuthContext = createContext<AuthContextType>({
    session: null,
    loading: true,
    isAdmin: false,
})

export function useAuth() {
    return useContext(AuthContext)
}
