export type MenuCategory =
  | 'Barchasi'
  | 'Burgerlar'
  | 'Lavash'
  | 'Tovuq va Fri'
  | 'Kombo'
  | 'Ichimliklar';

export interface ProductVariant {
  id: string;
  label: string;
  priceDelta: number;
}

export interface MenuItem {
  id: string;
  name: string;
  category: Exclude<MenuCategory, 'Barchasi'>;
  weight: string;
  price: number;
  description: string;
  image: string;
  highlight?: string;
  variants: ProductVariant[];
}

export interface CartItem {
  key: string;
  menuItemId: string;
  name: string;
  image: string;
  variantLabel: string;
  unitPrice: number;
  quantity: number;
}

export const CATEGORIES: MenuCategory[] = [
  'Barchasi',
  'Burgerlar',
  'Lavash',
  'Tovuq va Fri',
  'Kombo',
  'Ichimliklar',
];

export const IMAGES = {
  hero: '/src/assets/images/hero_smash_burger_feast_1794909496575.jpg',
  doubleBurger: '/src/assets/images/burger_double_cheddar_1794909495603.jpg',
  chickenBurger: '/src/assets/images/burger_crispy_chicken_1794909496480.jpg',
  lavashGrill: '/src/assets/images/lavash_beef_grill_1794909496983.jpg',
  tendersFries: '/src/assets/images/chicken_tenders_fries_1794909497550.jpg',
  drinks: '/src/assets/images/drinks_craft_lemonade_1794909498276.jpg',
  kitchen: '/src/assets/images/kitchen_open_grill_1794909498632.jpg',
};

export const MENU_ITEMS: MenuItem[] = [
  {
    id: 'oltin-double-smash',
    name: 'Oltin Double Smash',
    category: 'Burgerlar',
    weight: '340 g',
    price: 46000,
    description:
      "Ikki qavatli marmar mol go'shti, eritilgan chedder pishlog'i, tuzlangan bodring va maxsus firma sousi.",
    image: IMAGES.doubleBurger,
    highlight: 'Ommabop',
    variants: [
      {id: 'std', label: 'Standart (2x kotlet)', priceDelta: 0},
      {id: 'triple', label: 'Triple (3x kotlet)', priceDelta: 14000},
    ],
  },
  {
    id: 'crispy-chicken-burger',
    name: 'Crispy Chicken Burger',
    category: 'Burgerlar',
    weight: '280 g',
    price: 38000,
    description:
      "Qarsildoq tovuq filesi, chedder pishlog'i, yangi salat bargi va sariq xantal sousi brioch bulochkada.",
    image: IMAGES.chickenBurger,
    highlight: 'Ommabop',
    variants: [
      {id: 'classic', label: 'Klassik', priceDelta: 0},
      {id: 'spicy', label: 'Achchiq Jalapeno', priceDelta: 3000},
    ],
  },
  {
    id: 'klassik-cheeseburger',
    name: 'Klassik Cheeseburger',
    category: 'Burgerlar',
    weight: '230 g',
    price: 32000,
    description:
      "Yumshoq brioch bulochkada shirali mol go'shti kotleti, chedder va karamellashgan piyoz.",
    image: IMAGES.doubleBurger,
    variants: [
      {id: 'std', label: 'Standart', priceDelta: 0},
      {id: 'extra-cheese', label: 'Qo‘shimcha chedder', priceDelta: 5000},
    ],
  },
  {
    id: 'mol-goshtli-lavash',
    name: "Mol Go'shtli Gril Lavash",
    category: 'Lavash',
    weight: '360 g',
    price: 39000,
    description:
      "Ochiq grilda pishirilgan mol go'shti, yangi pomidor, ko'katlar va sarimsoqli qaymoq sousi.",
    image: IMAGES.lavashGrill,
    highlight: 'Yangi',
    variants: [
      {id: 'regular', label: 'Oddiy', priceDelta: 0},
      {id: 'cheese', label: 'Pishloqli', priceDelta: 5000},
    ],
  },
  {
    id: 'tovuqli-tandem-lavash',
    name: 'Tovuqli Tandem Lavash',
    category: 'Lavash',
    weight: '340 g',
    price: 34000,
    description:
      "Gril tovuq bo'laklari, qarsildoq kartoshka fri, yangi bodring va firma sousi.",
    image: IMAGES.lavashGrill,
    variants: [
      {id: 'regular', label: 'Oddiy', priceDelta: 0},
      {id: 'cheese', label: 'Pishloqli', priceDelta: 5000},
    ],
  },
  {
    id: 'tovuq-strips-fri',
    name: 'Qarsildoq Tovuq Strips + Fri',
    category: 'Tovuq va Fri',
    weight: '320 g',
    price: 37000,
    description:
      "5 dona oltinrang tovuq filesi bo'laklari, ziravorli kartoshka fri va iliq chedder sousi.",
    image: IMAGES.tendersFries,
    highlight: 'Ommabop',
    variants: [
      {id: '5pcs', label: '5 dona strips + fri', priceDelta: 0},
      {id: '8pcs', label: '8 dona strips + katta fri', priceDelta: 15000},
    ],
  },
  {
    id: 'chedder-kartoshka-fri',
    name: 'Chedder Kartoshka Fri',
    category: 'Tovuq va Fri',
    weight: '180 g',
    price: 22000,
    description:
      "Qarsildoq oltin kartoshka fri va yonida iliq eritilgan chedder pishloq sousi.",
    image: IMAGES.tendersFries,
    variants: [
      {id: 'medium', label: "O'rtacha (180 g)", priceDelta: 0},
      {id: 'large', label: 'Katta (260 g)', priceDelta: 7000},
    ],
  },
  {
    id: 'oltin-kombo-1',
    name: 'Oltin Kombo №1',
    category: 'Kombo',
    weight: '680 g',
    price: 69000,
    description:
      "Oltin Double Smash burger + o'rtacha kartoshka fri + 0.45L muzdek kola yoki limonad.",
    image: IMAGES.hero,
    highlight: 'Tejamkor',
    variants: [
      {id: 'cola', label: 'Muzdek Kola bilan', priceDelta: 0},
      {id: 'lemonade', label: 'Sitrus Limonad bilan', priceDelta: 4000},
    ],
  },
  {
    id: 'dostlar-kombo',
    name: "Do'stlar Kombo Seti",
    category: 'Kombo',
    weight: '1 150 g',
    price: 118000,
    description:
      "2 ta Gril Lavash, qarsildoq tovuq strips, katta kartoshka fri, 2 ta ichimlik va 2 xil sous.",
    image: IMAGES.lavashGrill,
    variants: [
      {id: 'beef', label: "Mol go'shtli lavashlar", priceDelta: 0},
      {id: 'mixed', label: 'Aralash (Mol + Tovuq)', priceDelta: 0},
    ],
  },
  {
    id: 'sitrus-mango-limonad',
    name: 'Sitrus-Mango Limonad',
    category: 'Ichimliklar',
    weight: '450 ml',
    price: 18000,
    description:
      "Yangi limon, mango pyuresi, yalpiz bargi va muz kubiklari bilan tetiklashtiruvchi ichimlik.",
    image: IMAGES.drinks,
    variants: [
      {id: '450ml', label: '450 ml', priceDelta: 0},
      {id: '700ml', label: '700 ml', priceDelta: 6000},
    ],
  },
  {
    id: 'muzdek-kola',
    name: 'Muzdek Kola',
    category: 'Ichimliklar',
    weight: '450 ml',
    price: 12000,
    description:
      "Muz va laym bo'lagi bilan tortiladigan klassik gazlangan salqin ichimlik.",
    image: IMAGES.drinks,
    variants: [
      {id: '450ml', label: '450 ml', priceDelta: 0},
      {id: '700ml', label: '700 ml', priceDelta: 4000},
    ],
  },
];

export function formatUzs(amount: number): string {
  return `${Math.round(amount).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ')} so'm`;
}
