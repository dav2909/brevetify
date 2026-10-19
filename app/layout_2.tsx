import './globals.css'
import type { Metadata } from 'next'
import Image from 'next/image'
import LogoutButton from '@/components/LogoutButton'

export const metadata: Metadata = {
  title: 'Brevetify - Révise ton Brevet',
  description: 'La plateforme ultime de révision du Brevet des Collèges',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr">
      <body className="antialiased">
        <header className="flex items-center justify-between p-4 border-b bg-white shadow-sm">
          <div className="flex items-center gap-3">
            <Image
              src="/images/logo.jpg"
              alt="Brevetify Logo"
              width={300}
              height={240}
              className="h-10 w-auto object-contain"
              priority
            />
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