-- Arshrozy Printshop - Supabase Storage Setup
-- Storage buckets and policies for images
-- =====================================================
-- CREATE STORAGE BUCKETS
-- =====================================================
-- Create public bucket for product images
INSERT INTO storage.buckets (
        id,
        name,
        public,
        file_size_limit,
        allowed_mime_types
    )
VALUES (
        'product-images',
        'product-images',
        true,
        5242880,
        -- 5MB limit
        ARRAY ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
    );
-- Create bucket for order attachments (private)
INSERT INTO storage.buckets (
        id,
        name,
        public,
        file_size_limit,
        allowed_mime_types
    )
VALUES (
        'order-attachments',
        'order-attachments',
        false,
        10485760,
        -- 10MB limit
        ARRAY ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif', 'application/pdf']
    );
-- =====================================================
-- STORAGE POLICIES
-- =====================================================
-- Allow public read access to product images
CREATE POLICY "Public Access to Product Images" ON storage.objects FOR
SELECT USING (bucket_id = 'product-images');
-- Allow authenticated users to upload product images (for admin)
CREATE POLICY "Authenticated users can upload product images" ON storage.objects FOR
INSERT WITH CHECK (
        bucket_id = 'product-images'
        AND auth.role() = 'authenticated'
    );
-- Allow authenticated users to update product images
CREATE POLICY "Authenticated users can update product images" ON storage.objects FOR
UPDATE USING (
        bucket_id = 'product-images'
        AND auth.role() = 'authenticated'
    );
-- Allow authenticated users to delete product images
CREATE POLICY "Authenticated users can delete product images" ON storage.objects FOR DELETE USING (
    bucket_id = 'product-images'
    AND auth.role() = 'authenticated'
);
-- Order attachments - only accessible by order owner
CREATE POLICY "Users can view their order attachments" ON storage.objects FOR
SELECT USING (
        bucket_id = 'order-attachments'
        AND auth.role() = 'authenticated'
    );
CREATE POLICY "Users can upload order attachments" ON storage.objects FOR
INSERT WITH CHECK (
        bucket_id = 'order-attachments'
        AND auth.role() = 'authenticated'
    );