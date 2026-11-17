import {Minus, Plus} from 'lucide-react';
import {formatUzs, type MenuItem} from '../data/menu.ts';
import {ResilientImage} from './ResilientImage.tsx';

interface MenuCardProps {
  item: MenuItem;
  defaultQuantityInCart: number;
  onQuickAdd: (item: MenuItem) => void;
  onDecrementDefault: (item: MenuItem) => void;
  onOpenDetail: (item: MenuItem) => void;
}

export function MenuCard({
  item,
  defaultQuantityInCart,
  onQuickAdd,
  onDecrementDefault,
  onOpenDetail,
}: MenuCardProps) {
  return (
    <article className="group flex flex-col bg-white border border-zinc-200 rounded-xl overflow-hidden transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
      <button
        type="button"
        onClick={() => onOpenDetail(item)}
        className="relative aspect-[4/3] w-full bg-zinc-950 overflow-hidden text-left cursor-pointer focus-visible:outline-2 focus-visible:outline-inset focus-visible:outline-yellow-400"
      >
        <ResilientImage
          src={item.image}
          alt={item.name}
          fallbackTitle={item.name}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
        />
      </button>

      <div className="flex flex-col flex-1 p-5">
        <div className="flex items-center justify-between gap-2 text-xs text-zinc-500 mb-1.5">
          <div className="flex items-center gap-1.5 truncate">
            <span className="font-medium text-zinc-700">{item.category}</span>
            <span aria-hidden="true">·</span>
            <span className="tabular-nums">{item.weight}</span>
          </div>
          {item.highlight && (
            <span className="font-semibold text-zinc-950 whitespace-nowrap shrink-0">
              {item.highlight}
            </span>
          )}
        </div>

        <button
          type="button"
          onClick={() => onOpenDetail(item)}
          className="text-left cursor-pointer focus-visible:outline-2 focus-visible:outline-yellow-500 rounded-sm"
        >
          <h3 className="font-display text-lg font-bold text-zinc-950 leading-snug group-hover:underline decoration-yellow-400 decoration-2 underline-offset-4">
            {item.name}
          </h3>
        </button>

        <p className="mt-1.5 text-sm text-zinc-600 leading-relaxed line-clamp-2 flex-1">
          {item.description}
        </p>

        <div className="mt-5 pt-4 border-t border-zinc-100 flex items-center justify-between gap-3">
          <span className="font-display text-base font-bold text-zinc-950 tabular-nums whitespace-nowrap">
            {formatUzs(item.price)}
          </span>

          {defaultQuantityInCart > 0 ? (
            <div className="inline-flex items-center rounded-lg border border-zinc-950 bg-zinc-950 text-white overflow-hidden">
              <button
                type="button"
                onClick={() => onDecrementDefault(item)}
                aria-label={`${item.name} miqdorini kamaytirish`}
                className="w-10 h-10 flex items-center justify-center hover:bg-zinc-800 transition-colors cursor-pointer"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="px-2.5 text-sm font-bold tabular-nums min-w-[2ch] text-center text-yellow-400">
                {defaultQuantityInCart}
              </span>
              <button
                type="button"
                onClick={() => onQuickAdd(item)}
                aria-label={`${item.name} miqdorini oshirish`}
                className="w-10 h-10 flex items-center justify-center hover:bg-zinc-800 transition-colors cursor-pointer"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => onQuickAdd(item)}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 min-h-[40px] rounded-lg bg-yellow-400 text-zinc-950 text-sm font-bold hover:bg-yellow-300 active:scale-[0.98] transition-all cursor-pointer whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-950"
            >
              <Plus className="w-4 h-4" aria-hidden="true" />
              <span>Qo'shish</span>
            </button>
          )}
        </div>
      </div>
    </article>
  );
}
