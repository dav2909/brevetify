'use client'

import { createClient } from '@/lib/supabase/client'
import { useRouter, useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'

interface Question {
  id: number
  question: string
  options: string[]
  correct_answer: string
  explanation: string
}

export default function QuizPage() {
  const router = useRouter()
  const params = useParams()
  const chapterId = params?.id
  const supabase = createClient()

  const [loading, setLoading] = useState(true)
  const [questions, setQuestions] = useState<Question[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedOption, setSelectedOption] = useState<string | null>(null)
  const [score, setScore] = useState(0)
  const [showExplanation, setShowExplanation] = useState(false)
  const [quizFinished, setQuizFinished] = useState(false)

  useEffect(() => {
    async function loadQuizQuestions() {
      if (!chapterId) return

      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/login')
        return
      }

      // Récupérer toutes les questions disponibles pour ce chapitre (le "panier")
      const { data, error } = await supabase
        .from('chapter_questions')
        .select('*')
        .eq('chapter_id', chapterId)

      if (error) {
        console.error('Erreur lors du chargement des questions :', error.message)
      } else if (data && data.length > 0) {
        // Mélanger aléatoirement le tableau de questions et en prendre 7 maximum
        const shuffled = [...data].sort(() => 0.5 - Math.random())
        setQuestions(shuffled.slice(0, 7))
      }

      setLoading(false)
    }

    loadQuizQuestions()
  }, [chapterId, router, supabase])

  const handleOptionSelect = (option: string) => {
    if (showExplanation) return
    setSelectedOption(option)
  }

  const handleValidate = async () => {
    // Empêche un double-clic rapide si la validation est déjà en cours
    if (!selectedOption || showExplanation) return

    // On active l'affichage des explications immédiatement pour bloquer les clics suivants
    setShowExplanation(true)

    const currentQuestion = questions[currentIndex]
    const isCorrect = selectedOption === currentQuestion.correct_answer

    if (isCorrect) {
      setScore(prev => prev + 1)
    }
  }

  const handleNext = async () => {
    setSelectedOption(null)
    setShowExplanation(false)

    if (currentIndex + 1 < questions.length) {
      setCurrentIndex(prev => prev + 1)
    } else {
      setQuizFinished(true)

      // Enregistrement propre du score final sans risque de dépassement
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        // On s'assure que le score enregistré ne dépasse jamais le nombre total de questions
        const finalScore = Math.min(score, questions.length)
        
        await supabase.from('quiz_attempts').insert({
          user_id: user.id,
          chapter_id: chapterId,
          score: finalScore,
          total_questions: questions.length
        })
      }
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 text-gray-500">
        Chargement du quiz...
      </div>
    )
  }

  if (questions.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 text-gray-500">
        <p className="mb-4">Aucun quiz disponible pour ce chapitre pour le moment.</p>
        <Link href={`/sciences/${chapterId}`} className="text-purple-600 font-semibold hover:underline">
          ← Retour au chapitre
        </Link>
      </div>
    )
  }

  if (quizFinished) {
    const percentage = Math.round((score / questions.length) * 100)
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6">
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-200 max-w-md w-full text-center space-y-6">
          <h2 className="text-2xl font-black text-gray-900">Quiz terminé </h2>
          <div className="p-6 bg-purple-50 rounded-2xl">
            <p className="text-sm text-purple-600 font-bold uppercase tracking-wider mb-1">Votre score</p>
            <p className="text-4xl font-black text-purple-700">{score} / {questions.length}</p>
            <p className="text-sm text-gray-500 mt-2">Soit {percentage}% de réussite</p>
          </div>
          <Link
            href={`/sciences/${chapterId}`}
            className="block w-full py-3 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-2xl transition shadow-sm text-center"
          >
            ← Retour au chapitre
          </Link>
        </div>
      </div>
    )
  }

  const currentQuestion = questions[currentIndex]

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 pb-20">
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center sticky top-0 z-10">
        <Link href="/dashboard" className="text-xl font-black bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
          Brevetify
        </Link>
        <Link href={`/sciences/${chapterId}`} className="text-sm font-medium text-gray-600 hover:text-purple-600 transition">
          ← Quitter le quiz
        </Link>
      </header>

      <main className="max-w-2xl mx-auto px-6 py-10 space-y-6">
        <div className="flex justify-between items-center text-sm font-bold text-gray-500">
          <span>Question {currentIndex + 1} sur {questions.length}</span>
          <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs">
            Score : {score}
          </span>
        </div>

        <div className="bg-white rounded-3xl shadow-sm border border-gray-200 p-8 space-y-6">
          <h2 className="text-xl font-bold text-gray-900">{currentQuestion.question}</h2>

          <div className="space-y-3">
            {currentQuestion.options.map((option, index) => {
              let btnStyle = "border-gray-200 hover:border-purple-300 bg-white text-gray-800"
              if (selectedOption === option) {
                btnStyle = "border-purple-600 bg-purple-50 text-purple-900 ring-2 ring-purple-600"
              }
              if (showExplanation) {
                if (option === currentQuestion.correct_answer) {
                  btnStyle = "border-emerald-500 bg-emerald-50 text-emerald-900 font-bold"
                } else if (selectedOption === option) {
                  btnStyle = "border-red-500 bg-red-50 text-red-900"
                }
              }

              return (
                <button
                  key={index}
                  disabled={showExplanation}
                  onClick={() => handleOptionSelect(option)}
                  className={`w-full text-left p-4 rounded-2xl border-2 transition text-sm flex items-center justify-between ${btnStyle}`}
                >
                  <span>{option}</span>
                </button>
              )
            })}
          </div>

          {showExplanation && (
            <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100 text-sm space-y-1">
              <p className="font-bold text-gray-900">Explication :</p>
              <p className="text-gray-600">{currentQuestion.explanation}</p>
            </div>
          )}

          <div className="pt-4 flex justify-end">
            {!showExplanation ? (
              <button
                disabled={!selectedOption}
                onClick={handleValidate}
                className={`px-6 py-3 rounded-2xl font-bold text-sm transition ${
                  selectedOption
                    ? 'bg-purple-600 hover:bg-purple-700 text-white shadow-sm'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                Valider
              </button>
            ) : (
              <button
                onClick={handleNext}
                className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-2xl transition shadow-sm text-sm"
              >
                {currentIndex + 1 < questions.length ? 'Question suivante →' : 'Voir mon score →'}
              </button>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}