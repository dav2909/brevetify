'use client'

import { createClient } from '@/lib/supabase/client'
import { useEffect, useState } from 'react'
import Link from 'next/link'

interface Chapter {
  id: number
  title: string
  order_index?: number
  module_name: string
  matiere_name: string
  category: 'mathematiques' | 'hist-geo-emc' | 'francais' | 'science'
}

interface ChapterWithStatus extends Chapter {
  attemptsCount: number
  isValide: boolean
}

const CATEGORIES_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  mathematiques: { label: 'Mathématiques', color: 'text-blue-700', bg: 'bg-blue-50 border-blue-200' },
  francais: { label: 'Français', color: 'text-rose-700', bg: 'bg-rose-50 border-rose-200' },
  'hist-geo-emc': { label: 'Histoire-Géo-EMC', color: 'text-amber-700', bg: 'bg-amber-50 border-amber-200' },
  science: { label: 'Sciences', color: 'text-emerald-700', bg: 'bg-emerald-50 border-emerald-200' },
}

// Ordre d'affichage strict souhaité
const CATEGORY_ORDER = ['mathematiques', 'francais', 'hist-geo-emc', 'science']

export default function DashboardPage() {
  const [chaptersData, setChaptersData] = useState<ChapterWithStatus[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    async function loadDashboardData() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        setLoading(false)
        return
      }

      // 1. Récupérer tous les chapitres
      const { data: chapters, error: chapError } = await supabase
        .from('chapters')
        .select('*')
        .order('order_index', { ascending: true })

      if (chapError) {
        console.error('Erreur chargement chapitres:', chapError.message)
        setLoading(false)
        return
      }

      // 2. Récupérer toutes les tentatives de l'utilisateur
      const { data: attempts, error: attError } = await supabase
        .from('quiz_results_hist_geo_emc')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (attError) {
        console.error('Erreur chargement tentatives:', attError.message)
      }

      // 3. Appliquer la règle : les 5 derniers essais >= 80%
      const evaluatedChapters: ChapterWithStatus[] = (chapters || []).map(chapter => {
        const chapterAttempts = attempts?.filter(a => a.chapter_id === chapter.id) || []
        
        let isValide = false
        if (chapterAttempts.length >= 5) {
          const lastFive = chapterAttempts.slice(0, 5)
          isValide = lastFive.every(attempt => {
            const percentage = (attempt.score / attempt.total) * 100
            return percentage >= 80
          })
        }

        return {
          ...chapter,
          attemptsCount: chapterAttempts.length,
          isValide
        }
      })

      setChaptersData(evaluatedChapters)
      setLoading(false)
    }

    loadDashboardData()
  }, [supabase])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 text-gray-500 font-medium">
        Chargement de votre tableau de bord...
      </div>
    )
  }

  // Répartition par catégorie principale
  const groupedByCategory = chaptersData.reduce((acc, chapter) => {
    const cat = chapter.category || 'hist-geo-emc'
    if (!acc[cat]) {
      acc[cat] = []
    }
    acc[cat].push(chapter)
    return acc
  }, {} as Record<string, ChapterWithStatus[]>)

  // Tri des catégories selon l'ordre strict défini dans CATEGORY_ORDER
  const sortedCategoryEntries = Object.entries(groupedByCategory).sort(([catA], [catB]) => {
    const indexA = CATEGORY_ORDER.indexOf(catA)
    const indexB = CATEGORY_ORDER.indexOf(catB)
    return (indexA === -1 ? 99 : indexA) - (indexB === -1 ? 99 : indexB)
  })

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 pb-20">
      <header className="bg-white border-b border-gray-200 px-8 py-4 flex justify-between items-center sticky top-0 z-10 shadow-sm">
        <span className="text-xl font-black bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
          Brevetify - Tableau de bord
        </span>
        <Link href="/" className="text-sm font-medium text-gray-600 hover:text-purple-600 transition">
          ← Accueil
        </Link>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-10 space-y-10">
        <div className="space-y-2">
          <h1 className="text-3xl font-black text-gray-900">Suivi des compétences</h1>
          <p className="text-sm text-gray-600">
            Règle de validation : Réussir les <strong>5 derniers essais</strong> consécutifs avec un score supérieur ou égal à <strong>80%</strong> par chapitre.
          </p>
        </div>

        {/* SECTION DES DEUX CARTES (Réviser les matières & Banque d'Annales) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Carte 1 : Réviser les matières */}
          <div className="bg-gradient-to-br from-indigo-700 to-blue-800 rounded-3xl p-6 text-white shadow-lg flex flex-col justify-between space-y-6">
            <div className="space-y-2">
              <span className="inline-block px-3 py-1 bg-white/20 text-white font-bold text-xs rounded-full uppercase tracking-wider">
                Programme
              </span>
              <h3 className="text-2xl font-black">Réviser les matières</h3>
              <p className="text-sm text-indigo-100 leading-relaxed">
                Accède aux fiches de cours, aux résumés et aux quiz d'entraînement pour toutes les matières de 3e.
              </p>
            </div>
            <Link
              href="/matieres"
              className="w-full bg-white text-indigo-900 font-bold py-3.5 px-6 rounded-2xl text-center shadow hover:bg-indigo-50 transition"
            >
              Explorer les matières 📚
            </Link>
          </div>

          {/* Carte 2 : Banque d'Annales */}
          <div className="bg-gradient-to-br from-purple-700 to-indigo-800 rounded-3xl p-6 text-white shadow-lg flex flex-col justify-between space-y-6">
            <div className="space-y-2">
              <span className="inline-block px-3 py-1 bg-white/20 text-white font-bold text-xs rounded-full uppercase tracking-wider">
                Entraînement
              </span>
              <h3 className="text-2xl font-black">Banque d'Annales</h3>
              <p className="text-sm text-purple-100 leading-relaxed">
                Retrouve les sujets des 10 dernières années avec leurs corrigés détaillés pas à pas.
              </p>
            </div>
            <Link
              href="/annales"
              className="w-full bg-white text-purple-900 font-bold py-3.5 px-6 rounded-2xl text-center shadow hover:bg-purple-50 transition"
            >
              Voir les sujets d'examens 📋
            </Link>
          </div>
        </div>

        {sortedCategoryEntries.length === 0 ? (
          <div className="bg-white p-8 rounded-3xl border border-gray-200 text-center text-gray-500">
            Aucun module ou chapitre trouvé pour le moment.
          </div>
        ) : (
          <div className="space-y-12">
            {sortedCategoryEntries.map(([categoryKey, catChapters]) => {
              const categoryMeta = CATEGORIES_CONFIG[categoryKey] || { label: categoryKey, color: 'text-purple-700', bg: 'bg-purple-50 border-purple-200' }

              const modulesInCat = catChapters.reduce((modAcc, chap) => {
                const modKey = chap.module_name || 'Module général'
                if (!modAcc[modKey]) {
                  modAcc[modKey] = {
                    matiereName: chap.matiere_name,
                    chapters: []
                  }
                }
                modAcc[modKey].chapters.push(chap)
                return modAcc
              }, {} as Record<string, { matiereName: string; chapters: ChapterWithStatus[] }>)

              return (
                <div key={categoryKey} className="space-y-6">
                  <div className={`px-5 py-3 rounded-2xl border ${categoryMeta.bg} flex items-center justify-between`}>
                    <h2 className={`text-lg font-black uppercase tracking-wider ${categoryMeta.color}`}>
                      📁 {categoryMeta.label}
                    </h2>
                    <span className="text-xs font-bold bg-white/80 px-3 py-1 rounded-full shadow-sm text-gray-700">
                      {catChapters.filter(c => c.isValide).length} / {catChapters.length} chapitres validés
                    </span>
                  </div>

                  <div className="space-y-6 pl-2 sm:pl-4 border-l-2 border-gray-200">
                    {Object.entries(modulesInCat).map(([moduleName, moduleData]) => {
                      //const sortedChapters = moduleData.chapters.sort((a, b) => a.id - b.id)
                      const sortedChapters = moduleData.chapters.sort((a, b) => (a.order_index || 0) - (b.order_index || 0) || a.id - b.id)
                      
                      const totalChapitres = sortedChapters.length
                      const chapitresValides = sortedChapters.filter(c => c.isValide).length
                      const chapitresRestants = totalChapitres - chapitresValides
                      const progressionPercent = Math.round((chapitresValides / totalChapitres) * 100) || 0

                      return (
                        <div key={moduleName} className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm space-y-6">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div>
                              <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full uppercase tracking-wider">
                                {moduleData.matiereName}
                              </span>
                              <h3 className="text-xl font-black text-gray-900 mt-2">{moduleName}</h3>
                            </div>
                            <span className="px-3.5 py-1.5 bg-purple-100 text-purple-700 font-bold text-xs rounded-full self-start sm:self-auto">
                              {chapitresValides} / {totalChapitres} validés
                            </span>
                          </div>

                          <div className="space-y-1.5">
                            <div className="flex justify-between text-xs font-bold text-gray-500">
                              <span>Progression du module</span>
                              <span>{progressionPercent}%</span>
                            </div>
                            <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden">
                              <div 
                                className="bg-purple-600 h-full transition-all duration-500 rounded-full" 
                                style={{ width: `${progressionPercent}%` }}
                              ></div>
                            </div>
                          </div>

                          <div className="text-sm font-semibold text-gray-600 bg-gray-50 p-3.5 rounded-2xl border border-gray-100">
                            {chapitresRestants === 0 ? (
                              <span className="text-emerald-600 font-bold flex items-center gap-1.5">
                                🎉 Félicitations ! Module entièrement validé.
                              </span>
                            ) : (
                              <span>
                                Il vous reste <strong className="text-purple-600">{chapitresRestants} chapitre(s)</strong> à valider (≥ 80% sur 5 essais) pour terminer ce module.
                              </span>
                            )}
                          </div>

                          <div className="space-y-3 pt-2 border-t border-gray-100">
                            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400">Détail des chapitres</h4>
                            {sortedChapters.map((chap, index) => {
                              const chapterNumber = chap.order_index && chap.order_index > 0 ? chap.order_index : index + 1

                              return (
                                <div key={chap.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 rounded-2xl bg-gray-50/60 border border-gray-100 gap-2">
                                  <div>
                                    <span className="font-bold text-sm text-gray-900">
                                      Chapitre {chapterNumber} : {chap.title}
                                    </span>
                                    <p className="text-xs text-gray-500 mt-0.5">
                                      Essais enregistrés : <strong className="text-gray-700">{chap.attemptsCount}</strong> / 5 requis (≥ 80%)
                                    </p>
                                  </div>
                                  <div className="flex items-center gap-3">
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold self-start sm:self-auto ${
                                      chap.isValide ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                                    }`}>
                                      {chap.isValide ? 'Validé (5/5 OK)' : 'En cours'}
                                    </span>
                                    <Link
                                      href={`/${chap.category}/${chap.id}`}
                                      className="text-xs font-bold text-purple-600 hover:underline px-2 py-1"
                                    >
                                      Réviser →
                                    </Link>
                                  </div>
                                </div>
                              )
                            })}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </main>
    </div>
  )
}