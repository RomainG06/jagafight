// renderer/Layout.tsx
// Layout global avec Navbar et Footer

import React from 'react'
import Navbar from '../src/components/layout/Navbar'
import Footer from '../src/components/layout/Footer'
import { AuthProvider } from '../src/contexts/AuthContext'

interface LayoutProps {
    children: React.ReactNode
    pathname?: string
}

export default function Layout({ children, pathname }: LayoutProps) {
    return (
        <AuthProvider>
            <div className="flex flex-col min-h-screen bg-[#0a0a0a]">
                <Navbar pathname={pathname} />
                <main className="flex-1 pt-16">
                    {children}
                </main>
                <Footer />
            </div>
        </AuthProvider>
    )
}
