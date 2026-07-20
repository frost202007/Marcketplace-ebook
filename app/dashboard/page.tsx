'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

type SellerState = 'loading' | 'signed_out' | 'inactive' | 'active';

export default function DashboardPage() {
  const [sellerState, setSellerState] = useState<SellerState>('loading');
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState('');

  useEffect(() => {
    checkAccess();
  }, []);

  async function checkAccess() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return setSellerState('signed_out');

    const { data: seller } = await supabase
      .from('sellers')
      .select('subscription_status')
      .eq('id', user.id)
      .single();

    setSellerState(seller?.subscription_status === 'active' ? 'active' : 'inactive');
  }

  async function handlePublish() {
    setStatus('Publication en cours...');
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return setStatus("Connecte-toi d'abord.");
    if (!file) return setStatus('Choisis un fichier ebook.');

    const filePath = `${user.id}/${Date.now()}-${file.name}`;
    const { error: uploadError } = await supabase.storage
      .from('ebooks')
      .upload(filePath, file);
    if (uploadError) return setStatus("Erreur d'upload: " + uploadError.message);

    const { error } = await supabase.from('ebooks').insert({
      seller_id: user.id,
      title,
      price_cents: Math.round(parseFloat(price) * 100),
      file_path: filePath,
      published: true,
    });

    setStatus(error ? 'Erreur: ' + error.message : 'Ebook publié !');
  }

  if (sellerState === 'loading') {
    return <p className="text-center text-paper/40 font-mono text-sm">Chargement...</p>;
  }

  if (sellerState === 'signed_out') {
    return (
      <div className="max-w-md mx-auto bg-paper text-ink rounded-sm p-8 text-center">
        <p className="text-ink/70 mb-4">Connecte-toi pour accéder à ton espace vendeur.</p>
        <a href="/sell" className="text-cloth underline font-medium">Publier tes ebooks</a>
      </div>
    );
  }

  if (sellerState === 'inactive') {
    return (
      <div className="max-w-md mx-auto bg-paper text-ink rounded-sm p-8 text-center">
        <p className="text-ink/70 mb-4">
          Ton abonnement d'hébergement n'est pas actif. Active-le pour publier des ebooks.
        </p>
        <a href="/sell" className="text-cloth underline font-medium">S'abonner</a>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto bg-paper text-ink rounded-sm p-8">
      <p className="font-mono text-xs uppercase tracking-[0.2em] text-cloth mb-3">Espace vendeur</p>
      <h1 className="font-display font-semibold text-2xl mb-6">Publier un ebook</h1>
      <input
        placeholder="Titre"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="border border-paper-line bg-white/60 rounded-sm px-3 py-2.5 w-full mb-3 font-mono text-sm placeholder:text-ink/30"
      />
      <input
        placeholder="Prix en €"
        type="number"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        className="border border-paper-line bg-white/60 rounded-sm px-3 py-2.5 w-full mb-3 font-mono text-sm placeholder:text-ink/30"
      />
      <input
        type="file"
        accept=".pdf,.epub"
        onChange={(e) => setFile(e.target.files?.[0] ?? null)}
        className="mb-4 w-full font-mono text-xs"
      />
      <button
        onClick={handlePublish}
        className="bg-cloth text-paper px-6 py-3 rounded-sm font-medium w-full hover:bg-cloth/90 transition-colors"
      >
        Publier
      </button>
      {status && <p className="mt-4 text-sm text-ink/60 font-mono">{status}</p>}
    </div>
  );
}
