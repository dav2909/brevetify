'use client'

import { useState } from 'react'

export default function SubscriptionSettings() {
  const [loading, setLoading] = useState(false)

  const handleManageSubscription = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/create-portal-session', {
        method: 'POST',
      })
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Erreur lors de l\'accès au portail de gestion.')
      }

      // Redirection vers le portail sécurisé Stripe
      window.location.href = data.url
    } catch (error: any) {
      alert(error.message)
      setLoading(false)
    }
  }

  return (
    <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm space-y-4 max-w-xl mx-auto mt-10">
      <h2 className="text-xl font-black text-gray-900">Mon Abonnement Brevetify</h2>
      <p className="text-sm text-gray-600">
        Gérez vos moyen de paiement, consultez vos factures ou résiliez votre abonnement à tout moment en toute sécurité.
      </p>
      <button
        onClick={handleManageSubscription}
        disabled={loading}
        className="px-5 py-3 bg-purple-600 hover:bg-purple-700 text-white font-bold text-sm rounded-xl transition shadow-sm disabled:opacity-50"
      >
        {loading ? 'Redirection...' : 'Gérer mon abonnement / Se désabonner'}
      </button>
    </div>
  )
}