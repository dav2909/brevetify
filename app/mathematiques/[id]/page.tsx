'use client'

import { createClient } from '@/lib/supabase/client'
import { useRouter, useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import ReactMarkdown from 'react-markdown'
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'

interface Chapter {
  id: number
  title: string
  content: string
  order_index: number
}

interface QuizResult {
  id: number
  score: number
  total: number
  created_at: string
}

export default function ChapterDetailPage() {
  const router = useRouter()
  const params = useParams()
  const id = params?.id
  const supabase = createClient()

  const [chapter, setChapter] = useState<Chapter | null>(null)
  const [quizHistory, setQuizHistory] = useState<QuizResult[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      if (!id) return
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/login')
        return
      }

      const { data: chapterData } = await supabase
        .from('chapters')
        .select('*')
        .eq('id', id)
        .single()

      if (chapterData) {
        setChapter(chapterData)
      }

      const { data: resultsData } = await supabase
        .from('quiz_results')
        .select('*')
        .eq('chapter_id', id)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (resultsData) {
        setQuizHistory(resultsData)
      }

      setLoading(false)
    }
    fetchData()
  }, [id, router, supabase])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 text-gray-500">
        Chargement...
      </div>
    )
  }

  if (!chapter) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 text-gray-500">
        Chapitre introuvable.
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center sticky top-0 z-10">
        <Link href="/mathematiques" className="text-xl font-black bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
          Brevetify
        </Link>
        <Link href="/mathematiques" className="text-sm font-medium text-gray-600 hover:text-indigo-600 transition">
          ← Retour au programme
        </Link>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-10">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-lg">
            Chapitre {chapter.order_index}
          </span>
          <span className="text-xs font-bold text-purple-600 bg-purple-50 px-3 py-1 rounded-lg">
            Fiche de révision
          </span>
        </div>

        <h1 className="text-3xl font-extrabold text-gray-900 mb-8">{chapter.title}</h1>

        {/* Fiche de révision avec support KaTeX et texte justifié */}
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200 mb-8">
          {chapter.content ? (
            <ReactMarkdown
              remarkPlugins={[remarkMath]}
              rehypePlugins={[rehypeKatex]}
              components={{
                h2: ({node, ...props}) => <h2 className="text-xl font-bold text-indigo-700 mt-6 mb-3 pb-1 border-b border-gray-100" {...props} />,
                h3: ({node, ...props}) => <h3 className="text-lg font-semibold text-gray-800 mt-4 mb-2" {...props} />,
                p: ({node, ...props}) => <p className="text-gray-700 leading-relaxed mb-3 text-justify" {...props} />,
                ul: ({node, ...props}) => <ul className="list-disc list-inside space-y-1 mb-4 text-gray-700 text-justify" {...props} />,
                li: ({node, ...props}) => <li className="ml-4 text-justify" {...props} />,
                blockquote: ({node, ...props}) => <blockquote className="border-l-4 border-indigo-500 pl-4 py-2 my-4 bg-indigo-50/50 text-indigo-900 italic rounded-r-lg text-justify" {...props} />
              }}
            >
              {chapter.content}
            </ReactMarkdown>
          ) : (
            <p className="text-gray-400 italic">Le contenu de cette fiche de révision sera bientôt ajouté.</p>
          )}
        </div>

        {/* Section Quiz & Historique */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-lg font-bold text-gray-900">Entraînement</h2>
              <p className="text-sm text-gray-500">Testez vos connaissances sur ce chapitre.</p>
            </div>
            <Link 
              href={`/mathematiques/${chapter.id}/quiz`}
              className="px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-xl text-sm transition shadow-sm"
            >
              Lancer le quiz →
            </Link>
          </div>

          {quizHistory.length > 0 && (
            <div className="border-t border-gray-100 pt-6 mt-6">
              <h3 className="text-sm font-semibold text-gray-800 mb-3">Historique de vos scores</h3>
              <div className="space-y-2">
                {quizHistory.map((res, index) => {
                  const dateStr = new Date(res.created_at).toLocaleDateString('fr-FR', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })
                  const percentage = Math.round((res.score / res.total) * 100)
                  let badgeColor = "bg-green-100 text-green-800"
                  if (percentage < 50) badgeColor = "bg-red-100 text-red-800"
                  else if (percentage < 80) badgeColor = "bg-orange-100 text-orange-800"

                  return (
                    <div key={res.id} className="flex justify-between items-center p-3 rounded-xl bg-gray-50 border border-gray-100 text-sm">
                      <span className="text-gray-500 text-xs">{dateStr}</span>
                      <div className="flex items-center gap-3">
                        <span className={`px-2.5 py-1 rounded-lg text-xs font-bold ${badgeColor}`}>
                          {res.score} / {res.total} ({percentage}%)
                        </span>
                        {index === 0 && (
                          <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
                            Dernier essai
                          </span>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}