import 'dotenv/config';
import express, {type Request, type Response} from 'express';
import fs from 'fs';
import path from 'path';
import {fileURLToPath} from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = Number(process.env.PORT) || 3000;
const IS_PROD = process.env.NODE_ENV === 'production';

const TELEGRAM_BOT_TOKEN =
  process.env.TELEGRAM_BOT_TOKEN ||
  '9226652506:AAGRSpLM4K3ig_gIdBx07zT4py3V1f876YM';
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID || '-1004276126156';

interface OrderItemPayload {
  id: string;
  name: string;
  variant?: string;
  price: number;
  quantity: number;
}

interface OrderPayload {
  customerName: string;
  phone: string;
  deliveryType: 'delivery' | 'pickup';
  address?: string;
  paymentMethod: 'cash' | 'card' | 'click_payme';
  comment?: string;
  items: OrderItemPayload[];
  deliveryFee: number;
  subtotal: number;
  total: number;
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function formatPriceUzs(amount: number): string {
  return `${Math.round(amount).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ')} so'm`;
}

function generateOrderCode(): string {
  const num = Math.floor(1000 + Math.random() * 9000);
  return `OG-${num}`;
}

async function startServer() {
  const app = express();
  app.use(express.json({limit: '1mb'}));

  app.get('/api/health', (_req: Request, res: Response) => {
    res.json({status: 'ok'});
  });

  app.post('/api/orders', async (req: Request, res: Response) => {
    try {
      const body = req.body as Partial<OrderPayload>;

      const customerName = String(body.customerName || '').trim();
      const phone = String(body.phone || '').trim();
      const deliveryType =
        body.deliveryType === 'pickup' ? 'pickup' : 'delivery';
      const address = String(body.address || '').trim();
      const paymentMethod = body.paymentMethod || 'cash';
      const comment = String(body.comment || '').trim();
      const items = Array.isArray(body.items) ? body.items : [];

      if (customerName.length < 2) {
        res.status(400).json({
          ok: false,
          error: "Iltimos, ismingizni to'liq kiriting.",
        });
        return;
      }

      if (phone.replace(/\D/g, '').length < 9) {
        res.status(400).json({
          ok: false,
          error: "Iltimos, to'g'ri telefon raqamini kiriting.",
        });
        return;
      }

      if (deliveryType === 'delivery' && address.length < 4) {
        res.status(400).json({
          ok: false,
          error: "Yetkazib berish manzilini aniqroq kiriting.",
        });
        return;
      }

      if (items.length === 0) {
        res.status(400).json({
          ok: false,
          error: "Savat bo'sh. Kamida bitta mahsulot tanlang.",
        });
        return;
      }

      let computedSubtotal = 0;
      const sanitizedItems: OrderItemPayload[] = [];
      for (const item of items) {
        const qty = Math.max(1, Math.min(50, Number(item.quantity) || 1));
        const price = Math.max(0, Number(item.price) || 0);
        computedSubtotal += qty * price;
        sanitizedItems.push({
          id: String(item.id || ''),
          name: String(item.name || 'Mahsulot'),
          variant: item.variant ? String(item.variant) : undefined,
          price,
          quantity: qty,
        });
      }

      const computedDeliveryFee =
        deliveryType === 'pickup' || computedSubtotal >= 120000 ? 0 : 15000;
      const computedTotal = computedSubtotal + computedDeliveryFee;
      const orderId = generateOrderCode();

      const paymentLabels: Record<string, string> = {
        cash: 'Naqd pul',
        card: 'Karta orqali (Terminal)',
        click_payme: 'Click / Payme',
      };

      const itemLines = sanitizedItems
        .map((item, idx) => {
          const variantText = item.variant
            ? ` (${escapeHtml(item.variant)})`
            : '';
          const lineTotal = formatPriceUzs(item.price * item.quantity);
          return `${idx + 1}. <b>${escapeHtml(item.name)}</b>${variantText} × ${item.quantity} — ${lineTotal}`;
        })
        .join('\n');

      const deliveryLabel =
        deliveryType === 'pickup' ? 'Olib ketish (Self-pickup)' : 'Yetkazib berish';

      const timestamp = new Date().toLocaleString('uz-UZ', {
        timeZone: 'Asia/Tashkent',
        hour12: false,
      });

      const messageLines = [
        `🍔 <b>YANGI BUYURTMA #${escapeHtml(orderId)}</b>`,
        `🕒 <i>${escapeHtml(timestamp)}</i>`,
        ``,
        `👤 <b>Mijoz:</b> ${escapeHtml(customerName)}`,
        `📞 <b>Telefon:</b> ${escapeHtml(phone)}`,
        `🚚 <b>Usul:</b> ${deliveryLabel}`,
      ];

      if (deliveryType === 'delivery') {
        messageLines.push(`📍 <b>Manzil:</b> ${escapeHtml(address)}`);
      }

      messageLines.push(
        `💳 <b>To'lov:</b> ${paymentLabels[paymentMethod] || 'Naqd pul'}`,
      );

      if (comment) {
        messageLines.push(`📝 <b>Izoh:</b> ${escapeHtml(comment)}`);
      }

      messageLines.push(
        ``,
        `🧾 <b>Buyurtma tarkibi:</b>`,
        itemLines,
        ``,
        `📦 <b>Taomlar:</b> ${formatPriceUzs(computedSubtotal)}`,
        `🛵 <b>Yetkazish:</b> ${
          computedDeliveryFee === 0 ? 'Bepul' : formatPriceUzs(computedDeliveryFee)
        }`,
        `💰 <b>JAMI TO'LOV:</b> <b>${formatPriceUzs(computedTotal)}</b>`,
      );

      const telegramUrl = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
      const tgResponse = await fetch(telegramUrl, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          chat_id: TELEGRAM_CHAT_ID,
          text: messageLines.join('\n'),
          parse_mode: 'HTML',
        }),
      });

      const tgData = (await tgResponse.json()) as {
        ok?: boolean;
        description?: string;
        result?: {message_id?: number};
      };

      if (!tgResponse.ok || !tgData.ok) {
        res.status(502).json({
          ok: false,
          error:
            tgData.description ||
            "Telegram kanalga yuborishda xatolik yuz berdi. Bot kanalga admin qilib qo'shilganligini tekshiring.",
        });
        return;
      }

      res.json({
        ok: true,
        orderId,
        messageId: tgData.result?.message_id ?? null,
        total: computedTotal,
        deliveryFee: computedDeliveryFee,
        subtotal: computedSubtotal,
        createdAt: timestamp,
      });
    } catch (err) {
      const msg =
        err instanceof Error
          ? err.message
          : "Serverda kutilmagan xatolik yuz berdi.";
      res.status(500).json({
        ok: false,
        error: `Buyurtmani yuborishda xatolik: ${msg}`,
      });
    }
  });

  if (!IS_PROD) {
    const {createServer: createViteServer} = await import('vite');
    const vite = await createViteServer({
      server: {middlewareMode: true},
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distDir = path.resolve(__dirname, 'dist');
    app.use(express.static(distDir));
    app.get('*', (_req: Request, res: Response) => {
      const indexFile = path.join(distDir, 'index.html');
      if (fs.existsSync(indexFile)) {
        res.sendFile(indexFile);
      } else {
        res.status(404).send('Build files not found.');
      }
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Oltin Grill server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
