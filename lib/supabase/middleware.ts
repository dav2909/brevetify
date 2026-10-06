import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet: any[]) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // Important : Ne pas exécuter de logique lourde entre createServerClient et supabase.auth.getUser()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const path = request.nextUrl.pathname

  // 1. Redirection vers /login si non connecté et tentative d'accès à une page protégée
  if (
    !user &&
    !path.startsWith('/login') &&
    !path.startsWith('/auth') &&
    path !== '/' &&
    !path.startsWith('/tarifs')
  ) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  // 2. Si l'utilisateur est connecté, on gère les accès selon son rôle et son abonnement
  if (user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role, subscription_status')
      .eq('id', user.id)
      .single()

    // Protection de la zone Administrateur (/admin)
    if (path.startsWith('/admin')) {
      if (profile?.role !== 'admin') {
        const url = request.nextUrl.clone()
        url.pathname = '/dashboard' // Redirection vers le dashboard standard si non admin
        return NextResponse.redirect(url)
      }
    }

    // Protection de la zone Utilisateur Payant (/dashboard ou révisions)
    if (path.startsWith('/dashboard')) {
      // Les admins ont accès partout, sinon on vérifie l'abonnement
      if (profile?.role !== 'admin' && profile?.subscription_status !== 'active') {
        const url = request.nextUrl.clone()
        url.pathname = '/tarifs' // Redirection vers la page de paiement à 14,99€
        return NextResponse.redirect(url)
      }
    }
  }

  return supabaseResponse
}