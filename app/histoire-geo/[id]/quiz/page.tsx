'use client'

import { createClient } from '@/lib/supabase/client'
import { useEffect, useState } from 'react'
import Link from 'next/link'

interface Question {
  id: number
  question: string
  options: string[]
  correct_answer: string
  explanation: string
}

interface HistoryItem {
  question: string
  selected: string
  correct: string
  isCorrect: boolean
  explanation: string
}

export default function QuizPage({ params }: { params: { id: string } }) {
  const [questions, setQuestions] = useState<Question[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [score, setScore] = useState(0)
  const [showResults, setShowResults] = useState(false)
  const [loading, setLoading] = useState(true)
  const [history, setHistory] = useState<HistoryItem[]>([])
  const supabase = createClient()

  const QUIZ_LENGTH = 7

  useEffect(() => {
    async function fetchAndRandomizeQuestions() {
      const { data, error } = await supabase
        .from('questions')
        .select('*')
        .eq('chapter_id', Number(params.id))

      if (error) {
        console.error('Erreur chargement questions:', error.message)
      } else if (data && data.length > 0) {
        const parsed = data.map(q => ({
          ...q,
          options: typeof q.options === 'string' ? JSON.parse(q.options) : q.options
        }))

        const shuffled = parsed.sort(() => 0.5 - Math.random())
        setQuestions(shuffled.slice(0, QUIZ_LENGTH))
      }
      setLoading(false)
    }

    fetchAndRandomizeQuestions()
  }, [params.id, supabase])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 text-gray-500">
        Chargement du quiz...
      </div>
    )
  }

  if (questions.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 space-y-4">
        <p className="text-gray-600">Aucune question n'est disponible pour ce chapitre.</p>
        <Link href={`/histoire-geo/${params.id}`} className="text-purple-600 font-bold hover:underline">
          ← Retour à la fiche
        </Link>
      </div>
    )
  }

  const currentQuestion = questions[currentIndex]

  const handleSelectOption = (option: string) => {
    if (selectedAnswer !== null) return

    setSelectedAnswer(option)
    const isCorrect = option === currentQuestion.correct_answer

    let newScore = score
    if (isCorrect) {
      newScore = score + 1
      setScore(newScore)
    }

    setHistory(prev => [
      ...prev,
      {
        question: currentQuestion.question,
        selected: option,
        correct: currentQuestion.correct_answer,
        isCorrect,
        explanation: currentQuestion.explanation
      }
    ])
  }

  const handleNext = async () => {
    setSelectedAnswer(null)
    
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex(currentIndex + 1)
    } else {
      setShowResults(true)

      // Récupérer l'utilisateur connecté pour l'associer au score
      const { data: { user } } = await supabase.auth.getUser()

      // Enregistrement automatique du score dans la bonne table avec le user_id
      const { error } = await supabase.from('quiz_results_hist_geo_emc').insert([
        {
          user_id: user?.id,
          chapter_id: Number(params.id),
          score: score,
          total: questions.length,
        }
      ])

      if (error) {
        console.error("Erreur d'enregistrement du score:", error.message)
      }
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 pb-20">
      <header className="bg-white border-b border-gray-200 px-8 py-4 flex justify-between items-center sticky top-0 z-10 shadow-sm">
        <span className="text-xl font-black bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
          Brevetify
        </span>
        <Link href={`/histoire-geo/${params.id}`} className="text-sm font-medium text-gray-600 hover:text-purple-600 transition">
          ← Retour à la fiche
        </Link>
      </header>

      <main className="max-w-2xl mx-auto px-6 py-10">
        {!showResults ? (
          <div className="bg-white border border-gray-200 rounded-3xl p-8 shadow-sm space-y-6">
            <div className="flex justify-between items-center text-sm font-bold text-gray-500">
              <span>Question {currentIndex + 1} sur {questions.length}</span>
              <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full">Score : {score}</span>
            </div>

            <h2 className="text-xl font-black text-gray-900">{currentQuestion.question}</h2>

            <div className="space-y-3">
              {currentQuestion.options.map((option, idx) => {
                let btnStyle = "w-full text-left p-4 rounded-2xl border font-medium transition flex items-center justify-between "
                if (selectedAnswer !== null) {
                  if (option === currentQuestion.correct_answer) {
                    btnStyle += "bg-green-100 border-green-500 text-green-900"
                  } else if (option === selectedAnswer) {
                    btnStyle += "bg-red-100 border-red-500 text-red-900"
                  } else {
                    btnStyle += "bg-gray-50 border-gray-200 opacity-50"
                  }
                } else {
                  btnStyle += "bg-gray-50 border-gray-200 hover:bg-purple-50 hover:border-purple-300"
                }

                return (
                  <button
                    key={idx}
                    onClick={() => handleSelectOption(option)}
                    disabled={selectedAnswer !== null}
                    className={btnStyle}
                  >
                    <span>{option}</span>
                  </button>
                )
              })}
            </div>

            {selectedAnswer !== null && (
              <div className="space-y-4 pt-4 border-t border-gray-100 animate-fadeIn">
                <div className={`p-4 rounded-2xl border ${selectedAnswer === currentQuestion.correct_answer ? 'bg-green-50 border-green-200 text-green-900' : 'bg-purple-50 border-purple-200 text-purple-900'}`}>
                  <p className="font-bold mb-1">💡 Explication historique :</p>
                  <p className="text-sm leading-relaxed">{currentQuestion.explanation}</p>
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={handleNext}
                    className="px-6 py-3 bg-purple-600 text-white font-bold rounded-2xl shadow hover:bg-purple-700 transition"
                  >
                    {currentIndex + 1 < questions.length ? "Question suivante →" : "Voir mon bilan"}
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="bg-white border border-gray-200 rounded-3xl p-8 shadow-sm space-y-8">
            <div className="text-center space-y-3">
              <h2 className="text-3xl font-black text-gray-900">Quiz terminé </h2>
              <p className="text-gray-600">Votre score final :</p>
              <div className="text-5xl font-black text-purple-600">
                {score} / {questions.length}
              </div>
              <p className="text-sm text-gray-500">
                {score >= questions.length * 0.8 ? "Excellent travail ! Le chapitre est parfaitement maîtrisé." : "Encore quelques révisions et ce sera parfait !"}
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-bold text-gray-900 border-b pb-2">Détail des questions</h3>
              <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                {history.map((item, idx) => (
                  <div key={idx} className={`p-4 rounded-2xl border space-y-2 ${item.isCorrect ? 'bg-green-50/50 border-green-200' : 'bg-red-50/50 border-red-200'}`}>
                    <div className="flex items-start justify-between">
                      <span className="font-bold text-sm text-gray-900">Q{idx + 1}. {item.question}</span>
                      <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${item.isCorrect ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'}`}>
                        {item.isCorrect ? 'Correct' : 'Incorrect'}
                      </span>
                    </div>
                    <div className="text-xs space-y-1 text-gray-600">
                      <p>Votre réponse : <span className={`font-semibold ${item.isCorrect ? 'text-green-700' : 'text-red-700'}`}>{item.selected}</span></p>
                      {!item.isCorrect && <p>Bonne réponse : <span className="font-semibold text-green-700">{item.correct}</span></p>}
                      <p className="italic text-gray-500 pt-1">💡 {item.explanation}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 flex justify-center space-x-4">
              <Link
                href={`/histoire-geo/${params.id}`}
                className="px-6 py-3 bg-gray-100 text-gray-700 font-bold rounded-2xl hover:bg-gray-200 transition"
              >
                Retour à la fiche
              </Link>
              <button
                onClick={() => {
                  window.location.reload()
                }}
                className="px-6 py-3 bg-purple-600 text-white font-bold rounded-2xl shadow hover:bg-purple-700 transition"
              >
                Refaire un quiz
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}