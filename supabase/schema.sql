-- Arshrozy Printshop Database Schema
-- Created for Supabase Migration
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
-- =====================================================
-- PRODUCTS TABLE
-- =====================================================
CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    category TEXT NOT NULL,
    -- 'cards', 'flyers', 'banners', 'apparel', etc.
    name TEXT NOT NULL,
    description TEXT,
    base_price DECIMAL(10, 2) NOT NULL,
    image_url TEXT,
    variants JSONB DEFAULT '[]'::jsonb,
    -- Array of variant options
    pricing_rules JSONB DEFAULT '{}'::jsonb,
    -- Custom pricing logic
    is_active BOOLEAN DEFAULT true,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
-- Create index for faster queries
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_products_active ON products(is_active);
-- =====================================================
-- PRODUCT VARIANTS TABLE (Optional - for complex products)
-- =====================================================
CREATE TABLE product_variants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    variant_type TEXT NOT NULL,
    -- 'size', 'type', 'finish', etc.
    variant_value TEXT NOT NULL,
    price_modifier DECIMAL(10, 2) DEFAULT 0,
    -- Additional cost
    image_url TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
CREATE INDEX idx_variants_product ON product_variants(product_id);
-- =====================================================
-- CUSTOMERS TABLE
-- =====================================================
CREATE TABLE customers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    phone TEXT UNIQUE NOT NULL,
    name TEXT,
    email TEXT,
    address TEXT,
    notes TEXT,
    total_orders INTEGER DEFAULT 0,
    total_spent DECIMAL(10, 2) DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
CREATE INDEX idx_customers_phone ON customers(phone);
-- =====================================================
-- ORDERS TABLE
-- =====================================================
CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_number TEXT UNIQUE NOT NULL,
    customer_id UUID REFERENCES customers(id) ON DELETE
    SET NULL,
        customer_name TEXT,
        customer_phone TEXT NOT NULL,
        customer_email TEXT,
        items JSONB NOT NULL,
        -- Array of order items
        subtotal DECIMAL(10, 2) NOT NULL,
        discount DECIMAL(10, 2) DEFAULT 0,
        total_amount DECIMAL(10, 2) NOT NULL,
        status TEXT DEFAULT 'pending',
        -- 'pending', 'confirmed', 'processing', 'completed', 'cancelled'
        payment_status TEXT DEFAULT 'unpaid',
        -- 'unpaid', 'partial', 'paid'
        payment_method TEXT,
        -- 'mpesa', 'cash', 'bank'
        whatsapp_sent BOOLEAN DEFAULT false,
        notes TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
CREATE INDEX idx_orders_customer ON orders(customer_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_created ON orders(created_at DESC);
-- =====================================================
-- ORDER ITEMS TABLE (Normalized approach)
-- =====================================================
CREATE TABLE order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(id) ON DELETE
    SET NULL,
        product_name TEXT NOT NULL,
        product_category TEXT NOT NULL,
        quantity INTEGER NOT NULL,
        unit_price DECIMAL(10, 2) NOT NULL,
        total_price DECIMAL(10, 2) NOT NULL,
        specifications JSONB DEFAULT '{}'::jsonb,
        -- Custom specs for this item
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
CREATE INDEX idx_order_items_order ON order_items(order_id);
CREATE INDEX idx_order_items_product ON order_items(product_id);
-- =====================================================
-- CART ITEMS TABLE (Optional - for persistent carts)
-- =====================================================
CREATE TABLE cart_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id TEXT NOT NULL,
    -- Browser session or user ID
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    quantity INTEGER NOT NULL DEFAULT 1,
    specifications JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
CREATE INDEX idx_cart_session ON cart_items(session_id);
-- =====================================================
-- SETTINGS TABLE (For site configuration)
-- =====================================================
CREATE TABLE settings (
    key TEXT PRIMARY KEY,
    value JSONB NOT NULL,
    description TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
-- Insert default settings
INSERT INTO settings (key, value, description)
VALUES (
        'whatsapp_number',
        '"254769752124"',
        'WhatsApp business number'
    ),
    (
        'business_email',
        '"info@arshrozy.com"',
        'Business contact email'
    ),
    (
        'business_name',
        '"Arshrozy Printshop"',
        'Business name'
    ),
    ('currency', '"KES"', 'Currency code'),
    ('tax_rate', '0', 'Tax rate percentage');
-- =====================================================
-- FUNCTIONS
-- =====================================================
-- Function to generate order number
CREATE OR REPLACE FUNCTION generate_order_number() RETURNS TEXT AS $$
DECLARE new_number TEXT;
counter INTEGER;
BEGIN -- Get count of orders today
SELECT COUNT(*) INTO counter
FROM orders
WHERE DATE(created_at) = CURRENT_DATE;
-- Format: ARZ-YYYYMMDD-XXX
new_number := 'ARZ-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-' || LPAD((counter + 1)::TEXT, 3, '0');
RETURN new_number;
END;
$$ LANGUAGE plpgsql;
-- Function to update customer stats
CREATE OR REPLACE FUNCTION update_customer_stats() RETURNS TRIGGER AS $$ BEGIN IF NEW.customer_id IS NOT NULL THEN
UPDATE customers
SET total_orders = (
        SELECT COUNT(*)
        FROM orders
        WHERE customer_id = NEW.customer_id
    ),
    total_spent = (
        SELECT COALESCE(SUM(total_amount), 0)
        FROM orders
        WHERE customer_id = NEW.customer_id
            AND status = 'completed'
    ),
    updated_at = NOW()
WHERE id = NEW.customer_id;
END IF;
RETURN NEW;
END;
$$ LANGUAGE plpgsql;
-- Trigger to update customer stats on order changes
CREATE TRIGGER trigger_update_customer_stats
AFTER
INSERT
    OR
UPDATE ON orders FOR EACH ROW EXECUTE FUNCTION update_customer_stats();
-- Function to auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column() RETURNS TRIGGER AS $$ BEGIN NEW.updated_at = NOW();
RETURN NEW;
END;
$$ LANGUAGE plpgsql;
-- Apply updated_at triggers
CREATE TRIGGER update_products_updated_at BEFORE
UPDATE ON products FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_customers_updated_at BEFORE
UPDATE ON customers FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_orders_updated_at BEFORE
UPDATE ON orders FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
-- =====================================================
-- ROW LEVEL SECURITY (RLS)
-- =====================================================
-- Enable RLS on all tables
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;
-- Public read access to products (anyone can view)
CREATE POLICY "Public products are viewable by everyone" ON products FOR
SELECT USING (is_active = true);
-- Public read access to product variants
CREATE POLICY "Public variants are viewable by everyone" ON product_variants FOR
SELECT USING (is_active = true);
-- Public read access to settings
CREATE POLICY "Settings are viewable by everyone" ON settings FOR
SELECT USING (true);
-- Customers can view their own data
CREATE POLICY "Customers can view own data" ON customers FOR
SELECT USING (auth.uid() = id);
-- Anyone can insert orders (for guest checkout)
CREATE POLICY "Anyone can create orders" ON orders FOR
INSERT WITH CHECK (true);
-- Customers can view their own orders
CREATE POLICY "Customers can view own orders" ON orders FOR
SELECT USING (
        customer_phone = (
            SELECT phone
            FROM customers
            WHERE id = auth.uid()
        )
    );
-- Anyone can manage their cart items
CREATE POLICY "Anyone can manage cart items" ON cart_items FOR ALL USING (true);
-- =====================================================
-- SEED DATA
-- =====================================================
-- Insert product categories
INSERT INTO products (
        category,
        name,
        description,
        base_price,
        image_url,
        variants,
        pricing_rules
    )
VALUES -- Business Cards
    (
        'cards',
        'Business Cards',
        'Premium business cards with multiple finish options',
        14.00,
        '/images/cards.jpg',
        '[{"type": "base", "label": "Standard Matte", "price": 14}, {"type": "spotuv", "label": "Spot UV", "price": 24}, {"type": "folded", "label": "Folded Cards", "price": 20}]'::jsonb,
        '{"min_qty": 100, "price_per_100": 14}'::jsonb
    ),
    -- Flyers
    (
        'flyers',
        'Flyers & Brochures',
        'High-impact marketing materials',
        35.00,
        '/images/marketing.jpg',
        '[{"type": "a4", "label": "A4 Size", "price": 35}, {"type": "a5", "label": "A5 Size", "price": 15}, {"type": "a6", "label": "A6 Size", "price": 10}]'::jsonb,
        '{"min_qty": 1000}'::jsonb
    ),
    -- Banners
    (
        'banners',
        'Banners & Signage',
        'Professional event signage and displays',
        6000.00,
        '/images/banners.jpg',
        '[{"type": "rollup", "label": "Rollup Banner", "price": 6000}, {"type": "xbanner", "label": "X-Banner", "price": 5800}, {"type": "doorframe", "label": "Door Frame", "price": 7500}, {"type": "backdrop", "label": "Backdrop", "price": 27000}, {"type": "teardrop", "label": "Teardrop Flag", "price": 15400}]'::jsonb,
        '{}'::jsonb
    ),
    -- Apparel
    (
        'apparel',
        'Corporate Apparel',
        'Branded clothing for your team',
        580.00,
        '/images/apparel.jpg',
        '[{"type": "tshirt", "label": "T-Shirt", "price": 580}, {"type": "hoodie", "label": "Hoodie", "price": 1500}, {"type": "polo", "label": "Polo Shirt", "price": 800}]'::jsonb,
        '{}'::jsonb
    ),
    -- Mugs & Merchandise
    (
        'mugs',
        'Mugs & Drinkware',
        'Custom branded drinkware',
        500.00,
        '/images/hero-banner.jpg',
        '[{"type": "standard", "label": "Standard Mug", "price": 500}, {"type": "magic", "label": "Magic Mug", "price": 800}, {"type": "travel", "label": "Travel Mug", "price": 1050}, {"type": "bottle", "label": "Water Bottle", "price": 750}]'::jsonb,
        '{}'::jsonb
    ),
    -- Stickers
    (
        'stickers',
        'Stickers & Labels',
        'Die-cut vinyl stickers and labels',
        1380.00,
        '/images/stickers.jpg',
        '[{"type": "vinyl", "label": "Vinyl Sticker", "price": 1380}, {"type": "reflective", "label": "Reflective", "price": 1800}, {"type": "magnet", "label": "Magnetic", "price": 1150}]'::jsonb,
        '{}'::jsonb
    ),
    -- Stamps
    (
        'stamps',
        'Rubber Stamps',
        'Professional rubber stamps and seals',
        1500.00,
        '/images/stamp-rubber.jpg',
        '[{"type": "rubber", "label": "Rubber Stamp", "price": 1500}, {"type": "self", "label": "Self-Inking", "price": 2500}, {"type": "dater", "label": "Date Stamp", "price": 3500}, {"type": "seal", "label": "Company Seal", "price": 5500}]'::jsonb,
        '{}'::jsonb
    ),
    -- Car Branding
    (
        'branding',
        'Vehicle Branding',
        'Full vehicle wraps and branding',
        45000.00,
        '/images/car-full.jpg',
        '[{"type": "full", "label": "Full Wrap", "price": 45000}, {"type": "partial", "label": "Partial Wrap", "price": 25000}, {"type": "tint", "label": "Window Tint", "price": 8000}]'::jsonb,
        '{}'::jsonb
    );
-- Update sort order
UPDATE products
SET sort_order = 1
WHERE category = 'cards';
UPDATE products
SET sort_order = 2
WHERE category = 'flyers';
UPDATE products
SET sort_order = 3
WHERE category = 'banners';
UPDATE products
SET sort_order = 4
WHERE category = 'apparel';
UPDATE products
SET sort_order = 5
WHERE category = 'mugs';
UPDATE products
SET sort_order = 6
WHERE category = 'stickers';
UPDATE products
SET sort_order = 7
WHERE category = 'stamps';
UPDATE products
SET sort_order = 8
WHERE category = 'branding';
-- =====================================================
-- VIEWS (For easier querying)
-- =====================================================
CREATE OR REPLACE VIEW active_products AS
SELECT *
FROM products
WHERE is_active = true
ORDER BY sort_order,
    name;
CREATE OR REPLACE VIEW recent_orders AS
SELECT o.*,
    c.name as account_name,
    c.email as account_email
FROM orders o
    LEFT JOIN customers c ON o.customer_id = c.id
ORDER BY o.created_at DESC
LIMIT 100;
-- =====================================================
-- COMMENTS
-- =====================================================
COMMENT ON TABLE products IS 'Product catalog with pricing and variants';
COMMENT ON TABLE orders IS 'Customer orders with items and status tracking';
COMMENT ON TABLE customers IS 'Customer information and statistics';
COMMENT ON TABLE settings IS 'Site-wide configuration settings';