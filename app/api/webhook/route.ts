import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { supabaseAdmin } from '@/lib/supabase';
import Stripe from 'stripe';

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get('stripe-signature')!;

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err) {
    return NextResponse.json({ error: 'Signature invalide' }, { status: 400 });
  }

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session;
      if (session.mode === 'payment') {
        await supabaseAdmin
          .from('purchases')
          .update({ status: 'paid' })
          .eq('stripe_checkout_session_id', session.id);
      }
      if (session.mode === 'subscription' && session.metadata?.sellerId) {
        await supabaseAdmin
          .from('sellers')
          .update({
            stripe_subscription_id: session.subscription as string,
            subscription_status: 'active',
          })
          .eq('id', session.metadata.sellerId);
      }
      break;
    }

    case 'customer.subscription.deleted':
    case 'customer.subscription.updated': {
      const sub = event.data.object as Stripe.Subscription;
      await supabaseAdmin
        .from('sellers')
        .update({ subscription_status: sub.status })
        .eq('stripe_subscription_id', sub.id);
      break;
    }
  }

  return NextResponse.json({ received: true });
}
