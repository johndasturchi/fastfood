import {ArrowRight, Clock, MapPin, Phone, Search, ShoppingBag} from 'lucide-react';
import {useMemo, useState} from 'react';
import {CartDrawer} from './components/CartDrawer.tsx';
import {MenuCard} from './components/MenuCard.tsx';
import {Navbar} from './components/Navbar.tsx';
import {ProductModal} from './components/ProductModal.tsx';
import {ResilientImage} from './components/ResilientImage.tsx';
import {
  CATEGORIES,
  IMAGES,
  MENU_ITEMS,
  type CartItem,
  type MenuCategory,
  type MenuItem,
  type ProductVariant,
} from './data/menu.ts';

export default function App() {
  const [selectedCategory, setSelectedCategory] =
    useState<MenuCategory>('Barchasi');
  const [searchQuery, setSearchQuery] = useState('');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [activeProduct, setActiveProduct] = useState<MenuItem | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const totalCartCount = useMemo(
    () => cart.reduce((sum, item) => sum + item.quantity, 0),
    [cart],
  );

  const filteredItems = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return MENU_ITEMS.filter((item) => {
      const matchesCat =
        selectedCategory === 'Barchasi' || item.category === selectedCategory;
      const matchesSearch =
        query === '' ||
        item.name.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query) ||
        item.category.toLowerCase().includes(query);
      return matchesCat && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    window.setTimeout(() => {
      setToastMessage((current) => (current === msg ? null : current));
    }, 2600);
  };

  const handleAddToCart = (
    item: MenuItem,
    variant: ProductVariant,
    quantity = 1,
  ) => {
    const key = `${item.id}::${variant.id}`;
    const unitPrice = item.price + variant.priceDelta;

    setCart((prev) => {
      const existing = prev.find((ci) => ci.key === key);
      if (existing) {
        return prev.map((ci) =>
          ci.key === key ? {...ci, quantity: ci.quantity + quantity} : ci,
        );
      }
      return [
        ...prev,
        {
          key,
          menuItemId: item.id,
          name: item.name,
          image: item.image,
          variantLabel: variant.label,
          unitPrice,
          quantity,
        },
      ];
    });

    showToast(`${item.name} savatga qo'shildi`);
  };

  const handleQuickAdd = (item: MenuItem) => {
    handleAddToCart(item, item.variants[0], 1);
  };

  const handleDecrementDefault = (item: MenuItem) => {
    const defaultKey = `${item.id}::${item.variants[0].id}`;
    handleUpdateQuantity(defaultKey, -1);
  };

  const handleUpdateQuantity = (key: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((ci) =>
          ci.key === key ? {...ci, quantity: ci.quantity + delta} : ci,
        )
        .filter((ci) => ci.quantity > 0),
    );
  };

  const handleRemoveItem = (key: string) => {
    setCart((prev) => prev.filter((ci) => ci.key !== key));
  };

  const getDefaultQuantityInCart = (item: MenuItem): number => {
    const defaultKey = `${item.id}::${item.variants[0].id}`;
    return cart.find((ci) => ci.key === defaultKey)?.quantity ?? 0;
  };

  return (
    <div id="top" className="min-h-screen flex flex-col bg-white text-zinc-950">
      <Navbar
        cartCount={totalCartCount}
        onOpenCart={() => setIsCartOpen(true)}
        onSelectKombo={() => setSelectedCategory('Kombo')}
      />

      <main className="flex-1">
        {/* Section 1: Storefront Hero */}
        <section className="border-b border-zinc-200 bg-zinc-50">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch">
              <div className="lg:col-span-6 flex flex-col justify-center">
                <p className="text-xs sm:text-sm font-medium text-zinc-600">
                  Toshkent · Har kuni 10:00 – 23:30
                </p>

                <h1 className="mt-3 font-display font-extrabold text-zinc-950 tracking-tight leading-[1.08] text-[clamp(2.25rem,4vw,3.75rem)] text-balance">
                  Olovda pishgan haqiqiy ta'm
                </h1>

                <p className="mt-4 text-base sm:text-lg text-zinc-600 leading-relaxed max-w-xl">
                  Har tong yangi yopilgan brioch bulochkada shirali smash burgerlar, ochiq gril lavashlar va qarsildoq tovuq. Buyurtmangiz to'g'ridan-to'g'ri oshxonamizga tushadi va 30 daqiqada issiq yetkaziladi.
                </p>

                <div className="mt-8 flex flex-wrap items-center gap-3.5">
                  <a
                    href="#menyu"
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 min-h-[44px] rounded-lg bg-yellow-400 text-zinc-950 text-sm font-bold hover:bg-yellow-300 active:scale-[0.98] transition-all whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-950"
                  >
                    <span>Menyuni ko'rish</span>
                    <ArrowRight className="w-4 h-4" aria-hidden="true" />
                  </a>

                  <button
                    type="button"
                    onClick={() => setIsCartOpen(true)}
                    className="inline-flex items-center justify-center gap-2 px-5 py-3 min-h-[44px] rounded-lg border border-zinc-950 bg-white text-zinc-950 text-sm font-semibold hover:bg-zinc-950 hover:text-white transition-colors cursor-pointer whitespace-nowrap shrink-0"
                  >
                    <span>Tez buyurtma</span>
                  </button>
                </div>
              </div>

              <div className="lg:col-span-6">
                <div className="relative aspect-[16/10] lg:aspect-auto lg:h-full min-h-[280px] rounded-2xl overflow-hidden bg-zinc-950 border border-zinc-200">
                  <ResilientImage
                    src={IMAGES.hero}
                    alt="Oltin Grill double smash burger, kartoshka fri va muzdek kola"
                    fallbackTitle="Oltin Grill Signature Set"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>

            {/* 4-Column Promise Strip */}
            <div className="mt-10 pt-8 border-t border-zinc-200 grid grid-cols-2 lg:grid-cols-4 gap-6">
              <div>
                <p className="font-display text-xl sm:text-2xl font-bold text-zinc-950 tabular-nums">
                  25–35 daqiqa
                </p>
                <p className="mt-0.5 text-xs sm:text-sm text-zinc-600">
                  Issiq yetkazib berish vaqti
                </p>
              </div>
              <div>
                <p className="font-display text-xl sm:text-2xl font-bold text-zinc-950 tabular-nums">
                  100% halol
                </p>
                <p className="mt-0.5 text-xs sm:text-sm text-zinc-600">
                  Yangi mol va tovuq go'shti
                </p>
              </div>
              <div>
                <p className="font-display text-xl sm:text-2xl font-bold text-zinc-950 tabular-nums">
                  240 °C
                </p>
                <p className="mt-0.5 text-xs sm:text-sm text-zinc-600">
                  Ochiq gril pishirish harorati
                </p>
              </div>
              <div>
                <p className="font-display text-xl sm:text-2xl font-bold text-zinc-950 tabular-nums">
                  0 so'm
                </p>
                <p className="mt-0.5 text-xs sm:text-sm text-zinc-600">
                  120 000 so'mdan ortiq yetkazish
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Section 2: Menu Collection */}
        <section id="menyu" className="py-14 lg:py-20 bg-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-zinc-200">
              <div>
                <p className="text-xs font-semibold text-zinc-500">
                  Har kuni yangi tayyorlanadi
                </p>
                <h2 className="mt-1 font-display text-3xl font-extrabold text-zinc-950 tracking-tight">
                  Bugungi Menyu
                </h2>
              </div>

              <div className="w-full md:w-72">
                <label htmlFor="menu-search" className="sr-only">
                  Taom qidirish
                </label>
                <div className="relative">
                  <Search
                    className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                    aria-hidden="true"
                  />
                  <input
                    id="menu-search"
                    type="search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Taom nomi bo'yicha qidirish..."
                    className="w-full pl-10 pr-4 py-2.5 min-h-[42px] text-sm rounded-lg border border-zinc-300 bg-zinc-50 text-zinc-950 placeholder:text-zinc-400 focus:bg-white focus:outline-none focus:border-zinc-950"
                  />
                </div>
              </div>
            </div>

            {/* Category Filter Segmented Controls */}
            <div
              role="tablist"
              aria-label="Taom toifalari"
              className="mt-6 flex items-center gap-1.5 overflow-x-auto pb-2"
            >
              {CATEGORIES.map((category) => {
                const isActive = selectedCategory === category;
                return (
                  <button
                    key={category}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-4 py-2 min-h-[40px] rounded-lg text-sm font-semibold transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                      isActive
                        ? 'bg-zinc-950 text-yellow-400'
                        : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200 hover:text-zinc-950'
                    }`}
                  >
                    {category}
                  </button>
                );
              })}
            </div>

            {filteredItems.length === 0 ? (
              <div className="mt-12 py-16 text-center border border-zinc-200 rounded-2xl bg-zinc-50">
                <p className="font-display text-lg font-bold text-zinc-950">
                  Hech qanday taom topilmadi
                </p>
                <p className="mt-1 text-sm text-zinc-600">
                  Qidiruv so'zini o'zgartirib ko'ring yoki barcha toifalarni tanlang.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedCategory('Barchasi');
                    setSearchQuery('');
                  }}
                  className="mt-5 px-5 py-2.5 min-h-[40px] rounded-lg bg-yellow-400 text-zinc-950 text-sm font-bold hover:bg-yellow-300 transition-colors cursor-pointer"
                >
                  Barchasini ko'rsatish
                </button>
              </div>
            ) : (
              <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                {filteredItems.map((item) => (
                  <MenuCard
                    key={item.id}
                    item={item}
                    defaultQuantityInCart={getDefaultQuantityInCart(item)}
                    onQuickAdd={handleQuickAdd}
                    onDecrementDefault={handleDecrementDefault}
                    onOpenDetail={setActiveProduct}
                  />
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Section 3: Kitchen Craftsmanship (High-Contrast Black Band) */}
        <section id="oshxona" className="bg-zinc-950 text-white py-16 lg:py-24">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-stretch">
              <div className="lg:col-span-6">
                <div className="relative aspect-[4/3] lg:aspect-auto lg:h-full min-h-[280px] rounded-2xl overflow-hidden border border-zinc-800 bg-zinc-900">
                  <ResilientImage
                    src={IMAGES.kitchen}
                    alt="Oltin Grill oshxonasida ochiq grilda burger tayyorlanishi"
                    fallbackTitle="Oltin Grill Oshxonasi"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              <div className="lg:col-span-6 flex flex-col justify-center">
                <p className="text-xs font-semibold text-yellow-400">
                  Oshxona standartlari
                </p>
                <h2 className="mt-2 font-display text-3xl sm:text-4xl font-extrabold tracking-tight text-balance">
                  Buyurtma tushgan soniyadan boshlab grilda pishiriladi
                </h2>
                <p className="mt-4 text-sm sm:text-base text-zinc-300 leading-relaxed">
                  Biz tayyor taomlarni isitib bermaymiz. Sayt orqali tasdiqlangan har bir buyurtma bir zumda oshxonamizning Telegram kanaliga tushadi va oshpazlarimiz uni yangidan tayyorlashni boshlaydi.
                </p>

                <div className="mt-8 space-y-5 border-t border-zinc-800 pt-6">
                  <div>
                    <h3 className="font-display text-base font-bold text-white">
                      01. Yangi va halol masalliqlar
                    </h3>
                    <p className="mt-1 text-sm text-zinc-400">
                      Muzlatilmagan marmar mol go'shti va kunlik sarxil sabzavotlar har kuni tongda qabul qilinadi.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-display text-base font-bold text-white">
                      02. Firma sariq chedder va souslar
                    </h3>
                    <p className="mt-1 text-sm text-zinc-400">
                      Oshxonamizda maxsus retsept bo'yicha tayyorlangan qaymoqli sarimsoq va iliq chedder souslari.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-display text-base font-bold text-white">
                      03. Telegram orqali tezkor qabul
                    </h3>
                    <p className="mt-1 text-sm text-zinc-400">
                      Ortiqcha qo'ng'iroqlarsiz — savatingizni yuboring, oshxona jamoasi bir zumda qabul qiladi.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Section 4: Footer */}
      <footer id="aloqa" className="bg-zinc-950 text-zinc-300 border-t border-zinc-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <span className="font-display text-xl font-extrabold text-white">
                Oltin Grill
              </span>
              <p className="mt-2.5 text-sm text-zinc-400 leading-relaxed max-w-xs">
                Toshkentdagi zamonaviy fast food oshxonasi. Issiq burgerlar, gril lavashlar va tezkor yetkazib berish.
              </p>
            </div>

            <div className="space-y-2.5 text-sm">
              <p className="font-display font-bold text-white">Manzil va vaqt</p>
              <p className="flex items-center gap-2 text-zinc-400">
                <MapPin className="w-4 h-4 text-yellow-400 shrink-0" aria-hidden="true" />
                <span>Toshkent sh., Amir Temur shoh ko'chasi 45</span>
              </p>
              <p className="flex items-center gap-2 text-zinc-400">
                <Clock className="w-4 h-4 text-yellow-400 shrink-0" aria-hidden="true" />
                <span>Har kuni · 10:00 – 23:30</span>
              </p>
              <p className="flex items-center gap-2 text-zinc-400">
                <Phone className="w-4 h-4 text-yellow-400 shrink-0" aria-hidden="true" />
                <a href="tel:+998901234567" className="hover:text-white transition-colors tabular-nums">
                  +998 90 123 45 67
                </a>
              </p>
            </div>

            <div className="space-y-2.5 text-sm">
              <p className="font-display font-bold text-white">Tezkor havolalar</p>
              <div className="flex flex-col gap-1.5">
                <a href="#menyu" className="text-zinc-400 hover:text-yellow-400 transition-colors w-fit">
                  Menyu
                </a>
                <a
                  href="#menyu"
                  onClick={() => setSelectedCategory('Kombo')}
                  className="text-zinc-400 hover:text-yellow-400 transition-colors w-fit"
                >
                  Kombo to'plamlar
                </a>
                <a href="#oshxona" className="text-zinc-400 hover:text-yellow-400 transition-colors w-fit">
                  Oshxona haqida
                </a>
                <button
                  type="button"
                  onClick={() => setIsCartOpen(true)}
                  className="text-left text-yellow-400 hover:text-yellow-300 font-semibold transition-colors w-fit cursor-pointer"
                >
                  Savatni ochish ({totalCartCount})
                </button>
              </div>
            </div>
          </div>

          <div className="mt-10 pt-6 border-t border-zinc-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-zinc-500">
            <p>© {new Date().getFullYear()} Oltin Grill. Barcha huquqlar himoyalangan.</p>
            <p>Tezkor buyurtma · Telegram orqali qabul</p>
          </div>
        </div>
      </footer>

      {/* Subtle Add-to-Cart Toast */}
      {toastMessage && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:bottom-6 z-40 sm:max-w-sm bg-zinc-950 text-white border border-zinc-800 rounded-xl px-4 py-3 shadow-xl flex items-center justify-between gap-4"
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <ShoppingBag className="w-4 h-4 text-yellow-400 shrink-0" aria-hidden="true" />
            <span className="text-xs sm:text-sm font-medium truncate">
              {toastMessage}
            </span>
          </div>
          <button
            type="button"
            onClick={() => {
              setToastMessage(null);
              setIsCartOpen(true);
            }}
            className="text-xs font-bold text-yellow-400 hover:text-yellow-300 whitespace-nowrap shrink-0 cursor-pointer"
          >
            Savatni ochish
          </button>
        </div>
      )}

      <ProductModal
        item={activeProduct}
        onClose={() => setActiveProduct(null)}
        onAddToCart={handleAddToCart}
      />

      <CartDrawer
        isOpen={isCartOpen}
        items={cart}
        onClose={() => setIsCartOpen(false)}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onClearCart={() => setCart([])}
      />
    </div>
  );
}
