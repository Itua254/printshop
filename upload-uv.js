const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://ozwthlyjffjhzjjyreli.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseKey) {
    console.error('❌ Missing SUPABASE_SERVICE_KEY');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function uploadUVImages() {
    const images = [
        { name: 'business-card-uv-front.png', path: './public/images/business-card-uv-front.png' },
        { name: 'business-card-uv-back.png', path: './public/images/business-card-uv-back.png' }
    ];

    console.log('🚀 Starting Spot UV update process...');

    for (const img of images) {
        if (!fs.existsSync(img.path)) {
            console.error(`❌ File not found: ${img.path}`);
            continue;
        }

        const fileContent = fs.readFileSync(img.path);
        const { data, error } = await supabase.storage
            .from('product-images')
            .upload(img.name, fileContent, {
                contentType: 'image/png',
                upsert: true
            });

        if (error) {
            console.error(`❌ Error uploading ${img.name}:`, error);
        } else {
            console.log(`✅ Uploaded to Storage: ${img.name}`);
        }
    }

    // Now update the database
    console.log('📝 Fetching Business Cards data...');

    const { data: product, error: fetchError } = await supabase
        .from('products')
        .select('*')
        .eq('name', 'Business Cards')
        .single();

    if (fetchError || !product) {
        console.error('❌ Error fetching product or product not found:', fetchError);
        return;
    }

    const frontUrl = `${supabaseUrl}/storage/v1/object/public/product-images/business-card-uv-front.png`;

    console.log('Current Variants:', JSON.stringify(product.variants, null, 2));

    // Update the Spot UV variant image - checking both common types
    const updatedVariants = product.variants.map(v => {
        const typeMatch = (v.type === 'spotuv' || v.type === 'Spot UV');
        const labelMatch = (v.label === 'Spot UV');

        if (typeMatch || labelMatch) {
            console.log(`🎯 Found Spot UV variant! Updating image to: ${frontUrl}`);
            return { ...v, image: frontUrl };
        }
        return v;
    });

    const { error: updateError } = await supabase
        .from('products')
        .update({ variants: updatedVariants })
        .eq('id', product.id);

    if (updateError) {
        console.error('❌ Error updating database:', updateError);
    } else {
        console.log('✅ Database updated successfully with image URLs!');
    }
}

uploadUVImages();
