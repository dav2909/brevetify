'use client'

import { createClient } from '@/lib/supabase/client'
import { useEffect, useState } from 'react'
import Link from 'next/link'

interface Chapter {
  id: number
  title: string
  description?: string
  category?: string
  matiere_name?: string
}

export default function FrancaisPage() {
  const [chapters, setChapters] = useState<Chapter[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    async function fetchChapters() {
      // Ajuste le filtre selon la structure de ta table 'chapters' (ex: category = 'francais' ou matiere_name)
      const { data, error } = await supabase
        .from('chapters')
        .select('*')
        .eq('category', 'francais')
        .order('order_index', { ascending: true })

      if (error) {
        console.error('Erreur chargement chapitres:', error.message)
      } else if (data) {
        setChapters(data)
      }
      setLoading(false)
    }

    fetchChapters()
  }, [supabase])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 text-gray-500 font-medium">
        Chargement des chapitres de français...
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 pb-20">
      {/* En-tête / Navigation */}
      <header className="bg-white border-b border-gray-200 px-8 py-4 flex justify-between items-center sticky top-0 z-10 shadow-sm">
        <span className="text-xl font-black bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
          Brevetify
        </span>
        <Link href="/matieres" className="text-sm font-medium text-gray-600 hover:text-purple-600 transition">
          ← Retour aux matières
        </Link>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-10 space-y-8">
        {/* En-tête de la page */}
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-rose-100 text-rose-800 rounded-full text-xs font-bold">
            <span>PROGRAMME OFFICIEL 3E</span>
            <span>📖</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-gray-900">
            Français - Chapitres et Révisions
          </h1>
          <p className="text-gray-600 text-base">
            Grammaire, orthographe, maîtrise de la langue et analyse de textes littéraires.
          </p>
        </div>

        {/* Bloc Conteneur Principal Unique */}
        <div className="bg-white border border-gray-200 rounded-3xl p-8 shadow-sm space-y-6">
          <h2 className="text-xl font-bold text-rose-700">Français</h2>

          {chapters.length === 0 ? (
            <p className="text-gray-500 italic py-6 text-center">
              Aucun chapitre de français trouvé dans la base de données.
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {chapters.map((chap, index) => (
                <Link
                  key={chap.id}
                  href={`/francais/${chap.id}`}
                  className="group p-6 bg-gray-50/60 border border-gray-100 rounded-2xl hover:bg-white hover:border-rose-300 hover:shadow-md transition flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-2">
                    <span className="inline-block px-3 py-1 bg-rose-100 text-rose-800 rounded-full text-xs font-bold">
                      Chapitre {chap.order_index || index + 1}
                    </span>
                    <h3 className="text-lg font-bold text-gray-900 group-hover:text-rose-700 transition">
                      {chap.title}
                    </h3>
                    {chap.description && (
                      <p className="text-sm text-gray-500 line-clamp-2">
                        {chap.description}
                      </p>
                    )}
                  </div>

                  <div className="text-right">
                    <span className="text-xs font-bold text-rose-600 group-hover:underline">
                      Fiches & Quiz disponibles →
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}