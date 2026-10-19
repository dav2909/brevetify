'use client'

import { useState } from 'react'

interface ShareModuleModalProps {
  moduleName: string
  matiereName: string
  isOpen: boolean
  onClose: () => void
}

export default function ShareModuleModal({
  moduleName,
  matiereName,
  isOpen,
  onClose,
}: ShareModuleModalProps) {
  const [copied, setCopied] = useState(false)

  if (!isOpen) return null

  const shareTitle = `🏆 Module Validé sur Brevetify !`
  const shareText = `Je viens de valider 100% du module "${moduleName}" en ${matiereName} sur Brevetify ! Qui fait mieux pour le Brevet ? 🚀`
  const shareUrl = 'https://brevetify.fr' // Remplacez par votre domaine officiel

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: shareTitle,
          text: shareText,
          url: shareUrl,
        })
      } catch (err) {
        console.log('Partage annulé ou non pris en charge', err)
      }
    } else {
      // Fallback si le navigateur sur PC ne supporte pas le partage natif
      navigator.clipboard.writeText(`${shareText} ${shareUrl}`)
      setCopied(true)
      setTimeout(() => setCopied(false), 3000)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl text-center space-y-6 animate-in fade-in zoom-in duration-300">
        
        {/* En-tête / Badge Visuel */}
        <div className="mx-auto w-20 h-20 bg-gradient-to-tr from-amber-400 to-amber-200 rounded-full flex items-center justify-center text-4xl shadow-lg border-4 border-white">
          🎉
        </div>

        <div className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-purple-600 bg-purple-50 px-3 py-1 rounded-full">
            {matiereName}
          </span>
          <h3 className="text-2xl font-black text-gray-900">
            Module Validé !
          </h3>
          <p className="text-sm text-gray-600">
            Félicitations, tu as terminé avec succès le module <strong>{moduleName}</strong>.
          </p>
        </div>

        {/* Aperçu de la carte de partage */}
        <div className="bg-gradient-to-br from-purple-700 to-indigo-800 text-white rounded-2xl p-5 text-left shadow-inner space-y-3">
          <div className="flex justify-between items-center text-xs font-bold text-purple-200">
            <span>BREVETIFY.FR</span>
            <span>100% VALIDÉ</span>
          </div>
          <div className="text-lg font-black">{moduleName}</div>
          <p className="text-xs text-purple-100">
            « Prêt à décrocher la mention au Brevet ! 🔥 »
          </p>
        </div>

        {/* Boutons d'action */}
        <div className="space-y-3">
          <button
            onClick={handleNativeShare}
            className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-black py-4 px-6 rounded-2xl shadow-lg hover:shadow-xl transition flex items-center justify-center gap-2 text-base"
          >
            <span>Lancer le défi à tes potes</span>
            <span>🚀</span>
          </button>

          {copied && (
            <p className="text-xs font-bold text-emerald-600">
              Lien et message copiés dans le presse-papier !
            </p>
          )}

          <button
            onClick={onClose}
            className="text-xs font-bold text-gray-400 hover:text-gray-600 transition block mx-auto pt-2"
          >
            Fermer
          </button>
        </div>

      </div>
    </div>
  )
}