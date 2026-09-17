import '../src/index.css'

import type { ReactNode } from 'react'
import Navbar from '../src/components/layout/Navbar'
import Footer from '../src/components/layout/Footer'
import { AuthProvider } from '../src/contexts/AuthContext'

export function Layout({ children }: { children: ReactNode }) {
    return (
        <AuthProvider>
            <div className="flex flex-col min-h-screen bg-[#0a0a0a]">
                <Navbar />
                <main className="flex-1 pt-16">
                    {children}
                </main>
                <Footer />
            </div>
        </AuthProvider>
    )
}