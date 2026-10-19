import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server' // ou votre client serveur

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  // Optionnel : paramètre de redirection après connexion
  const next = searchParams.get('next') ?? '/dashboard'

  if (code) {
    const supabase = createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`)
    }
  }

  // En cas d'erreur, renvoyer vers la page de login avec une erreur
  return NextResponse.redirect(`${origin}/login?message=Could not login with code`)
}