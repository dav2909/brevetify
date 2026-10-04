'use client'

import { createClient } from '@/lib/supabase/client'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'

interface Chapter {
  id: number
  title: string
  content?: string
}

interface ScoreItem {
  id: string
  created_at: string
  score: number
  total: number
}

export default function FrancaisChapterDetailPage() {
  const params = useParams()
  const chapterId = params.id as string
  
  const [chapter, setChapter] = useState<Chapter | null>(null)
  const [chapterNumber, setChapterNumber] = useState<number>(1)
  const [scores, setScores] = useState<ScoreItem[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    async function fetchData() {
      // 1. Récupérer tous les chapitres de français pour calculer le bon numéro séquentiel
      const { data: allChapters } = await supabase
        .from('chapters')
        .select('*')
        .eq('category', 'francais')
        .order('order_index', { ascending: true })

      if (allChapters) {
        const foundIndex = allChapters.findIndex(c => c.id.toString() === chapterId)
        if (foundIndex !== -1) {
          setChapterNumber(foundIndex + 1)
          setChapter(allChapters[foundIndex])
        }
      }

      if (!chapter) {
        const { data: chapterData } = await supabase
          .from('chapters')
          .select('*')
          .eq('id', chapterId)
          .single()

        if (chapterData) {
          setChapter(chapterData)
        }
      }

      // 2. Récupérer l'historique des scores (tu peux ajuster la table des scores si tu utilises une table dédiée au français, ex: 'quiz_results_francais')
      const { data: scoreData, error: scoreError } = await supabase
        .from('quiz_results') // À remplacer par ta table de résultats français si nécessaire
        .select('*')
        .eq('chapter_id', chapterId)
        .order('created_at', { ascending: false })

      if (!scoreError && scoreData) {
        setScores(scoreData)
      }

      setLoading(false)
    }

    if (chapterId) {
      fetchData()
    }
  }, [chapterId, supabase, chapter])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 text-gray-500">
        Chargement...
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 pb-20">
      {/* En-tête / Navigation */}
      <header className="bg-white border-b border-gray-200 px-8 py-4 flex justify-between items-center sticky top-0 z-10 shadow-sm">
        <span className="text-xl font-black bg-gradient-to-r from-rose-600 to-purple-600 bg-clip-text text-transparent">
          Brevetify
        </span>
        <Link href="/francais" className="text-sm font-medium text-gray-600 hover:text-rose-600 transition">
          ← Retour aux chapitres
        </Link>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-10 space-y-8">
        {/* En-tête avec badges aux couleurs du français */}
        <div className="flex items-center gap-3">
          <span className="px-4 py-1.5 bg-rose-600 text-white rounded-full text-xs font-bold shadow-sm">
            Chapitre {chapterNumber}
          </span>
          <span className="px-4 py-1.5 bg-purple-600 text-white rounded-full text-xs font-bold shadow-sm">
            Fiche de révision
          </span>
        </div>

        <h1 className="text-3xl md:text-4xl font-black text-gray-900">{chapter?.title}</h1>

        {/* --- FICHE DE COURS --- */}
        <div className="bg-white border border-gray-200 rounded-3xl p-8 shadow-sm space-y-6">
          {/* Ajout de text-justify ici */}
          <div className="prose prose-rose max-w-none text-gray-700 text-justify leading-relaxed space-y-6">
            {chapter?.content ? (
              <div 
                /* Ajout de [&>p]:text-justify [&>ul]:text-justify pour cibler les éléments HTML injectés */
                className="[&>h2]:text-xl [&>h2]:font-bold [&>h2]:text-rose-800 [&>h2]:mt-6 [&>h2]:mb-3 [&>h3]:text-lg [&>h3]:font-bold [&>h3]:text-gray-800 [&>h3]:mt-4 [&>h3]:mb-2 [&>p]:mb-3 [&>p]:text-justify [&>ul]:list-disc [&>ul]:pl-5 [&>ul]:space-y-2 [&>ul]:text-justify text-justify"
                dangerouslySetInnerHTML={{ __html: chapter.content }} 
              />
            ) : (
              <p className="text-gray-400 italic">Le contenu de la fiche de cours n'est pas encore disponible pour ce chapitre.</p>
            )}
          </div>
        </div>
        
        {/* --- SECTION ENTRAÎNEMENT / QUIZ --- */}
        <div className="bg-white border border-gray-200 rounded-3xl p-8 shadow-sm space-y-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-gray-100 pb-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Entraînement</h2>
              <p className="text-sm text-gray-500">Testez vos connaissances sur ce chapitre.</p>
            </div>
            <Link
              href={`/francais/${chapterId}/quiz`}
              className="px-6 py-3 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-2xl shadow-sm hover:shadow transition flex items-center gap-2"
            >
              Lancer le quiz →
            </Link>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-bold text-gray-700">Historique de vos scores</h3>

            {scores.length === 0 ? (
              <p className="text-sm text-gray-400 italic py-2">Aucun essai pour le moment. Lancez le quiz pour voir vos scores ici !</p>
            ) : (
              <div className="space-y-3">
                {scores.map((item, index) => {
                  const percentage = Math.round((item.score / item.total) * 100)
                  const isSuccess = percentage >= 50

                  return (
                    <div
                      key={item.id || index}
                      className="flex items-center justify-between p-4 bg-gray-50/60 border border-gray-100 rounded-2xl text-sm"
                    >
                      <span className="text-gray-600 font-medium">
                        {new Date(item.created_at).toLocaleDateString('fr-FR', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>

                      <div className="flex items-center gap-3">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-bold ${
                            isSuccess 
                              ? 'bg-emerald-100 text-emerald-800' 
                              : 'bg-rose-100 text-rose-800'
                          }`}
                        >
                          {item.score} / {item.total} ({percentage}%)
                        </span>
                        
                        {index === 0 && (
                          <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-bold">
                            Dernier essai
                          </span>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}