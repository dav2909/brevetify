'use client'

import { createClient } from '@/lib/supabase/client'
import { useEffect, useState } from 'react'
import Link from 'next/link'

interface Chapter {
  id: number
  title: string
  description?: string
}

export default function HistoireGeoPage() {
  const [chapters, setChapters] = useState<Chapter[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    async function fetchChapters() {
      const { data, error } = await supabase
        .from('chapters')
        .select('*')
        .eq('subject', 'histoire-geo') // Ajuste si nécessaire selon ton schéma Supabase
        .order('id', { ascending: true })

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
      <div className="min-h-screen flex items-center justify-center bg-gray-50 text-gray-500">
        Chargement des chapitres...
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
          ← Retrour aux matières
        </Link>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-10 space-y-8">
        {/* En-tête de la page */}
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-xs font-bold">
            <span>PROGRAMME OFFICIEL 3E</span>
            <span>🌍</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-gray-900">
            Histoire-Géo & EMC - Chapitres et Révisions
          </h1>
          <p className="text-gray-600 text-base">
            Grandes guerres, Ve République, mondes contemporains et civisme.
          </p>
        </div>

        {/* Bloc Conteneur Principal Unique */}
        <div className="bg-white border border-gray-200 rounded-3xl p-8 shadow-sm space-y-6">
          <h2 className="text-xl font-bold text-amber-700">Histoire-Géo & EMC</h2>

          {chapters.length === 0 ? (
            <p className="text-gray-500 italic py-6 text-center">
              Aucun chapitre d'histoire-géo trouvé dans la base de données.
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {chapters.map((chap, index) => (
                <Link
                  key={chap.id}
                  href={`/histoire-geo/${chap.id}`}
                  className="group p-6 bg-gray-50/60 border border-gray-100 rounded-2xl hover:bg-white hover:border-amber-300 hover:shadow-md transition flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-2">
                    {/* Numérotation séquentielle propre (Chapitre 1, Chapitre 2...) */}
                    <span className="inline-block px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-xs font-bold">
                      Chapitre {index + 1}
                    </span>
                    <h3 className="text-lg font-bold text-gray-900 group-hover:text-amber-700 transition">
                      {chap.title}
                    </h3>
                    {chap.description && (
                      <p className="text-sm text-gray-500 line-clamp-2">
                        {chap.description}
                      </p>
                    )}
                  </div>

                  <div className="text-right">
                    <span className="text-xs font-bold text-amber-600 group-hover:underline">
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