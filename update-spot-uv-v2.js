const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
require('dotenv').config();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://ozwthlyjffjhzjjyreli.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseKey) {
    console.error('❌ Missing SUPABASE_SERVICE_KEY');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function updateSpotUV() {
    const imgName = 'business-card-uv-complete.jpg';
    const imgPath = './public/images/business-card-uv-complete.jpg';

    if (!fs.existsSync(imgPath)) {
        console.error(`❌ File not found: ${imgPath}`);
        return;
    }

    console.log(`🚀 Uploading new Spot UV design: ${imgName}...`);

    const fileContent = fs.readFileSync(imgPath);
    const { data, error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(imgName, fileContent, {
            contentType: 'image/jpeg',
            upsert: true
        });

    if (uploadError) {
        console.error(`❌ Error uploading to storage:`, uploadError);
        return;
    }

    console.log(`✅ Uploaded to Storage!`);

    const imageUrl = `${supabaseUrl}/storage/v1/object/public/product-images/${imgName}`;

    console.log('📝 Fetching Business Cards data...');
    const { data: product, error: fetchError } = await supabase
        .from('products')
        .select('*')
        .eq('name', 'Business Cards')
        .single();

    if (fetchError || !product) {
        console.error('❌ Error fetching product:', fetchError);
        return;
    }

    const updatedVariants = product.variants.map(v => {
        if (v.type === 'spotuv' || v.label === 'Spot UV') {
            console.log(`🎯 Updating Spot UV variant image...`);
            return { ...v, image: imageUrl };
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
        console.log('✅ Success! Spot UV updated with new template image.');
    }
}

updateSpotUV();
