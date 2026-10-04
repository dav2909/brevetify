'use client'

import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'

interface Chapter {
  id: number
  title: string
  category: string
  description: string
  order_index: number
}

export default function MathematiquesPage() {
  const router = useRouter()
  const supabase = createClient()
  const [loading, setLoading] = useState(true)
  const [chapters, setChapters] = useState<Chapter[]>([])

  useEffect(() => {
    async function fetchChapters() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/login')
        return
      }

      const { data, error } = await supabase
        .from('chapters')
        .select('*')
        .eq('category', 'mathematiques') // <-- Utilise 'category' au lieu de 'subject'
        .order('id', { ascending: true }) // Trie par ID croissant pour respecter l'ordre exact de la base

      if (error) {
        console.error('Erreur lors du chargement des chapitres :', error.message)
      } else if (data) {
        setChapters(data)
      }

      setLoading(false)
    }
    fetchChapters()
  }, [router, supabase])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 text-gray-500">
        Chargement du programme de mathématiques...
      </div>
    )
  }

  // Récupération unique des catégories pour regrouper les chapitres
  const categories = Array.from(new Set(chapters.map((c) => c.category)))

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
        <Link href="/dashboard" className="text-xl font-black bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
          Brevetify
        </Link>
        <Link href="/matieres" className="text-sm font-medium text-gray-600 hover:text-indigo-600 transition">
          ← Retour aux matières
        </Link>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-10">
        <div className="mb-10">
          <span className="px-3 py-1 bg-indigo-100 text-indigo-700 font-bold rounded-lg text-xs uppercase tracking-wider">
            Programme officiel 3e 📐
          </span>
          <h1 className="text-3xl font-extrabold text-gray-900 mt-2">Mathématiques - Chapitres et Révisions</h1>
          <p className="text-gray-500 mt-1">Maîtrisez l'ensemble des notions requises pour réussir l'épreuve du Brevet.</p>
        </div>

        <div className="space-y-10">
          {categories.map((category) => {
            const categoryChapters = chapters.filter((c) => c.category === category)
            return (
              <div key={category} className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden p-6">
                <h2 className="text-xl font-bold text-indigo-600 mb-4 pb-2 border-b border-gray-100">
                  {category}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {categoryChapters.map((chapter) => (
                    <Link 
                      key={chapter.order_index} 
                      href={`/mathematiques/${chapter.order_index}`}
                      className="p-4 rounded-xl bg-gray-50 hover:bg-indigo-50/50 border border-gray-100 hover:border-indigo-200 transition flex flex-col justify-between block"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-bold text-purple-600 bg-purple-100 px-2 py-0.5 rounded-md">
                            Chapitre {chapter.order_index}
                          </span>
                        </div>
                        <h3 className="font-bold text-gray-900 text-base">{chapter.title}</h3>
                        <p className="text-sm text-gray-500 mt-1">{chapter.description}</p>
                      </div>
                      <div className="mt-4 flex items-center justify-end">
                        <span className="text-xs font-semibold text-indigo-600">
                          Fiches & Quiz disponibles →
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </main>
    </div>
  )
}