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
  let customerId = dataObject.customer

  // SÉCURITÉ / ROBUSTESSE : Si le userId n'est pas dans les métadonnées de l'événement courant
  // (ex: événements de type invoice ou subscription mis à jour sans metadata direct),
  // on recherche l'utilisateur dans Supabase via son stripe_customer_id.
  if (!userId && customerId) {
    const { data: profile } = await supabaseAdmin
      .from('profiles')
      .select('id')
      .eq('stripe_customer_id', customerId)
      .single()

    if (profile) {
      userId = profile.id
    }
  }

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

    const { error: updateError } = await supabaseAdmin
      .from('profiles')
      .update(updateData)
      .eq('id', userId)

    if (updateError) {
      console.error('Erreur mise à jour webhook Supabase:', updateError.message)
      return NextResponse.json({ error: 'Database update failed' }, { status: 500 })
    }
  }

  return NextResponse.json({ received: true })
}