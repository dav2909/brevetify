import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

// Client Supabase avec la clé service_role pour pouvoir modifier les profils librement
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

  const subscription = event.data.object as Stripe.Subscription
  const userId = subscription.metadata?.userId

  if (userId) {
    let status = 'inactive'
    if (subscription.status === 'trialing') status = 'trialing'
    if (subscription.status === 'active') status = 'active'
    if (subscription.status === 'canceled' || subscription.status === 'unpaid') status = 'inactive'

    // Mise à jour du profil dans Supabase
    await supabaseAdmin
      .from('profiles')
      .update({
        subscription_status: status,
        stripe_customer_id: subscription.customer as string,
      })
      .eq('id', userId)
  }

  return NextResponse.json({ received: true })
}