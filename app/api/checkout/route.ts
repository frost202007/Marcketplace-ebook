import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { supabaseAdmin } from '@/lib/supabase';

export async function POST(req: NextRequest) {
  const { ebookId, buyerEmail } = await req.json();

  const { data: ebook } = await supabaseAdmin
    .from('ebooks')
    .select('*, sellers(stripe_connect_account_id)')
    .eq('id', ebookId)
    .single();

  if (!ebook || !ebook.sellers?.stripe_connect_account_id) {
    return NextResponse.json({ error: 'Ebook ou vendeur invalide' }, { status: 404 });
  }

  const applicationFee = Math.round(ebook.price_cents * 0.05);

  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    customer_email: buyerEmail,
    line_items: [
      {
        price_data: {
          currency: 'eur',
          product_data: { name: ebook.title },
          unit_amount: ebook.price_cents,
        },
        quantity: 1,
      },
    ],
    payment_intent_data: {
      application_fee_amount: applicationFee,
      transfer_data: { destination: ebook.sellers.stripe_connect_account_id },
    },
    success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/ebooks/${ebookId}?paid=1&session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/ebooks/${ebookId}`,
    metadata: { ebookId },
  });

  await supabaseAdmin.from('purchases').insert({
    ebook_id: ebookId,
    buyer_email: buyerEmail,
    stripe_checkout_session_id: session.id,
    status: 'pending',
  });

  return NextResponse.json({ url: session.url });
}
