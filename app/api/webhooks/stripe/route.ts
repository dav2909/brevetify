import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: Request) {
  const body = await req.text()
  const sig = req.headers.get('stripe-signature')!

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret)
  } catch (err: any) {
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 })
  }

  const dataObject = event.data.object as any
  let userId = dataObject.metadata?.userId || dataObject.client_reference_id

  // Si l'événement vient d'une facture ou d'un abonnement sans metadata direct, 
  // on essaie de récupérer le client associé pour retrouver l'info si besoin
  let customerId = dataObject.customer

  if (userId) {
    let status = 'inactive'
    
    // Gérer les différents statuts possibles
    if (['active', 'trialing'].includes(dataObject.status)) {
      status = dataObject.status
    }
    // Si c'est un événement de checkout session réussi
    if (event.type === 'checkout.session.completed') {
      status = dataObject.payment_status === 'paid' || dataObject.status === 'complete' ? 'active' : 'inactive'
      if (dataObject.subscription) {
        // Récupérer le statut réel de l'abonnement si besoin
        const sub = await stripe.subscriptions.retrieve(dataObject.subscription as string)
        status = sub.status // 'active' ou 'trialing'
      }
    }

    // Mise à jour du profil dans Supabase
    const updateData: any = {
      subscription_status: status,
    }
    if (customerId) {
      updateData.stripe_customer_id = customerId as string
    }

    await supabaseAdmin
      .from('profiles')
      .update(updateData)
      .eq('id', userId)
  }

  return NextResponse.json({ received: true })
}