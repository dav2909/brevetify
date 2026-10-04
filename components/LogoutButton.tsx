'use client'

import { useRouter } from 'next/navigation'
import { createClient } from '@supabase/supabase-js'

// Initialisation de ton client Supabase (veille à utiliser tes variables d'environnement)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function LogoutButton() {
  const router = useRouter()

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut()

    if (error) {
      console.error('Erreur lors de la déconnexion :', error.message)
    } else {
      router.push('/login') // Redirection vers ta page de connexion
      router.refresh()
    }
  }

  return (
    <button
      onClick={handleLogout}
      className="px-4 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
    >
      Se déconnecter
    </button>
  )
}