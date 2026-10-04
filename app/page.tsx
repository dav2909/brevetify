import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-purple-950 text-white flex flex-col justify-between">
      {/* Barre de navigation */}
      <header className="max-w-7xl mx-auto w-full px-6 py-6 flex justify-between items-center">
        <div className="text-2xl font-black tracking-wider bg-gradient-to-r from-indigo-400 to-pink-400 bg-clip-text text-transparent">
          Brevetify
        </div>
        <div className="space-x-4">
          <Link
            href="/login"
            className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white transition"
          >
            Connexion
          </Link>
          <Link
            href="/login"
            className="px-5 py-2.5 rounded-full bg-indigo-600 hover:bg-indigo-500 text-sm font-semibold shadow-lg shadow-indigo-600/30 transition"
          >
            Commencer
          </Link>
        </div>
      </header>

      {/* Section Héro */}
      <main className="max-w-4xl mx-auto px-6 py-16 text-center">
        <span className="inline-block px-4 py-1.5 mb-6 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-sm font-medium">
          La plateforme ultime de révision du Brevet 📚
        </span>
        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight mb-6 leading-tight">
          Révise ton Brevet <br />
          <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            sans stress et avec méthode.
          </span>
        </h1>
        <p className="text-lg sm:text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
          Accède au programme complet de 3e, entraîne-toi sur les annales des 10 dernières années et suis ta progression pas à pas.
        </p>

        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link
            href="/login"
            className="px-8 py-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-lg shadow-xl shadow-indigo-600/40 transition transform hover:-translate-y-0.5"
          >
            Créer mon espace gratuit
          </Link>
          <Link
            href="/annales"
            className="px-8 py-4 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-lg border border-white/10 transition"
          >
            Voir les annales 📄
          </Link>
        </div>

        {/* Fonctionnalités clés en aperçu */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-20 text-left">
          <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
            <div className="text-3xl mb-3">📊</div>
            <h3 className="font-bold text-lg mb-1">Suivi de progression</h3>
            <p className="text-sm text-gray-400">Évalue ton niveau matière par matière et vois ce qu'il te reste à travailler.</p>
          </div>
          <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
            <div className="text-3xl mb-3">📝</div>
            <h3 className="font-bold text-lg mb-1">10 ans d'Annales</h3>
            <p className="text-sm text-gray-400">Retrouve tous les sujets officiels des 10 dernières années avec leurs corrigés.</p>
          </div>
          <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
            <div className="text-3xl mb-3">⚡</div>
            <h3 className="font-bold text-lg mb-1">100% Gratuit</h3>
            <p className="text-sm text-gray-400">Accessible partout, sur mobile, tablette ou ordinateur, sans aucun frais.</p>
          </div>
        </div>
      </main>

      {/* Pied de page */}
      <footer className="border-t border-white/10 py-6 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} Brevetify. Conçu pour réussir le Brevet des Collèges.
      </footer>
    </div>
  )
}