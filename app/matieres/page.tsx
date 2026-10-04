'use client'

import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'

export default function MatieresPage() {
  const router = useRouter()
  const supabase = createClient()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function checkUser() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/login')
        return
      }
      setLoading(false)
    }
    checkUser()
  }, [router, supabase])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 text-gray-500">
        Chargement...
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <header className="bg-white border-b border-gray-200 px-8 py-4 flex justify-between items-center">
        <Link href="/dashboard" className="text-xl font-black bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
          Brevetify
        </Link>
        <Link href="/dashboard" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition">
          ← Retour au tableau de bord
        </Link>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-10">
        <div className="mb-10">
          <h1 className="text-3xl font-extrabold text-gray-900 flex items-center gap-2">
            Programme de 3e & Matières 📚
          </h1>
          <p className="text-sm text-gray-500 mt-1">Choisis une matière pour accéder aux chapitres, fiches de révision et quiz.</p>
        </div>

        {/* Grille des 4 matières */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* 1. Mathématiques */}
          <div className="bg-white rounded-3xl shadow-sm border border-gray-200 overflow-hidden flex flex-col justify-between hover:shadow-md transition">
            <div className="bg-gradient-to-br from-blue-600 to-indigo-800 text-white p-8">
              <div className="text-2xl mb-3">📐</div>
              <h2 className="text-2xl font-extrabold">Mathématiques</h2>
              <p className="text-blue-100 text-sm mt-1">Nombres, calculs, géométrie, fonctions et algorithmique.</p>
            </div>
            <div className="p-6 flex items-center justify-between bg-white">
              <span className="text-xs font-semibold text-gray-500">15 chapitres au programme</span>
              <Link
                href="/mathematiques"
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-900 text-xs font-bold rounded-xl transition flex items-center gap-1.5"
              >
                Accéder →
              </Link>
            </div>
          </div>

          {/* 2. Français */}
          <div className="bg-white rounded-3xl shadow-sm border border-gray-200 overflow-hidden flex flex-col justify-between hover:shadow-md transition">
            <div className="bg-gradient-to-br from-purple-600 to-pink-600 text-white p-8">
              <div className="text-2xl mb-3">📖</div>
              <h2 className="text-2xl font-extrabold">Français</h2>
              <p className="text-purple-100 text-sm mt-1">Grammaire, analyse littéraire, expression écrite et dictée.</p>
            </div>
            <div className="p-6 flex items-center justify-between bg-white">
              <span className="text-xs font-semibold text-gray-500">12 chapitres au programme</span>
              <Link
                href="/francais"
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-900 text-xs font-bold rounded-xl transition flex items-center gap-1.5"
              >
                Accéder →
              </Link>
            </div>
          </div>

          {/* 3. Histoire-Géo & EMC */}
          <div className="bg-white rounded-3xl shadow-sm border border-gray-200 overflow-hidden flex flex-col justify-between hover:shadow-md transition">
            <div className="bg-gradient-to-br from-orange-500 to-amber-600 text-white p-8">
              <div className="text-2xl mb-3">🌍</div>
              <h2 className="text-2xl font-extrabold">Histoire-Géo & EMC</h2>
              <p className="text-orange-100 text-sm mt-1">Grandes guerres, Ve République, mondes contemporains et civisme.</p>
            </div>
            <div className="p-6 flex items-center justify-between bg-white">
              <span className="text-xs font-semibold text-gray-500">14 chapitres au programme</span>
              <Link
                href="/histoire-geo"
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-900 text-xs font-bold rounded-xl transition flex items-center gap-1.5"
              >
                Accéder →
              </Link>
            </div>
          </div>

          {/* 4. Sciences (Physique, SVT, Techno) */}
          <div className="bg-white rounded-3xl shadow-sm border border-gray-200 overflow-hidden flex flex-col justify-between hover:shadow-md transition">
            <div className="bg-gradient-to-br from-emerald-600 to-teal-800 text-white p-8">
              <div className="text-2xl mb-3">🔬</div>
              <h2 className="text-2xl font-extrabold">Sciences (Physique, SVT, Techno)</h2>
              <p className="text-emerald-100 text-sm mt-1">Énergie, génétique, écosystèmes et conception technique.</p>
            </div>
            <div className="p-6 flex items-center justify-between bg-white">
              <span className="text-xs font-semibold text-gray-500">15 chapitres au programme</span>
              <Link
                href="/sciences"
                className="px-4 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold rounded-xl transition flex items-center gap-1.5"
              >
                Accéder →
              </Link>
            </div>
          </div>

        </div>
      </main>
    </div>
  )
}