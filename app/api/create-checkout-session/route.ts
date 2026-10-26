import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2026-09-30.endive' as any,
})

export async function POST(req: Request) {
  const cookieStore = cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
      },
    }
  )

  // 1. Vérification sécurisée de la session utilisateur côté serveur
  const { data: { user } } = await supabase.auth.getUser()
  if (!user || !user.email) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
  }

  try {
    const { priceId } = await req.json()

    // 2. Contrôle de sécurité : vérifier que le priceId correspond à la variable Vercel
    if (!priceId || priceId !== process.env.NEXT_PUBLIC_STRIPE_PRICE_ID) {
      return NextResponse.json({ error: 'Tarif invalide ou non autorisé.' }, { status: 400 })
    }

    // 3. Vérifier si l'utilisateur a déjà un stripe_customer_id dans la table profiles
    const { data: profile } = await supabase
      .from('profiles')
      .select('stripe_customer_id')
      .eq('id', user.id)
      .single()

    let customerId = profile?.stripe_customer_id

    // 4. S'il n'en a pas, créer le client dans Stripe et enregistrer l'ID dans Supabase
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        metadata: {
          userId: user.id,
        },
      })

      customerId = customer.id

      const { error: updateError } = await supabase
        .from('profiles')
        .update({ stripe_customer_id: customerId })
        .eq('id', user.id)

      if (updateError) {
        console.error('Erreur critique mise à jour profil:', updateError.message)
        return NextResponse.json({ error: 'Erreur lors de la mise à jour du profil.' }, { status: 500 })
      }
    }

    // 5. Créer la session Checkout avec la période d'essai de 7 jours
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      customer: customerId,
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      subscription_data: {
        trial_period_days: 7,
      },
      metadata: {
        userId: user.id,
      },
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/dashboard?success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/tarifs?canceled=true`,
    })

    return NextResponse.json({ url: session.url })
  } catch (error: any) {
    console.error('Erreur Stripe Checkout:', error.message)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}