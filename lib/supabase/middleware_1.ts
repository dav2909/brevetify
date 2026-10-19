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

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const path = request.nextUrl.pathname

  // 1. Redirection vers /login si non connecté
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

  // 2. Si l'utilisateur est connecté
  if (user) {
    console.log("--> [MIDDLEWARE] Utilisateur détecté :", user.email);

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('role, subscription_status')
      .eq('id', user.id)
      .single()

    console.log("--> [MIDDLEWARE] Profil récupéré :", profile);
    console.log("--> [MIDDLEWARE] Erreur éventuelle SQL :", profileError);

    // Protection de la zone Administrateur (/admin)
    if (path.startsWith('/admin')) {
      if (profile?.role !== 'admin') {
        const url = request.nextUrl.clone()
        url.pathname = '/dashboard'
        return NextResponse.redirect(url)
      }
    }

    // Protection du Dashboard pour les abonnements inactifs
    if (path.startsWith('/dashboard')) {
      if (profile?.role !== 'admin' && profile?.subscription_status !== 'active') {
        console.log("--> [MIDDLEWARE] ACCÈS REFUSÉ : Redirection imminente vers /tarifs");
        const url = request.nextUrl.clone()
        url.pathname = '/tarifs'
        return NextResponse.redirect(url)
      }
    }
  } else {
    console.log("--> [MIDDLEWARE] Aucun utilisateur actif détecté sur la route :", path);
  }

  return supabaseResponse
}

// ⚠️ C'EST CETTE PARTIE QUI ACTIVE LE MIDDLEWARE SUR VOS ROUTES
export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}