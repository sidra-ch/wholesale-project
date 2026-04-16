-- ============================================================
-- SweetWholesale - Production MySQL Database Schema
-- B2B Wholesale Platform for Biscuits, Candies, Chocolates & Snacks
-- Engine: InnoDB | Charset: utf8mb4 | Collation: utf8mb4_unicode_ci
-- ============================================================

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

CREATE DATABASE IF NOT EXISTS `wholesale_db`
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE `wholesale_db`;

-- ============================================================
-- 1) customer_groups
-- Determines pricing tier for approved users
-- ============================================================
CREATE TABLE `customer_groups` (
  `id`          BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `name`        VARCHAR(50)     NOT NULL COMMENT 'retail | wholesale | distributor',
  `slug`        VARCHAR(50)     NOT NULL,
  `description` VARCHAR(255)    DEFAULT NULL,
  `discount_pct` DECIMAL(5,2)   NOT NULL DEFAULT 0.00 COMMENT 'Global discount % for the group',
  `created_at`  TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`  TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_customer_groups_slug` (`slug`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 2) users
-- All users register as pending; admin approves before pricing is visible
-- ============================================================
CREATE TABLE `users` (
  `id`                BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `name`              VARCHAR(100)    NOT NULL,
  `email`             VARCHAR(191)    NOT NULL,
  `phone`             VARCHAR(20)     DEFAULT NULL,
  `password`          VARCHAR(255)    NOT NULL COMMENT 'bcrypt hash',
  `role`              ENUM('admin','customer') NOT NULL DEFAULT 'customer',
  `status`            ENUM('pending','approved','rejected') NOT NULL DEFAULT 'pending',
  `customer_group_id` BIGINT UNSIGNED DEFAULT NULL,
  `business_name`     VARCHAR(150)    DEFAULT NULL,
  `tax_id`            VARCHAR(50)     DEFAULT NULL,
  `email_verified_at` TIMESTAMP       NULL DEFAULT NULL,
  `remember_token`    VARCHAR(100)    DEFAULT NULL,
  `created_at`        TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`        TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_users_email` (`email`),
  KEY `idx_users_status` (`status`),
  KEY `idx_users_role` (`role`),
  KEY `fk_users_customer_group` (`customer_group_id`),
  CONSTRAINT `fk_users_customer_group`
    FOREIGN KEY (`customer_group_id`) REFERENCES `customer_groups` (`id`)
    ON UPDATE CASCADE ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 3) categories
-- Product categories with optional parent for nesting
-- ============================================================
CREATE TABLE `categories` (
  `id`          BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `parent_id`   BIGINT UNSIGNED DEFAULT NULL COMMENT 'Self-ref for sub-categories',
  `name`        VARCHAR(100)    NOT NULL,
  `slug`        VARCHAR(120)    NOT NULL,
  `image`       VARCHAR(500)    DEFAULT NULL,
  `sort_order`  INT UNSIGNED    NOT NULL DEFAULT 0,
  `is_active`   TINYINT(1)      NOT NULL DEFAULT 1,
  `created_at`  TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`  TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_categories_slug` (`slug`),
  KEY `fk_categories_parent` (`parent_id`),
  CONSTRAINT `fk_categories_parent`
    FOREIGN KEY (`parent_id`) REFERENCES `categories` (`id`)
    ON UPDATE CASCADE ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 4) products
-- Core product table with triple-tier pricing and MOQ
-- ============================================================
CREATE TABLE `products` (
  `id`                BIGINT UNSIGNED  NOT NULL AUTO_INCREMENT,
  `category_id`       BIGINT UNSIGNED  NOT NULL,
  `name`              VARCHAR(200)     NOT NULL,
  `slug`              VARCHAR(220)     NOT NULL,
  `sku`               VARCHAR(50)      NOT NULL,
  `description`       TEXT             DEFAULT NULL,
  `short_description` VARCHAR(500)     DEFAULT NULL,
  `retail_price`      DECIMAL(10,2)    NOT NULL DEFAULT 0.00,
  `wholesale_price`   DECIMAL(10,2)    NOT NULL DEFAULT 0.00,
  `distributor_price` DECIMAL(10,2)    NOT NULL DEFAULT 0.00,
  `cost_price`        DECIMAL(10,2)    NOT NULL DEFAULT 0.00 COMMENT 'Internal cost for margin tracking',
  `moq`               INT UNSIGNED     NOT NULL DEFAULT 1 COMMENT 'Minimum order quantity',
  `stock`             INT UNSIGNED     NOT NULL DEFAULT 0,
  `low_stock_threshold` INT UNSIGNED   NOT NULL DEFAULT 10,
  `brand`             VARCHAR(100)     DEFAULT NULL,
  `unit`              VARCHAR(30)      NOT NULL DEFAULT 'piece' COMMENT 'piece | box | carton | kg',
  `weight`            DECIMAL(8,2)     DEFAULT NULL COMMENT 'Weight in kg',
  `is_active`         TINYINT(1)       NOT NULL DEFAULT 1,
  `is_featured`       TINYINT(1)       NOT NULL DEFAULT 0,
  `created_at`        TIMESTAMP        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`        TIMESTAMP        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_products_slug` (`slug`),
  UNIQUE KEY `uk_products_sku` (`sku`),
  KEY `idx_products_brand` (`brand`),
  KEY `idx_products_is_active` (`is_active`),
  KEY `idx_products_is_featured` (`is_featured`),
  KEY `idx_products_stock` (`stock`),
  KEY `fk_products_category` (`category_id`),
  CONSTRAINT `fk_products_category`
    FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`)
    ON UPDATE CASCADE ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 5) product_images
-- Multiple images per product; first by sort_order is primary
-- ============================================================
CREATE TABLE `product_images` (
  `id`          BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `product_id`  BIGINT UNSIGNED NOT NULL,
  `image_url`   VARCHAR(500)    NOT NULL,
  `alt_text`    VARCHAR(200)    DEFAULT NULL,
  `sort_order`  INT UNSIGNED    NOT NULL DEFAULT 0,
  `created_at`  TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `fk_product_images_product` (`product_id`),
  CONSTRAINT `fk_product_images_product`
    FOREIGN KEY (`product_id`) REFERENCES `products` (`id`)
    ON UPDATE CASCADE ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 6) addresses
-- Users can have multiple shipping addresses; one is default
-- ============================================================
CREATE TABLE `addresses` (
  `id`          BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id`     BIGINT UNSIGNED NOT NULL,
  `label`       VARCHAR(50)     DEFAULT NULL COMMENT 'e.g. Warehouse, Office',
  `name`        VARCHAR(100)    NOT NULL,
  `phone`       VARCHAR(20)     NOT NULL,
  `address`     VARCHAR(500)    NOT NULL,
  `city`        VARCHAR(100)    NOT NULL,
  `state`       VARCHAR(100)    DEFAULT NULL,
  `postal_code` VARCHAR(20)     DEFAULT NULL,
  `country`     VARCHAR(60)     NOT NULL DEFAULT 'US',
  `is_default`  TINYINT(1)      NOT NULL DEFAULT 0,
  `created_at`  TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`  TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `fk_addresses_user` (`user_id`),
  CONSTRAINT `fk_addresses_user`
    FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
    ON UPDATE CASCADE ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 7) carts
-- Server-side cart for logged-in users
-- ============================================================
CREATE TABLE `carts` (
  `id`          BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id`     BIGINT UNSIGNED NOT NULL,
  `product_id`  BIGINT UNSIGNED NOT NULL,
  `quantity`    INT UNSIGNED    NOT NULL DEFAULT 1,
  `created_at`  TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`  TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_carts_user_product` (`user_id`, `product_id`),
  KEY `fk_carts_product` (`product_id`),
  CONSTRAINT `fk_carts_user`
    FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
    ON UPDATE CASCADE ON DELETE CASCADE,
  CONSTRAINT `fk_carts_product`
    FOREIGN KEY (`product_id`) REFERENCES `products` (`id`)
    ON UPDATE CASCADE ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 8) orders
-- Master order table; address is snapshotted as JSON
-- ============================================================
CREATE TABLE `orders` (
  `id`               BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id`          BIGINT UNSIGNED NOT NULL,
  `order_number`     VARCHAR(30)     NOT NULL COMMENT 'WS-20260415-XXXXX',
  `subtotal`         DECIMAL(12,2)   NOT NULL DEFAULT 0.00,
  `shipping_amount`  DECIMAL(10,2)   NOT NULL DEFAULT 0.00,
  `tax_amount`       DECIMAL(10,2)   NOT NULL DEFAULT 0.00,
  `discount_amount`  DECIMAL(10,2)   NOT NULL DEFAULT 0.00,
  `total_amount`     DECIMAL(12,2)   NOT NULL DEFAULT 0.00,
  `status`           ENUM('pending','processing','shipped','delivered','cancelled')
                       NOT NULL DEFAULT 'pending',
  `payment_status`   ENUM('unpaid','paid','refunded')
                       NOT NULL DEFAULT 'unpaid',
  `shipping_address` JSON            NOT NULL COMMENT 'Snapshot of address at order time',
  `notes`            TEXT            DEFAULT NULL,
  `shipped_at`       TIMESTAMP       NULL DEFAULT NULL,
  `delivered_at`     TIMESTAMP       NULL DEFAULT NULL,
  `cancelled_at`     TIMESTAMP       NULL DEFAULT NULL,
  `created_at`       TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`       TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_orders_order_number` (`order_number`),
  KEY `idx_orders_status` (`status`),
  KEY `idx_orders_payment_status` (`payment_status`),
  KEY `idx_orders_created_at` (`created_at`),
  KEY `fk_orders_user` (`user_id`),
  CONSTRAINT `fk_orders_user`
    FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
    ON UPDATE CASCADE ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 9) order_items
-- Line items for each order; price is locked at time of purchase
-- ============================================================
CREATE TABLE `order_items` (
  `id`            BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `order_id`      BIGINT UNSIGNED NOT NULL,
  `product_id`    BIGINT UNSIGNED NOT NULL,
  `product_name`  VARCHAR(200)    NOT NULL COMMENT 'Snapshot in case product is later deleted',
  `sku`           VARCHAR(50)     NOT NULL,
  `price_at_time` DECIMAL(10,2)   NOT NULL COMMENT 'Locked unit price',
  `quantity`      INT UNSIGNED    NOT NULL,
  `subtotal`      DECIMAL(12,2)   NOT NULL COMMENT 'price_at_time * quantity',
  `created_at`    TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `fk_order_items_order` (`order_id`),
  KEY `fk_order_items_product` (`product_id`),
  CONSTRAINT `fk_order_items_order`
    FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`)
    ON UPDATE CASCADE ON DELETE CASCADE,
  CONSTRAINT `fk_order_items_product`
    FOREIGN KEY (`product_id`) REFERENCES `products` (`id`)
    ON UPDATE CASCADE ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 10) payments
-- Tracks payment attempts per order
-- ============================================================
CREATE TABLE `payments` (
  `id`              BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `order_id`        BIGINT UNSIGNED NOT NULL,
  `amount`          DECIMAL(12,2)   NOT NULL,
  `payment_method`  ENUM('cod','bank_transfer','credit_card','online')
                      NOT NULL DEFAULT 'cod',
  `status`          ENUM('pending','paid','failed','refunded')
                      NOT NULL DEFAULT 'pending',
  `transaction_id`  VARCHAR(100)    DEFAULT NULL COMMENT 'External gateway ref',
  `paid_at`         TIMESTAMP       NULL DEFAULT NULL,
  `notes`           VARCHAR(500)    DEFAULT NULL,
  `created_at`      TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`      TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_payments_status` (`status`),
  KEY `fk_payments_order` (`order_id`),
  CONSTRAINT `fk_payments_order`
    FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`)
    ON UPDATE CASCADE ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 11) invoices
-- Auto-generated after successful order; one per order
-- ============================================================
CREATE TABLE `invoices` (
  `id`              BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `order_id`        BIGINT UNSIGNED NOT NULL,
  `invoice_number`  VARCHAR(30)     NOT NULL COMMENT 'INV-20260415-XXXXX',
  `subtotal`        DECIMAL(12,2)   NOT NULL,
  `tax_amount`      DECIMAL(10,2)   NOT NULL DEFAULT 0.00,
  `total_amount`    DECIMAL(12,2)   NOT NULL,
  `pdf_url`         VARCHAR(500)    DEFAULT NULL,
  `issued_at`       TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `due_date`        DATE            DEFAULT NULL,
  `created_at`      TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_invoices_invoice_number` (`invoice_number`),
  UNIQUE KEY `uk_invoices_order` (`order_id`),
  CONSTRAINT `fk_invoices_order`
    FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`)
    ON UPDATE CASCADE ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 12) stock_logs
-- Audit trail for every stock movement
-- ============================================================
CREATE TABLE `stock_logs` (
  `id`          BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `product_id`  BIGINT UNSIGNED NOT NULL,
  `type`        ENUM('in','out')  NOT NULL,
  `quantity`    INT              NOT NULL COMMENT 'Always positive; type determines direction',
  `reason`      ENUM('order','restock','manual','return','adjustment')
                  NOT NULL DEFAULT 'manual',
  `reference_id` BIGINT UNSIGNED DEFAULT NULL COMMENT 'order_id or other entity id',
  `note`        VARCHAR(500)     DEFAULT NULL,
  `created_by`  BIGINT UNSIGNED  DEFAULT NULL COMMENT 'Admin who triggered the change',
  `created_at`  TIMESTAMP        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_stock_logs_type` (`type`),
  KEY `fk_stock_logs_product` (`product_id`),
  KEY `fk_stock_logs_created_by` (`created_by`),
  CONSTRAINT `fk_stock_logs_product`
    FOREIGN KEY (`product_id`) REFERENCES `products` (`id`)
    ON UPDATE CASCADE ON DELETE CASCADE,
  CONSTRAINT `fk_stock_logs_created_by`
    FOREIGN KEY (`created_by`) REFERENCES `users` (`id`)
    ON UPDATE CASCADE ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 13) pricing_rules
-- Quantity-based tier pricing overrides per product
-- ============================================================
CREATE TABLE `pricing_rules` (
  `id`          BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `product_id`  BIGINT UNSIGNED NOT NULL,
  `customer_group_id` BIGINT UNSIGNED DEFAULT NULL COMMENT 'NULL = applies to all groups',
  `min_qty`     INT UNSIGNED    NOT NULL,
  `max_qty`     INT UNSIGNED    DEFAULT NULL COMMENT 'NULL = unlimited upper bound',
  `price`       DECIMAL(10,2)   NOT NULL,
  `created_at`  TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`  TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `fk_pricing_rules_product` (`product_id`),
  KEY `fk_pricing_rules_group` (`customer_group_id`),
  CONSTRAINT `fk_pricing_rules_product`
    FOREIGN KEY (`product_id`) REFERENCES `products` (`id`)
    ON UPDATE CASCADE ON DELETE CASCADE,
  CONSTRAINT `fk_pricing_rules_group`
    FOREIGN KEY (`customer_group_id`) REFERENCES `customer_groups` (`id`)
    ON UPDATE CASCADE ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ============================================================
-- TRIGGERS
-- ============================================================

-- Auto-decrease stock after order item insert
DELIMITER $$
CREATE TRIGGER `trg_order_items_after_insert`
AFTER INSERT ON `order_items`
FOR EACH ROW
BEGIN
  UPDATE `products`
    SET `stock` = `stock` - NEW.`quantity`
  WHERE `id` = NEW.`product_id`;

  INSERT INTO `stock_logs` (`product_id`, `type`, `quantity`, `reason`, `reference_id`)
  VALUES (NEW.`product_id`, 'out', NEW.`quantity`, 'order', NEW.`order_id`);
END$$
DELIMITER ;

-- Auto-restore stock when order is cancelled
DELIMITER $$
CREATE TRIGGER `trg_orders_after_update_cancel`
AFTER UPDATE ON `orders`
FOR EACH ROW
BEGIN
  IF OLD.`status` != 'cancelled' AND NEW.`status` = 'cancelled' THEN
    -- Restore stock for each item
    UPDATE `products` p
    INNER JOIN `order_items` oi ON oi.`product_id` = p.`id`
    SET p.`stock` = p.`stock` + oi.`quantity`
    WHERE oi.`order_id` = NEW.`id`;

    -- Log the restock
    INSERT INTO `stock_logs` (`product_id`, `type`, `quantity`, `reason`, `reference_id`)
    SELECT oi.`product_id`, 'in', oi.`quantity`, 'return', NEW.`id`
    FROM `order_items` oi
    WHERE oi.`order_id` = NEW.`id`;
  END IF;
END$$
DELIMITER ;


-- ============================================================
-- VIEWS
-- ============================================================

-- Handy view: products with primary image and stock status
CREATE VIEW `vw_products_list` AS
SELECT
  p.`id`,
  p.`name`,
  p.`slug`,
  p.`sku`,
  p.`brand`,
  c.`name`   AS `category_name`,
  c.`slug`   AS `category_slug`,
  p.`retail_price`,
  p.`wholesale_price`,
  p.`distributor_price`,
  p.`moq`,
  p.`stock`,
  p.`unit`,
  p.`is_active`,
  p.`is_featured`,
  (SELECT pi.`image_url` FROM `product_images` pi
   WHERE pi.`product_id` = p.`id` ORDER BY pi.`sort_order` LIMIT 1) AS `primary_image`,
  CASE
    WHEN p.`stock` = 0 THEN 'out_of_stock'
    WHEN p.`stock` <= p.`low_stock_threshold` THEN 'low_stock'
    ELSE 'in_stock'
  END AS `stock_status`
FROM `products` p
LEFT JOIN `categories` c ON c.`id` = p.`category_id`;

-- Order summary view
CREATE VIEW `vw_order_summary` AS
SELECT
  o.`id`,
  o.`order_number`,
  u.`name`          AS `customer_name`,
  u.`email`         AS `customer_email`,
  o.`total_amount`,
  o.`status`,
  o.`payment_status`,
  o.`created_at`,
  (SELECT COUNT(*) FROM `order_items` oi WHERE oi.`order_id` = o.`id`) AS `item_count`
FROM `orders` o
INNER JOIN `users` u ON u.`id` = o.`user_id`;


SET FOREIGN_KEY_CHECKS = 1;
