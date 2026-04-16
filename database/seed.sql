-- ============================================================
-- SweetWholesale - Seed Data
-- ============================================================

USE `wholesale_db`;

-- ============================================================
-- Customer Groups
-- ============================================================
INSERT INTO `customer_groups` (`id`, `name`, `slug`, `description`, `discount_pct`) VALUES
(1, 'Retail',       'retail',       'Standard retail customers',                     0.00),
(2, 'Wholesale',    'wholesale',    'Verified wholesale buyers — bulk pricing',     15.00),
(3, 'Distributor',  'distributor',  'Regional distributors — best pricing tier',    25.00);

-- ============================================================
-- Admin User  (password: admin123 — bcrypt hash)
-- ============================================================
INSERT INTO `users` (`id`, `name`, `email`, `phone`, `password`, `role`, `status`, `customer_group_id`, `business_name`, `email_verified_at`) VALUES
(1, 'Admin User', 'admin@sweetwholesale.com', '+15551234567',
 '$2y$12$LJ3a1x0Y5F5V5h5f5g5h5uGhJ3kL5mN7oP9qR1sT3uV5wX7yZ9a0', 'admin', 'approved', NULL, 'SweetWholesale HQ', NOW());

-- Sample Customers
INSERT INTO `users` (`id`, `name`, `email`, `phone`, `password`, `role`, `status`, `customer_group_id`, `business_name`) VALUES
(2, 'Ahmed Grocery',   'ahmed@example.com',   '+15559876543', '$2y$12$LJ3a1x0Y5F5V5h5f5g5h5uGhJ3kL5mN7oP9qR1sT3uV5wX7yZ9a0', 'customer', 'approved',  2, 'Ahmed Mini Mart'),
(3, 'Sara Distribution','sara@example.com',   '+15551112233', '$2y$12$LJ3a1x0Y5F5V5h5f5g5h5uGhJ3kL5mN7oP9qR1sT3uV5wX7yZ9a0', 'customer', 'approved',  3, 'Sara Dist. Co.'),
(4, 'Pending Shop',     'pending@example.com','+15554445566', '$2y$12$LJ3a1x0Y5F5V5h5f5g5h5uGhJ3kL5mN7oP9qR1sT3uV5wX7yZ9a0', 'customer', 'pending',   NULL, 'New Shop LLC');

-- ============================================================
-- Categories
-- ============================================================
INSERT INTO `categories` (`id`, `parent_id`, `name`, `slug`, `image`, `sort_order`) VALUES
(1, NULL, 'Premium Biscuits',    'premium-biscuits',    '/images/img25.jpeg',    1),
(2, NULL, 'Chocolate Candies',   'chocolate-candies',   '/images/img26.jpeg',    2),
(3, NULL, 'Hard Candies',        'hard-candies',        '/images/img27.jpeg',    3),
(4, NULL, 'Gummy & Jellies',     'gummy-jellies',       '/images/img28.jpeg',    4),
(5, NULL, 'Cream Wafers',        'cream-wafers',        '/images/img29.jpeg',    5),
(6, NULL, 'Cookies & Crackers',  'cookies-crackers',    '/images/img30.jpeg',    6),
(7, NULL, 'Snack Packs',         'snack-packs',         '/images/img31.jpeg',    7),
(8, NULL, 'Gift Packs',          'gift-packs',          '/images/img32.jpeg',    8);

-- Sub-categories
INSERT INTO `categories` (`id`, `parent_id`, `name`, `slug`, `image`, `sort_order`) VALUES
(9,  1, 'Butter Biscuits',   'butter-biscuits',   NULL, 1),
(10, 1, 'Cream Biscuits',    'cream-biscuits',    NULL, 2),
(11, 2, 'Milk Chocolate',    'milk-chocolate',    NULL, 1),
(12, 2, 'Dark Chocolate',    'dark-chocolate',    NULL, 2);

-- ============================================================
-- Products (12 sample products)
-- ============================================================
INSERT INTO `products` (`id`, `category_id`, `name`, `slug`, `sku`, `description`, `short_description`,
  `retail_price`, `wholesale_price`, `distributor_price`, `cost_price`,
  `moq`, `stock`, `low_stock_threshold`, `brand`, `unit`, `weight`, `is_active`, `is_featured`) VALUES

(1,  1, 'Royal Butter Cookies',         'royal-butter-cookies',         'RBC-001',
 'Premium butter cookies made with real Danish butter. Crispy, golden, and packed in elegant tins perfect for gifting or retail shelves.',
 'Premium Danish-style butter cookies in gift tins',
 8.99, 6.50, 5.20, 3.80, 24, 500, 50, 'Royal Dansk', 'box', 0.45, 1, 1),

(2,  1, 'Chocolate Cream Biscuits',     'chocolate-cream-biscuits',     'CCB-002',
 'Rich chocolate cream sandwiched between two crispy cocoa biscuits. A bestseller for retail stores.',
 'Crispy cocoa biscuits with chocolate cream filling',
 5.49, 3.80, 3.00, 2.10, 48, 1200, 100, 'SweetBite', 'box', 0.30, 1, 1),

(3,  2, 'Belgian Milk Chocolate Bar',   'belgian-milk-chocolate-bar',   'BMC-003',
 'Smooth Belgian milk chocolate crafted from premium cocoa beans. Individually wrapped bars ideal for wholesale.',
 'Smooth Belgian milk chocolate — individually wrapped',
 3.99, 2.80, 2.20, 1.50, 100, 3000, 200, 'ChocoLux', 'piece', 0.10, 1, 1),

(4,  2, 'Dark Chocolate Truffles',      'dark-chocolate-truffles',      'DCT-004',
 '70% cacao dark chocolate truffles dusted in cocoa powder. Pack of 12 truffles per box.',
 'Premium 70% cacao truffles — 12pc box',
 12.99, 9.50, 7.80, 5.50, 20, 400, 30, 'ChocoLux', 'box', 0.25, 1, 1),

(5,  3, 'Fruit Hard Candy Mix',         'fruit-hard-candy-mix',         'FHC-005',
 'Assorted fruit-flavored hard candies — strawberry, orange, lemon, and grape. Perfect for candy shops.',
 'Assorted fruit hard candies — 4 flavors',
 4.29, 2.90, 2.30, 1.60, 50, 2000, 150, 'CandyPop', 'bag', 0.50, 1, 0),

(6,  3, 'Mint Drops',                   'mint-drops',                   'MTD-006',
 'Cool peppermint drops that freshen breath. Wrapped individually. Retail-ready packaging.',
 'Individually wrapped peppermint drops',
 3.49, 2.40, 1.90, 1.20, 100, 5000, 300, 'FreshMint', 'bag', 0.40, 1, 0),

(7,  4, 'Gummy Bear Family Pack',       'gummy-bear-family-pack',       'GBF-007',
 'Colorful gummy bears in 5 fruity flavors. 500g family-size bags for retail or wholesale counters.',
 'Fruity gummy bears — 500g family bags',
 6.99, 4.80, 3.90, 2.70, 36, 800, 60, 'JellyJoy', 'bag', 0.50, 1, 1),

(8,  4, 'Sour Worm Jellies',            'sour-worm-jellies',            'SWJ-008',
 'Tangy sour worm-shaped gummy candies coated in sour sugar. Kids love them!',
 'Sour sugar-coated worm gummies',
 5.49, 3.70, 2.90, 2.00, 48, 600, 40, 'JellyJoy', 'bag', 0.35, 1, 0),

(9,  5, 'Vanilla Cream Wafer Rolls',    'vanilla-cream-wafer-rolls',    'VCW-009',
 'Light and crispy wafer rolls filled with rich vanilla cream. Elegant packaging for premium retail.',
 'Crispy wafer rolls with vanilla cream',
 7.49, 5.20, 4.10, 2.90, 30, 450, 40, 'WaferWorld', 'box', 0.30, 1, 1),

(10, 5, 'Hazelnut Wafer Bites',         'hazelnut-wafer-bites',         'HWB-010',
 'Bite-sized wafer cubes filled with hazelnut chocolate cream. Resealable bags.',
 'Hazelnut chocolate wafer bites — resealable',
 8.99, 6.20, 5.00, 3.50, 24, 350, 30, 'WaferWorld', 'bag', 0.40, 1, 0),

(11, 6, 'Oat Digestive Crackers',       'oat-digestive-crackers',       'ODC-011',
 'Whole grain oat digestive biscuits. Low-sugar, high-fiber option for health-conscious customers.',
 'Whole grain oat digestives — low sugar',
 4.99, 3.40, 2.70, 1.80, 60, 900, 80, 'NatureCrunch', 'box', 0.35, 1, 0),

(12, 6, 'Cheese Crackers Party Pack',   'cheese-crackers-party-pack',   'CCP-012',
 'Crispy cheese-flavored crackers in party-size boxes. Great for events, cafeterias, and bulk retail.',
 'Cheese crackers — party-size boxes',
 9.99, 7.00, 5.60, 3.90, 20, 250, 20, 'NatureCrunch', 'box', 0.60, 1, 1);

-- ============================================================
-- Product Images
-- ============================================================
INSERT INTO `product_images` (`product_id`, `image_url`, `alt_text`, `sort_order`) VALUES
(1,  '/images/img1.jpeg',   'Royal Butter Cookies',         0),
(1,  '/images/img2.jpeg',   'Royal Butter Cookies',         1),
(2,  '/images/img3.jpeg',   'Chocolate Cream Biscuits',     0),
(2,  '/images/img4.jpeg',   'Chocolate Cream Biscuits',     1),
(3,  '/images/img5.jpeg',   'Belgian Milk Chocolate Bar',   0),
(3,  '/images/img6.jpeg',   'Belgian Milk Chocolate Bar',   1),
(4,  '/images/img7.jpeg',   'Dark Chocolate Truffles',      0),
(4,  '/images/img8.jpeg',   'Dark Chocolate Truffles',      1),
(5,  '/images/img9.jpeg',   'Fruit Hard Candy Mix',         0),
(5,  '/images/img10.jpeg',  'Fruit Hard Candy Mix',         1),
(6,  '/images/img11.jpeg',  'Mint Drops',                   0),
(6,  '/images/img12.jpeg',  'Mint Drops',                   1),
(7,  '/images/img13.jpeg',  'Gummy Bear Family Pack',       0),
(7,  '/images/img14.jpeg',  'Gummy Bear Family Pack',       1),
(8,  '/images/img15.jpeg',  'Sour Worm Jellies',            0),
(8,  '/images/img16.jpeg',  'Sour Worm Jellies',            1),
(9,  '/images/img17.jpeg',  'Vanilla Cream Wafer Rolls',    0),
(9,  '/images/img18.jpeg',  'Vanilla Cream Wafer Rolls',    1),
(10, '/images/img19.jpeg',  'Hazelnut Wafer Bites',         0),
(10, '/images/img20.jpeg',  'Hazelnut Wafer Bites',         1),
(11, '/images/img21.jpeg',  'Oat Digestive Crackers',       0),
(11, '/images/img22.jpeg',  'Oat Digestive Crackers',       1),
(12, '/images/img23.jpeg',  'Cheese Crackers Party Pack',   0),
(12, '/images/img24.jpeg',  'Cheese Crackers Party Pack',   1);

-- ============================================================
-- Addresses
-- ============================================================
INSERT INTO `addresses` (`user_id`, `label`, `name`, `phone`, `address`, `city`, `state`, `postal_code`, `country`, `is_default`) VALUES
(2, 'Warehouse', 'Ahmed Grocery', '+15559876543', '45 Market Street', 'Brooklyn', 'NY', '11201', 'US', 1),
(3, 'Main Office', 'Sara Distribution', '+15551112233', '901 Commerce Blvd, Suite 4', 'Newark', 'NJ', '07102', 'US', 1);

-- ============================================================
-- Pricing Rules (Quantity-based tier pricing for product 1)
-- ============================================================
INSERT INTO `pricing_rules` (`product_id`, `customer_group_id`, `min_qty`, `max_qty`, `price`) VALUES
(1, 2,  24,  99,  6.50),
(1, 2,  100, 499, 5.80),
(1, 2,  500, NULL, 5.20),
(1, 3,  24,  99,  5.20),
(1, 3,  100, NULL, 4.50),
(3, 2,  100, 499, 2.80),
(3, 2,  500, NULL, 2.40),
(3, 3,  100, 499, 2.20),
(3, 3,  500, NULL, 1.80);

-- ============================================================
-- Sample Order (Ahmed placing an order)
-- ============================================================
INSERT INTO `orders` (`id`, `user_id`, `order_number`, `subtotal`, `shipping_amount`, `tax_amount`, `discount_amount`, `total_amount`, `status`, `payment_status`, `shipping_address`, `notes`) VALUES
(1, 2, 'WS-20260415-00001', 436.00, 0.00, 34.88, 0.00, 470.88, 'delivered', 'paid',
 '{"name":"Ahmed Grocery","phone":"+15559876543","address":"45 Market Street","city":"Brooklyn","state":"NY","postal_code":"11201","country":"US"}',
 'Please deliver before 10 AM');

INSERT INTO `order_items` (`order_id`, `product_id`, `product_name`, `sku`, `price_at_time`, `quantity`, `subtotal`) VALUES
(1, 1, 'Royal Butter Cookies',       'RBC-001', 6.50, 48, 312.00),
(1, 3, 'Belgian Milk Chocolate Bar', 'BMC-003', 2.80, 100, 280.00);

-- Note: The trigger will auto-deduct stock and log it.
-- For seed data we manually adjust since triggers fire on INSERT:
-- Stock for product 1: 500 - 48 = 452  (trigger handles it)
-- Stock for product 3: 3000 - 100 = 2900

INSERT INTO `payments` (`order_id`, `amount`, `payment_method`, `status`, `transaction_id`, `paid_at`) VALUES
(1, 470.88, 'bank_transfer', 'paid', 'BT-20260410-7891', '2026-04-10 14:30:00');

INSERT INTO `invoices` (`order_id`, `invoice_number`, `subtotal`, `tax_amount`, `total_amount`, `pdf_url`, `due_date`) VALUES
(1, 'INV-20260415-00001', 436.00, 34.88, 470.88, '/invoices/INV-20260415-00001.pdf', '2026-05-15');
