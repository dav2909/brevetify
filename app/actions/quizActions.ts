'use server'

import { createClient } from '@/lib/supabase/server'

export async function enregistrerScoreQuiz(chapterId: number, score: number, total: number) {
  const supabase = await createClient()

  // Vérification de l'utilisateur sur le serveur
  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    throw new Error("Accès non autorisé : vous devez être connecté.")
  }

  // Insertion en base de données
  const { error } = await supabase.from('quiz_results').insert({
    user_id: user.id,
    chapter_id: chapterId,
    score: score,
    total: total
  })

  if (error) {
    throw new Error("Erreur lors de l'enregistrement : " + error.message)
  }

  return { success: true }
}