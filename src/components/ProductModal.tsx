import {Minus, Plus, X} from 'lucide-react';
import {useEffect, useState} from 'react';
import {formatUzs, type MenuItem, type ProductVariant} from '../data/menu.ts';
import {ResilientImage} from './ResilientImage.tsx';

interface ProductModalProps {
  item: MenuItem | null;
  onClose: () => void;
  onAddToCart: (
    item: MenuItem,
    variant: ProductVariant,
    quantity: number,
  ) => void;
}

export function ProductModal({item, onClose, onAddToCart}: ProductModalProps) {
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(
    null,
  );
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (item) {
      setSelectedVariant(item.variants[0]);
      setQuantity(1);
    }
  }, [item]);

  useEffect(() => {
    if (!item) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [item, onClose]);

  if (!item || !selectedVariant) return null;

  const unitPrice = item.price + selectedVariant.priceDelta;
  const totalPrice = unitPrice * quantity;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/75 backdrop-blur-xs"
      role="dialog"
      aria-modal="true"
      aria-labelledby="product-modal-title"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl bg-white rounded-2xl overflow-hidden border border-zinc-200 shadow-2xl grid grid-cols-1 md:grid-cols-2"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Yopish"
          className="absolute top-3 right-3 z-10 w-10 h-10 rounded-lg bg-zinc-950/85 text-white flex items-center justify-center hover:bg-zinc-950 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="aspect-[4/3] md:aspect-auto md:h-full bg-zinc-950">
          <ResilientImage
            src={item.image}
            alt={item.name}
            fallbackTitle={item.name}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs text-zinc-500">
              <span className="font-medium text-zinc-700">{item.category}</span>
              <span aria-hidden="true">·</span>
              <span className="tabular-nums">{item.weight}</span>
            </div>

            <h2
              id="product-modal-title"
              className="mt-2 font-display text-2xl font-bold text-zinc-950 leading-tight"
            >
              {item.name}
            </h2>

            <p className="mt-2.5 text-sm text-zinc-600 leading-relaxed">
              {item.description}
            </p>

            <div className="mt-5">
              <p className="text-xs font-semibold text-zinc-900 mb-2">
                Variantni tanlang
              </p>
              <div className="flex flex-col gap-2">
                {item.variants.map((variant) => {
                  const isActive = variant.id === selectedVariant.id;
                  return (
                    <button
                      key={variant.id}
                      type="button"
                      onClick={() => setSelectedVariant(variant)}
                      className={`w-full px-3.5 py-2.5 rounded-lg border text-left text-sm flex items-center justify-between gap-3 transition-colors cursor-pointer ${
                        isActive
                          ? 'border-zinc-950 bg-zinc-950 text-white font-semibold'
                          : 'border-zinc-200 bg-white text-zinc-800 hover:border-zinc-400'
                      }`}
                    >
                      <span>{variant.label}</span>
                      <span
                        className={`tabular-nums text-xs ${
                          isActive ? 'text-yellow-400' : 'text-zinc-500'
                        }`}
                      >
                        {variant.priceDelta > 0
                          ? `+${formatUzs(variant.priceDelta)}`
                          : 'Asosiy'}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="mt-6 pt-5 border-t border-zinc-200 flex items-center gap-3">
            <div className="inline-flex items-center rounded-lg border border-zinc-300 bg-zinc-50">
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                aria-label="Kamaytirish"
                className="w-10 h-11 flex items-center justify-center text-zinc-900 hover:bg-zinc-200/70 rounded-l-lg transition-colors cursor-pointer"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="px-3 text-sm font-bold tabular-nums min-w-[2.5ch] text-center">
                {quantity}
              </span>
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.min(20, q + 1))}
                aria-label="Oshirish"
                className="w-10 h-11 flex items-center justify-center text-zinc-900 hover:bg-zinc-200/70 rounded-r-lg transition-colors cursor-pointer"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            <button
              type="button"
              onClick={() => {
                onAddToCart(item, selectedVariant, quantity);
                onClose();
              }}
              className="flex-1 min-h-[44px] px-4 py-2.5 rounded-lg bg-yellow-400 text-zinc-950 text-sm font-bold hover:bg-yellow-300 active:scale-[0.99] transition-all cursor-pointer tabular-nums whitespace-nowrap"
            >
              Qo'shish · {formatUzs(totalPrice)}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
