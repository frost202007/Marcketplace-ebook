import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { supabaseAdmin } from '@/lib/supabase';

export async function POST(req: NextRequest) {
  const { sellerId, email, shopName } = await req.json();

  if (!sellerId) {
    return NextResponse.json({ error: 'Utilisateur non authentifié' }, { status: 401 });
  }

  const { data: seller, error: upsertError } = await supabaseAdmin
    .from('sellers')
    .upsert(
      { id: sellerId, display_name: shopName ?? undefined },
      { onConflict: 'id', ignoreDuplicates: false }
    )
    .select()
    .single();

  if (upsertError || !seller) {
    return NextResponse.json({ error: 'Impossible de créer le vendeur' }, { status: 500 });
  }

  let customerId = seller.stripe_customer_id;
  if (!customerId) {
    const customer = await stripe.customers.create({ email });
    customerId = customer.id;
    await supabaseAdmin
      .from('sellers')
      .update({ stripe_customer_id: customerId })
      .eq('id', sellerId);
  }

  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    customer: customerId,
    line_items: [{ price: process.env.STRIPE_HOSTING_PRICE_ID!, quantity: 1 }],
    success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/dashboard?subscribed=1`,
    cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/sell`,
    metadata: { sellerId },
  });

  return NextResponse.json({ url: session.url });
}
