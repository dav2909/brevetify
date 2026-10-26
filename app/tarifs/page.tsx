'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Check, ShieldCheck, Sparkles, Loader2 } from 'lucide-react'
import { createBrowserClient } from '@supabase/ssr'

export default function TarifsPage() {
  const [loading, setLoading] = useState(false)

  // Initialisation du client Supabase côté navigateur
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const handleCheckout = async () => {
    try {
      setLoading(true)

      // 1. Récupérer l'utilisateur connecté
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        window.location.href = '/login'
        return
      }

      // 2. Appel vers votre route API de création de session Stripe
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_ID, // Price ID Stripe (ex: price_1M...)
          userEmail: user.email,
          userId: user.id,
        }),
      })

      const data = await response.json()

      if (data.url) {
        window.location.href = data.url
      } else {
        alert('Erreur: ' + (data.error || 'Impossible de créer la session de paiement.'))
        setLoading(false)
      }
    } catch (error) {
      console.error(error)
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-indigo-50/30 flex flex-col justify-between">
      {/* En-tête minimaliste */}
      <header className="w-full py-6 px-8 flex justify-between items-center max-w-7xl mx-auto">
        <div className="flex items-center space-x-2">
          <div className="bg-indigo-600 text-white font-bold px-3 py-1.5 rounded-xl shadow-sm text-sm">
            BY
          </div>
          <span className="font-bold text-xl text-slate-800 tracking-tight">Brevetify</span>
        </div>
        <Link 
          href="/login" 
          className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors"
        >
          Se connecter à un autre compte
        </Link>
      </header>

      {/* Contenu principal */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-12">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 py-1 px-3 rounded-full bg-indigo-100 text-indigo-700 text-xs font-semibold mb-4">
            Accès restreint
          </div>
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-4">
            Débloquez tout le potentiel de vos révisions
          </h1>
          <p className="text-slate-600 text-lg">
            Votre abonnement actuel est inactif. Accédez immédiatement à l'intégralité des fiches, des quiz et de la banque d'annales.
          </p>
        </div>

        {/* Carte de tarif "Soft & Clean" */}
        <div className="bg-white rounded-3xl shadow-xl shadow-indigo-100/50 border border-slate-100 p-8 sm:p-10 max-w-md w-full relative overflow-hidden transition-all">
          <div className="absolute top-0 right-0 bg-indigo-50 text-indigo-700 text-xs font-bold px-4 py-1.5 rounded-bl-2xl uppercase tracking-wider">
            Formule Unique
          </div>

          <div className="mb-6">
            <h3 className="text-xl font-bold text-slate-900">Pass Annales & Fiches</h3>
            <p className="text-slate-500 text-sm mt-1">Idéal pour réussir son année et préparer l'examen sereinement.</p>
          </div>

          <div className="flex items-baseline mb-6">
            <span className="text-5xl font-black text-slate-900 tracking-tight">14,99 €</span>
            <span className="text-slate-500 ml-2 font-medium">/ mois</span>
          </div>

          <ul className="space-y-3.5 mb-8 text-slate-600 text-sm">
            <li className="flex items-center gap-3">
              <div className="rounded-full p-1 bg-emerald-100 text-emerald-600">
                <Check size={14} strokeWidth={3} />
              </div>
              <span>Accès illimité à toutes les matières de 3e</span>
            </li>
            <li className="flex items-center gap-3">
              <div className="rounded-full p-1 bg-emerald-100 text-emerald-600">
                <Check size={14} strokeWidth={3} />
              </div>
              <span>Banque d'Annales complète avec corrigés détaillés</span>
            </li>
            <li className="flex items-center gap-3">
              <div className="rounded-full p-1 bg-emerald-100 text-emerald-600">
                <Check size={14} strokeWidth={3} />
              </div>
              <span>Suivi personnalisé des compétences et des quiz</span>
            </li>
            <li className="flex items-center gap-3">
              <div className="rounded-full p-1 bg-emerald-100 text-emerald-600">
                <Check size={14} strokeWidth={3} />
              </div>
              <span>Sans engagement, résiliable à tout moment</span>
            </li>
          </ul>

          {/* Bouton d'action */}
          <button 
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3.5 px-6 rounded-2xl shadow-lg shadow-indigo-200 transition-all duration-200 active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-70"
            onClick={handleCheckout}
          >
            {loading && <Loader2 className="animate-spin" size={18} />}
            {loading ? 'Redirection...' : "S'abonner maintenant"}
          </button>

          <div className="flex items-center justify-center gap-2 mt-4 text-xs text-slate-400">
            <ShieldCheck size={14} /> Paiement 100% sécurisé via Stripe
          </div>
        </div>
      </main>

      {/* Pied de page discret */}
      <footer className="w-full py-6 text-center text-xs text-slate-400">
        © {new Date().getFullYear()} Brevetify. Tous droits réservés.
      </footer>
    </div>
  )
}