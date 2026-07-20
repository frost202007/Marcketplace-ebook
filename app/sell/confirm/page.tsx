'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function ConfirmSellerPage() {
  const [status, setStatus] = useState('Vérification de ton email...');

  useEffect(() => {
    async function run() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setStatus("Lien invalide ou expiré. Retourne sur la page 'Publier'.");
        return;
      }

      const shopName = sessionStorage.getItem('pending_shop_name') || 'Ma boutique';
      setStatus('Email confirmé. Redirection vers le paiement...');

      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sellerId: user.id, email: user.email, shopName }),
      });
      const data = await res.json();

      if (data.url) {
        sessionStorage.removeItem('pending_shop_name');
        window.location.href = data.url;
      } else {
        setStatus(data.error || 'Une erreur est survenue.');
      }
    }
    run();
  }, []);

  return (
    <div className="max-w-md mx-auto bg-paper text-ink rounded-sm p-8 text-center">
      <p className="font-mono text-sm text-ink/70">{status}</p>
    </div>
  );
}
