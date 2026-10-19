import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

// ⚠️ La fonction doit s'appeler 'middleware' (ou être exportée par défaut)
export async function middleware(request: NextRequest) {
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
    const { data: profile } = await supabase
      .from('profiles')
      .select('role, subscription_status')
      .eq('id', user.id)
      .single()

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
      const isSubscribed = profile?.subscription_status === 'active' || profile?.subscription_status === 'trialing'
      
      if (profile?.role !== 'admin' && !isSubscribed) {
        const url = request.nextUrl.clone()
        url.pathname = '/tarifs'
        return NextResponse.redirect(url)
      }
    }
  }

  return supabaseResponse
}

// Le matcher pour cibler les routes
export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}