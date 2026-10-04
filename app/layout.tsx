import './globals.css'
import type { Metadata } from 'next'
import LogoutButton from '@/components/LogoutButton'

export const metadata: Metadata = {
  title: 'Brevetify - Révise ton Brevet',
  description: 'La plateforme ultime de révision du Brevet des Collèges',
}

export default function RootLayout({
  children,
} : {
  children: React.ReactNode
}) {
  return (
    <html lang="fr">
      <body className="antialiased">
        <header className="flex items-center justify-between p-4 border-b bg-white shadow-sm">
          <div className="flex items-center gap-3">
            <svg width="32" height="32" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="40" height="40" rx="8" fill="#1E3A8A"/>
              <text x="50%" y="54%" dominantBaseline="middle" textAnchor="middle" fill="white" fontFamily="system-ui, -apple-system, sans-serif" fontSize="18" fontWeight="bold">BY</text>
            </svg>
            <span className="font-bold text-lg text-gray-900">Brevetify</span>
          </div>
          <div>
            <LogoutButton />
          </div>
        </header>

        <main>{children}</main>
      </body>
    </html>
  )
}