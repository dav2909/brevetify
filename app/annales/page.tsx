'use client'

import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'

interface Annale {
  id: number
  year: number
  subject: string
  series: string
  session: string
  type: string
  subject_pdf_url: string     // URL du sujet
  correction_pdf_url: string  // URL du corrigé
}

export default function AnnalesPage() {
  const router = useRouter()
  const supabase = createClient()
  const [loading, setLoading] = useState(true)
  const [annales, setAnnales] = useState<Annale[]>([])
  const [selectedYear, setSelectedYear] = useState<string>('all')
  const [selectedSeries, setSelectedSeries] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState<string>('')

  useEffect(() => {
    async function fetchData() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/login')
        return
      }

      const { data, error } = await supabase
        .from('annales')
        .select('*')
        .order('year', { ascending: false })

      if (error) {
        console.error('Erreur lors du chargement des annales :', error.message)
      } else if (data) {
        setAnnales(data)
      }

      setLoading(false)
    }
    fetchData()
  }, [router, supabase])

  const filteredAnnales = annales
    .filter((annale) => selectedYear === 'all' || annale.year.toString() === selectedYear)
    .filter((annale) => selectedSeries === 'all' || annale.series === selectedSeries)
    .filter((annale) => {
      const query = searchQuery.toLowerCase().trim()
      if (!query) return true
      return (
        annale.subject.toLowerCase().includes(query) ||
        annale.session.toLowerCase().includes(query) ||
        annale.year.toString().includes(query) ||
        annale.series.toLowerCase().includes(query)
      )
    })

  const availableYears = Array.from(new Set(annales.map((a) => a.year))).sort((a, b) => b - a)

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 text-gray-500">
        Chargement de la banque d'annales...
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
        <Link href="/dashboard" className="text-xl font-black bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
          Brevetify
        </Link>
        <Link href="/dashboard" className="text-sm font-medium text-gray-600 hover:text-indigo-600 transition">
          ← Retour au tableau de bord
        </Link>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900">Banque d'Annales - Académies de France 🇫🇷</h1>
          <p className="text-gray-500 mt-1">Téléchargez séparément les sujets officiels et leurs corrigés.</p>
        </div>

        {/* Barre de recherche */}
        <div className="mb-6">
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-gray-400">
              🔍
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Rechercher par matière (ex: Mathématiques), session (ex: Métropole)..."
              className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm transition"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute inset-y-0 right-0 flex items-center pr-4 text-xs font-semibold text-gray-400 hover:text-gray-600"
              >
                Effacer ✕
              </button>
            )}
          </div>
        </div>

        {/* Filtres */}
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-200 mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-semibold text-gray-700 mr-2">Série :</span>
            {['all', 'Générale', 'Professionnelle'].map((series) => (
              <button
                key={series}
                onClick={() => setSelectedSeries(series)}
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition ${
                  selectedSeries === series
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {series === 'all' ? 'Toutes' : series}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0">
            <span className="text-sm font-semibold text-gray-700 mr-2">Année :</span>
            <button
              onClick={() => setSelectedYear('all')}
              className={`px-3 py-2 rounded-xl text-sm font-semibold transition ${
                selectedYear === 'all' ? 'bg-purple-600 text-white shadow-md' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Toutes
            </button>
            {availableYears.map((year) => (
              <button
                key={year}
                onClick={() => setSelectedYear(year.toString())}
                className={`px-3 py-2 rounded-xl text-sm font-semibold transition ${
                  selectedYear === year.toString() ? 'bg-purple-600 text-white shadow-md' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {year}
              </button>
            ))}
          </div>
        </div>

        {/* Liste */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          {filteredAnnales.length === 0 ? (
            <div className="p-12 text-center text-gray-500">
              Aucun sujet ne correspond à vos critères de recherche.
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {filteredAnnales.map((annale) => (
                <div key={annale.id} className="p-6 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 hover:bg-gray-50 transition">
                  <div>
                    <div className="flex items-center gap-3 flex-wrap">
                      <span className="px-3 py-1 bg-purple-100 text-purple-700 font-bold rounded-lg text-sm">
                        {annale.year}
                      </span>
                      <span className={`px-3 py-1 font-bold rounded-lg text-xs ${
                        annale.series === 'Générale' ? 'bg-blue-100 text-blue-700' : 'bg-amber-100 text-amber-800'
                      }`}>
                        Série {annale.series}
                      </span>
                      <h2 className="text-lg font-bold text-gray-900">{annale.subject}</h2>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">
                      Session : {annale.session} • {annale.type}
                    </p>
                  </div>

                  {/* Boutons séparés Sujet / Corrigé */}
                  <div className="flex items-center gap-3 flex-wrap w-full lg:w-auto justify-start lg:justify-end">
                    {annale.subject_pdf_url && (
                      <a
                        href={annale.subject_pdf_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-semibold rounded-xl text-sm border border-indigo-200 transition text-center flex items-center gap-2"
                      >
                        <span>📄 Sujet</span>
                      </a>
                    )}

                    {annale.correction_pdf_url && (
                      <a
                        href={annale.correction_pdf_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-semibold rounded-xl text-sm border border-emerald-200 transition text-center flex items-center gap-2"
                      >
                        <span>✅ Corrigé</span>
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}