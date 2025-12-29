#!/usr/bin/env node

/**
 * Arshrozy Printshop - Image Upload Script
 * Uploads all images from /images to Supabase Storage
 * 
 * Usage:
 * 1. Set SUPABASE_URL and SUPABASE_SERVICE_KEY in .env
 * 2. Run: node supabase/upload-images.js
 */

const fs = require('fs');
const path = require('path');
require('dotenv').config();

// Check for required environment variables
if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_KEY) {
    console.error('❌ Missing required environment variables:');
    console.error('   - NEXT_PUBLIC_SUPABASE_URL');
    console.error('   - SUPABASE_SERVICE_KEY');
    console.error('\nPlease add them to your .env file');
    process.exit(1);
}

const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_KEY,
    {
        auth: {
            autoRefreshToken: false,
            persistSession: false
        }
    }
);

const IMAGES_DIR = path.join(__dirname, '../images');
const BUCKET_NAME = 'product-images';

async function uploadImages() {
    console.log('🚀 Starting image upload to Supabase Storage...\n');

    // Check if bucket exists
    const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();

    if (bucketsError) {
        console.error('❌ Error listing buckets:', bucketsError);
        return;
    }

    const bucketExists = buckets.some(b => b.name === BUCKET_NAME);

    if (!bucketExists) {
        console.log(`📦 Creating bucket: ${BUCKET_NAME}`);
        const { error: createError } = await supabase.storage.createBucket(BUCKET_NAME, {
            public: true,
            fileSizeLimit: 5242880, // 5MB
            allowedMimeTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
        });

        if (createError) {
            console.error('❌ Error creating bucket:', createError);
            return;
        }
        console.log('✅ Bucket created successfully\n');
    }

    // Read all files from images directory
    const files = fs.readdirSync(IMAGES_DIR);
    const imageFiles = files.filter(file =>
        /\.(jpg|jpeg|png|gif|webp)$/i.test(file)
    );

    console.log(`📁 Found ${imageFiles.length} images to upload\n`);

    let successCount = 0;
    let errorCount = 0;

    for (const filename of imageFiles) {
        const filePath = path.join(IMAGES_DIR, filename);
        const fileBuffer = fs.readFileSync(filePath);
        const fileSize = (fs.statSync(filePath).size / 1024).toFixed(2);

        console.log(`⬆️  Uploading: ${filename} (${fileSize} KB)`);

        const { data, error } = await supabase.storage
            .from(BUCKET_NAME)
            .upload(filename, fileBuffer, {
                contentType: `image/${path.extname(filename).slice(1)}`,
                upsert: true // Overwrite if exists
            });

        if (error) {
            console.error(`   ❌ Error: ${error.message}`);
            errorCount++;
        } else {
            console.log(`   ✅ Success: ${data.path}`);
            successCount++;
        }
    }

    console.log('\n' + '='.repeat(50));
    console.log(`✅ Upload complete!`);
    console.log(`   Success: ${successCount}`);
    console.log(`   Errors: ${errorCount}`);
    console.log('='.repeat(50));

    // Generate URL mapping
    console.log('\n📋 Image URL Mapping:\n');
    for (const filename of imageFiles) {
        const { data } = supabase.storage
            .from(BUCKET_NAME)
            .getPublicUrl(filename);

        console.log(`${filename} -> ${data.publicUrl}`);
    }
}

// Run the upload
uploadImages().catch(console.error);
