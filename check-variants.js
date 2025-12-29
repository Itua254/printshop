const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://ozwthlyjffjhzjjyreli.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkBusinessCardVariants() {
    console.log('Checking Business Cards variants...');
    const { data, error } = await supabase
        .from('products')
        .select('name, variants, image_url')
        .eq('name', 'Business Cards')
        .single();

    if (error) {
        console.error('Error:', error);
    } else {
        console.log('Product Name:', data.name);
        console.log('Main Image URL:', data.image_url);
        console.log('Variants:', JSON.stringify(data.variants, null, 2));
    }
}

checkBusinessCardVariants();
