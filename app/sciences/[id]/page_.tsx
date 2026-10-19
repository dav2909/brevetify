'use client'

import { createClient } from '@/lib/supabase/client'
import { useRouter, useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import ReactMarkdown from 'react-markdown'

interface Chapter {
  id: number
  title: string
  category: string
  description: string
  content: string
  order_index: number
}

interface QuizAttempt {
  id: number
  score: number
  total_questions: number
  created_at: string
}

export default function FicheRevisionPage() {
  const router = useRouter()
  const params = useParams()
  const id = params?.id
  const supabase = createClient()
  
  const [loading, setLoading] = useState(true)
  const [chapter, setChapter] = useState<Chapter | null>(null)
  const [attempts, setAttempts] = useState<QuizAttempt[]>([])

  useEffect(() => {
    async function fetchChapterContent() {
      if (!id) return
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/login')
        return
      }

      // 1. Récupérer le chapitre
      const { data, error } = await supabase
        .from('chapters')
        .select('*')
        .eq('id', id)
        .single()

      if (error) {
        console.error('Erreur lors du chargement de la fiche :', error.message)
      } else if (data) {
        setChapter(data)
      }

      // 2. Récupérer l'historique des tentatives de quiz
      const { data: attemptsData, error: attemptsError } = await supabase
        .from('quiz_attempts')
        .select('*')
        .eq('chapter_id', id)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (attemptsError) {
        console.error('Erreur historique quiz :', attemptsError.message)
      } else if (attemptsData) {
        setAttempts(attemptsData)
      }

      setLoading(false)
    }
    fetchChapterContent()
  }, [id, router, supabase])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 text-gray-500">
        Chargement de la fiche de révision...
      </div>
    )
  }

  if (!chapter) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 text-gray-500">
        <p className="mb-4">Fiche introuvable.</p>
        <Link href="/sciences" className="text-indigo-600 font-semibold hover:underline">
          ← Retour au programme
        </Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 pb-20">
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center sticky top-0 z-10">
        <Link href="/dashboard" className="text-xl font-black bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
          Brevetify
        </Link>
        <Link href="/sciences" className="text-sm font-medium text-gray-600 hover:text-indigo-600 transition">
          ← Retour au chapitre
        </Link>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-10 space-y-8">
        <div className="mb-2">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-bold text-purple-600 bg-purple-100 px-3 py-1 rounded-lg">
              Chapitre {chapter.order_index}
            </span>
            <span className="text-xs font-bold text-indigo-600 bg-indigo-100 px-3 py-1 rounded-lg">
              Fiche de révision
            </span>
          </div>
          <h1 className="text-3xl font-extrabold text-gray-900">{chapter.title}</h1>
        </div>

        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200">
          {chapter.content ? (
            <ReactMarkdown
            components={{
              h2: ({node, ...props}) => <h2 className="text-xl font-bold text-indigo-700 mt-6 mb-3 pb-1 border-b border-gray-100" {...props} />,
              h3: ({node, ...props}) => <h3 className="text-lg font-semibold text-gray-800 mt-4 mb-2" {...props} />,
              p: ({node, ...props}) => <p className="text-gray-700 leading-relaxed mb-3 text-justify" {...props} />,
              ul: ({node, ...props}) => <ul className="list-disc list-inside space-y-1 mb-4 text-gray-700" {...props} />,
              li: ({node, ...props}) => <li className="ml-4 text-justify" {...props} />,
              blockquote: ({node, ...props}) => <blockquote className="border-l-4 border-indigo-500 pl-4 py-2 my-4 bg-indigo-50/50 text-indigo-900 italic rounded-r-lg text-justify" {...props} />
            }}
          >
            {chapter.content}
          </ReactMarkdown>
          ) : (
            <p className="text-gray-400 italic">Le contenu de cette fiche de révision sera bientôt ajouté dans la base de données.</p>
          )}
        </div>

        {/* Bloc Entraînement et Historique des scores */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h2 className="text-xl font-extrabold text-gray-900">Entraînement</h2>
              <p className="text-sm text-gray-500 mt-1">Testez vos connaissances sur ce chapitre.</p>
            </div>
            <Link
              href={`/sciences/${chapter.id}/quiz`}
              className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-2xl transition shadow-sm text-sm"
            >
              Lancer le quiz →
            </Link>
          </div>

          <div>
            <h3 className="text-sm font-bold text-gray-800 mb-4">Historique de vos scores</h3>
            {attempts.length === 0 ? (
              <p className="text-sm text-gray-400 italic">Aucun essai pour le moment. Lancez le quiz pour voir vos scores ici !</p>
            ) : (
              <div className="space-y-3">
                {attempts.map((attempt, index) => {
                  const percentage = Math.min(100, Math.round((attempt.score / attempt.total_questions) * 100))
                  const isSuccess = percentage >= 95
                  const formattedDate = new Date(attempt.created_at).toLocaleString('fr-FR', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })

                  return (
                    <div key={attempt.id} className="flex items-center justify-between p-4 rounded-2xl bg-gray-50 border border-gray-100 text-sm">
                      <span className="text-gray-500 font-medium">{formattedDate}</span>
                      <div className="flex items-center gap-3">
                        <span className={`px-3 py-1 rounded-full font-bold text-xs ${
                          isSuccess ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {attempt.score} / {attempt.total_questions} ({percentage}%)
                        </span>
                        {index === 0 && (
                          <span className="px-2.5 py-1 rounded-full bg-indigo-100 text-indigo-700 font-bold text-xs">
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