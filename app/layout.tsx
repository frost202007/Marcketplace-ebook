import './globals.css';

export const metadata = {
  title: 'Le Rayon — marketplace d\'ebooks',
  description: 'Achète et publie des ebooks',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body className="min-h-screen bg-ink text-paper font-body">
        <header className="border-b border-white/10 px-6 py-5 flex justify-between items-center bg-ink">
          <a href="/" className="font-display font-semibold text-xl tracking-tight text-paper">
            Le Rayon
          </a>
          <nav className="space-x-6 text-sm font-mono uppercase tracking-wide">
            <a href="/sell" className="text-paper/70 hover:text-gold transition-colors">Publier</a>
            <a href="/dashboard" className="text-paper/70 hover:text-gold transition-colors">Mon espace</a>
          </nav>
        </header>
        <main className="max-w-5xl mx-auto px-6 py-12">{children}</main>
        <footer className="border-t border-white/10 px-6 py-8 mt-16 text-center text-xs font-mono text-paper/40 uppercase tracking-widest">
          Le Rayon — catalogue indépendant
        </footer>
      </body>
    </html>
  );
}
