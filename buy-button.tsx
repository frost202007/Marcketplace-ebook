'use client';

import { useState } from 'react';

export default function BuyButton({ ebookId }: { ebookId: string }) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleBuy() {
    if (!email) return alert("Entre ton email pour recevoir l'ebook");
    setLoading(true);
    const res = await fetch('/api/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ebookId, buyerEmail: email }),
    });
    const data = await res.json();
    if (data.url) window.location.href = data.url;
    setLoading(false);
  }

  return (
    <div className="space-y-3">
      <input
        type="email"
        placeholder="ton@email.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="border border-paper-line bg-white/60 rounded-sm px-3 py-2.5 w-full font-mono text-sm placeholder:text-ink/30"
      />
      <button
        onClick={handleBuy}
        disabled={loading}
        className="bg-cloth text-paper px-6 py-3 rounded-sm font-medium w-full hover:bg-cloth/90 transition-colors"
      >
        {loading ? 'Chargement...' : 'Acheter'}
      </button>
    </div>
  );
}
