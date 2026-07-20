'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';

export default function DownloadPanel() {
  const params = useSearchParams();
  const paid = params.get('paid');
  const sessionId = params.get('session_id');
  const [url, setUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (paid && sessionId) {
      fetch(`/api/download?session_id=${sessionId}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.url) setUrl(data.url);
          else setError(data.error || 'Erreur inconnue');
        });
    }
  }, [paid, sessionId]);

  if (!paid) return null;

  return (
    <div className="mt-4 p-4 bg-cloth/10 border border-cloth/30 rounded-sm">
      {url && (
        <>
          <p className="text-cloth font-medium mb-2 font-mono text-sm">Paiement confirmé</p>
          <a
            href={url}
            className="inline-block bg-gold text-ink px-4 py-2 rounded-sm text-sm font-medium hover:bg-gold/90 transition-colors"
          >
            Télécharger mon ebook
          </a>
          <p className="text-xs text-ink/40 mt-2 font-mono">Ce lien expire dans 1 heure.</p>
        </>
      )}
      {error && <p className="text-red-700 text-sm">{error}</p>}
      {!url && !error && <p classNam
