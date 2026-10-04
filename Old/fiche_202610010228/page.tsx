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

export default function FicheRevisionPage() {
  const router = useRouter()
  const params = useParams()
  const id = params?.id
  const supabase = createClient()
  
  const [loading, setLoading] = useState(true)
  const [chapter, setChapter] = useState<Chapter | null>(null)

  useEffect(() => {
    async function fetchChapterContent() {
      if (!id) return
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/login')
        return
      }

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
        <Link href="/mathematiques" className="text-indigo-600 font-semibold hover:underline">
          ← Retour au programme
        </Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center sticky top-0 z-10">
        <Link href="/dashboard" className="text-xl font-black bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
          Brevetify
        </Link>
        <Link href={`/mathematiques/${chapter.id}`} className="text-sm font-medium text-gray-600 hover:text-indigo-600 transition">
          ← Retour au chapitre
        </Link>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-10">
        <div className="mb-8">
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
                p: ({node, ...props}) => <p className="text-gray-700 leading-relaxed mb-3" {...props} />,
                ul: ({node, ...props}) => <ul className="list-disc list-inside space-y-1 mb-4 text-gray-700" {...props} />,
                li: ({node, ...props}) => <li className="ml-4" {...props} />,
                blockquote: ({node, ...props}) => <blockquote className="border-l-4 border-indigo-500 pl-4 py-2 my-4 bg-indigo-50/50 text-indigo-900 italic rounded-r-lg" {...props} />
              }}
            >
              {chapter.content}
            </ReactMarkdown>
          ) : (
            <p className="text-gray-400 italic">Le contenu de cette fiche de révision sera bientôt ajouté dans la base de données.</p>
          )}
        </div>
      </main>
    </div>
  )
}