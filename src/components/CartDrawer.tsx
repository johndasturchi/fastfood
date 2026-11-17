import {
  AlertCircle,
  CheckCircle2,
  Loader2,
  Minus,
  Plus,
  Send,
  ShoppingBag,
  Trash2,
  X,
} from 'lucide-react';
import {useEffect, useState, type FormEvent} from 'react';
import {formatUzs, type CartItem} from '../data/menu.ts';
import {ResilientImage} from './ResilientImage.tsx';

interface OrderReceipt {
  orderId: string;
  total: number;
  deliveryFee: number;
  subtotal: number;
  createdAt: string;
  customerName: string;
  deliveryType: 'delivery' | 'pickup';
}

interface CartDrawerProps {
  isOpen: boolean;
  items: CartItem[];
  onClose: () => void;
  onUpdateQuantity: (key: string, delta: number) => void;
  onRemoveItem: (key: string) => void;
  onClearCart: () => void;
}

const FREE_DELIVERY_THRESHOLD = 120000;
const DELIVERY_COST = 15000;

export function CartDrawer({
  isOpen,
  items,
  onClose,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
}: CartDrawerProps) {
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('+998 ');
  const [deliveryType, setDeliveryType] = useState<'delivery' | 'pickup'>(
    'delivery',
  );
  const [address, setAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<
    'cash' | 'click_payme' | 'card'
  >('cash');
  const [comment, setComment] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [receipt, setReceipt] = useState<OrderReceipt | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const subtotal = items.reduce(
    (sum, item) => sum + item.unitPrice * item.quantity,
    0,
  );
  const deliveryFee =
    items.length === 0 ||
    deliveryType === 'pickup' ||
    subtotal >= FREE_DELIVERY_THRESHOLD
      ? 0
      : DELIVERY_COST;
  const total = subtotal + deliveryFee;
  const remainingForFreeDelivery = Math.max(
    0,
    FREE_DELIVERY_THRESHOLD - subtotal,
  );

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (items.length === 0) {
      setErrorMsg("Savat bo'sh. Iltimos, avval taom tanlang.");
      return;
    }

    if (customerName.trim().length < 2) {
      setErrorMsg("Iltimos, ismingizni kiriting.");
      return;
    }

    if (phone.replace(/\D/g, '').length < 9) {
      setErrorMsg("Iltimos, to'liq telefon raqamingizni kiriting.");
      return;
    }

    if (deliveryType === 'delivery' && address.trim().length < 4) {
      setErrorMsg("Yetkazib berish manzilini kiriting.");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          customerName: customerName.trim(),
          phone: phone.trim(),
          deliveryType,
          address: deliveryType === 'delivery' ? address.trim() : '',
          paymentMethod,
          comment: comment.trim(),
          subtotal,
          deliveryFee,
          total,
          items: items.map((item) => ({
            id: item.menuItemId,
            name: item.name,
            variant: item.variantLabel,
            price: item.unitPrice,
            quantity: item.quantity,
          })),
        }),
      });

      const data = (await response.json()) as {
        ok?: boolean;
        error?: string;
        orderId?: string;
        total?: number;
        deliveryFee?: number;
        subtotal?: number;
        createdAt?: string;
      };

      if (!response.ok || !data.ok) {
        setErrorMsg(
          data.error ||
            "Buyurtmani Telegram kanalga yuborishda xatolik yuz berdi.",
        );
        return;
      }

      setReceipt({
        orderId: data.orderId || 'OG-1001',
        total: data.total ?? total,
        deliveryFee: data.deliveryFee ?? deliveryFee,
        subtotal: data.subtotal ?? subtotal,
        createdAt: data.createdAt || '',
        customerName: customerName.trim(),
        deliveryType,
      });
      onClearCart();
      setComment('');
    } catch {
      setErrorMsg(
        "Tarmoq xatoligi yuz berdi. Internet aloqasini tekshirib qayta urining.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetReceiptAndClose = () => {
    setReceipt(null);
    setErrorMsg(null);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-zinc-950/65 backdrop-blur-xs"
      role="dialog"
      aria-modal="true"
      aria-labelledby="cart-drawer-title"
      onClick={onClose}
    >
      <aside
        className="w-full max-w-md bg-white h-full flex flex-col shadow-2xl border-l border-zinc-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-6 py-4 border-b border-zinc-200 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <ShoppingBag className="w-5 h-5 text-zinc-950" aria-hidden="true" />
            <h2
              id="cart-drawer-title"
              className="font-display text-lg font-bold text-zinc-950"
            >
              Buyurtma savati
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Savatni yopish"
            className="w-10 h-10 rounded-lg text-zinc-600 hover:bg-zinc-100 hover:text-zinc-950 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-5">
          {receipt ? (
            <div className="py-6 flex flex-col items-start">
              <div className="w-12 h-12 rounded-xl bg-yellow-400 text-zinc-950 flex items-center justify-center mb-4">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <span className="text-xs font-semibold text-zinc-500">
                Buyurtma raqami · #{receipt.orderId}
              </span>
              <h3 className="mt-1 font-display text-2xl font-bold text-zinc-950">
                Buyurtmangiz qabul qilindi
              </h3>
              <p className="mt-2 text-sm text-zinc-600 leading-relaxed">
                Hurmatli <span className="font-semibold text-zinc-950">{receipt.customerName}</span>,
                buyurtmangiz oshxonamizning Telegram kanaliga muvaffaqiyatli yuborildi. Operatorimiz tez orada bog'lanadi.
              </p>

              <div className="mt-6 w-full bg-zinc-50 border border-zinc-200 rounded-xl p-4 space-y-2.5 text-sm">
                <div className="flex justify-between text-zinc-600">
                  <span>Usul</span>
                  <span className="font-medium text-zinc-950">
                    {receipt.deliveryType === 'pickup'
                      ? 'Olib ketish'
                      : 'Yetkazib berish'}
                  </span>
                </div>
                <div className="flex justify-between text-zinc-600">
                  <span>Taomlar qiymati</span>
                  <span className="tabular-nums font-medium text-zinc-950">
                    {formatUzs(receipt.subtotal)}
                  </span>
                </div>
                <div className="flex justify-between text-zinc-600">
                  <span>Yetkazib berish</span>
                  <span className="tabular-nums font-medium text-zinc-950">
                    {receipt.deliveryFee === 0
                      ? 'Bepul'
                      : formatUzs(receipt.deliveryFee)}
                  </span>
                </div>
                <div className="pt-2.5 border-t border-zinc-200 flex justify-between font-display text-base font-bold text-zinc-950">
                  <span>Jami to'lov</span>
                  <span className="tabular-nums">{formatUzs(receipt.total)}</span>
                </div>
              </div>

              <button
                type="button"
                onClick={resetReceiptAndClose}
                className="mt-6 w-full min-h-[44px] px-5 py-3 rounded-lg bg-zinc-950 text-white text-sm font-bold hover:bg-zinc-800 transition-colors cursor-pointer"
              >
                Menyuga qaytish
              </button>
            </div>
          ) : items.length === 0 ? (
            <div className="py-16 text-center">
              <div className="w-12 h-12 rounded-xl bg-zinc-100 text-zinc-500 flex items-center justify-center mx-auto mb-4">
                <ShoppingBag className="w-6 h-6" />
              </div>
              <h3 className="font-display text-lg font-bold text-zinc-950">
                Savatingiz hozircha bo'sh
              </h3>
              <p className="mt-1.5 text-sm text-zinc-600 max-w-xs mx-auto">
                Menyudan issiq burger, lavash yoki kombo tanlab buyurtma bering.
              </p>
              <button
                type="button"
                onClick={onClose}
                className="mt-5 px-5 py-2.5 min-h-[40px] rounded-lg bg-yellow-400 text-zinc-950 text-sm font-bold hover:bg-yellow-300 transition-colors cursor-pointer"
              >
                Menyuni ko'rish
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-semibold text-zinc-500">
                    Tanlangan taomlar ({items.reduce((s, i) => s + i.quantity, 0)})
                  </span>
                  <button
                    type="button"
                    onClick={onClearCart}
                    className="text-xs font-medium text-zinc-500 hover:text-zinc-950 underline underline-offset-4 cursor-pointer"
                  >
                    Tozalash
                  </button>
                </div>

                <ul className="divide-y divide-zinc-200 border-y border-zinc-200">
                  {items.map((item) => (
                    <li key={item.key} className="py-3.5 flex gap-3.5">
                      <div className="w-16 h-16 rounded-lg overflow-hidden bg-zinc-950 shrink-0">
                        <ResilientImage
                          src={item.image}
                          alt={item.name}
                          fallbackTitle={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <p className="text-sm font-bold text-zinc-950 truncate">
                              {item.name}
                            </p>
                            <p className="text-xs text-zinc-500 truncate">
                              {item.variantLabel}
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() => onRemoveItem(item.key)}
                            aria-label={`${item.name} ni o'chirish`}
                            className="p-1.5 text-zinc-400 hover:text-zinc-950 transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        <div className="mt-2.5 flex items-center justify-between gap-2">
                          <span className="text-sm font-bold text-zinc-950 tabular-nums">
                            {formatUzs(item.unitPrice * item.quantity)}
                          </span>

                          <div className="inline-flex items-center rounded-lg border border-zinc-200 bg-zinc-50">
                            <button
                              type="button"
                              onClick={() => onUpdateQuantity(item.key, -1)}
                              aria-label="Kamaytirish"
                              className="w-8 h-8 flex items-center justify-center text-zinc-800 hover:bg-zinc-200/70 rounded-l-lg cursor-pointer"
                            >
                              <Minus className="w-3.5 h-3.5" />
                            </button>
                            <span className="px-2 text-xs font-bold tabular-nums min-w-[2ch] text-center">
                              {item.quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() => onUpdateQuantity(item.key, 1)}
                              aria-label="Oshirish"
                              className="w-8 h-8 flex items-center justify-center text-zinc-800 hover:bg-zinc-200/70 rounded-r-lg cursor-pointer"
                            >
                              <Plus className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>

                {deliveryType === 'delivery' && (
                  <p className="mt-3 text-xs text-zinc-600">
                    {remainingForFreeDelivery > 0 ? (
                      <>
                        Bepul yetkazish uchun yana{' '}
                        <span className="font-bold text-zinc-950 tabular-nums">
                          {formatUzs(remainingForFreeDelivery)}
                        </span>{' '}
                        qo'shing.
                      </>
                    ) : (
                      <span className="font-semibold text-zinc-950">
                        Tabriklaymiz, yetkazib berish bepul!
                      </span>
                    )}
                  </p>
                )}
              </div>

              <form id="checkout-form" onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <span className="block text-xs font-semibold text-zinc-700 mb-1.5">
                    Buyurtma usuli
                  </span>
                  <div className="grid grid-cols-2 gap-1.5 p-1 bg-zinc-100 rounded-lg">
                    <button
                      type="button"
                      onClick={() => setDeliveryType('delivery')}
                      className={`py-2 px-3 text-xs font-semibold rounded-md transition-colors cursor-pointer whitespace-nowrap ${
                        deliveryType === 'delivery'
                          ? 'bg-zinc-950 text-white'
                          : 'text-zinc-600 hover:text-zinc-950'
                      }`}
                    >
                      Yetkazib berish
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeliveryType('pickup')}
                      className={`py-2 px-3 text-xs font-semibold rounded-md transition-colors cursor-pointer whitespace-nowrap ${
                        deliveryType === 'pickup'
                          ? 'bg-zinc-950 text-white'
                          : 'text-zinc-600 hover:text-zinc-950'
                      }`}
                    >
                      Olib ketish
                    </button>
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="customer-name"
                    className="block text-xs font-semibold text-zinc-700 mb-1"
                  >
                    Ismingiz
                  </label>
                  <input
                    id="customer-name"
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="Masalan: Jasur"
                    className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-zinc-300 bg-white text-zinc-950 placeholder:text-zinc-400 focus:outline-none focus:border-zinc-950"
                  />
                </div>

                <div>
                  <label
                    htmlFor="customer-phone"
                    className="block text-xs font-semibold text-zinc-700 mb-1"
                  >
                    Telefon raqamingiz
                  </label>
                  <input
                    id="customer-phone"
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+998 90 123 45 67"
                    className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-zinc-300 bg-white text-zinc-950 placeholder:text-zinc-400 focus:outline-none focus:border-zinc-950 tabular-nums"
                  />
                </div>

                {deliveryType === 'delivery' && (
                  <div>
                    <label
                      htmlFor="customer-address"
                      className="block text-xs font-semibold text-zinc-700 mb-1"
                    >
                      Yetkazib berish manzili
                    </label>
                    <input
                      id="customer-address"
                      type="text"
                      required
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="Tuman, ko'cha, uy va xonadon"
                      className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-zinc-300 bg-white text-zinc-950 placeholder:text-zinc-400 focus:outline-none focus:border-zinc-950"
                    />
                  </div>
                )}

                <div>
                  <span className="block text-xs font-semibold text-zinc-700 mb-1.5">
                    To'lov turi
                  </span>
                  <div className="grid grid-cols-3 gap-1.5">
                    {(
                      [
                        {id: 'cash', label: 'Naqd pul'},
                        {id: 'click_payme', label: 'Click / Payme'},
                        {id: 'card', label: 'Karta'},
                      ] as const
                    ).map((option) => (
                      <button
                        key={option.id}
                        type="button"
                        onClick={() => setPaymentMethod(option.id)}
                        className={`py-2 px-2 text-xs font-semibold rounded-lg border transition-colors cursor-pointer whitespace-nowrap ${
                          paymentMethod === option.id
                            ? 'border-zinc-950 bg-zinc-950 text-yellow-400'
                            : 'border-zinc-200 bg-white text-zinc-700 hover:border-zinc-400'
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="order-comment"
                    className="block text-xs font-semibold text-zinc-700 mb-1"
                  >
                    Qo'shimcha izoh (ixtiyoriy)
                  </label>
                  <textarea
                    id="order-comment"
                    rows={2}
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Masalan: piyozsiz, achchiq sous bilan"
                    className="w-full px-3.5 py-2 text-sm rounded-lg border border-zinc-300 bg-white text-zinc-950 placeholder:text-zinc-400 focus:outline-none focus:border-zinc-950 resize-none"
                  />
                </div>

                {errorMsg && (
                  <div
                    role="alert"
                    className="flex items-start gap-2.5 p-3 rounded-lg bg-zinc-950 text-white text-xs leading-relaxed"
                  >
                    <AlertCircle className="w-4 h-4 text-yellow-400 shrink-0 mt-0.5" />
                    <span>{errorMsg}</span>
                  </div>
                )}
              </form>
            </div>
          )}
        </div>

        {!receipt && items.length > 0 && (
          <div className="px-6 py-4 border-t border-zinc-200 bg-zinc-50 space-y-3">
            <div className="space-y-1 text-xs text-zinc-600">
              <div className="flex justify-between">
                <span>Taomlar</span>
                <span className="tabular-nums font-medium text-zinc-900">
                  {formatUzs(subtotal)}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Yetkazib berish</span>
                <span className="tabular-nums font-medium text-zinc-900">
                  {deliveryFee === 0 ? 'Bepul' : formatUzs(deliveryFee)}
                </span>
              </div>
              <div className="pt-1.5 flex justify-between font-display text-base font-bold text-zinc-950">
                <span>Jami</span>
                <span className="tabular-nums">{formatUzs(total)}</span>
              </div>
            </div>

            <button
              type="submit"
              form="checkout-form"
              disabled={isSubmitting}
              className="w-full min-h-[46px] px-5 py-3 rounded-lg bg-yellow-400 text-zinc-950 text-sm font-bold hover:bg-yellow-300 disabled:opacity-60 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Telegramga yuborilmoqda...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Buyurtmani Telegramga yuborish</span>
                </>
              )}
            </button>
          </div>
        )}
      </aside>
    </div>
  );
}
