import { supabaseAdmin } from '@/lib/supabase';
import Link from 'next/link';

export const revalidate = 0;

export default async function HomePage() {
  const { data: ebooks } = await supabaseAdmin
    .from('ebooks')
    .select('id, title, description, price_cents, cover_url')
    .eq('published', true)
    .order('created_at', { ascending: false });

  return (
    <div>
      <div className="text-center mb-16 py-8">
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-gold mb-4">
          Catalogue indépendant
        </p>
        <h1 className="font-display font-semibold text-5xl md:text-6xl leading-tight text-paper mb-4">
          Des livres écrits<br />par des gens, pas des marques.
        </h1>
        <p className="font-mono text-sm text-paper/50 max-w-md mx-auto">
          Chaque titre ci-dessous vient d'un auteur indépendant hébergé sur Le Rayon.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {ebooks?.map((ebook) => (
          <Link
            key={ebook.id}
            href={`/ebooks/${ebook.id}`}
            className="group bg-paper text-ink rounded-sm p-4 relative hover:-translate-y-1 transition-transform duration-200"
          >
            <div className="aspect-[2/3] bg-ink-soft rounded-sm mb-3 overflow-hidden">
              {ebook.cover_url && (
                <img src={ebook.cover_url} alt={ebook.title} className="w-full h-full object-cover" />
              )}
            </div>
            <h2 className="font-display font-semibold text-base leading-snug mb-1">
              {ebook.title}
            </h2>
            <div className="stamp text-cloth text-xs px-2.5 py-1 mt-2">
              {(ebook.price_cents / 100).toFixed(2)} €
            </div>
          </Link>
        ))}
        {!ebooks?.length && (
          <p className="col-span-full text-center text-paper/40 font-mono text-sm py-12">
            Le catalogue est encore vide — reviens bientôt.
          </p>
        )}
      </div>
    </div>
  );
}
