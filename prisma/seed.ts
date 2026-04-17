import { config } from "dotenv";
config({ path: ".env.local" });
config({ path: ".env" });

async function main() {
  const { PrismaClient } = await import("../src/generated/prisma/client.js");
  const { neonConfig } = await import("@neondatabase/serverless");
  const { PrismaNeon } = await import("@prisma/adapter-neon");
  const bcryptMod = await import("bcryptjs");
  const bcrypt = bcryptMod.default;
  const ws = (await import("ws")).default;

  neonConfig.webSocketConstructor = ws;

  const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL });
  const prisma = new PrismaClient({ adapter } as never);

  console.log("Seeding database...");

  // Clear existing data in order
  await prisma.$executeRawUnsafe(`TRUNCATE TABLE invoices, payments, order_items, orders, pricing_rules, addresses, product_images, products, categories, users, customer_groups, stock_logs, coupons, suppliers, purchase_order_items, purchase_orders, notifications, activity_logs, settings, role_permissions, admin_user_roles, roles, permissions RESTART IDENTITY CASCADE`);

  // ── Customer Groups ──
  await prisma.customerGroup.createMany({
    data: [
      { id: 1, name: "Retail", slug: "retail", description: "Standard retail customers", discountPct: 0.0 },
      { id: 2, name: "Wholesale", slug: "wholesale", description: "Verified wholesale buyers — bulk pricing", discountPct: 15.0 },
      { id: 3, name: "Distributor", slug: "distributor", description: "Regional distributors — best pricing tier", discountPct: 25.0 },
    ],
  });

  // ── Users (password: admin123) ──
  const hash = await bcrypt.hash("admin123", 12);

  await prisma.user.createMany({
    data: [
      { id: 1, name: "Admin User", email: "admin@sweetwholesale.com", phone: "+15551234567", password: hash, role: "admin", status: "approved", businessName: "SweetWholesale HQ", emailVerifiedAt: new Date() },
      { id: 2, name: "Ahmed Grocery", email: "ahmed@example.com", phone: "+15559876543", password: hash, role: "customer", status: "approved", customerGroupId: 2, businessName: "Ahmed Mini Mart" },
      { id: 3, name: "Sara Distribution", email: "sara@example.com", phone: "+15551112233", password: hash, role: "customer", status: "approved", customerGroupId: 3, businessName: "Sara Dist. Co." },
      { id: 4, name: "Pending Shop", email: "pending@example.com", phone: "+15554445566", password: hash, role: "customer", status: "pending", businessName: "New Shop LLC" },
    ],
  });

  // ── Categories ──
  await prisma.category.createMany({
    data: [
      { id: 1, name: "Premium Biscuits", slug: "premium-biscuits", image: "/images/img25.jpeg", sortOrder: 1 },
      { id: 2, name: "Chocolate Candies", slug: "chocolate-candies", image: "/images/img26.jpeg", sortOrder: 2 },
      { id: 3, name: "Hard Candies", slug: "hard-candies", image: "/images/img27.jpeg", sortOrder: 3 },
      { id: 4, name: "Gummy & Jellies", slug: "gummy-jellies", image: "/images/img28.jpeg", sortOrder: 4 },
      { id: 5, name: "Cream Wafers", slug: "cream-wafers", image: "/images/img29.jpeg", sortOrder: 5 },
      { id: 6, name: "Cookies & Crackers", slug: "cookies-crackers", image: "/images/img30.jpeg", sortOrder: 6 },
      { id: 7, name: "Snack Packs", slug: "snack-packs", image: "/images/img31.jpeg", sortOrder: 7 },
      { id: 8, name: "Gift Packs", slug: "gift-packs", image: "/images/img32.jpeg", sortOrder: 8 },
      // Sub-categories
      { id: 9, parentId: 1, name: "Butter Biscuits", slug: "butter-biscuits", sortOrder: 1 },
      { id: 10, parentId: 1, name: "Cream Biscuits", slug: "cream-biscuits", sortOrder: 2 },
      { id: 11, parentId: 2, name: "Milk Chocolate", slug: "milk-chocolate", sortOrder: 1 },
      { id: 12, parentId: 2, name: "Dark Chocolate", slug: "dark-chocolate", sortOrder: 2 },
    ],
  });

  // ── Products ──
  await prisma.product.createMany({
    data: [
      { id: 1, categoryId: 1, name: "Royal Butter Cookies", slug: "royal-butter-cookies", sku: "RBC-001", description: "Premium butter cookies made with real Danish butter. Crispy, golden, and packed in elegant tins perfect for gifting or retail shelves.", shortDescription: "Premium Danish-style butter cookies in gift tins", retailPrice: 8.99, wholesalePrice: 6.50, distributorPrice: 5.20, costPrice: 3.80, moq: 24, stock: 500, lowStockThreshold: 50, brand: "Royal Dansk", unit: "box", weight: 0.45, isActive: true, isFeatured: true },
      { id: 2, categoryId: 1, name: "Chocolate Cream Biscuits", slug: "chocolate-cream-biscuits", sku: "CCB-002", description: "Rich chocolate cream sandwiched between two crispy cocoa biscuits. A bestseller for retail stores.", shortDescription: "Crispy cocoa biscuits with chocolate cream filling", retailPrice: 5.49, wholesalePrice: 3.80, distributorPrice: 3.00, costPrice: 2.10, moq: 48, stock: 1200, lowStockThreshold: 100, brand: "SweetBite", unit: "box", weight: 0.30, isActive: true, isFeatured: true },
      { id: 3, categoryId: 2, name: "Belgian Milk Chocolate Bar", slug: "belgian-milk-chocolate-bar", sku: "BMC-003", description: "Smooth Belgian milk chocolate crafted from premium cocoa beans. Individually wrapped bars ideal for wholesale.", shortDescription: "Smooth Belgian milk chocolate — individually wrapped", retailPrice: 3.99, wholesalePrice: 2.80, distributorPrice: 2.20, costPrice: 1.50, moq: 100, stock: 3000, lowStockThreshold: 200, brand: "ChocoLux", unit: "piece", weight: 0.10, isActive: true, isFeatured: true },
      { id: 4, categoryId: 2, name: "Dark Chocolate Truffles", slug: "dark-chocolate-truffles", sku: "DCT-004", description: "70% cacao dark chocolate truffles dusted in cocoa powder. Pack of 12 truffles per box.", shortDescription: "Premium 70% cacao truffles — 12pc box", retailPrice: 12.99, wholesalePrice: 9.50, distributorPrice: 7.80, costPrice: 5.50, moq: 20, stock: 400, lowStockThreshold: 30, brand: "ChocoLux", unit: "box", weight: 0.25, isActive: true, isFeatured: true },
      { id: 5, categoryId: 3, name: "Fruit Hard Candy Mix", slug: "fruit-hard-candy-mix", sku: "FHC-005", description: "Assorted fruit-flavored hard candies — strawberry, orange, lemon, and grape. Perfect for candy shops.", shortDescription: "Assorted fruit hard candies — 4 flavors", retailPrice: 4.29, wholesalePrice: 2.90, distributorPrice: 2.30, costPrice: 1.60, moq: 50, stock: 2000, lowStockThreshold: 150, brand: "CandyPop", unit: "bag", weight: 0.50, isActive: true, isFeatured: false },
      { id: 6, categoryId: 3, name: "Mint Drops", slug: "mint-drops", sku: "MTD-006", description: "Cool peppermint drops that freshen breath. Wrapped individually. Retail-ready packaging.", shortDescription: "Individually wrapped peppermint drops", retailPrice: 3.49, wholesalePrice: 2.40, distributorPrice: 1.90, costPrice: 1.20, moq: 100, stock: 5000, lowStockThreshold: 300, brand: "FreshMint", unit: "bag", weight: 0.40, isActive: true, isFeatured: false },
      { id: 7, categoryId: 4, name: "Gummy Bear Family Pack", slug: "gummy-bear-family-pack", sku: "GBF-007", description: "Colorful gummy bears in 5 fruity flavors. 500g family-size bags for retail or wholesale counters.", shortDescription: "Fruity gummy bears — 500g family bags", retailPrice: 6.99, wholesalePrice: 4.80, distributorPrice: 3.90, costPrice: 2.70, moq: 36, stock: 800, lowStockThreshold: 60, brand: "JellyJoy", unit: "bag", weight: 0.50, isActive: true, isFeatured: true },
      { id: 8, categoryId: 4, name: "Sour Worm Jellies", slug: "sour-worm-jellies", sku: "SWJ-008", description: "Tangy sour worm-shaped gummy candies coated in sour sugar. Kids love them!", shortDescription: "Sour sugar-coated worm gummies", retailPrice: 5.49, wholesalePrice: 3.70, distributorPrice: 2.90, costPrice: 2.00, moq: 48, stock: 600, lowStockThreshold: 40, brand: "JellyJoy", unit: "bag", weight: 0.35, isActive: true, isFeatured: false },
      { id: 9, categoryId: 5, name: "Vanilla Cream Wafer Rolls", slug: "vanilla-cream-wafer-rolls", sku: "VCW-009", description: "Light and crispy wafer rolls filled with rich vanilla cream. Elegant packaging for premium retail.", shortDescription: "Crispy wafer rolls with vanilla cream", retailPrice: 7.49, wholesalePrice: 5.20, distributorPrice: 4.10, costPrice: 2.90, moq: 30, stock: 450, lowStockThreshold: 40, brand: "WaferWorld", unit: "box", weight: 0.30, isActive: true, isFeatured: true },
      { id: 10, categoryId: 5, name: "Hazelnut Wafer Bites", slug: "hazelnut-wafer-bites", sku: "HWB-010", description: "Bite-sized wafer cubes filled with hazelnut chocolate cream. Resealable bags.", shortDescription: "Hazelnut chocolate wafer bites — resealable", retailPrice: 8.99, wholesalePrice: 6.20, distributorPrice: 5.00, costPrice: 3.50, moq: 24, stock: 350, lowStockThreshold: 30, brand: "WaferWorld", unit: "bag", weight: 0.40, isActive: true, isFeatured: false },
      { id: 11, categoryId: 6, name: "Oat Digestive Crackers", slug: "oat-digestive-crackers", sku: "ODC-011", description: "Whole grain oat digestive biscuits. Low-sugar, high-fiber option for health-conscious customers.", shortDescription: "Whole grain oat digestives — low sugar", retailPrice: 4.99, wholesalePrice: 3.40, distributorPrice: 2.70, costPrice: 1.80, moq: 60, stock: 900, lowStockThreshold: 80, brand: "NatureCrunch", unit: "box", weight: 0.35, isActive: true, isFeatured: false },
      { id: 12, categoryId: 6, name: "Cheese Crackers Party Pack", slug: "cheese-crackers-party-pack", sku: "CCP-012", description: "Crispy cheese-flavored crackers in party-size boxes. Great for events, cafeterias, and bulk retail.", shortDescription: "Cheese crackers — party-size boxes", retailPrice: 9.99, wholesalePrice: 7.00, distributorPrice: 5.60, costPrice: 3.90, moq: 20, stock: 250, lowStockThreshold: 20, brand: "NatureCrunch", unit: "box", weight: 0.60, isActive: true, isFeatured: true },
    ],
  });

  // ── Product Images ──
  await prisma.productImage.createMany({
    data: [
      { productId: 1, imageUrl: "/images/img1.jpeg", type: "image", altText: "Royal Butter Cookies", sortOrder: 0 },
      { productId: 1, imageUrl: "/images/img2.jpeg", type: "image", altText: "Royal Butter Cookies", sortOrder: 1 },
      { productId: 1, imageUrl: "/images/video1.mp4", type: "video", altText: "Royal Butter Cookies promo", sortOrder: 2 },
      { productId: 2, imageUrl: "/images/img3.jpeg", type: "image", altText: "Chocolate Cream Biscuits", sortOrder: 0 },
      { productId: 2, imageUrl: "/images/img4.jpeg", type: "image", altText: "Chocolate Cream Biscuits", sortOrder: 1 },
      { productId: 3, imageUrl: "/images/img5.jpeg", type: "image", altText: "Belgian Milk Chocolate Bar", sortOrder: 0 },
      { productId: 3, imageUrl: "/images/img6.jpeg", type: "image", altText: "Belgian Milk Chocolate Bar", sortOrder: 1 },
      { productId: 3, imageUrl: "/images/video2.mp4", type: "video", altText: "Belgian Chocolate promo", sortOrder: 2 },
      { productId: 4, imageUrl: "/images/img7.jpeg", type: "image", altText: "Dark Chocolate Truffles", sortOrder: 0 },
      { productId: 4, imageUrl: "/images/img8.jpeg", type: "image", altText: "Dark Chocolate Truffles", sortOrder: 1 },
      { productId: 5, imageUrl: "/images/img9.jpeg", type: "image", altText: "Fruit Hard Candy Mix", sortOrder: 0 },
      { productId: 5, imageUrl: "/images/img10.jpeg", type: "image", altText: "Fruit Hard Candy Mix", sortOrder: 1 },
      { productId: 5, imageUrl: "/images/video3.mp4", type: "video", altText: "Fruit Candy promo", sortOrder: 2 },
      { productId: 6, imageUrl: "/images/img11.jpeg", type: "image", altText: "Mint Drops", sortOrder: 0 },
      { productId: 6, imageUrl: "/images/img12.jpeg", type: "image", altText: "Mint Drops", sortOrder: 1 },
      { productId: 7, imageUrl: "/images/img13.jpeg", type: "image", altText: "Gummy Bear Family Pack", sortOrder: 0 },
      { productId: 7, imageUrl: "/images/img14.jpeg", type: "image", altText: "Gummy Bear Family Pack", sortOrder: 1 },
      { productId: 7, imageUrl: "/images/video4.mp4", type: "video", altText: "Gummy Bears promo", sortOrder: 2 },
      { productId: 8, imageUrl: "/images/img15.jpeg", type: "image", altText: "Sour Worm Jellies", sortOrder: 0 },
      { productId: 8, imageUrl: "/images/img16.jpeg", type: "image", altText: "Sour Worm Jellies", sortOrder: 1 },
      { productId: 9, imageUrl: "/images/img17.jpeg", type: "image", altText: "Vanilla Cream Wafer Rolls", sortOrder: 0 },
      { productId: 9, imageUrl: "/images/img18.jpeg", type: "image", altText: "Vanilla Cream Wafer Rolls", sortOrder: 1 },
      { productId: 10, imageUrl: "/images/img19.jpeg", type: "image", altText: "Hazelnut Wafer Bites", sortOrder: 0 },
      { productId: 10, imageUrl: "/images/img20.jpeg", type: "image", altText: "Hazelnut Wafer Bites", sortOrder: 1 },
      { productId: 11, imageUrl: "/images/img21.jpeg", type: "image", altText: "Oat Digestive Crackers", sortOrder: 0 },
      { productId: 11, imageUrl: "/images/img22.jpeg", type: "image", altText: "Oat Digestive Crackers", sortOrder: 1 },
      { productId: 12, imageUrl: "/images/img23.jpeg", type: "image", altText: "Cheese Crackers Party Pack", sortOrder: 0 },
      { productId: 12, imageUrl: "/images/img24.jpeg", type: "image", altText: "Cheese Crackers Party Pack", sortOrder: 1 },
    ],
  });

  // ── Addresses ──
  await prisma.address.createMany({
    data: [
      { userId: 2, label: "Warehouse", name: "Ahmed Grocery", phone: "+15559876543", address: "45 Market Street", city: "Brooklyn", state: "NY", postalCode: "11201", country: "US", isDefault: true },
      { userId: 3, label: "Main Office", name: "Sara Distribution", phone: "+15551112233", address: "901 Commerce Blvd, Suite 4", city: "Newark", state: "NJ", postalCode: "07102", country: "US", isDefault: true },
    ],
  });

  // ── Pricing Rules ──
  await prisma.pricingRule.createMany({
    data: [
      { productId: 1, customerGroupId: 2, minQty: 24, maxQty: 99, price: 6.50 },
      { productId: 1, customerGroupId: 2, minQty: 100, maxQty: 499, price: 5.80 },
      { productId: 1, customerGroupId: 2, minQty: 500, price: 5.20 },
      { productId: 1, customerGroupId: 3, minQty: 24, maxQty: 99, price: 5.20 },
      { productId: 1, customerGroupId: 3, minQty: 100, price: 4.50 },
      { productId: 3, customerGroupId: 2, minQty: 100, maxQty: 499, price: 2.80 },
      { productId: 3, customerGroupId: 2, minQty: 500, price: 2.40 },
      { productId: 3, customerGroupId: 3, minQty: 100, maxQty: 499, price: 2.20 },
      { productId: 3, customerGroupId: 3, minQty: 500, price: 1.80 },
    ],
  });

  // ── Sample Order ──
  await prisma.order.create({
    data: {
      id: 1,
      userId: 2,
      orderNumber: "WS-20260415-00001",
      subtotal: 436.00,
      shippingAmount: 0.00,
      taxAmount: 34.88,
      discountAmount: 0.00,
      totalAmount: 470.88,
      status: "delivered",
      paymentStatus: "paid",
      shippingAddress: '{"name":"Ahmed Grocery","phone":"+15559876543","address":"45 Market Street","city":"Brooklyn","state":"NY","postal_code":"11201","country":"US"}',
      notes: "Please deliver before 10 AM",
      orderItems: {
        create: [
          { productId: 1, productName: "Royal Butter Cookies", sku: "RBC-001", priceAtTime: 6.50, quantity: 48, subtotal: 312.00 },
          { productId: 3, productName: "Belgian Milk Chocolate Bar", sku: "BMC-003", priceAtTime: 2.80, quantity: 100, subtotal: 280.00 },
        ],
      },
    },
  });

  // Adjust stock for the order
  await prisma.product.update({ where: { id: 1 }, data: { stock: 452 } });
  await prisma.product.update({ where: { id: 3 }, data: { stock: 2900 } });

  // ── Payment ──
  await prisma.payment.create({
    data: {
      orderId: 1,
      amount: 470.88,
      paymentMethod: "bank_transfer",
      status: "paid",
      transactionId: "BT-20260410-7891",
      paidAt: new Date("2026-04-10T14:30:00Z"),
    },
  });

  // ── Invoice ──
  await prisma.invoice.create({
    data: {
      orderId: 1,
      invoiceNumber: "INV-20260415-00001",
      subtotal: 436.00,
      taxAmount: 34.88,
      totalAmount: 470.88,
      pdfUrl: "/invoices/INV-20260415-00001.pdf",
      dueDate: new Date("2026-05-15"),
    },
  });

  // ── Stock Logs ──
  await prisma.stockLog.createMany({
    data: [
      { productId: 1, type: "out", quantity: 48, reason: "order", note: "Order WS-20260415-00001", createdBy: 1 },
      { productId: 3, type: "out", quantity: 100, reason: "order", note: "Order WS-20260415-00001", createdBy: 1 },
    ],
  });

  // ── Settings ──
  await prisma.setting.createMany({
    data: [
      { key: "site_name", value: "SweetWholesale" },
      { key: "currency", value: "USD" },
      { key: "tax_rate", value: "8" },
      { key: "min_order_amount", value: "50" },
      { key: "free_shipping_threshold", value: "500" },
    ],
  });

  // Reset sequences
  await prisma.$executeRawUnsafe(`SELECT setval('customer_groups_id_seq', (SELECT MAX(id) FROM customer_groups))`);
  await prisma.$executeRawUnsafe(`SELECT setval('users_id_seq', (SELECT MAX(id) FROM users))`);
  await prisma.$executeRawUnsafe(`SELECT setval('categories_id_seq', (SELECT MAX(id) FROM categories))`);
  await prisma.$executeRawUnsafe(`SELECT setval('products_id_seq', (SELECT MAX(id) FROM products))`);
  await prisma.$executeRawUnsafe(`SELECT setval('orders_id_seq', (SELECT MAX(id) FROM orders))`);

  console.log("Seeding complete!");
  await prisma.$disconnect();
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
