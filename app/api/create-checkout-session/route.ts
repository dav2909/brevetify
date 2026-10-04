import { NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-02-24.acacia' as any,
})

export async function POST(req: Request) {
  try {
    const { priceId, userEmail, userId } = await req.json()

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'subscription',
      customer_email: userEmail,
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      subscription_data: {
        trial_period_days: 7, // 7 jours d'essai gratuit
      },
      metadata: {
        userId, // ID Supabase pour faire le lien dans le webhook
      },
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/mathematiques?success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/tarifs?canceled=true`,
    })

    return NextResponse.json({ url: session.url })
  } catch (error: any) {
    console.error('Erreur Stripe Checkout:', error.message)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}