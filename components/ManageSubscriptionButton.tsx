'use client'

import { useState } from 'react'

export default function ManageSubscriptionButton() {
  const [loading, setLoading] = useState(false)

  const handleOpenPortal = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/create-portal-session', {
        method: 'POST',
      })
      const data = await res.json()

      if (data.url) {
        window.location.href = data.url
      } else {
        alert(data.error || 'Une erreur est survenue.')
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleOpenPortal}
      disabled={loading}
      className="px-4 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-700 transition disabled:opacity-50"
    >
      {loading ? 'Chargement...' : 'Gérer / Résilier mon abonnement'}
    </button>
  )
}