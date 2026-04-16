import type { Product, Category } from "./types";

// Helper to build local image path (served from Next.js public folder)
function img(n: number): string {
  return `/images/img${n}.jpeg`;
}

// All available image numbers (img37 and img43 don't exist)
const IMAGE_NUMBERS = [
  1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
  21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 38, 39,
  40, 41, 42, 44,
];

// Full pool of all backend images
export const IMAGE_POOL = IMAGE_NUMBERS.map((n) => img(n));

// Video pool (local + Cloudinary)
export const VIDEO_POOL = [
  "/images/video1.mp4",
  "/images/video2.mp4",
  "/images/video3.mp4",
  "/images/video4.mp4",
  "https://res.cloudinary.com/dfixnhqn0/video/upload/q_auto/f_auto/v1775306360/P14SJEsZQjk5AQRpYw___8_rp3zeo.mp4",
];

// Hero fallback image
export const HERO_FALLBACK = "/images/hero-2.webp";

// Shuffle utility (Fisher-Yates)
function shuffle<T>(arr: T[]): T[] {
  const s = [...arr];
  for (let i = s.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [s[i], s[j]] = [s[j], s[i]];
  }
  return s;
}

// Get N random unique images from the pool
export function getRandomImages(count: number): string[] {
  return shuffle(IMAGE_POOL).slice(0, count);
}

// Get a single random image
export function getRandomImage(): string {
  return IMAGE_POOL[Math.floor(Math.random() * IMAGE_POOL.length)];
}

// Get a random video URL
export function getRandomVideo(): string {
  return VIDEO_POOL[Math.floor(Math.random() * VIDEO_POOL.length)];
}

export const categories: Category[] = [
  {
    id: "1",
    name: "Premium Biscuits",
    slug: "premium-biscuits",
    image: img(1),
    description: "Finest quality biscuits from top international brands",
    productCount: 48,
  },
  {
    id: "2",
    name: "Chocolate Candies",
    slug: "chocolate-candies",
    image: img(3),
    description: "Rich, smooth chocolate candies for every occasion",
    productCount: 36,
  },
  {
    id: "3",
    name: "Hard Candies",
    slug: "hard-candies",
    image: img(5),
    description: "Classic hard candies in vibrant flavors",
    productCount: 28,
  },
  {
    id: "4",
    name: "Gummy & Jellies",
    slug: "gummy-jellies",
    image: img(7),
    description: "Fun chewy gummies and jelly treats",
    productCount: 32,
  },
  {
    id: "5",
    name: "Cream Wafers",
    slug: "cream-wafers",
    image: img(9),
    description: "Crispy wafers with creamy fillings",
    productCount: 22,
  },
  {
    id: "6",
    name: "Cookies & Crackers",
    slug: "cookies-crackers",
    image: img(11),
    description: "Assorted cookies and savory crackers",
    productCount: 40,
  },
];

export const products: Product[] = [
  {
    id: "1",
    name: "Royal Danish Butter Cookies",
    slug: "royal-danish-butter-cookies",
    description: "Authentic Danish butter cookies made with premium ingredients. Each tin contains an assortment of 7 unique cookie varieties.",
    price: 42.0,
    comparePrice: 48.0,
    images: [img(1), img(2)],
    category: "Premium Biscuits",
    brand: "Royal Danish",
    moq: 24,
    stock: 480,
    unit: "tins",
    ingredients: "Wheat flour, butter (26%), sugar, coconut, eggs, salt, vanilla.",
    packaging: "454g tin. Master carton: 12 tins per case.",
    deliveryInfo: "Standard delivery: 3-5 business days. Express: 1-2 business days.",
    featured: true,
  },
  {
    id: "2",
    name: "Belgian Dark Chocolate Truffles",
    slug: "belgian-dark-chocolate-truffles",
    description: "Luxurious dark chocolate truffles crafted with finest Belgian cocoa. Perfect for gifting and retail display.",
    price: 68.0,
    comparePrice: 78.0,
    images: [img(3), img(4)],
    category: "Chocolate Candies",
    brand: "Belcolade",
    moq: 12,
    stock: 240,
    unit: "boxes",
    ingredients: "Cocoa mass, sugar, cocoa butter, cream powder, vanilla extract.",
    packaging: "250g box. Master carton: 24 boxes per case.",
    deliveryInfo: "Temperature-controlled delivery. Standard: 3-5 business days.",
    featured: true,
  },
  {
    id: "3",
    name: "Japanese Matcha KitKat",
    slug: "japanese-matcha-kitkat",
    description: "Authentic Japanese Matcha flavored KitKat bars. A bestseller with exotic appeal for specialty retail stores.",
    price: 55.0,
    images: [img(5), img(6)],
    category: "Chocolate Candies",
    brand: "Nestle Japan",
    moq: 36,
    stock: 600,
    unit: "packs",
    ingredients: "Sugar, wheat flour, matcha green tea powder, cocoa butter, whole milk powder.",
    packaging: "12-piece pack. Master carton: 24 packs per case.",
    deliveryInfo: "Import item. Standard delivery: 5-7 business days.",
    featured: true,
  },
  {
    id: "4",
    name: "Haribo Gold Bears Mega Pack",
    slug: "haribo-gold-bears-mega",
    description: "The world's favourite gummy bears in bulk wholesale packs. Six fruity flavors loved by all ages.",
    price: 38.0,
    images: [img(7), img(8)],
    category: "Gummy & Jellies",
    brand: "Haribo",
    moq: 48,
    stock: 960,
    unit: "bags",
    ingredients: "Glucose syrup, sugar, gelatin, fruit juice concentrates, citric acid.",
    packaging: "500g bag. Master carton: 12 bags per case.",
    deliveryInfo: "Standard delivery: 3-5 business days.",
    featured: true,
  },
  {
    id: "5",
    name: "Lotus Biscoff Original",
    slug: "lotus-biscoff-original",
    description: "The iconic caramelised biscuit. Perfect for coffee accompaniment and retail. Individually wrapped.",
    price: 34.0,
    comparePrice: 39.0,
    images: [img(9), img(10)],
    category: "Premium Biscuits",
    brand: "Lotus",
    moq: 30,
    stock: 750,
    unit: "packs",
    ingredients: "Wheat flour, sugar, vegetable oils, candy sugar syrup, soy flour, cinnamon.",
    packaging: "250g pack (32 biscuits). Master carton: 10 packs per case.",
    deliveryInfo: "Standard delivery: 3-5 business days.",
    featured: true,
  },
  {
    id: "6",
    name: "Werther's Original Caramels",
    slug: "werthers-original-caramels",
    description: "Classic creamy caramel candies. An timeless favourite with premium positioning for retail.",
    price: 29.0,
    images: [img(11), img(12)],
    category: "Hard Candies",
    brand: "Werther's",
    moq: 24,
    stock: 480,
    unit: "bags",
    ingredients: "Sugar, glucose syrup, cream, butter, salt, emulsifier.",
    packaging: "300g bag. Master carton: 12 bags per case.",
    deliveryInfo: "Standard delivery: 3-5 business days.",
    featured: true,
  },
  {
    id: "7",
    name: "Oreo Original Family Pack",
    slug: "oreo-original-family-pack",
    description: "America's favourite cookie in bulk wholesale packs. Chocolate wafers with vanilla cream filling.",
    price: 26.0,
    images: [img(13), img(14)],
    category: "Cookies & Crackers",
    brand: "Oreo",
    moq: 36,
    stock: 0,
    unit: "packs",
    ingredients: "Wheat flour, sugar, vegetable oil, cocoa powder, vanilla flavouring.",
    packaging: "396g pack. Master carton: 12 packs per case.",
    deliveryInfo: "Currently out of stock. Expected restock: 2 weeks.",
  },
  {
    id: "8",
    name: "Crispy Cream Wafer Rolls",
    slug: "crispy-cream-wafer-rolls",
    description: "Delicate rolled wafers filled with rich vanilla cream. Light, crispy texture perfect for tea time.",
    price: 22.0,
    images: [img(15), img(16)],
    category: "Cream Wafers",
    brand: "SweetRoll",
    moq: 48,
    stock: 320,
    unit: "packs",
    ingredients: "Wheat flour, sugar, palm oil, cream powder, vanilla, lecithin.",
    packaging: "200g pack. Master carton: 24 packs per case.",
    deliveryInfo: "Standard delivery: 3-5 business days.",
  },
];

export const brands = ["Royal Danish", "Belcolade", "Nestle Japan", "Haribo", "Lotus", "Werther's", "Oreo", "SweetRoll"];
