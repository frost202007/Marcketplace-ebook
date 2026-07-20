'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function SellPage() {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSendLink() {
    if (!email || !name) return setError('Remplis le nom de boutique et ton email.');
    setLoading(true);
    setError('');

    sessionStorage.setItem('pending_shop_name', name);

    const { error: otpError } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback?next=/sell/confirm`,
      },
    });

    if (otpError) setError(otpError.message);
    else setSent(true);
    setLoading(false);
  }

  if (sent) {
    return (
      <div className="max-w-md mx-auto bg-paper text-ink rounded-sm p-8 text-center">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-cloth mb-3">Étape 2</p>
        <h1 className="font-display font-semibold text-2xl mb-3">Vérifie ta boîte mail</h1>
        <p className="text-ink/70">
          On t'a envoyé un lien à <strong>{email}</strong>. Clique dessus pour
          confirmer ton compte et lancer l'abonnement.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto bg-paper text-ink rounded-sm p-8">
      <p className="font-mono text-xs uppercase tracking-[0.2em] text-cloth mb-3">Étape 1</p>
      <h1 className="font-display font-semibold text-2xl mb-3">Publier tes ebooks</h1>
      <p className="text-ink/70 mb-6 text-sm leading-relaxed">
        Héberge et vends tes ebooks sur Le Rayon pour un abonnement mensuel
        fixe. Tu gardes l'essentiel de tes ventes.
      </p>
      <input
        placeholder="Nom de boutique"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="border border-paper-line bg-white/60 rounded-sm px-3 py-2.5 w-full mb-3 font-mono text-sm placeholder:text-ink/30"
      />
      <input
        type="email"
        placeholder="ton@email.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="border border-paper-line bg-white/60 rounded-sm px-3 py-2.5 w-full mb-4 font-mono text-sm placeholder:text-ink/30"
      />
      {error && <p className="text-red-700 text-sm mb-3">{error}</p>}
      <button
        onClick={handleSendLink}
        disabled={loading}
        className="bg-cloth text-paper px-6 py-3 rounded-sm font-medium w-full hover:bg-cloth/90 transition-colors"
      >
        {loading ? 'Envoi...' : 'Recevoir le lien de confirmation'}
      </button>
    </div>
  );
}
