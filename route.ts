import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

// Vérifie que l'achat est bien payé, puis génère une URL de téléchargement
// signée et temporaire (valable 1h) vers le fichier privé dans Supabase Storage.
export async function GET(req: NextRequest) {
  const sessionId = req.nextUrl.searchParams.get('session_id');
  if (!sessionId) {
    return NextResponse.json({ error: 'session_id manquant' }, { status: 400 });
  }

  const { data: purchase } = await supabaseAdmin
    .from('purchases')
    .select('*, ebooks(file_path, title)')
    .eq('stripe_checkout_session_id', sessionId)
    .single();

  if (!purchase || purchase.status !== 'paid') {
    return NextResponse.json({ error: 'Achat introuvable ou non payé' }, { status: 403 });
  }

  const { data, error } = await supabaseAdmin.storage
    .from('ebooks')
    .createSignedUrl(purchase.ebooks.file_path, 3600); // valable 1h

  if (error || !data) {
    return NextResponse.json({ error: 'Impossible de générer le lien' }, { status: 500 });
  }

  return NextResponse.json({ url: data.signedUrl, title: purchase.ebooks.title });
}
