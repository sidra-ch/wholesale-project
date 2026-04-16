-- ============================================================
-- Fix: Update product images and category images from
-- broken Cloudinary demo URLs to local public/images paths
-- Compatible with PostgreSQL (alwaysdata)
-- ============================================================

-- Step 1: Delete all existing product_images (they have fake Cloudinary URLs)
DELETE FROM product_images;

-- Step 2: Re-insert with correct local paths
-- Product 1: Royal Butter Cookies (id=1)
INSERT INTO product_images (product_id, image_url, public_id, type, alt_text, sort_order) VALUES
(1, '/images/img1.jpeg',  NULL, 'image', 'Royal Butter Cookies',       0),
(1, '/images/img2.jpeg',  NULL, 'image', 'Royal Butter Cookies',       1),
(1, '/images/video1.mp4', NULL, 'video', 'Royal Butter Cookies promo', 2);

-- Product 2: Digestive Wheat Biscuits (id=2)
INSERT INTO product_images (product_id, image_url, public_id, type, alt_text, sort_order) VALUES
(2, '/images/img3.jpeg',  NULL, 'image', 'Digestive Wheat Biscuits',   0),
(2, '/images/img4.jpeg',  NULL, 'image', 'Digestive Wheat Biscuits',   1);

-- Product 3: Belgian Dark Truffles (id=3)
INSERT INTO product_images (product_id, image_url, public_id, type, alt_text, sort_order) VALUES
(3, '/images/img5.jpeg',  NULL, 'image', 'Belgian Dark Truffles',      0),
(3, '/images/img6.jpeg',  NULL, 'image', 'Belgian Dark Truffles',      1),
(3, '/images/video2.mp4', NULL, 'video', 'Belgian Truffles promo',     2);

-- Product 4: Milk Chocolate Bars (id=4)
INSERT INTO product_images (product_id, image_url, public_id, type, alt_text, sort_order) VALUES
(4, '/images/img7.jpeg',  NULL, 'image', 'Milk Chocolate Bars',        0),
(4, '/images/img8.jpeg',  NULL, 'image', 'Milk Chocolate Bars',        1);

-- Product 5: Fruit Drop Assortment (id=5)
INSERT INTO product_images (product_id, image_url, public_id, type, alt_text, sort_order) VALUES
(5, '/images/img9.jpeg',  NULL, 'image', 'Fruit Drop Assortment',      0),
(5, '/images/img10.jpeg', NULL, 'image', 'Fruit Drop Assortment',      1),
(5, '/images/video3.mp4', NULL, 'video', 'Fruit Drops promo',          2);

-- Product 6: Gummy Bear Party Pack (id=6)
INSERT INTO product_images (product_id, image_url, public_id, type, alt_text, sort_order) VALUES
(6, '/images/img11.jpeg', NULL, 'image', 'Gummy Bear Party Pack',      0),
(6, '/images/img12.jpeg', NULL, 'image', 'Gummy Bear Party Pack',      1);

-- Product 7: Vanilla Cream Wafers (id=7)
INSERT INTO product_images (product_id, image_url, public_id, type, alt_text, sort_order) VALUES
(7, '/images/img13.jpeg', NULL, 'image', 'Vanilla Cream Wafers',       0),
(7, '/images/img14.jpeg', NULL, 'image', 'Vanilla Cream Wafers',       1),
(7, '/images/video4.mp4', NULL, 'video', 'Vanilla Wafers promo',       2);

-- Product 8: Chocolate Chip Cookies (id=8)
INSERT INTO product_images (product_id, image_url, public_id, type, alt_text, sort_order) VALUES
(8, '/images/img15.jpeg', NULL, 'image', 'Chocolate Chip Cookies',     0),
(8, '/images/img16.jpeg', NULL, 'image', 'Chocolate Chip Cookies',     1);

-- Step 3: Update category images to local paths
UPDATE categories SET image = '/images/img25.jpeg' WHERE id = 1;
UPDATE categories SET image = '/images/img26.jpeg' WHERE id = 2;
UPDATE categories SET image = '/images/img27.jpeg' WHERE id = 3;
UPDATE categories SET image = '/images/img28.jpeg' WHERE id = 4;
UPDATE categories SET image = '/images/img29.jpeg' WHERE id = 5;
UPDATE categories SET image = '/images/img30.jpeg' WHERE id = 6;
