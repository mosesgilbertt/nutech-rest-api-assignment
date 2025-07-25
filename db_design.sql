-- ===================================================
-- NUTECH REST API DATABASE DESIGN (DDL)
-- ===================================================
-- Date: July 25, 2025
-- Description: Database schema for Nutech REST API Assignment
-- ===================================================

-- Drop existing tables if exists (for clean installation)
DROP TABLE IF EXISTS "Transactions" CASCADE;
DROP TABLE IF EXISTS "Topups" CASCADE;
DROP TABLE IF EXISTS "Services" CASCADE;
DROP TABLE IF EXISTS "Banners" CASCADE;
DROP TABLE IF EXISTS "Users" CASCADE;

-- ===================================================
-- TABLE: Users
-- Description: Store user information and authentication data
-- ===================================================
CREATE TABLE "Users" (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    profile_picture VARCHAR(255), -- URL to profile image (sesuai migrate.js)
    balance INTEGER DEFAULT 0 -- User balance in smallest currency unit
);

-- Create index for email lookup
CREATE INDEX idx_users_email ON "Users"(email);

-- ===================================================
-- TABLE: Services
-- Description: Store available services/products
-- ===================================================
CREATE TABLE "Services" (
    id SERIAL PRIMARY KEY,
    service_code VARCHAR(255) NOT NULL,
    service_name VARCHAR(255) NOT NULL,
    service_icon VARCHAR(255) NOT NULL, -- URL to service icon
    service_tariff INTEGER NOT NULL -- Service price in smallest currency unit
);

-- Create index for service_code lookup
CREATE INDEX idx_services_code ON "Services"(service_code);

-- ===================================================
-- TABLE: Banners
-- Description: Store promotional banners
-- ===================================================
CREATE TABLE "Banners" (
    id SERIAL PRIMARY KEY,
    banner_name VARCHAR(255) NOT NULL,
    banner_image VARCHAR(255) NOT NULL, -- URL to banner image
    description TEXT
);

-- ===================================================
-- TABLE: Topups
-- Description: Store top-up transaction history
-- ===================================================
CREATE TABLE "Topups" (
    id SERIAL PRIMARY KEY,
    top_up_amount INTEGER NOT NULL,
    user_id INTEGER NOT NULL REFERENCES "Users"(id) ON DELETE CASCADE,
    transaction_type VARCHAR(50) NOT NULL,
    created_on TIMESTAMP DEFAULT NOW()
);

-- Create index for user_id and date lookups
CREATE INDEX idx_topups_user_date ON "Topups"(user_id, created_on DESC);

-- ===================================================
-- TABLE: Transactions
-- Description: Store payment transaction history
-- ===================================================
CREATE TABLE "Transactions" (
    id SERIAL PRIMARY KEY,
    invoice_number VARCHAR(255) NOT NULL UNIQUE,
    service_code VARCHAR(255) NOT NULL,
    service_name VARCHAR(255) NOT NULL,
    transaction_type VARCHAR(50) NOT NULL DEFAULT 'PAYMENT',
    total_amount INTEGER NOT NULL,
    user_id INTEGER NOT NULL REFERENCES "Users"(id) ON DELETE CASCADE,
    created_on TIMESTAMP DEFAULT NOW()
);

-- Create indexes for efficient queries
CREATE INDEX idx_transactions_user_date ON "Transactions"(user_id, created_on DESC);
CREATE INDEX idx_transactions_invoice ON "Transactions"(invoice_number);
CREATE INDEX idx_transactions_service ON "Transactions"(service_code);

-- ===================================================
-- SAMPLE DATA INSERTION
-- ===================================================

-- Insert sample services
INSERT INTO "Services" (service_code, service_name, service_icon, service_tariff) VALUES
('PAJAK', 'Pajak PBB', 'https://nutech-integrasi.app/dummy.jpg', 40000),
('PLN', 'Listrik', 'https://nutech-integrasi.app/dummy.jpg', 10000),
('PDAM', 'PDAM Berlangganan', 'https://nutech-integrasi.app/dummy.jpg', 40000),
('PULSA', 'Pulsa', 'https://nutech-integrasi.app/dummy.jpg', 40000),
('PGN', 'PGN Berlangganan', 'https://nutech-integrasi.app/dummy.jpg', 50000),
('MUSIK', 'Musik Berlangganan', 'https://nutech-integrasi.app/dummy.jpg', 50000),
('TV', 'TV Berlangganan', 'https://nutech-integrasi.app/dummy.jpg', 50000),
('PAKET_DATA', 'Paket data', 'https://nutech-integrasi.app/dummy.jpg', 50000),
('VOUCHER_GAME', 'Voucher Game', 'https://nutech-integrasi.app/dummy.jpg', 100000),
('VOUCHER_MAKANAN', 'Voucher Makanan', 'https://nutech-integrasi.app/dummy.jpg', 100000),
('QURBAN', 'Qurban', 'https://nutech-integrasi.app/dummy.jpg', 200000),
('ZAKAT', 'Zakat', 'https://nutech-integrasi.app/dummy.jpg', 300000);

-- Insert sample banners
INSERT INTO "Banners" (banner_name, banner_image, description) VALUES
('Banner 1', 'https://nutech-integrasi.app/dummy.jpg', 'Lerem Ipsum Dolor sit amet'),
('Banner 2', 'https://nutech-integrasi.app/dummy.jpg', 'Lerem Ipsum Dolor sit amet'),
('Banner 3', 'https://nutech-integrasi.app/dummy.jpg', 'Lerem Ipsum Dolor sit amet'),
('Banner 4', 'https://nutech-integrasi.app/dummy.jpg', 'Lerem Ipsum Dolor sit amet'),
('Banner 5', 'https://nutech-integrasi.app/dummy.jpg', 'Lerem Ipsum Dolor sit amet'),
('Banner 6', 'https://nutech-integrasi.app/dummy.jpg', 'Lerem Ipsum Dolor sit amet');

-- ===================================================
-- TRANSACTION HISTORY VIEW
-- ===================================================

-- View for transaction history (combine transactions and topups)
CREATE OR REPLACE VIEW "TransactionHistory" AS
SELECT 
    invoice_number,
    transaction_type,
    service_name as description,
    total_amount,
    user_id,
    created_on
FROM "Transactions"
UNION ALL
SELECT 
    CONCAT('TOP', id) as invoice_number,
    transaction_type,
    'Top Up balance' as description,
    top_up_amount as total_amount,
    user_id,
    created_on
FROM "Topups"
ORDER BY created_on DESC;

-- ===================================================
-- CONSTRAINTS & VALIDATIONS
-- ===================================================

-- Add constraints for data validation
ALTER TABLE "Users" ADD CONSTRAINT chk_balance_positive 
    CHECK (balance >= 0);

ALTER TABLE "Services" ADD CONSTRAINT chk_tariff_positive 
    CHECK (service_tariff > 0);

ALTER TABLE "Topups" ADD CONSTRAINT chk_topup_amount_positive 
    CHECK (top_up_amount > 0);

ALTER TABLE "Transactions" ADD CONSTRAINT chk_transaction_amount_positive 
    CHECK (total_amount > 0);

-- ===================================================
-- COMMENTS FOR DOCUMENTATION
-- ===================================================

COMMENT ON TABLE "Users" IS 'Store user account information and balance';
COMMENT ON TABLE "Services" IS 'Store available services/products for transaction';
COMMENT ON TABLE "Banners" IS 'Store promotional banners for display';
COMMENT ON TABLE "Topups" IS 'Store user balance top-up history';
COMMENT ON TABLE "Transactions" IS 'Store payment transaction history';

COMMENT ON COLUMN "Users".balance IS 'User balance in smallest currency unit (e.g., cents)';
COMMENT ON COLUMN "Services".service_tariff IS 'Service price in smallest currency unit';
COMMENT ON COLUMN "Transactions".invoice_number IS 'Unique invoice number format: INVddmmyyyy-hhmmssmmm';

-- ===================================================
-- END OF DDL
-- ===================================================