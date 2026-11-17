import {Menu, ShoppingBag, X} from 'lucide-react';
import {useState} from 'react';

interface NavbarProps {
  cartCount: number;
  onOpenCart: () => void;
  onSelectKombo: () => void;
}

export function Navbar({cartCount, onOpenCart, onSelectKombo}: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-zinc-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        <a
          href="#top"
          className="font-display text-xl font-extrabold tracking-tight text-zinc-950 whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-yellow-500 rounded-sm"
        >
          Oltin Grill
        </a>

        <nav
          aria-label="Asosiy navigatsiya"
          className="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-700"
        >
          <a
            href="#menyu"
            className="hover:text-zinc-950 hover:underline underline-offset-4 decoration-2 decoration-yellow-400 transition-colors whitespace-nowrap shrink-0"
          >
            Menyu
          </a>
          <a
            href="#menyu"
            onClick={onSelectKombo}
            className="hover:text-zinc-950 hover:underline underline-offset-4 decoration-2 decoration-yellow-400 transition-colors whitespace-nowrap shrink-0"
          >
            Kombo
          </a>
          <a
            href="#oshxona"
            className="hover:text-zinc-950 hover:underline underline-offset-4 decoration-2 decoration-yellow-400 transition-colors whitespace-nowrap shrink-0"
          >
            Oshxona
          </a>
          <a
            href="#aloqa"
            className="hover:text-zinc-950 hover:underline underline-offset-4 decoration-2 decoration-yellow-400 transition-colors whitespace-nowrap shrink-0"
          >
            Aloqa
          </a>
        </nav>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={onOpenCart}
            className="inline-flex items-center gap-2 px-4 py-2.5 min-h-[40px] rounded-lg bg-zinc-950 text-white text-sm font-semibold hover:bg-zinc-800 active:scale-[0.98] transition-all cursor-pointer whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-yellow-400"
          >
            <ShoppingBag className="w-4 h-4 text-yellow-400" aria-hidden="true" />
            <span>Savat</span>
            <span className="tabular-nums text-yellow-400">({cartCount})</span>
          </button>

          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-expanded={mobileMenuOpen}
            aria-label={mobileMenuOpen ? 'Menyuni yopish' : 'Menyuni ochish'}
            className="md:hidden inline-flex items-center justify-center w-11 h-11 rounded-lg border border-zinc-200 text-zinc-950 hover:bg-zinc-100 transition-colors cursor-pointer"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <nav
          aria-label="Mobil navigatsiya"
          className="md:hidden border-t border-zinc-200 bg-white px-4 py-3 flex flex-col gap-1"
        >
          <a
            href="#menyu"
            onClick={() => setMobileMenuOpen(false)}
            className="px-3 py-2.5 rounded-lg text-sm font-medium text-zinc-900 hover:bg-zinc-100"
          >
            Menyu
          </a>
          <a
            href="#menyu"
            onClick={() => {
              onSelectKombo();
              setMobileMenuOpen(false);
            }}
            className="px-3 py-2.5 rounded-lg text-sm font-medium text-zinc-900 hover:bg-zinc-100"
          >
            Kombo
          </a>
          <a
            href="#oshxona"
            onClick={() => setMobileMenuOpen(false)}
            className="px-3 py-2.5 rounded-lg text-sm font-medium text-zinc-900 hover:bg-zinc-100"
          >
            Oshxona
          </a>
          <a
            href="#aloqa"
            onClick={() => setMobileMenuOpen(false)}
            className="px-3 py-2.5 rounded-lg text-sm font-medium text-zinc-900 hover:bg-zinc-100"
          >
            Aloqa
          </a>
        </nav>
      )}
    </header>
  );
}
