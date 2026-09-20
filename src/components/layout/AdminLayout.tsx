import { usePageContext } from 'vike-react/usePageContext'
import { supabase } from '../../lib/supabase'
import type { ReactNode } from 'react'
import ProtectedRoute from '../ProtectedRoute'

const NAV = [
    { to: '/admin/membres', label: 'Adhérents' },
    { to: '/admin/paiements', label: 'Paiements' },
    { to: '/admin/saisons', label: 'Saisons' },
]

function AdminLayoutInner({ children }: { children: ReactNode }) {
    const { urlPathname: pathname } = usePageContext()

    function isActive(to: string) {
        return pathname.startsWith(to)
    }

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-[#F5F5F0] flex flex-col">
            {/* Top bar */}
            <div className="border-b border-white/10 px-6 py-3 flex items-center justify-between flex-shrink-0">
                <span className="font-title text-sm tracking-widest uppercase text-[#F5F5F0]/60">
                    Jaga Fight — Admin
                </span>

                <button
                    onClick={() => supabase.auth.signOut()}
                    className="text-xs text-[#eb0071] hover:text-[#eb0071] transition-colors tracking-widest uppercase cursor-pointer"
                >
                    Déconnexion
                </button>
            </div>

            {/* Mobile nav — horizontal tabs, hidden on desktop */}
            <nav className="flex md:hidden border-b border-white/10 overflow-x-auto flex-shrink-0">
                {NAV.map(n => (
                    <a
                        key={n.to}
                        href={n.to}
                        className={`px-5 py-3 text-sm tracking-widest uppercase whitespace-nowrap flex-shrink-0 transition-colors ${
                            isActive(n.to)
                                ? 'text-[#F5F5F0] border-b-2 border-[#eb0071]'
                                : 'text-[#F5F5F0]/40 hover:text-[#F5F5F0]'
                        }`}
                    >
                        {n.label}
                    </a>
                ))}
            </nav>

            <div className="flex flex-1 flex-col md:flex-row">
                {/* Sidebar — hidden on mobile, visible on desktop */}
                <nav className="hidden md:flex w-48 border-r border-white/10 px-3 py-6 flex-col flex-shrink-0">
                    <ul className="space-y-1">
                        {NAV.map(n => (
                            <li key={n.to}>
                                <a
                                    href={n.to}
                                    className={`block px-3 py-2.5 text-sm transition-colors ${isActive(n.to)
                                        ? 'text-[#F5F5F0] bg-white/5 border-l-2 border-[#eb0071]'
                                        : 'text-[#F5F5F0]/50 hover:text-[#F5F5F0] hover:bg-white/3'
                                        }`}
                                >
                                    {n.label}
                                </a>
                            </li>
                        ))}
                    </ul>
                </nav>

                <main className="flex-1 overflow-auto">{children}</main>
            </div>
        </div>
    )
}

export default function AdminLayout({ children }: { children: ReactNode }) {
    return (
        <ProtectedRoute>
            <AdminLayoutInner>{children}</AdminLayoutInner>
        </ProtectedRoute>
    )
}
