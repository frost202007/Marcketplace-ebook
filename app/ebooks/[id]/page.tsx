import { supabaseAdmin } from '@/lib/supabase';
import BuyButton from './buy-button';
import DownloadPanel from './download-panel';

export default async function EbookPage({ params }: { params: { id: string } }) {
  const { data: ebook } = await supabaseAdmin
    .from('ebooks')
    .select('*')
    .eq('id', params.id)
    .single();

  if (!ebook) return <p className="text-center text-paper/50 font-mono">Ebook introuvable.</p>;

  return (
    <div className="grid md:grid-cols-[280px_1fr] gap-10 bg-paper text-ink rounded-sm p-8 md:p-10">
      <div className="aspect-[2/3] bg-ink-soft rounded-sm overflow-hidden">
        {ebook.cover_url && (
          <img src={ebook.cover_url} alt={ebook.title} className="w-full h-full object-cover" />
        )}
      </div>
      <div className="flex flex-col">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-cloth mb-3">Ebook</p>
        <h1 className="font-display font-semibold text-3xl md:text-4xl mb-4">{ebook.title}</h1>
        <p className="text-ink/70 leading-relaxed mb-6">{ebook.description}</p>
        <div className="stamp text-cloth text-lg px-4 py-2 self-start mb-6">
          {(ebook.price_cents / 100).toFixed(2)} €
        </div>
        <div className="mt-auto">
          <BuyButton ebookId={ebook.id} />
          <DownloadPanel />
        </div>
      </div>
    </div>
  );
}
